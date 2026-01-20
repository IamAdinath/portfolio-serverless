#!/usr/bin/env python3
import json
import re
import requests
import time
from urllib.parse import urlparse

def fetch_medium_image(url):
    """Fetch the main image URL from a Medium article"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Look for og:image meta tag
        og_image = re.search(r'<meta property="og:image" content="([^"]+)"', response.text)
        if og_image:
            return og_image.group(1)
        
        # Look for article image in JSON-LD
        json_ld = re.search(r'<script type="application/ld\+json">({[^<]+})</script>', response.text)
        if json_ld:
            data = json.loads(json_ld.group(1))
            if 'image' in data:
                return data['image'][0] if isinstance(data['image'], list) else data['image']
        
        return None
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def main():
    # Read the JSON file
    with open('mediumArticles.json', 'r') as f:
        articles = json.load(f)
    
    # Fetch images for each article
    for i, article in enumerate(articles):
        print(f"Fetching image for: {article['title']}")
        image_url = fetch_medium_image(article['url'])
        if image_url:
            article['image'] = image_url
            print(f"  Found: {image_url}")
        else:
            print(f"  Failed to fetch image")
        
        # Sleep for 5 seconds between requests (except after the last one)
        if i < len(articles) - 1:
            print("  Waiting 5 seconds...")
            time.sleep(5)
    
    # Write updated JSON
    with open('mediumArticles.json', 'w') as f:
        json.dump(articles, f, indent=2)
    
    print("\nDone! Updated mediumArticles.json")

if __name__ == '__main__':
    main()
