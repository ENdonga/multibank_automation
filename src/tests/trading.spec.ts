import { test, expect } from '../fixtures';
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
 * @tag @trading
 */
test.describe('Trading Functionality — Explore page @trading', () => {

  test('hero heading "Markets at your fingertips" is visible', async ({ tradingPage }) => {
    await expect(tradingPage.heroHeading).toBeVisible({ timeout: 10_000 });
    const text = await tradingPage.heroHeading.textContent();
    expect(text?.trim()).toBe(explorePageCopy.heroHeading);
  });

  test('all 3 feature banner cards are present', async ({ tradingPage }) => {
    await expect(tradingPage.earnInterestBanner).toBeVisible();
    await expect(tradingPage.instantBuyBanner).toBeVisible();
    await expect(tradingPage.depositsBanner).toBeVisible();
  });

  test('feature banner "Earn interest on your assets" shows "Up to 35% APY"', async ({ tradingPage }) => {
    await expect(tradingPage.earnInterestBanner).toBeVisible();
    await expect(tradingPage.earnInterestBanner).toContainText('Up to 35% APY');
  });

  test('feature banner "Get crypto with your card" shows "Instant buy"', async ({ tradingPage }) => {
    await expect(tradingPage.instantBuyBanner).toBeVisible();
    await expect(tradingPage.instantBuyBanner).toContainText('Instant buy');
  });

  test('feature banner "Deposits using card or wire transfer" shows "Top up today"', async ({ tradingPage }) => {
    await expect(tradingPage.depositsBanner).toBeVisible();
    await expect(tradingPage.depositsBanner).toContainText('Top up today');
  });

  test('Spot market section heading matches exactly', async ({ tradingPage }) => {
    await expect(tradingPage.spotMarketHeading).toBeVisible();
    const text = await tradingPage.spotMarketHeading.textContent();
    expect(text?.trim()).toBe(explorePageCopy.spotMarketHeading);
  });

  test('Spot market description contains expected copy', async ({ tradingPage }) => {
    await expect(tradingPage.spotMarketDescription).toBeVisible();
    await expect(tradingPage.spotMarketDescription).toContainText(explorePageCopy.spotMarketDescriptionContains);
  });

  test('"Today\'s top crypto prices" heading is visible', async ({ tradingPage }) => {
    await expect(tradingPage.priceTable.heading).toBeVisible();
  });

  test('price table shows all 3 filter tabs: Hot, Gainers, Losers', async ({ tradingPage }) => {
    const labels = await tradingPage.priceTable.getTabLabels();
    for (const expectedTab of priceTabs) {
      expect(
        labels.some(l => l.toLowerCase() === expectedTab.toLowerCase()),
        `Tab "${expectedTab}" not found. Tabs found: ${labels.join(', ')}`
      ).toBeTruthy();
    }
  });

  test('at least 5 pair rows are rendered', async ({ tradingPage }) => {
    const count = await tradingPage.priceTable.getPairCount();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('every pair row has non-empty symbol and full name', async ({ tradingPage }) => {
    const pairs = await tradingPage.priceTable.getTradingPairs(15);
    expect(pairs.length).toBeGreaterThan(0);
    for (const pair of pairs) {
      expect(pair.symbol.length, `Symbol empty in row`).toBeGreaterThan(0);
      expect(pair.name.length, `Full name empty for ${pair.symbol}`).toBeGreaterThan(0);
    }
  });

  test('every pair row price cell matches $N,NNN.NN format', async ({ tradingPage }) => {
    const pairs = await tradingPage.priceTable.getTradingPairs(15);
    for (const pair of pairs) {
      expect(pair.price, `Price "${pair.price}" for ${pair.symbol} does not match format`).toMatch(priceRegex);
    }
  });

  test('every pair row change cell contains a percentage value', async ({ tradingPage }) => {
    const pairs = await tradingPage.priceTable.getTradingPairs(15);
    for (const pair of pairs) {
      expect(pair.change, `Change "${pair.change}" for ${pair.symbol} has no percentage`).toMatch(changeRegex);
    }
  });

  test('every pair row has a direction indicator (up or down)', async ({ tradingPage }) => {
    const pairs = await tradingPage.priceTable.getTradingPairs(15);
    for (const pair of pairs) {
      expect(['up', 'down'], `Direction for ${pair.symbol} got "${pair.direction}"`).toContain(pair.direction);
    }
  });

  test('each pair row has a mini chart (recharts SVG) rendered', async ({ tradingPage }) => {
    await tradingPage.priceTable.waitForCharts(5);
    const count = await tradingPage.priceTable.allChartCells.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('MBG (MultiBank Group) is the first row', async ({ tradingPage }) => {
    await expect(tradingPage.priceTable.rowSymbol(tradingPage.priceTable.firstPairRow)).toHaveText('MBG');
    await expect(tradingPage.priceTable.rowName(tradingPage.priceTable.firstPairRow)).toHaveText('MultiBank Group');
  });

  test('BTC row shows "Bitcoin" as full name', async ({ tradingPage }) => {
    await expect(tradingPage.priceTable.rowSymbol(tradingPage.priceTable.secondPairRow)).toHaveText('BTC');
    await expect(tradingPage.priceTable.rowName(tradingPage.priceTable.secondPairRow)).toHaveText('Bitcoin');
  });

  test('core crypto symbols and names are all visible', async ({ tradingPage }) => {
    const coreSymbols: Array<typeof knownHotPairSymbols[number]> = ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE'];
    const pairs = await tradingPage.priceTable.getTradingPairs(15);
    const symbolMap = new Map(pairs.map(p => [p.symbol, p.name]));
    for (const sym of coreSymbols) {
      expect(symbolMap.has(sym), `Ticker "${sym}" not found`).toBeTruthy();
      expect(symbolMap.get(sym), `Full name for ${sym} incorrect`).toBe(knownHotPairNames[sym]);
    }
  });

  test('each pair row links to /explore/<SYMBOL>', async ({ tradingPage }) => {
    const pairs = await tradingPage.priceTable.getTradingPairs(5);
    for (const pair of pairs) {
      await expect(tradingPage.priceTable.pairLink(pair.symbol)).toBeVisible();
    }
  });

  test('Gainers tab is clickable and shows pair rows', async ({ tradingPage }) => {
    await tradingPage.priceTable.clickTab(tradingPage.priceTable.gainersTab);
    const count = await tradingPage.priceTable.getPairCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('Losers tab is clickable and shows pair rows', async ({ tradingPage }) => {
    await tradingPage.priceTable.clickTab(tradingPage.priceTable.losersTab);
    const count = await tradingPage.priceTable.getPairCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('switching back to Hot tab restores MBG as first row', async ({ tradingPage }) => {
    await tradingPage.priceTable.clickTab(tradingPage.priceTable.gainersTab);
    await tradingPage.priceTable.clickTab(tradingPage.priceTable.hotTab);
    await expect(tradingPage.priceTable.rowSymbol(tradingPage.priceTable.firstPairRow)).toHaveText('MBG');
  });

  test('Market sentiment widget is visible in sidebar', async ({ tradingPage }) => {
    await expect(tradingPage.marketSentimentWidget).toBeVisible();
  });

  test('"Download the app" button is visible in sidebar', async ({ tradingPage }) => {
    await tradingPage.downloadAppButton.scrollIntoViewIfNeeded();
    await expect(tradingPage.downloadAppButton).toBeVisible();
  });
});