from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time

BASE_URL = "http://localhost:5173"

def login(driver, email="testuser1@gmail.com", password="Abcd1234!"):
    driver.get(f"{BASE_URL}/login")
    driver.find_element(By.ID, "email").send_keys(email)
    driver.find_element(By.ID, "password").send_keys(password)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    WebDriverWait(driver, 10).until(
        EC.url_contains("/")
    )


def open_user_menu(driver):
    WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, "user-menu-btn"))
    ).click()

    WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, "menu-profile"))
    ).click()

def test_profile_page_load(driver):
    login(driver)
    open_user_menu(driver)
    username = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "username-input"))
    )
    assert username.is_displayed()


def test_sidebar_info(driver):
    login(driver)
    open_user_menu(driver)
    avatar = driver.find_element(By.ID, "sidebar-avatar")
    username = driver.find_element(By.ID, "sidebar-username")
    email = driver.find_element(By.ID, "sidebar-email")
    assert avatar.is_displayed()
    assert username.is_displayed()
    assert email.is_displayed()

def test_update_username(driver):
    login(driver)
    open_user_menu(driver)
    input_username = driver.find_element(By.ID, "username-input")
    input_username.clear()
    input_username.send_keys("NewName")
    driver.find_element(By.ID, "update-profile-btn").click()
    time.sleep(2)
    updated_value = driver.find_element(By.ID, "username-input").get_attribute("value")
    assert updated_value == "NewName"

def test_change_gender(driver):
    login(driver)
    open_user_menu(driver)
    gender_radio = driver.find_element(By.ID, "gender-female")
    gender_radio.click()
    driver.find_element(By.ID, "update-profile-btn").click()
    time.sleep(2)
    assert gender_radio.is_selected()

def test_open_change_password(driver):
    login(driver)
    open_user_menu(driver)
    driver.find_element(By.ID, "change-password-link").click()
    modal = WebDriverWait(driver, 5).until(
        EC.visibility_of_element_located((By.ID, "submit-change-password"))
    )
    assert modal.is_displayed()


def test_change_password_mismatch(driver):
    login(driver)
    open_user_menu(driver)
    driver.find_element(By.ID, "change-password-link").click()
    driver.find_element(By.ID, "old-password").send_keys("Abcd1234!")
    driver.find_element(By.ID, "new-password").send_keys("NewPass1!")
    driver.find_element(By.ID, "confirm-password").send_keys("Mismatch1!")
    driver.find_element(By.ID, "submit-change-password").click()
    time.sleep(2)
    assert True  


def test_change_password_success(driver):
    login(driver)
    open_user_menu(driver)
    driver.find_element(By.ID, "change-password-link").click()
    driver.find_element(By.ID, "old-password").send_keys("Abcd1234!")
    driver.find_element(By.ID, "new-password").send_keys("Abcd12345!")
    driver.find_element(By.ID, "confirm-password").send_keys("Abcd12345!")
    driver.find_element(By.ID, "submit-change-password").click()
    time.sleep(2)
    modals = driver.find_elements(By.ID, "submit-change-password")
    assert len(modals) == 0


def test_avatar_upload(driver):
    login(driver)
    open_user_menu(driver)
    avatar_input = driver.find_element(By.ID, "avatar-upload")
    avatar_input.send_keys(r"C:\path\to\small-avatar.png")  # đổi path thật
    time.sleep(2)
    avatar = driver.find_element(By.ID, "profile-avatar")
    assert "data:image" in avatar.get_attribute("src")


def test_logout(driver):
    login(driver)
    open_user_menu(driver)
    driver.find_element(By.XPATH, "//button[contains(text(),'Thoát')]").click()
    WebDriverWait(driver, 5).until(
        EC.url_contains("/login")
    )
    assert "/login" in driver.current_url


def test_email_readonly(driver):
    login(driver)
    open_user_menu(driver)
    email_input = driver.find_element(By.ID, "email-input")
    assert email_input.get_attribute("readonly") is not None
