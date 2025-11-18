
import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"

@pytest.fixture
def open_home_page(driver):
    driver.get(BASE_URL)
    yield driver

def highlight(element, driver):
    driver.execute_script("arguments[0].style.border='3px solid red'", element)


def test_searchbox_visible(open_home_page):
    driver = open_home_page
    search_input = driver.find_element(By.ID, "search")
    highlight(search_input, driver)
    time.sleep(1)
    assert search_input.is_displayed()


def test_search_valid_keyword(open_home_page):
    driver = open_home_page
    search_input = driver.find_element(By.ID, "search")
    highlight(search_input, driver)
    search_input.send_keys("Avengers" + Keys.ENTER)
    time.sleep(2)
    WebDriverWait(driver, 10).until(lambda d: "keyword=Avengers" in d.current_url)
    assert "keyword=Avengers" in driver.current_url
    assert "page=1" in driver.current_url
    time.sleep(1)


def test_search_trim_spaces(open_home_page):
    driver = open_home_page
    search_input = driver.find_element(By.ID, "search")
    highlight(search_input, driver)
    search_input.send_keys("   Spider-Man   " + Keys.ENTER)
    time.sleep(2)
    WebDriverWait(driver, 10).until(lambda d: "keyword=Spider-Man" in d.current_url)
    assert "keyword=Spider-Man" in driver.current_url
    assert "page=1" in driver.current_url
    time.sleep(1)


def test_search_empty_input(open_home_page):
    driver = open_home_page
    search_input = driver.find_element(By.ID, "search")
    highlight(search_input, driver)
    search_input.clear()
    search_input.send_keys(Keys.ENTER)
    time.sleep(2)
    assert driver.current_url == BASE_URL + "/"


def test_search_reset_input(open_home_page):
    driver = open_home_page
    search_input = driver.find_element(By.ID, "search")
    highlight(search_input, driver)
    search_input.send_keys("Matrix" + Keys.ENTER)
    time.sleep(2)
    WebDriverWait(driver, 10).until(lambda d: "keyword=Matrix" in d.current_url)
    search_input_after = driver.find_element(By.ID, "search")
    assert search_input_after.get_attribute("value").strip() == ""
    time.sleep(1)


def test_search_special_char(open_home_page):
    driver = open_home_page
    search_input = driver.find_element(By.ID, "search")
    highlight(search_input, driver)
    search_input.send_keys("@!#$$%" + Keys.ENTER)
    time.sleep(2)
    WebDriverWait(driver, 10).until(lambda d: "%40%21%23%24%24%25" in d.current_url)
    assert "%40%21%23%24%24%25" in driver.current_url
    time.sleep(1)


def test_search_long_input(open_home_page):
    driver = open_home_page
    long_text = "a" * 256
    search_input = driver.find_element(By.ID, "search")
    highlight(search_input, driver)
    search_input.send_keys(long_text + Keys.ENTER)
    time.sleep(2)
    WebDriverWait(driver, 10).until(lambda d: long_text in d.current_url)
    assert long_text in driver.current_url
    time.sleep(1)


def test_search_reset_page_param(driver):
    driver.get(f"{BASE_URL}/movies/search?keyword=Batman&page=2")
    search_input = driver.find_element(By.ID, "search")
    highlight(search_input, driver)
    search_input.clear()
    search_input.send_keys("Joker" + Keys.ENTER)
    time.sleep(2)
    WebDriverWait(driver, 10).until(lambda d: "keyword=Joker" in d.current_url)
    assert "page=1" in driver.current_url
    time.sleep(1)


def test_search_submit_enter(open_home_page):
    driver = open_home_page
    search_input = driver.find_element(By.ID, "search")
    highlight(search_input, driver)
    search_input.send_keys("Thor" + Keys.ENTER)
    time.sleep(2)
    WebDriverWait(driver, 10).until(lambda d: "keyword=Thor" in d.current_url)
    assert "keyword=Thor" in driver.current_url
    time.sleep(1)


def test_search_paste_input(open_home_page):
    driver = open_home_page
    search_input = driver.find_element(By.ID, "search")
    highlight(search_input, driver)
    search_input.send_keys("Inception" + Keys.ENTER)
    time.sleep(2)
    WebDriverWait(driver, 10).until(lambda d: "keyword=Inception" in d.current_url)
    assert "keyword=Inception" in driver.current_url
    time.sleep(1)
