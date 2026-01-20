#!/usr/bin/env python3
import json
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def fetch_medium_image_selenium(driver, url):
    """Fetch the main image URL from a Medium article using Selenium"""
    try:
        driver.get(url)
        time.sleep(3)  # Wait for page to load
        
        # Try to find og:image meta tag
        try:
            og_image = driver.find_element(By.XPATH, '//meta[@property="og:image"]')
            image_url = og_image.get_attribute('content')
            if image_url:
                return image_url
        except:
            pass
        
        # Try to find the main article image
        try:
            img = driver.find_element(By.CSS_SELECTOR, 'article img, figure img')
            image_url = img.get_attribute('src')
            if image_url:
                return image_url
        except:
            pass
        
        return None
    except Exception as e:
        print(f"  Error: {e}")
        return None

def main():
    # Read the JSON file
    with open('mediumArticles.json', 'r') as f:
        articles = json.load(f)
    
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
    
    # Initialize driver
    print("Starting Chrome driver...")
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # Fetch images for each article
        for i, article in enumerate(articles):
            print(f"\n[{i+1}/{len(articles)}] Fetching: {article['title']}")
            image_url = fetch_medium_image_selenium(driver, article['url'])
            
            if image_url:
                article['image'] = image_url
                print(f"  ✓ Found: {image_url[:80]}...")
            else:
                print(f"  ✗ Failed to fetch image")
            
            # Sleep between requests
            if i < len(articles) - 1:
                print("  Waiting 5 seconds...")
                time.sleep(5)
        
        # Write updated JSON
        with open('mediumArticles.json', 'w') as f:
            json.dump(articles, f, indent=2)
        
        print("\n✓ Done! Updated mediumArticles.json")
        
    finally:
        driver.quit()

if __name__ == '__main__':
    main()
