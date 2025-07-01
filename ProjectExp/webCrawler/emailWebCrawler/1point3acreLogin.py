from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import re
import csv
import time

EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
results = []

# ✅ 配置浏览器
options = Options()
options.add_argument("--headless")  # 可注释掉调试
options.add_argument("--disable-gpu")
options.add_argument("window-size=1920,1080")
options.add_argument("user-agent=Mozilla/5.0")

# ✅ 自动安装 & 启动浏览器驱动
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# ✅ 抓取页码范围
for page in range(1, 6):
    print(f"🟢 抓取第 {page} 页...")
    list_url = f"https://www.1point3acres.com/bbs/forum.php?mod=forumdisplay&fid=198&typeid=653&filter=typeid&page={page}"
    driver.get(list_url)
    time.sleep(2)

    soup = BeautifulSoup(driver.page_source, "html.parser")
    threads = soup.select("a.s.xst")

    for thread in threads:
        title = thread.get_text(strip=True)
        href = thread["href"]
        full_url = "https://www.1point3acres.com/bbs/" + href if not href.startswith("http") else href

        try:
            driver.get(full_url)
            time.sleep(3)

            post_soup = BeautifulSoup(driver.page_source, "html.parser")
            post_text = post_soup.get_text()

            emails = list(set(EMAIL_PATTERN.findall(post_text)))
            emails = [
                e for e in emails
                if not e.split('@')[0].startswith(tuple("0123456789."))
                and len(e.split('@')[0]) >= 5
                and "xx" not in e.split('@')[0].lower()
            ]

            if emails:
                print(f"✅ [{title}] 提取 {len(emails)} 个邮箱")
                for email in emails:
                    print("    📧", email)
                results.append([title, full_url, "; ".join(emails)])
        except Exception as e:
            print(f"⚠️ 访问失败：{full_url}，原因：{e}")
            continue

# ✅ 关闭浏览器
driver.quit()

# ✅ 保存结果
with open("1point3acres_emails_selenium.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["Title", "Link", "Emails"])
    writer.writerows(results)

print("🎉 抓取完成！结果已保存到 1point3acres_emails_selenium.csv")