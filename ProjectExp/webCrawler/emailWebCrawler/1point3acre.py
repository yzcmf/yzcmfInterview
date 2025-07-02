import re, csv, time
import requests
from bs4 import BeautifulSoup

base_url = "https://www.1point3acres.com/bbs/"
page_template = "https://www.1point3acres.com/bbs/forum.php?mod=forumdisplay&fid=198&typeid=653&filter=typeid&page={}"

headers = {
    "User-Agent": "Mozilla/5.0"
}

results = []

for page_num in range(1, 8):
    page_url = page_template.format(page_num)
    print(f"📄 正在处理第 {page_num} 页：{page_url}")

    try:
        res = requests.get(page_url, headers=headers, timeout=15)
        soup = BeautifulSoup(res.text, "html.parser")
        thread_links = soup.select("a.s.xst")  # 帖子链接

        for a in thread_links:
            title = a.get_text(strip=True)
            link = base_url + a.get("href")

            try:
                post_res = requests.get(link, headers=headers, timeout=15)
                post_soup = BeautifulSoup(post_res.text, "html.parser")
                post_text = post_soup.get_text()

                # 匹配所有邮箱
                emails = list(set(re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", post_text)))

                if emails:
                    print(f"✅ {title} | {emails}")
                    results.append([title, link, "; ".join(emails)])

                time.sleep(1.2)  # 防止访问频率过高

            except Exception as e:
                print(f"⚠️ 子页面抓取失败：{link} | 错误：{e}")
                continue

    except Exception as e:
        print(f"❌ 页面抓取失败：第 {page_num} 页 | 错误：{e}")
        continue

# 保存为 CSV
with open("result/1point3acres_emails_page1to7.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["帖子标题", "帖子链接", "提取的邮箱"])
    writer.writerows(results)

print("🎉 完成所有页面抓取，保存为 1point3acres_emails_page1to7.csv")