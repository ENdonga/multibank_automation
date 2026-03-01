import { test, expect } from '@playwright/test';
import { HomePage } from '../pages';
import { navigationData } from '../data/navigationData';

/**
 * Navigation & Layout Tests
 * @tag @navigation
 */
test.describe('Navigation & Layout @navigation', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.open();
  });

  test('header is visible on page load', async () => {
    await expect(homePage.header).toBeVisible();
  });

  test('main navigation is visible on desktop', async () => {
    await expect(homePage.mainNav).toBeVisible();
  });

  test('navigation contains exactly the expected number of links', async () => {
    const labels = await homePage.getNavLinkLabels();
    expect(labels.length).toBe(navigationData.primaryNav.length);
  });

  test('all expected nav items are present', async () => {
    const labels = await homePage.getNavLinkLabels();
    const labelsLower = labels.map(l => l.toLowerCase());

    for (const expected of navigationData.primaryNav) {
      const found = labelsLower.some(l => l.includes(expected.label.toLowerCase()));
      expect(
        found,
        `Expected nav item "${expected.label}" to be present. Actual: [${labels.join(', ')}]`
      ).toBeTruthy();
    }
  });

  test('each nav link is visible and not hidden', async () => {
    const count = await homePage.navLinks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(homePage.navLinks.nth(i)).toBeVisible();
    }
  });

  test('Sign in and Sign up buttons are visible in header', async () => {
    const { signIn, signUp } = await homePage.areCtaButtonsVisible();
    expect(signIn, 'Sign in button should be visible').toBeTruthy();
    expect(signUp, 'Sign up button should be visible').toBeTruthy();
  });

  test('Explore nav link points to /en/explore', async () => {
    const href = await homePage.getNavLinkHref('Explore');
    expect(href).toBe('/en/explore');
  });

  test('Features nav link points to /en/features', async () => {
    const href = await homePage.getNavLinkHref('Features');
    expect(href).toBe('/en/features');
  });

  test('Company nav link points to /en/company', async () => {
    const href = await homePage.getNavLinkHref('Company');
    expect(href).toBe('/en/company');
  });

  test('$MBG link is external and points to multibankgroup.com', async () => {
    const href = await homePage.getNavLinkHref(/\$MBG/i);
    expect(href).toContain('multibankgroup.com');
  });

  test('Sign in button links to trade.mb.io/login', async () => {
    const href = await homePage.signInButton.getAttribute('href');
    expect(href).toContain('trade.mb.io/login');
  });

  test('Sign up button links to trade.mb.io/register', async () => {
    const href = await homePage.signUpButton.getAttribute('href');
    expect(href).toContain('trade.mb.io/register');
  });

  test('clicking Explore navigates to the Explore page', async ({ page }) => {
    await homePage.clickNavLink('Explore');
    await expect(page).toHaveURL(/\/en\/explore/);
  });

  test('clicking Features navigates to the Features page', async ({ page }) => {
    await homePage.clickNavLink('Features');
    await expect(page).toHaveURL(/\/en\/features/);
  });

  test('clicking Company navigates to the Company page', async ({ page }) => {
    await homePage.clickNavLink('Company');
    await expect(page).toHaveURL(/\/en\/company/);
  });

  test('hero heading contains "Crypto"', async () => {
    const heading = await homePage.getHeroHeadingText();
    expect(heading.toLowerCase()).toContain('crypto');
  });

  test('"Download the app" button is visible on hero', async () => {
    await expect(homePage.downloadAppButton).toBeVisible();
  });

  test('"Open an account" button is visible on hero', async () => {
    await expect(homePage.openAccountButton).toBeVisible();
  });
});