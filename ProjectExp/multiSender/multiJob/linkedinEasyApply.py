from playwright.sync_api import sync_playwright

def apply_job(page, job_url):
    try:
        page.goto(job_url, timeout=20000)
        page.wait_for_timeout(3000)

        # 滚动到 Easy Apply 按钮（解决 hidden 问题）
        easy_apply_btn = page.locator("button:has-text('Easy Apply')").first
        easy_apply_btn.scroll_into_view_if_needed()
        page.wait_for_timeout(1000)

        # 强制点击（跳过可见性、可点击检查）
        easy_apply_btn.click(force=True)
        page.wait_for_timeout(2000)

        # 自动填写任意 input
        for i in range(page.locator("input").count()):
            try:
                page.locator("input").nth(i).fill("Yes")
            except:
                continue

        # 提交按钮点击（如有）
        submit_btn = page.locator("button[aria-label='Submit application']")
        if submit_btn.is_visible():
            submit_btn.click()
            print(f"✅ Applied: {job_url}")
        else:
            print(f"❌ Multi-step or locked: {job_url}")
    except Exception as e:
        print(f"❌ Error: {e} at {job_url}")

with sync_playwright() as p:
    browser = p.chromium.launch_persistent_context(user_data_dir="./linkedin-session", headless=False)
    page = browser.new_page()

    search_url = "https://www.linkedin.com/jobs/search/?currentJobId=4212271032&f_AL=true&f_WT=2&geoId=103644278&origin=JOB_SEARCH_PAGE_JOB_FILTER&refresh=true&sortBy=R"
    page.goto(search_url)
    page.wait_for_timeout(3000)

    # 滚动加载更多
    for _ in range(50):
        page.mouse.wheel(0, 3000)
        page.wait_for_timeout(1500)

    # 提取所有 Easy Apply 链接
    job_cards = page.locator("li[data-occludable-job-id]")
    job_links = []

    count = job_cards.count()
    for i in range(count):
        card = job_cards.nth(i)
        easy_apply = card.locator("li:has-text('Easy Apply')")
        if easy_apply.count() > 0:
            link = card.locator("a.job-card-container__link")
            href = link.get_attribute("href")
            if href and href.startswith("/jobs/view/"):
                full_url = "https://www.linkedin.com" + href
                job_links.append(full_url)

    print(f"🔍 Found {len(job_links)} Easy Apply jobs.")

    for link in job_links:
        apply_job(page, link)

    browser.close()
