import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // ── Navigation ──
  readonly header: Locator;
  readonly mainNav: Locator;
  readonly navLinks: Locator;
  readonly signInButton: Locator;
  readonly signUpButton: Locator;

  // ── Hero section ──
  readonly heroHeading: Locator;
  readonly downloadAppButton: Locator;
  readonly openAccountButton: Locator;

  // ── Download section ──
  readonly downloadSection: Locator;
  readonly appStoreLink: Locator;
  readonly googlePlayLink: Locator;

  // ── Marketing banners ──
  readonly marketingBanners: Locator;

  constructor(page: Page) {
    super(page);

    this.header = page.locator('header').first();
    this.mainNav = page.locator('nav[aria-label="Main"]');
    this.navLinks = this.mainNav.locator('a');
    this.signInButton = page.locator('a[href*="trade.mb.io/login"]').first();
    this.signUpButton = page.locator('a[href*="trade.mb.io/register"]').first();

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

  // ── Navigation helpers ──
  async getNavLinkLabels(): Promise<string[]> {
    await expect(this.mainNav).toBeVisible();
    const count = await this.navLinks.count();
    const labels: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await this.navLinks.nth(i).textContent())?.trim() ?? '';
      if (text) labels.push(text);
    }
    return labels;
  }

  async getNavLinkHref(label: string | RegExp): Promise<string | null> {
    const link = this.mainNav.getByRole('link', { name: label });
    await expect(link).toBeVisible();
    return link.getAttribute('href');
  }

  async clickNavLink(label: string | RegExp): Promise<void> {
    const link = this.mainNav.getByRole('link', { name: label });
    await this.safeClick(link);
    await this.waitForPageReady();
  }

  async areCtaButtonsVisible(): Promise<{ signIn: boolean; signUp: boolean }> {
    return {
      signIn: await this.signInButton.isVisible(),
      signUp: await this.signUpButton.isVisible(),
    };
  }

  // ── Hero helpers ──
  async getHeroHeadingText(): Promise<string> {
    await expect(this.heroHeading).toBeVisible();
    return (await this.heroHeading.textContent())?.trim() ?? '';
  }

  // ── Download section helpers ──
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