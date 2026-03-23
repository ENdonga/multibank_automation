import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PriceTableComponent } from 'src/components/PriceTableComponent';

export interface TradingPair {
  symbol: string;
  name: string;
  price: string;
  change: string;
  direction: 'up' | 'down' | 'neutral';
}

/**
 * TradingPage — covers the Explore / Spot Market page: https://mb.io/en/explore
 *
 * DOM structure (from source):
 * Hero:
 * Feature banners (3 cards below hero):
 *   "Earn interest on your assets / Up to 35% APY"
 *   "Get crypto with your card / Instant buy"
 *   "Deposits using card or wire transfer / Top up today"
 * Spot market section:
 * Price table heading + tab bar:
 * Table structure (one <tr> per coin, data-index="N"):
 * Sidebar:
 *   "Market sentiment" widget
 *   "Download the app" link/button
 */
export class TradingPage extends BasePage {
  // Hero
  readonly heroHeading: Locator;

  // Feature banner cards
  readonly earnInterestBanner: Locator;
  readonly instantBuyBanner: Locator;
  readonly depositsBanner: Locator;

  // Spot market section
  readonly spotMarketHeading: Locator;
  readonly spotMarketDescription: Locator;

  // Sidebar
  readonly marketSentimentWidget: Locator;
  readonly downloadAppButton: Locator;

  // Price tables (using the component)
  readonly priceTable: PriceTableComponent;

  constructor(page: Page) {
    super(page);

    this.heroHeading = page.getByRole('heading', { name: /markets at your fingertips/i });

    this.earnInterestBanner = page.locator('a, div').filter({ hasText: /earn interest on your assets/i }).first();
    this.instantBuyBanner = page.locator('a, div').filter({ hasText: /get crypto with your card/i }).first();
    this.depositsBanner = page.locator('a, div').filter({ hasText: /deposits using card or wire transfer/i }).first();

    this.spotMarketHeading = page.locator('h2').filter({ hasText: /^spot market$/i }).first();
    this.spotMarketDescription = page.locator('p').filter({ hasText: /discover our cryptocurrency spot market/i }).first();

    this.marketSentimentWidget = page.locator('*').filter({ hasText: /^market sentiment$/i }).first();
    this.downloadAppButton = page.getByRole('link', { name: /download the app/i }).first();

    this.priceTable = new PriceTableComponent(page);
  }

  async open(): Promise<void> {
    await this.goto('/en/explore');
    await this.dismissConsentBanner();
  }
}