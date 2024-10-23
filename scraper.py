import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import time

class WebScraper:
    def __init__(self, base_url):
        self.base_url = base_url
        self.domain = urlparse(base_url).netloc
        self.visited_urls = set()
        self.content = {}

    def is_valid(self, url):
        parsed = urlparse(url)
        return bool(parsed.netloc) and parsed.netloc.endswith(self.domain)

    def get_links(self, soup):
        return [urljoin(self.base_url, link.get('href')) for link in soup.find_all('a', href=True)]

    def scrape_page(self, url):
        if url in self.visited_urls:
            return

        self.visited_urls.add(url)
        print(f"Scraping: {url}")

        try:
            response = requests.get(url)
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract text content
            text_content = ' '.join([p.get_text(strip=True) for p in soup.find_all('p')])
            self.content[url] = text_content

            # Find all links on the page
            for link in self.get_links(soup):
                if self.is_valid(link):
                    self.scrape_page(link)

        except Exception as e:
            print(f"Error scraping {url}: {str(e)}")

        time.sleep(1)  # Be polite, wait between requests

    def start_scraping(self):
        self.scrape_page(self.base_url)

    def save_content(self, filename='morabanc_content.txt'):
        with open(filename, 'w', encoding='utf-8') as f:
            for url, content in self.content.items():
                f.write(f"URL: {url}\n")
                f.write(f"Content: {content}\n\n")

if __name__ == "__main__":
    scraper = WebScraper("https://www.morabanc.ad/")
    scraper.start_scraping()
    scraper.save_content()
    print(f"Scraping completed. Visited {len(scraper.visited_urls)} pages.")