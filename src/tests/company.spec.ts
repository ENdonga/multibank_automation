import { test, expect } from '../fixtures';
import { companyData } from '../data/companyData';

/**
 * Content Validation — Why MultiBank Group page
 * Target: https://mb.io/en/company
 * @tag @content
 */
test.describe('Why MultiBank Group page @content', () => {

    test('page heading renders correctly', async ({ companyPage }) => {
        const heading = await companyPage.getHeadingText();
        expect(heading).toBe(companyData.heading);
    });

    test('page subheading is visible and contains expected text', async ({ companyPage }) => {
        const subheading = await companyPage.getSubheadingText();
        expect(subheading).toContain(companyData.subheadingContains);
    });

    test('all 3 stat cards are visible', async ({ companyPage }) => {
        const count = await companyPage.getStatCardCount();
        expect(count).toBe(companyData.stats.length);
    });

    test('Annual turnover stat displays correct value and label', async ({ companyPage }) => {
        await expect(companyPage.annualTurnoverValue).toBeVisible();
        await expect(companyPage.annualTurnoverLabel).toBeVisible();
    });

    test('Customers worldwide stat displays correct value and label', async ({ companyPage }) => {
        await expect(companyPage.customersValue).toBeVisible();
        await expect(companyPage.customersLabel).toBeVisible();
    });

    test('Offices globally stat displays correct value and label', async ({ companyPage }) => {
        await expect(companyPage.officesValue).toBeVisible();
        await expect(companyPage.officesLabel).toBeVisible();
    });

    test('all stat values and labels match expected data', async ({ companyPage }) => {
        for (const stat of companyData.stats) {
            await companyPage.isStatVisible(stat.value, stat.label);
        }
    });
});