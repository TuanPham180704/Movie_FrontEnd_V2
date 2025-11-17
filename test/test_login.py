# test/test_login.py
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

BASE_URL = "http://localhost:5173"  # sửa nếu cần

# ----------------------
# 11. Login thành công với email/password hợp lệ
# ----------------------
def test_login_success(driver):
    driver.get(f"{BASE_URL}/login")
    driver.find_element(By.ID, "email").send_keys("testuser1@gmail.com")
    driver.find_element(By.ID, "password").send_keys("Abcd1234!")
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()

    WebDriverWait(driver, 15).until(
        EC.url_contains("/")
    )
    assert "/" in driver.current_url

# ----------------------
# 12. Email sai → hiển thị message “User không tồn tại”
# ----------------------
def test_login_wrong_email(driver):
    driver.get(f"{BASE_URL}/login")
    driver.find_element(By.ID, "email").send_keys("wrongemail@gmail.com")
    driver.find_element(By.ID, "password").send_keys("Abcd1234!")
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()

    error_msg = WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located(
            (By.XPATH, "//p[contains(text(),'User không tồn tại') or contains(text(),'không tồn tại')]")
        )
    )
    assert error_msg.is_displayed()

# ----------------------
# 13. Password sai → hiển thị message “Sai mật khẩu”
# ----------------------
def test_login_wrong_password(driver):
    driver.get(f"{BASE_URL}/login")
    driver.find_element(By.ID, "email").send_keys("testuser1@gmail.com")
    driver.find_element(By.ID, "password").send_keys("WrongPass1!")
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()

    error_msg = WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located(
            (By.XPATH, "//p[contains(text(),'Sai mật khẩu') or contains(text(),'sai mật khẩu')]")
        )
    )
    assert error_msg.is_displayed()

# ----------------------
# 14. Email chưa đăng ký → message “User không tồn tại”
# ----------------------
def test_login_unregistered_email(driver):
    driver.get(f"{BASE_URL}/login")
    driver.find_element(By.ID, "email").send_keys("notregistered@gmail.com")
    driver.find_element(By.ID, "password").send_keys("Abcd1234!")
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()

    error_msg = WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located(
            (By.XPATH, "//p[contains(text(),'User không tồn tại') or contains(text(),'không tồn tại')]")
        )
    )
    assert error_msg.is_displayed()

# ----------------------
# 15. Bỏ trống email → hiển thị message required
# ----------------------
def test_login_empty_email(driver):
    driver.get(f"{BASE_URL}/login")
    driver.find_element(By.ID, "password").send_keys("Abcd1234!")
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()

    error_msg = WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located(
            (By.XPATH, "//p[contains(text(),'required') or contains(text(),'bắt buộc')]")
        )
    )
    assert error_msg.is_displayed()

# ----------------------
# 16. Bỏ trống password → hiển thị message required
# ----------------------
def test_login_empty_password(driver):
    driver.get(f"{BASE_URL}/login")
    driver.find_element(By.ID, "email").send_keys("testuser1@gmail.com")
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()

    error_msg = WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located(
            (By.XPATH, "//p[contains(text(),'required') or contains(text(),'bắt buộc')]")
        )
    )
    assert error_msg.is_displayed()

# ----------------------
# 17. Bỏ trống cả email/password → hiển thị message required
# ----------------------
def test_login_empty_fields(driver):
    driver.get(f"{BASE_URL}/login")
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()

    error_msgs = WebDriverWait(driver, 15).until(
        EC.visibility_of_all_elements_located(
            (By.XPATH, "//p[contains(text(),'required') or contains(text(),'bắt buộc')]")
        )
    )
    assert len(error_msgs) > 0

# ----------------------
# 18. Show/Hide password hoạt động
# ----------------------
def test_login_show_hide_password(driver):
    driver.get(f"{BASE_URL}/login")
    password_input = driver.find_element(By.ID, "password")
    toggle = driver.find_element(By.XPATH, "//span[contains(text(),'👁') or contains(text(),'🙈')]")

    password_input.send_keys("Abcd1234!")
    assert password_input.get_attribute("type") == "password"

    toggle.click()
    assert password_input.get_attribute("type") == "text"

    toggle.click()
    assert password_input.get_attribute("type") == "password"

# ----------------------
# 19. Login bằng phím Enter → redirect home đúng
# ----------------------
def test_login_enter_key(driver):
    driver.get(f"{BASE_URL}/login")
    driver.find_element(By.ID, "email").send_keys("testuser1@gmail.com")
    driver.find_element(By.ID, "password").send_keys("Abcd1234!" + Keys.ENTER)

    WebDriverWait(driver, 15).until(
        EC.url_contains("/")
    )
    assert "/" in driver.current_url

# ----------------------
# 20. Login xong → verify user profile icon/menu xuất hiện
# ----------------------
def test_login_profile_icon(driver):
    driver.get(f"{BASE_URL}/login")
    driver.find_element(By.ID, "email").send_keys("testuser1@gmail.com")
    driver.find_element(By.ID, "password").send_keys("Abcd1234!")
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()

    profile_icon = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located(
            (By.CSS_SELECTOR, ".user-profile-icon, .user-menu")
        )
    )
    assert profile_icon.is_displayed()
