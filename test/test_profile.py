
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"


@pytest.fixture
def login(driver):
    driver.get(f"{BASE_URL}/login")
    driver.find_element(By.ID, "email").send_keys("testuser1@gmail.com")
    driver.find_element(By.ID, "password").send_keys("NewPass123!")  
    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    WebDriverWait(driver, 20).until(EC.url_contains("/profile"))
    return driver


@pytest.fixture
def reset_user(driver, login):
    driver.get(f"{BASE_URL}/profile")

    username_input = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.ID, "username-input"))
    )
    username_input.clear()
    username_input.send_keys("testuser1")
    driver.find_element(By.ID, "update-profile-btn").click()
    WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located(
            (By.XPATH, "//div[contains(text(),'Cập nhật thông tin thành công')]")
        )
    )
    driver.find_element(By.ID, "change-password-link").click()
    old_pass = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.ID, "old-password"))
    )
    new_pass = driver.find_element(By.ID, "new-password")
    confirm_pass = driver.find_element(By.ID, "confirm-password")
    old_pass.send_keys("NewPass123!")  
    new_pass.send_keys("NewPass123!") 
    confirm_pass.send_keys("NewPass123!")
    driver.find_element(By.ID, "submit-change-password").click()
    WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located(
            (By.XPATH, "//div[contains(text(),'Đổi mật khẩu thành công')]")
        )
    )
    return driver

def test_profile_load(login):
    driver = login
    driver.get(f"{BASE_URL}/profile")
    avatar = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.ID, "profile-avatar"))
    )
    assert avatar.is_displayed()


def test_update_username(login, reset_user):
    driver = reset_user
    driver.get(f"{BASE_URL}/profile")
    username_input = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.ID, "username-input"))
    )
    username_input.clear()
    username_input.send_keys("NewTestUser")
    driver.find_element(By.ID, "update-profile-btn").click()
    WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.XPATH, "//div[contains(text(),'Cập nhật thông tin thành công')]"))
    )
    assert username_input.get_attribute("value") == "NewTestUser"


def test_update_gender_male(login, reset_user):
    driver = reset_user
    driver.get(f"{BASE_URL}/profile")
    gender_male = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "gender-male"))
    )
    gender_male.click()
    driver.find_element(By.ID, "update-profile-btn").click()
    WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.XPATH, "//div[contains(text(),'Cập nhật thông tin thành công')]"))
    )
    assert gender_male.is_selected()


def test_update_gender_female(login, reset_user):
    driver = reset_user
    driver.get(f"{BASE_URL}/profile")
    gender_female = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "gender-female"))
    )
    gender_female.click()
    driver.find_element(By.ID, "update-profile-btn").click()
    WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.XPATH, "//div[contains(text(),'Cập nhật thông tin thành công')]"))
    )
    assert gender_female.is_selected()


def test_email_readonly(login):
    driver = login
    driver.get(f"{BASE_URL}/profile")
    email_input = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.ID, "email-input"))
    )
    assert email_input.get_attribute("readOnly") is not None


def test_open_change_password_modal(login):
    driver = login
    driver.get(f"{BASE_URL}/profile")
    change_link = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "change-password-link"))
    )
    change_link.click()
    modal = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.ID, "old-password"))
    )
    assert modal.is_displayed()


def test_change_password_submit(login):
    driver = login
    driver.get(f"{BASE_URL}/profile")
    driver.find_element(By.ID, "change-password-link").click()
    old_pass = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.ID, "old-password"))
    )
    new_pass = driver.find_element(By.ID, "new-password")
    confirm_pass = driver.find_element(By.ID, "confirm-password")
    old_pass.send_keys("NewPass123!")
    new_pass.send_keys("NewPass123!") 
    confirm_pass.send_keys("NewPass123!")
    driver.find_element(By.ID, "submit-change-password").click()
    WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.XPATH, "//div[contains(text(),'Đổi mật khẩu thành công')]"))
    )
    assert True


def test_upload_avatar(login, reset_user):
    driver = reset_user
    driver.get(f"{BASE_URL}/profile")
    avatar_input = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.ID, "avatar-upload"))
    )
    avatar_input.send_keys(r"C:\path\to\avatar.png") 
    WebDriverWait(driver, 20).until(
        lambda d: d.find_element(By.ID, "profile-avatar").get_attribute("src") != ""
    )
    avatar_img = driver.find_element(By.ID, "profile-avatar")
    assert "avatar.png" in avatar_img.get_attribute("src")


def test_sidebar_username(login):
    driver = login
    driver.get(f"{BASE_URL}/profile")
    sidebar_username = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.ID, "sidebar-username"))
    )
    assert sidebar_username.is_displayed()


def test_logout(login):
    driver = login
    driver.get(f"{BASE_URL}/profile")
    logout_btn = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(.,'Thoát')]"))
    )
    logout_btn.click()
    WebDriverWait(driver, 20).until(EC.url_contains("/login"))
    assert "/login" in driver.current_url
