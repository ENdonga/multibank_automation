import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

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

  // Price table
  readonly cryptoPricesHeading: Locator;
  readonly hotTab: Locator;
  readonly gainersTab: Locator;
  readonly losersTab: Locator;

  /** All coin rows — selected by data-index attribute set by the table renderer */
  readonly pairRows: Locator;

  // Sidebar
  readonly marketSentimentWidget: Locator;
  readonly downloadAppButton: Locator;

  /** Row 0 — always MBG on the Hot tab */
  readonly firstPairRow: Locator;
  /** Row 1 — always BTC on the Hot tab */
  readonly secondPairRow: Locator;

  /**
   * All mini-chart SVG elements across every row.
   * Recharts renders lazily — use waitForCharts() before counting.
   */
  readonly allChartCells: Locator;

  constructor(page: Page) {
    super(page);

    this.heroHeading = page.getByRole('heading', { name: /markets at your fingertips/i });

    this.earnInterestBanner = page.locator('a, div').filter({ hasText: /earn interest on your assets/i }).first();
    this.instantBuyBanner   = page.locator('a, div').filter({ hasText: /get crypto with your card/i }).first();
    this.depositsBanner     = page.locator('a, div').filter({ hasText: /deposits using card or wire transfer/i }).first();

    this.spotMarketHeading     = page.locator('h2').filter({ hasText: /^spot market$/i }).first();
    this.spotMarketDescription = page.locator('p').filter({ hasText: /discover our cryptocurrency spot market/i }).first();

    this.cryptoPricesHeading = page.locator('h3').filter({ hasText: /today's top crypto prices/i }).first();

    this.hotTab     = page.getByRole('button', { name: /^hot$/i });
    this.gainersTab = page.getByRole('button', { name: /^gainers$/i });
    this.losersTab  = page.getByRole('button', { name: /^losers$/i });

    this.pairRows      = page.locator('tr[data-index]');
    this.firstPairRow  = page.locator('tr[data-index="0"]');
    this.secondPairRow = page.locator('tr[data-index="1"]');

    this.allChartCells = page.locator('[id$="_week-chart-td"] .recharts-surface');

    this.marketSentimentWidget = page.locator('*').filter({ hasText: /^market sentiment$/i }).first();
    this.downloadAppButton     = page.getByRole('link', { name: /download the app/i }).first();
  }

  async open(): Promise<void> {
    await this.goto('/en/explore');
    await this.dismissConsentBanner();
  }

  // Row-level cell helpers
  /** Ticker symbol span from a specific row (e.g. "BTC") */
  rowSymbol(row: Locator): Locator {
    return row.locator('[id$="_displayName-td"] span').first();
  }

  /** Full name span from a specific row (e.g. "Bitcoin") */
  rowName(row: Locator): Locator {
    return row.locator('[id$="_displayName-td"] span').nth(1);
  }

  /** Price div from a specific row (e.g. "$67,003.61") */
  rowPrice(row: Locator): Locator {
    return row.locator('[id$="_price-td"] div').first();
  }

  /** Change % span from a specific row (e.g. "5.58%") */
  rowChange(row: Locator): Locator {
    return row.locator('[id$="_change-td"] span').first();
  }

  /** Detail page link for a given ticker symbol (e.g. /explore/BTC) */
  pairLink(symbol: string): Locator {
    return this.page.locator(`a[href="/explore/${symbol}"]`);
  }

  /**
   * Returns visible tab labels from the price-table tab bar.
   * Waits for the Hot tab specifically (first tab, always rendered) before
   */
  async getTabLabels(): Promise<string[]> {
    await expect(this.hotTab.first()).toBeVisible({ timeout: 10_000 });

    const tabs = this.page.getByRole('button').filter({ hasText: /^(hot|gainers|losers)$/i });
    const count = await tabs.count();
    const labels: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await tabs.nth(i).textContent())?.trim() ?? '';
      if (text) labels.push(text);
    }
    return labels;
  }

  /** Click a tab and wait for the table to re-render */
  async clickTab(tab: Locator): Promise<void> {
    await expect(tab).toBeVisible();
    await tab.click();
    await this.page.waitForTimeout(400);
  }

  /**
   * Scrolls every pair row into view so Recharts renders all mini-chart SVGs,
   * then waits until the expected count is stable.
   * Call this before asserting on allChartCells.count().
   */
  async waitForCharts(expectedMinCount = 5): Promise<void> {
    await expect(this.pairRows.first()).toBeVisible({ timeout: 10_000 });

    const rowCount = await this.pairRows.count();
    for (let i = 0; i < rowCount; i++) {
      await this.pairRows.nth(i).scrollIntoViewIfNeeded();
    }

    await expect(async () => {
      const count = await this.allChartCells.count();
      expect(count).toBeGreaterThanOrEqual(expectedMinCount);
    }).toPass({ timeout: 10_000 });
  }

  /**
   * Extract trading pair data from all visible rows.
   */
  async getTradingPairs(limit = 20): Promise<TradingPair[]> {
    await expect(this.cryptoPricesHeading).toBeVisible({ timeout: 10_000 });
    await expect(this.pairRows.first()).toBeVisible({ timeout: 10_000 });

    const count = await this.pairRows.count();
    const pairs: TradingPair[] = [];

    for (let i = 0; i < Math.min(count, limit); i++) {
      const row = this.pairRows.nth(i);

      const nameTd  = row.locator('[id$="_displayName-td"]');
      const spans   = nameTd.locator('span');
      const symbol  = ((await spans.nth(0).textContent()) ?? '').trim();
      const name    = ((await spans.nth(1).textContent()) ?? '').trim();

      const priceTd = row.locator('[id$="_price-td"]');
      const price   = ((await priceTd.locator('div').first().textContent()) ?? '').trim();

      const changeTd = row.locator('[id$="_change-td"]');
      const change   = ((await changeTd.locator('span').first().textContent()) ?? '').trim();

      const isUp    = (await changeTd.locator('svg.rotate-180').count()) > 0;
      const direction: 'up' | 'down' | 'neutral' = change ? (isUp ? 'up' : 'down') : 'neutral';

      if (symbol) pairs.push({ symbol, name, price, change, direction });
    }

    return pairs;
  }

  async getPairCount(): Promise<number> {
    await expect(this.cryptoPricesHeading).toBeVisible({ timeout: 10_000 });
    return this.pairRows.count();
  }
}