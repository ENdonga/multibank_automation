import { test, expect } from '@playwright/test';
import { HomePage } from '../pages';
import { contentData } from '../data/contentData';

/**
 * Content Validation Tests
 *
 * Covers:
 * - Marketing banners appear at page bottom
 * - App Store link present and points to Apple
 * - Google Play link present and points to Google
 * - Links are valid (href not empty, not '#')
 *
 * @tag @content
 */
test.describe('Content Validation @content', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.open();
  });

  test('marketing banners are displayed on the page', async () => {
    await homePage.scrollToBanners();
    const count = await homePage.getBannerCount();
    expect(count).toBeGreaterThanOrEqual(
      contentData.bannerCount,
      `Expected at least ${contentData.bannerCount} banner(s), found ${count}`
    );
  });

  test('App Store download link is present and valid', async () => {
    await homePage.scrollToDownloadSection();
    const href = await homePage.getAppStoreHref();

    expect(href, 'App Store link href should not be null').not.toBeNull();
    expect(href!.length).toBeGreaterThan(0, 'App Store href should not be empty');
    expect(href).not.toBe('#');
    expect(href).toContain(contentData.appStoreLinks.appStore);
  });

  test('Google Play download link is present and valid', async () => {
    await homePage.scrollToDownloadSection();
    const href = await homePage.getGooglePlayHref();

    expect(href, 'Google Play link href should not be null').not.toBeNull();
    expect(href!.length).toBeGreaterThan(0, 'Google Play href should not be empty');
    expect(href).not.toBe('#');
    expect(href).toContain(contentData.appStoreLinks.googlePlay);
  });

  test('App Store link opens in new tab (target=_blank)', async () => {
    const target = await homePage.appStoreLink.getAttribute('target');
    // Best practice: external links should open in new tab
    expect(target).toBe('_blank');
  });

  test('Google Play link opens in new tab (target=_blank)', async () => {
    const target = await homePage.googlePlayLink.getAttribute('target');
    expect(target).toBe('_blank');
  });

  test('download section is visible after scrolling', async () => {
    await homePage.scrollToDownloadSection();
    await expect(homePage.downloadSection).toBeVisible({ timeout: 10_000 });
  });

  test('page has no broken links in main navigation', async ({ page }) => {
    const navLinks = page.locator('nav a[href], header a[href]');
    const count = await navLinks.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 10); i++) {
      const href = await navLinks.nth(i).getAttribute('href');
      // href should exist and not be empty
      expect(href).not.toBeNull();
      expect(href!.trim()).not.toBe('');
    }
  });
});
