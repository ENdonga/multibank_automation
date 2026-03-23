import { test, expect } from '../fixtures';
import { contentData } from '../data/contentData';

/**
 * Content Validation Tests — mb.io/en
 * @tag @content
 */
test.describe.skip('Content Validation @content', () => {

  test('marketing banners are displayed on the page', async ({ homePage }) => {
    await homePage.scrollToBottom();
    const count = await homePage.getBannerCount();
    expect(count).toBeGreaterThanOrEqual(contentData.bannerCount);
  });

  test('App Store download link is present and valid', async ({ homePage }) => {
    await homePage.scrollToDownloadSection();
    const href = await homePage.getAppStoreHref();
    expect(href).not.toBeNull();
    expect(href!.length).toBeGreaterThan(0);
    expect(href).not.toBe('#');
    expect(href).toContain(contentData.appStoreLinks.appStore);
  });

  test('Google Play download link is present and valid', async ({ homePage }) => {
    await homePage.scrollToDownloadSection();
    const href = await homePage.getGooglePlayHref();
    expect(href).not.toBeNull();
    expect(href!.length).toBeGreaterThan(0);
    expect(href).not.toBe('#');
    expect(href).toContain(contentData.appStoreLinks.googlePlay);
  });

  test('App Store link opens in new tab', async ({ homePage }) => {
    const target = await homePage.appStoreLink.getAttribute('target');
    expect(target).toBe('_blank');
  });

  test('Google Play link opens in new tab', async ({ homePage }) => {
    const target = await homePage.googlePlayLink.getAttribute('target');
    expect(target).toBe('_blank');
  });

  test('download section is visible after scrolling', async ({ homePage }) => {
    await homePage.scrollToDownloadSection();
    await expect(homePage.downloadSection).toBeVisible({ timeout: 10_000 });
  });

  test('page has no broken links in main navigation', async ({ homePage, page }) => {
    const navLinks = page.locator('nav a[href], header a[href]');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
    const hrefs = await Promise.all(Array.from({ length: Math.min(count, 10) }, (_, i) => navLinks.nth(i).getAttribute('href')));
    for (const href of hrefs) {
      expect(href).not.toBeNull();
      expect(href!.trim()).not.toBe('');
    }
  });
});