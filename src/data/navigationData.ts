/**
 * Test data for navigation and layout validation.
 * Reflects the actual nav at https://mb.io/en
 * Update this file if the site navigation changes.
 */

export interface NavItem {
  label: string;
  expectedPath?: string;
  isExternal?: boolean;
}

export interface NavigationData {
  primaryNav: NavItem[];
  ctaButtons: string[];
  whyMultibankComponents: string[];
  aboutUsSubmenu: NavItem[];
}

export const navigationData: NavigationData = {
  primaryNav: [
    { label: 'Explore', expectedPath: '/en/explore' },
    { label: 'Features', expectedPath: '/en/features' },
    { label: 'Company', expectedPath: '/en/company' },
    { label: '$MBG', isExternal: true },
  ],

  ctaButtons: ['Sign in', 'Sign up'],

  aboutUsSubmenu: [],

  whyMultibankComponents: ['hero', 'statistics', 'features'],
};