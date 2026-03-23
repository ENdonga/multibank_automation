import { test, expect } from '../fixtures';
import { navigationData } from '../data/navigationData';

/**
 * Navigation & Layout Tests — mb.io/en
 * @tag @navigation
 */
test.describe('Navigation & Layout @navigation', () => {

  test('header is visible on page load', async ({ homePage }) => {
    await expect(homePage.header.header).toBeVisible();
  });

  test('main navigation is visible on desktop', async ({ homePage }) => {
    await expect(homePage.mainNav).toBeVisible();
  });

  test('navigation contains exactly the expected number of links', async ({ homePage }) => {
    const labels = await homePage.getNavLinkLabels();
    expect(labels.length).toBe(navigationData.primaryNav.length);
  });

  test('all expected nav items are present', async ({ homePage }) => {
    const labels = await homePage.getNavLinkLabels();
    const labelsLower = labels.map(l => l.toLowerCase());
    for (const expected of navigationData.primaryNav) {
      const found = labelsLower.some(l => l.includes(expected.label.toLowerCase()));
      expect(found, `Expected nav item "${expected.label}". Actual: [${labels.join(', ')}]`).toBeTruthy();
    }
  });

  test('each nav item is visible', async ({ homePage }) => {
    const count = await homePage.navLinks.count();
    expect(count).toBeGreaterThan(0);
    await Promise.all(Array.from({ length: count }, (_, i) => expect(homePage.navLinks.nth(i)).toBeVisible()));
  });

  test('Sign in and Sign up CTA buttons are visible', async ({ homePage }) => {
    const { signIn, signUp } = await homePage.areCtaButtonsVisible();
    expect(signIn, 'Sign in button should be visible').toBeTruthy();
    expect(signUp, 'Sign up button should be visible').toBeTruthy();
  });

  test('Explore nav link points to /en/explore', async ({ homePage }) => {
    const href = await homePage.getNavLinkHref('Explore');
    expect(href).toBe('/en/explore');
  });

  test('Features nav link points to /en/features', async ({ homePage }) => {
    const href = await homePage.getNavLinkHref('Features');
    expect(href).toBe('/en/features');
  });

  test('Company nav link points to /en/company', async ({ homePage }) => {
    const href = await homePage.getNavLinkHref('Company');
    expect(href).toBe('/en/company');
  });

  test('$MBG link is an external link to multibankgroup.com', async ({ homePage }) => {
    const href = await homePage.getNavLinkHref(/\$MBG/i);
    expect(href).toContain('multibankgroup.com');
  });

  test('Sign in button links to trade.mb.io/login', async ({ homePage }) => {
    const href = await homePage.signInButton.getAttribute('href');
    expect(href).toContain('trade.mb.io/login');
  });

  test('Sign up button links to trade.mb.io/register', async ({ homePage }) => {
    const href = await homePage.signUpButton.getAttribute('href');
    expect(href).toContain('trade.mb.io/register');
  });

  test('clicking Explore navigates to the Explore page', async ({ homePage, page }) => {
    await homePage.clickNavLink('Explore');
    await expect(page).toHaveURL(/\/en\/explore/);
  });

  test('clicking Features navigates to the Features page', async ({ homePage, page }) => {
    await homePage.clickNavLink('Features');
    await expect(page).toHaveURL(/\/en\/features/);
  });

  test('clicking Company navigates to the Company page', async ({ homePage, page }) => {
    await homePage.clickNavLink('Company');
    await expect(page).toHaveURL(/\/en\/company/);
  });

  test('hero heading contains "Crypto"', async ({ homePage }) => {
    const heading = await homePage.getHeroHeadingText();
    expect(heading.toLowerCase()).toContain('crypto');
  });

  test('"Download the app" CTA button is visible on hero', async ({ homePage }) => {
    await expect(homePage.downloadAppButton).toBeVisible();
  });

  test('"Open an account" CTA button is visible on hero', async ({ homePage }) => {
    await expect(homePage.openAccountButton).toBeVisible();
  });
});