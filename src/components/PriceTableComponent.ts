import { Page, Locator, expect } from '@playwright/test';
import { TradingPair } from '../pages/TradingPage';

/**
 * PriceTableComponent — the crypto price table on the Explore page.
 * Extracted as a component so it can be reused if the table
 * appears on other pages in future.
 */
export class PriceTableComponent {
    readonly heading: Locator;
    readonly hotTab: Locator;
    readonly gainersTab: Locator;
    readonly losersTab: Locator;
    readonly pairRows: Locator;
    readonly firstPairRow: Locator;
    readonly secondPairRow: Locator;
    readonly allChartCells: Locator;

    constructor(private readonly page: Page) {
        this.heading = page.locator('h3').filter({ hasText: /today's top crypto prices/i }).first();
        this.hotTab = page.getByRole('button', { name: /^hot$/i });
        this.gainersTab = page.getByRole('button', { name: /^gainers$/i });
        this.losersTab = page.getByRole('button', { name: /^losers$/i });
        this.pairRows = page.locator('tr[data-index]');
        this.firstPairRow = page.locator('tr[data-index="0"]');
        this.secondPairRow = page.locator('tr[data-index="1"]');
        this.allChartCells = page.locator('[id$="_week-chart-td"] .recharts-surface');
    }

    rowSymbol(row: Locator): Locator {
        return row.locator('[id$="_displayName-td"] span').first();
    }

    rowName(row: Locator): Locator {
        return row.locator('[id$="_displayName-td"] span').nth(1);
    }

    rowPrice(row: Locator): Locator {
        return row.locator('[id$="_price-td"] div').first();
    }

    rowChange(row: Locator): Locator {
        return row.locator('[id$="_change-td"] span').first();
    }

    pairLink(symbol: string): Locator {
        return this.page.locator(`a[href="/explore/${symbol}"]`);
    }

    async getTabLabels(): Promise<string[]> {
        await expect(this.hotTab.first()).toBeVisible({ timeout: 10_000 });
        const tabs = this.page.getByRole('button').filter({ hasText: /^(hot|gainers|losers)$/i });
        const count = await tabs.count();
        const labels = await Promise.all(
            Array.from({ length: count }, (_, i) =>
                tabs.nth(i).textContent().then(t => t?.trim() ?? '')
            )
        );
        return labels.filter(Boolean);
    }

    async clickTab(tab: Locator): Promise<void> {
        await expect(tab).toBeVisible();
        await tab.click();
        await this.page.waitForTimeout(400);
    }

    async getPairCount(): Promise<number> {
        await expect(this.heading).toBeVisible({ timeout: 10_000 });
        return this.pairRows.count();
    }

    async getTradingPairs(limit = 20): Promise<TradingPair[]> {
        await expect(this.heading).toBeVisible({ timeout: 10_000 });
        await expect(this.pairRows.first()).toBeVisible({ timeout: 10_000 });

        const count = await this.pairRows.count();
        const indices = Array.from({ length: Math.min(count, limit) }, (_, i) => i);

        const pairs = await Promise.all(
            indices.map(async (i) => {
                const row = this.pairRows.nth(i);
                const nameTd = row.locator('[id$="_displayName-td"]');
                const changeTd = row.locator('[id$="_change-td"]');

                const [symbol, name, price, change, upCount] = await Promise.all([
                    nameTd.locator('span').nth(0).textContent(),
                    nameTd.locator('span').nth(1).textContent(),
                    row.locator('[id$="_price-td"] div').first().textContent(),
                    changeTd.locator('span').first().textContent(),
                    changeTd.locator('svg.rotate-180').count(),
                ]);

                const s = symbol?.trim() ?? '';
                const c = change?.trim() ?? '';
                const direction: 'up' | 'down' | 'neutral' = c ? (upCount > 0 ? 'up' : 'down') : 'neutral';

                return s ? { symbol: s, name: name?.trim() ?? '', price: price?.trim() ?? '', change: c, direction } as TradingPair : null;
            })
        );

        return pairs.filter((p): p is TradingPair => p !== null);
    }

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
}