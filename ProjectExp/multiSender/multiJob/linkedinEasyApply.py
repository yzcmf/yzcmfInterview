import time, random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

# --- CONFIG --- #
LINKEDIN_EMAIL = 'your_email@example.com'
LINKEDIN_PASSWORD = 'your_password'
JOB_SEARCH_URL = "https://www.linkedin.com/jobs/search/?currentJobId=4233977704&f_AL=true&f_WT=2%2C3&geoId=103644278&keywords=software%20engineering%20manager&origin=JOB_SEARCH_PAGE_JOB_FILTER&refresh=true&sortBy=R"

def random_answer():
    # Customize if needed
    return random.choice(["Yes", "No", "3 years", "5", "I'm flexible", "N/A"])

# --- START BROWSER --- #
driver = webdriver.Chrome()
driver.get("https://www.linkedin.com/login")
time.sleep(2)

# --- LOGIN --- #
driver.find_element(By.ID, "username").send_keys(LINKEDIN_EMAIL)
driver.find_element(By.ID, "password").send_keys(LINKEDIN_PASSWORD)
driver.find_element(By.XPATH, "//button[@type='submit']").click()
time.sleep(3)

# --- OPEN SEARCH PAGE --- #
driver.get(JOB_SEARCH_URL)
time.sleep(3)

# --- SCROLL TO LOAD JOBS --- #
for _ in range(2):
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(2)

# --- COLLECT JOB LINKS --- #
jobs = driver.find_elements(By.CLASS_NAME, 'job-card-container__link')
job_links = [job.get_attribute('href') for job in jobs if job.get_attribute('href')]

# --- APPLY LOOP --- #
for job_url in job_links:
    try:
        driver.get(job_url)
        time.sleep(2)

        easy_apply = driver.find_element(By.XPATH, "//button[contains(@class, 'jobs-apply-button')]")
        easy_apply.click()
        time.sleep(2)

        while True:
            # --- Fill Inputs --- #
            inputs = driver.find_elements(By.TAG_NAME, 'input')
            for input_element in inputs:
                try:
                    if input_element.is_displayed() and input_element.is_enabled():
                        input_element.clear()
                        input_element.send_keys(random_answer())
                except:
                    continue

            # --- Dropdowns --- #
            dropdowns = driver.find_elements(By.TAG_NAME, 'select')
            for select in dropdowns:
                try:
                    options = select.find_elements(By.TAG_NAME, 'option')
                    if len(options) > 1:
                        options[random.randint(1, len(options) - 1)].click()
                except:
                    continue

            # --- Checkboxes --- #
            checkboxes = driver.find_elements(By.XPATH, "//input[@type='checkbox']")
            for box in checkboxes:
                try:
                    if not box.is_selected() and random.choice([True, False]):
                        driver.execute_script("arguments[0].click();", box)
                except:
                    continue

            time.sleep(1)

            # --- Submit or Next --- #
            try:
                submit = driver.find_element(By.XPATH, "//button[@aria-label='Submit application']")
                if submit.is_enabled():
                    submit.click()
                    print(f"✅ Submitted: {job_url}")
                    break
            except:
                try:
                    next_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Next')]")
                    next_btn.click()
                    time.sleep(2)
                except:
                    print(f"❌ Multi-step or complex form, skipping: {job_url}")
                    try:
                        close_btn = driver.find_element(By.CLASS_NAME, "artdeco-modal__dismiss")
                        close_btn.click()
                        time.sleep(1)
                        discard_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Discard')]")
                        discard_btn.click()
                    except:
                        pass
                    break

    except Exception as e:
        print(f"❌ Skipped job due to error: {e}")
        continue

driver.quit()