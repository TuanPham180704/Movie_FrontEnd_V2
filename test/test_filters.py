# test/test_filters.py
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

BASE_URL = "http://localhost:5173"

@pytest.fixture
def open_home_page(driver):
    driver.get(BASE_URL)
    time.sleep(5)  # chậm 5 giây để load trang
    yield driver

# -----------------------------
# Helper function hover dropdown
# -----------------------------
def hover_dropdown(driver, dropdown_id):
    # Wait until dropdown container is present
    container = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, dropdown_id))
    )
    # Hover vào div cha (container) để mở dropdown
    ActionChains(driver).move_to_element(container).perform()
    time.sleep(5)  # chậm 5 giây để quan sát dropdown
    return container

# -----------------------------
# Test 1: Kiểm tra link Phim Lẻ
# -----------------------------
def test_link_phim_le(open_home_page):
    driver = open_home_page
    link = driver.find_element(By.ID, "link-phim-le")
    link.click()
    time.sleep(5)
    assert "/movies/list/phim-le" in driver.current_url

# -----------------------------
# Test 2: Kiểm tra link Phim Bộ
# -----------------------------
def test_link_phim_bo(open_home_page):
    driver = open_home_page
    link = driver.find_element(By.ID, "link-phim-bo")
    link.click()
    time.sleep(5)
    assert "/movies/list/phim-bo" in driver.current_url

# -----------------------------
# Test 3: Kiểm tra link Hoạt Hình
# -----------------------------
def test_link_hoat_hinh(open_home_page):
    driver = open_home_page
    link = driver.find_element(By.ID, "link-hoat-hinh")
    link.click()
    time.sleep(5)
    assert "/movies/list/hoat-hinh" in driver.current_url

