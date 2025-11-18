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
    time.sleep(5)  
    yield driver


def hover_dropdown(driver, dropdown_id):
    container = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, dropdown_id))
    )
    ActionChains(driver).move_to_element(container).perform()
    time.sleep(5) 
    return container
def test_link_phim_le(open_home_page):
    driver = open_home_page
    link = driver.find_element(By.ID, "link-phim-le")
    link.click()
    time.sleep(5)
    assert "/movies/list/phim-le" in driver.current_url

def test_link_phim_bo(open_home_page):
    driver = open_home_page
    link = driver.find_element(By.ID, "link-phim-bo")
    link.click()
    time.sleep(5)
    assert "/movies/list/phim-bo" in driver.current_url


def test_link_hoat_hinh(open_home_page):
    driver = open_home_page
    link = driver.find_element(By.ID, "link-hoat-hinh")
    link.click()
    time.sleep(5)
    assert "/movies/list/hoat-hinh" in driver.current_url

