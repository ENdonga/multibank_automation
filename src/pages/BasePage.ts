import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigate to the given path relative to baseURL. */
  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitForPageReady();
  }

  /** Waits for network to be idle and page to be interactive. */
  async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForFunction(() => document.readyState === 'complete');
  }

  get currentUrl(): string {
    return this.page.url();
  }

  /** Scrolls an element into view and waits for it to be visible. */
  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await expect(locator).toBeVisible();
  }

  async safeClick(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
    await locator.click();
  }

  /** Dismisses cookie/consent banners if present, so they don't block interactions. */
  async dismissConsentBanner(): Promise<void> {
    const consentSelectors = [
      '[id*="cookie"] button[id*="accept"]',
      '[class*="cookie"] button[class*="accept"]',
      'button:has-text("Accept")',
      'button:has-text("Accept All")',
      'button:has-text("Got it")',
      '[aria-label*="accept cookies"]',
    ];

    for (const selector of consentSelectors) {
      const btn = this.page.locator(selector).first();
      if (await btn.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await btn.click();
        return;
      }
    }
  }

  /** Takes a labelled screenshot for evidence / debugging. */
  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: false,
    });
  }
}
