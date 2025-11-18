
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"

@pytest.fixture
def open_forgot_password_page(driver):
    driver.get(f"{BASE_URL}/forgot-password")
    yield driver

def test_send_valid_email(open_forgot_password_page):
    driver = open_forgot_password_page
    form = driver.find_element(By.TAG_NAME, "form")
    email_input = form.find_element(By.ID, "email")
    email_input.send_keys("testuser1@gmail.com")
    submit_btn = form.find_element(By.TAG_NAME, "button")
    submit_btn.click()

    toast = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[contains(text(),'Gửi email khôi phục thành công!')]"))
    )
    assert toast.is_displayed()

def test_send_nonexistent_email(open_forgot_password_page):
    driver = open_forgot_password_page
    form = driver.find_element(By.TAG_NAME, "form")
    email_input = form.find_element(By.ID, "email")
    email_input.send_keys("nonexistuser@example.com")
    submit_btn = form.find_element(By.TAG_NAME, "button")
    submit_btn.click()

    toast = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[contains(text(),'Email không tồn tại') or contains(text(),'Lỗi khi gửi yêu cầu')]"))
    )
    assert toast.is_displayed()


def test_send_empty_email(open_forgot_password_page):
    driver = open_forgot_password_page
    form = driver.find_element(By.TAG_NAME, "form")
    submit_btn = form.find_element(By.TAG_NAME, "button")
    submit_btn.click()

    toast = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[contains(text(),'Vui lòng nhập email!')]"))
    )
    assert toast.is_displayed()


def test_send_invalid_format_email(open_forgot_password_page):
    driver = open_forgot_password_page
    form = driver.find_element(By.TAG_NAME, "form")
    email_input = form.find_element(By.ID, "email")
    email_input.send_keys("abc123")
    submit_btn = form.find_element(By.TAG_NAME, "button")
    submit_btn.click()

    error_message = WebDriverWait(driver, 5).until(
        EC.visibility_of_element_located((By.XPATH, "//*[contains(text(),'không hợp lệ') or contains(text(),'invalid')]"))
    )
    assert error_message.is_displayed()

def test_button_disabled_while_loading(open_forgot_password_page):
    driver = open_forgot_password_page
    form = driver.find_element(By.TAG_NAME, "form")
    email_input = form.find_element(By.ID, "email")
    email_input.send_keys("testuser1@gmail.com")
    submit_btn = form.find_element(By.TAG_NAME, "button")
    submit_btn.click()
    assert not submit_btn.is_enabled() or "Đang gửi" in submit_btn.text

def test_exit_forgot_password(open_forgot_password_page):
    driver = open_forgot_password_page
    close_btn = driver.find_element(By.XPATH, "//button[text()='✕']")
    close_btn.click()
    WebDriverWait(driver, 5).until(lambda d: "/login" in d.current_url)
    assert "/login" in driver.current_url


def test_toast_backend_error(open_forgot_password_page):
    driver = open_forgot_password_page
    form = driver.find_element(By.TAG_NAME, "form")
    email_input = form.find_element(By.ID, "email")
    email_input.send_keys("testuser1@gmail.com")
    submit_btn = form.find_element(By.TAG_NAME, "button")


    submit_btn.click()
    toast = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[contains(text(),'Lỗi khi gửi yêu cầu')]"))
    )
    assert toast.is_displayed()
