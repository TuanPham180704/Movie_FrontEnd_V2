from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
BASE_URL = "http://localhost:5173" 

def test_register_valid(driver):
    driver.get(f"{BASE_URL}/register")
    driver.find_element(By.ID, "username").send_keys("testuser1999")
    driver.find_element(By.ID, "email").send_keys("testuser9912223@gmail.com")
    driver.find_element(By.ID, "password").send_keys("Abcd1234!")
    driver.find_element(By.ID, "confirmPassword").send_keys("Abcd1234!")
    driver.find_element(By.ID, "verify").click()
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    time.sleep(5)
    success_msg = WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.XPATH, "//div[contains(text(),'Đăng ký thành công')]"))
    )
    assert success_msg.is_displayed()

def test_register_short_username(driver):
    driver.get(f"{BASE_URL}/register")
    driver.find_element(By.ID, "username").send_keys("ab")
    driver.find_element(By.ID, "email").send_keys("shortname@gmail.com")
    driver.find_element(By.ID, "password").send_keys("Abcd1234!")
    driver.find_element(By.ID, "confirmPassword").send_keys("Abcd1234!")
    driver.find_element(By.ID, "verify").click()
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    time.sleep(5)
    error_msg = WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.XPATH, "//p[contains(text(),'Tên hiển thị phải có ít nhất 3 ký tự')]"))
    )
    assert error_msg.is_displayed()

def test_register_invalid_email(driver):
    driver.get(f"{BASE_URL}/register")
    driver.find_element(By.ID, "username").send_keys("validname")
    driver.find_element(By.ID, "email").send_keys("invalidemail")
    driver.find_element(By.ID, "password").send_keys("Abcd1234!")
    driver.find_element(By.ID, "confirmPassword").send_keys("Abcd1234!")
    driver.find_element(By.ID, "verify").click()
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    time.sleep(5)
    error_msg = WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.XPATH, "//p[contains(text(),'Email không hợp lệ')]"))
    )
    assert error_msg.is_displayed()

def test_register_short_password(driver):
    driver.get(f"{BASE_URL}/register")
    driver.find_element(By.ID, "username").send_keys("userpwshort")
    driver.find_element(By.ID, "email").send_keys("userpwshort@gmail.com")
    driver.find_element(By.ID, "password").send_keys("Abc1!")
    driver.find_element(By.ID, "confirmPassword").send_keys("Abc1!")
    driver.find_element(By.ID, "verify").click()
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    time.sleep(5)
    error_msg = WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.XPATH, "//p[contains(text(),'Mật khẩu phải có ít nhất 8 ký tự')]"))
    )
    assert error_msg.is_displayed()

def test_register_password_no_special(driver):
    driver.get(f"{BASE_URL}/register")
    driver.find_element(By.ID, "username").send_keys("nospecialchar")
    driver.find_element(By.ID, "email").send_keys("nospecial@gmail.com")
    driver.find_element(By.ID, "password").send_keys("Abcd1234")
    driver.find_element(By.ID, "confirmPassword").send_keys("Abcd1234")
    driver.find_element(By.ID, "verify").click()
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    time.sleep(5)
    error_msg = WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.XPATH, "//p[contains(text(),'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt')]"))
    )
    assert error_msg.is_displayed()

def test_register_password_no_number(driver):
    driver.get(f"{BASE_URL}/register")
    driver.find_element(By.ID, "username").send_keys("nonumberuser")
    driver.find_element(By.ID, "email").send_keys("nonumber@gmail.com")
    driver.find_element(By.ID, "password").send_keys("Abcd!@#$")
    driver.find_element(By.ID, "confirmPassword").send_keys("Abcd!@#$")
    driver.find_element(By.ID, "verify").click()
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    time.sleep(5)
    error_msg = WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.XPATH, "//p[contains(text(),'Mật khẩu phải chứa ít nhất 1 chữ số')]"))
    )
    assert error_msg.is_displayed()


def test_register_password_mismatch(driver):
    driver.get(f"{BASE_URL}/register")
    driver.find_element(By.ID, "username").send_keys("mismatchuser")
    driver.find_element(By.ID, "email").send_keys("mismatch@gmail.com")
    driver.find_element(By.ID, "password").send_keys("Abcd1234!")
    driver.find_element(By.ID, "confirmPassword").send_keys("Different1!")
    driver.find_element(By.ID, "verify").click()
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    time.sleep(5)
    error_msg = WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.XPATH, "//p[contains(text(),'Mật khẩu nhập lại không khớp')]"))
    )
    assert error_msg.is_displayed()

def test_register_verify_unchecked(driver):
    driver.get(f"{BASE_URL}/register")
    driver.find_element(By.ID, "username").send_keys("verifyuser")
    driver.find_element(By.ID, "email").send_keys("verify@gmail.com")
    driver.find_element(By.ID, "password").send_keys("Abcd1234!")
    driver.find_element(By.ID, "confirmPassword").send_keys("Abcd1234!")
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    time.sleep(5)
    error_msg = WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.XPATH, "//p[contains(text(),'Bạn phải xác minh là con người')]"))
    )
    assert error_msg.is_displayed()

def test_register_empty_fields(driver):
    driver.get(f"{BASE_URL}/register")
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    time.sleep(5)
    error_msgs = WebDriverWait(driver, 15).until(
        EC.visibility_of_all_elements_located((By.XPATH, "//p"))
    )
    assert any("bắt buộc" in e.text.lower() or "không hợp lệ" in e.text.lower() for e in error_msgs)



def test_register(driver):
    driver.get(f"{BASE_URL}/register")
    driver.find_element(By.ID, "username").send_keys("testuser1999")
    driver.find_element(By.ID, "email").send_keys("testuser9912223@gmail.com")
    driver.find_element(By.ID, "password").send_keys("Abcd1234!")
    driver.find_element(By.ID, "confirmPassword").send_keys("Abcd1234!")
    driver.find_element(By.ID, "verify").click()
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    time.sleep(5)
    success_msg = WebDriverWait(driver, 15).until(
        EC.visibility_of_element_located((By.XPATH, "//div[contains(text(),'Đăng ký thành công')]"))
    )
    assert success_msg.is_displayed()