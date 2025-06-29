import re, csv, time
import requests
from bs4 import BeautifulSoup

base_url = "https://www.1point3acres.com/bbs/"
page_url = "https://www.1point3acres.com/bbs/forum.php?mod=forumdisplay&fid=198&typeid=653&filter=typeid&page=6"

headers = {
    "User-Agent": "Mozilla/5.0"
}

res = requests.get(page_url, headers=headers)
soup = BeautifulSoup(res.text, "html.parser")
thread_links = soup.select("a.s.xst")

results = []

for a in thread_links:
    title = a.get_text(strip=True)
    link = base_url + a.get("href")

    try:
        post_res = requests.get(link, headers=headers)
        post_soup = BeautifulSoup(post_res.text, "html.parser")
        post_text = post_soup.get_text()

        emails = list(set(re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", post_text)))

        if emails:
            print(f"✅ {title} | {emails}")
            results.append([title, link, "; ".join(emails)])

        time.sleep(1)  # 防止访问过快被 ban

    except Exception as e:
        print(f"❌ 抓取失败: {link} | 错误: {e}")
        continue

# 保存为 CSV
with open("1point3acres_page6_emails.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["标题", "链接", "邮箱"])
    writer.writerows(results)

print("✅ 全部抓取完毕，已保存为 1point3acres_page6_emails.csv")