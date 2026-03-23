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

export interface FooterLink {
  label: string,
  expectedPath: string
}

export interface NavigationData {
  primaryNav: NavItem[];
  ctaButtons: string[];
  whyMultibankComponents: string[];
  aboutUsSubmenu: NavItem[];
  footerNav: {
    legal: FooterLink[];
    support: FooterLink[];
  },
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
  footerNav: {
    legal: [
      { label: 'Terms & Conditions', expectedPath: '/en/about/terms-conditions' },
      { label: 'Privacy Policy', expectedPath: '/en/about/privacy-policy' },
      { label: 'Client Agreement', expectedPath: '/en/about/client-agreement' },
      { label: 'Cookie Policy', expectedPath: '/en/about/cookie-policy' },
      { label: 'Acceptable Use Policy', expectedPath: '/en/about/acceptable-use-policy' },
    ],
    support: [
      { label: 'Contact Us', expectedPath: '/en/support/contact-us' },
    ],
  },
};