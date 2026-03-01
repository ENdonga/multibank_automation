import type { NavItem, TradingCategory, WhyMultiBankSection } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Trade', hasDropdown: true },
  { label: 'Markets', hasDropdown: false },
  { label: 'Tools', hasDropdown: true },
  { label: 'Learn', hasDropdown: true },
  { label: 'About Us', hasDropdown: true },
];

export const TRADING_CATEGORIES: TradingCategory[] = [
  {
    name: 'Forex',
    pairs: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
  },
  {
    name: 'Crypto',
    pairs: ['BTC/USD', 'ETH/USD'],
  },
  {
    name: 'Stocks',
    pairs: ['AAPL', 'TSLA', 'AMZN'],
  },
  {
    name: 'Commodities',
    pairs: ['XAU/USD', 'XAG/USD'],
  },
  {
    name: 'Indices',
    pairs: ['US30', 'US500', 'NAS100'],
  },
];

export const APP_STORE_URL_PATTERNS = {
  appStore: 'apps.apple.com',
  googlePlay: 'play.google.com',
} as const;

export const WHY_MULTIBANK_SECTIONS: WhyMultiBankSection[] = [
  {
    heading: 'Regulated',
    subheadings: [],
  },
  {
    heading: 'Trusted',
    subheadings: [],
  },
  {
    heading: 'Award-Winning',
    subheadings: [],
  },
];

export const URLS = {
  base: 'https://trade.multibank.io',
  whyMultibank: '/en/about-us/why-multibank',
  aboutUs: '/en/about-us',
} as const;

export const TIMEOUTS = {
  element: 15_000,
  navigation: 30_000,
  animation: 2_000,
  retry: 1_000,
} as const;
