import { chromium, Browser, Page } from "playwright";

interface PlaywrightScraperOptions {
  timeout?: number;
  waitForSelector?: string;
  headless?: boolean;
}

class PlaywrightScraper {
  private browser: Browser | null = null;

  async initialize(): Promise<void> {
    try {
      this.browser = await chromium.launch({ headless: true });
    } catch (error) {
      console.warn("Playwright not available, falling back to Cheerio", error);
    }
  }

  async scrapeWithJS(
    url: string,
    options: PlaywrightScraperOptions = {}
  ): Promise<string> {
    if (!this.browser) {
      throw new Error("Playwright browser not initialized");
    }

    let page: Page | null = null;
    try {
      page = await this.browser.newPage();
      
      // Set viewport and user agent
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      );

      // Navigate to URL
      await page.goto(url, { waitUntil: "networkidle", timeout: options.timeout || 30000 });

      // Wait for specific selector if provided
      if (options.waitForSelector) {
        await page.waitForSelector(options.waitForSelector, { timeout: 5000 }).catch(() => {
          // Selector not found, but we'll continue anyway
        });
      } else {
        // Wait for common product elements
        await page.waitForSelector("h1, .product-title, [class*='title']", {
          timeout: 5000,
        }).catch(() => null);
      }

      // Return page content
      return await page.content();
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Singleton instance
let scraperInstance: PlaywrightScraper | null = null;

export async function getPlaywrightScraper(): Promise<PlaywrightScraper> {
  if (!scraperInstance) {
    scraperInstance = new PlaywrightScraper();
    try {
      await scraperInstance.initialize();
    } catch (error) {
      console.warn("Could not initialize Playwright scraper", error);
    }
  }
  return scraperInstance;
}

export async function closePlaywrightScraper(): Promise<void> {
  if (scraperInstance) {
    await scraperInstance.close();
    scraperInstance = null;
  }
}
