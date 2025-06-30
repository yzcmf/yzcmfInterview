import re, csv, time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# 分类函数
def classify_emails(email_list):
    recruiter_keywords = ["recruit", "talent", "hr", "staffing"]
    manager_keywords = ["manager", "lead", "director", "engineering", "hiring"]
    recruiter_emails, manager_emails, unknown_emails = [], [], []
    for email in email_list:
        lowered = email.lower()
        if any(k in lowered for k in recruiter_keywords):
            recruiter_emails.append(email)
        elif any(k in lowered for k in manager_keywords):
            manager_emails.append(email)
        else:
            unknown_emails.append(email)
    return recruiter_emails, manager_emails, unknown_emails

# 浏览器设置
options = Options()
# options.add_argument("--headless")  # 可打开以观察点击动作
options.add_argument("--disable-gpu")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# Oracle Careers 搜索页面
url = "https://careers.oracle.com/en/sites/jobsearch/jobs?keyword=Engineering%20and%20Development&location=United%20States&locationId=300000000149325"
driver.get(url)
time.sleep(5)

# 滚动加载所有职位
for _ in range(15):
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(2)

WebDriverWait(driver, 20).until(
    EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a.job-title-link"))
)
job_cards = driver.find_elements(By.CSS_SELECTOR, "a.job-title-link")
print(f"✅ 找到 {len(job_cards)} 个职位")

results = []

for i in range(len(job_cards)):
    try:
        job_cards = driver.find_elements(By.CSS_SELECTOR, "a.job-title-link")
        title = job_cards[i].text.strip()

        # 点击职位卡片 → 右侧浮窗出现
        driver.execute_script("arguments[0].click();", job_cards[i])
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div.phx-modal-container"))
        )
        time.sleep(1.5)

        # 抓取右侧详情浮窗内容
        detail_html = driver.find_element(By.CSS_SELECTOR, "div.phx-modal-container").get_attribute("innerHTML")
        emails = set(re.findall(r"[a-zA-Z0-9._%+-]+@oracle\.com", detail_html))
        recruiters, managers, unknowns = classify_emails(emails)

        print(f"[{title}] 📥 Recruiter: {recruiters} | Manager: {managers}")
        results.append([
            title,
            url,  # 所有详情都在同页浮出，URL不变
            "; ".join(recruiters),
            "; ".join(managers),
            "; ".join(unknowns)
        ])

        # 关闭浮窗
        close_btn = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label='Close']"))
        )
        close_btn.click()
        time.sleep(1)

    except Exception as e:
        print(f"⚠️ 第 {i} 个职位抓取失败：{e}")
        continue

# 写入 CSV
with open("oracle_email_clickmodal.csv", "w", newline='', encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["Job Title", "Job URL", "Recruiter Emails", "Manager Emails", "Other Oracle Emails"])
    writer.writerows(results)

driver.quit()
print("✅ 全部完成，保存至 oracle_email_clickmodal.csv")
