import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from 'src/components/HeaderComponent';

export class HomePage extends BasePage {
  // Header component
  readonly header: HeaderComponent;

  // Hero section
  readonly heroHeading: Locator;
  readonly downloadAppButton: Locator;
  readonly openAccountButton: Locator;

  // Download section
  readonly downloadSection: Locator;
  readonly appStoreLink: Locator;
  readonly googlePlayLink: Locator;

  // Marketing banners
  readonly marketingBanners: Locator;

  // Expose nav locators from header component for backward compat with specs
  get mainNav() {
    return this.header.mainNav;
  }

  get navLinks() {
    return this.header.navLinks;
  }

  get signInButton() {
    return this.header.signInButton;
  }

  get signUpButton() {
    return this.header.signUpButton;
  }

  constructor(page: Page) {
    super(page);

    this.header = new HeaderComponent(page);

    this.heroHeading = page.locator('h3').first();
    this.downloadAppButton = page.getByRole('link', { name: /download the app/i }).first();
    this.openAccountButton = page.getByRole('link', { name: /open an account/i }).first();

    this.downloadSection = page.locator('section, div').filter({ hasText: /app store|google play/i }).first();
    this.appStoreLink = page.locator('a[href*="apps.apple.com"]').first();
    this.googlePlayLink = page.locator('a[href*="play.google.com"]').first();

    this.marketingBanners = page.locator('section').filter({ hasNotText: /^\s*$/ });
  }

  async open(): Promise<void> {
    await this.goto('/en');
    await this.dismissConsentBanner();
  }

  // Navigation helpers
  async getNavLinkLabels(): Promise<string[]> {
    return this.header.getNavLinkLabels();
  }

  async getNavLinkHref(label: string | RegExp): Promise<string | null> {
    return this.header.getNavLinkHref(label);
  }

  async clickNavLink(label: string | RegExp): Promise<void> {
    await this.header.clickNavLink(typeof label === 'string' ? label : label.toString());
    await this.waitForPageReady();
  }

  async areCtaButtonsVisible(): Promise<{ signIn: boolean; signUp: boolean }> {
    return await this.header.areCtaButtonsVisible()
  }

  // Hero helpers
  async getHeroHeadingText(): Promise<string> {
    await expect(this.heroHeading).toBeVisible();
    return (await this.heroHeading.textContent())?.trim() ?? '';
  }

  // Download section helpers
  async scrollToDownloadSection(): Promise<void> {
    try {
      await this.downloadSection.scrollIntoViewIfNeeded();
    } catch {
      await this.appStoreLink.scrollIntoViewIfNeeded();
    }
  }

  async getAppStoreHref(): Promise<string | null> {
    return this.appStoreLink.getAttribute('href');
  }

  async getGooglePlayHref(): Promise<string | null> {
    return this.googlePlayLink.getAttribute('href');
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForFunction(() => document.readyState === 'complete', { timeout: 5_000 });
  }

  async getBannerCount(): Promise<number> {
    return this.marketingBanners.count();
  }
}