import asyncio
import aiohttp
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import re
import csv
import time

USERNAME = "hu0112174"
PASSWORD = "Zyx!213416"

EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
FORUM_BASE = "https://www.1point3acres.com/bbs/"
LIST_BASE = FORUM_BASE + "forum.php?mod=forumdisplay&fid=198&typeid=653&filter=typeid&page="

# ✅ Step 1: 登录并获取 cookies
def get_cookies_after_login(username, password):
    options = Options()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)
    driver.get("https://www.1point3acres.com/bbs/member.php?mod=logging&action=login")
    time.sleep(2)

    driver.find_element(By.NAME, "username").send_keys(username)
    driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.NAME, "loginsubmit").click()
    time.sleep(5)

    cookies = {c['name']: c['value'] for c in driver.get_cookies()}
    driver.quit()
    return cookies

# ✅ Step 2: 获取所有帖子的 URL
def get_thread_urls(pages, cookies):
    session = requests.Session()
    session.cookies.update(cookies)
    urls = []
    for page in range(1, pages + 1):
        print(f"📄 抓取第 {page} 页...")
        res = session.get(LIST_BASE + str(page))
        soup = BeautifulSoup(res.text, "html.parser")
        threads = soup.select("a.s.xst")
        for t in threads:
            href = t["href"]
            title = t.get_text(strip=True)
            full_url = FORUM_BASE + href if not href.startswith("http") else href
            urls.append((title, full_url))
    return urls

# ✅ Step 3: 并发抓帖子正文并提取邮箱
async def fetch_emails(session, title, url):
    try:
        async with session.get(url, timeout=15) as res:
            html = await res.text()
            soup = BeautifulSoup(html, "html.parser")
            text = soup.get_text()
            emails = list(set(EMAIL_PATTERN.findall(text)))
            emails = [
                e for e in emails
                if len(e.split('@')[0]) >= 5 and "xx" not in e.lower()
            ]
            if emails:
                print(f"✅ [{title}] 提取 {len(emails)} 个邮箱")
            return [title, url, "; ".join(emails)] if emails else None
    except Exception as e:
        print(f"❌ [{title}] 失败：{e}")
        return None

async def batch_fetch(thread_list, cookies):
    results = []
    async with aiohttp.ClientSession(cookies=cookies) as session:
        tasks = [
            fetch_emails(session, title, url)
            for title, url in thread_list
        ]
        for task in asyncio.as_completed(tasks):
            result = await task
            if result:
                results.append(result)
    return results

# ✅ Step 4: 主函数入口
def main():
    cookies = get_cookies_after_login(USERNAME, PASSWORD)
    thread_list = get_thread_urls(5, cookies)
    results = asyncio.run(batch_fetch(thread_list, cookies))

    # 保存 CSV
    with open("1point3acres_emails_full.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Title", "Link", "Emails"])
        writer.writerows(results)
    print("🎉 完成！数据保存在 1point3acres_emails_full.csv")

if __name__ == "__main__":
    main()
