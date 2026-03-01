import { test, expect } from '@playwright/test';
import { TradingPage } from '../pages';
import {
  priceTabs,
  explorePageCopy,
  knownHotPairSymbols,
  knownHotPairNames,
  priceRegex,
  changeRegex,
} from '../data/tradingData';

/**
 * Trading Functionality Tests — mb.io/en/explore
 *
 * All locators are centralised in TradingPage.ts — no page.locator() calls here.
 * This file contains only assertions and test orchestration logic.
 *
 * @tag @trading
 */
test.describe('Trading Functionality — Explore page @trading', () => {
  let tradingPage: TradingPage;

  test.beforeEach(async ({ page }) => {
    tradingPage = new TradingPage(page);
    await tradingPage.open();
  });

  test('hero heading "Markets at your fingertips" is visible', async () => {
    await expect(tradingPage.heroHeading).toBeVisible({ timeout: 10_000 });
    const text = await tradingPage.heroHeading.textContent();
    expect(text?.trim()).toBe(explorePageCopy.heroHeading);
  });

  test('all 3 feature banner cards are present', async () => {
    await expect(tradingPage.earnInterestBanner).toBeVisible();
    await expect(tradingPage.instantBuyBanner).toBeVisible();
    await expect(tradingPage.depositsBanner).toBeVisible();
  });

  test('feature banner "Earn interest on your assets" shows "Up to 35% APY"', async () => {
    await expect(tradingPage.earnInterestBanner).toBeVisible();
    await expect(tradingPage.earnInterestBanner).toContainText('Up to 35% APY');
  });

  test('feature banner "Get crypto with your card" shows "Instant buy"', async () => {
    await expect(tradingPage.instantBuyBanner).toBeVisible();
    await expect(tradingPage.instantBuyBanner).toContainText('Instant buy');
  });

  test('feature banner "Deposits using card or wire transfer" shows "Top up today"', async () => {
    await expect(tradingPage.depositsBanner).toBeVisible();
    await expect(tradingPage.depositsBanner).toContainText('Top up today');
  });

  test('Spot market section heading matches exactly', async () => {
    await expect(tradingPage.spotMarketHeading).toBeVisible();
    const text = await tradingPage.spotMarketHeading.textContent();
    expect(text?.trim()).toBe(explorePageCopy.spotMarketHeading);
  });

  test('Spot market description is visible and contains expected copy', async () => {
    await expect(tradingPage.spotMarketDescription).toBeVisible();
    await expect(tradingPage.spotMarketDescription).toContainText(
      explorePageCopy.spotMarketDescriptionContains
    );
  });

  test('"Today\'s top crypto prices" heading is visible', async () => {
    await expect(tradingPage.cryptoPricesHeading).toBeVisible();
  });

  test('price table shows all 3 filter tabs: Hot, Gainers, Losers', async () => {
    const labels = await tradingPage.getTabLabels();
    for (const expectedTab of priceTabs) {
      expect(labels.some(l => l.toLowerCase() === expectedTab.toLowerCase()), `Tab "${expectedTab}" not found. Tabs found: ${labels.join(', ')}`).toBeTruthy();
    }
  });

  test('at least 5 pair rows are rendered in the table (tr[data-index])', async () => {
    const count = await tradingPage.getPairCount();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('every pair row has non-empty symbol and full name', async () => {
    const pairs = await tradingPage.getTradingPairs(15);
    expect(pairs.length).toBeGreaterThan(0);
    for (const pair of pairs) {
      expect(pair.symbol.length, `Symbol empty in row`).toBeGreaterThan(0);
      expect(pair.name.length, `Full name empty for ${pair.symbol}`).toBeGreaterThan(0);
    }
  });

  test('every pair row price cell matches $N,NNN.NN format', async () => {
    const pairs = await tradingPage.getTradingPairs(15);
    for (const pair of pairs) {
      expect(pair.price, `Price "${pair.price}" for ${pair.symbol} does not match expected format`).toMatch(priceRegex);
    }
  });

  test('every pair row change cell contains a percentage value', async () => {
    const pairs = await tradingPage.getTradingPairs(15);
    for (const pair of pairs) {
      expect(pair.change, `Change "${pair.change}" for ${pair.symbol} does not contain a percentage`).toMatch(changeRegex);
    }
  });

  test('every pair row has a direction indicator (up or down)', async () => {
    const pairs = await tradingPage.getTradingPairs(15);
    for (const pair of pairs) {
      expect(['up', 'down'], `Direction for ${pair.symbol} should be "up" or "down", got "${pair.direction}"`).toContain(pair.direction);
    }
  });

  test('each pair row has a mini chart (recharts SVG) rendered', async () => {
    await tradingPage.waitForCharts(5);
    const count = await tradingPage.allChartCells.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('MBG (MultiBank Group) is the first row (data-index="0")', async () => {
    await expect(tradingPage.rowSymbol(tradingPage.firstPairRow)).toHaveText('MBG');
    await expect(tradingPage.rowName(tradingPage.firstPairRow)).toHaveText('MultiBank Group');
  });

  test('BTC row shows "Bitcoin" as full name', async () => {
    await expect(tradingPage.rowSymbol(tradingPage.secondPairRow)).toHaveText('BTC');
    await expect(tradingPage.rowName(tradingPage.secondPairRow)).toHaveText('Bitcoin');
  });

  test('core crypto symbols and names are all visible', async () => {
    const coreSymbols: Array<typeof knownHotPairSymbols[number]> = ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE'];
    const pairs = await tradingPage.getTradingPairs(15);
    const symbolMap = new Map(pairs.map(p => [p.symbol, p.name]));

    for (const sym of coreSymbols) {
      expect(symbolMap.has(sym), `Ticker "${sym}" not found in pair rows`).toBeTruthy();
      expect(symbolMap.get(sym), `Full name for ${sym} should be "${knownHotPairNames[sym]}"`).toBe(knownHotPairNames[sym]);
    }
  });

  test('each pair row links to /explore/<SYMBOL> detail page', async () => {
    const pairs = await tradingPage.getTradingPairs(5);
    for (const pair of pairs) {
      await expect(tradingPage.pairLink(pair.symbol)).toBeVisible();
    }
  });

  test('Gainers tab is clickable and still shows pair rows', async () => {
    await tradingPage.clickTab(tradingPage.gainersTab);
    const count = await tradingPage.getPairCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('Losers tab is clickable and still shows pair rows', async () => {
    await tradingPage.clickTab(tradingPage.losersTab);
    const count = await tradingPage.getPairCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('switching back to Hot tab restores MBG as first row', async () => {
    await tradingPage.clickTab(tradingPage.gainersTab);
    await tradingPage.clickTab(tradingPage.hotTab);
    await expect(tradingPage.rowSymbol(tradingPage.firstPairRow)).toHaveText('MBG');
  });

  test('Market sentiment widget is visible in sidebar', async () => {
    await expect(tradingPage.marketSentimentWidget).toBeVisible();
  });

  test('"Download the app" button is visible in sidebar', async () => {
    await tradingPage.downloadAppButton.scrollIntoViewIfNeeded();
    await expect(tradingPage.downloadAppButton).toBeVisible();
  });
});