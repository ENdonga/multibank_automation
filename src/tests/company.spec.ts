import { test, expect } from '@playwright/test';
import { WhyMultibankPage } from '../pages';
import { companyData } from '../data/companyData';

/**
 * Content Validation — Why MultiBank Group page
 *
 * Target: https://mb.io/en/company
 *
 * Validates:
 * - Page heading and subheading render with correct text
 * - All 3 stat cards are visible with correct values and labels
 *
 * @tag @content
 */
test.describe('Why MultiBank Group page @content', () => {
    let companyPage: WhyMultibankPage;

    test.beforeEach(async ({ page }) => {
        companyPage = new WhyMultibankPage(page);
        await companyPage.open();
    });

    test('page heading renders correctly', async () => {
        const heading = await companyPage.getHeadingText();
        expect(heading).toBe(companyData.heading);
    });

    test('page subheading is visible and contains expected text', async () => {
        const subheading = await companyPage.getSubheadingText();
        expect(subheading).toContain(companyData.subheadingContains);
    });

    test('all 3 stat cards are visible', async () => {
        const count = await companyPage.getStatCardCount();
        expect(count).toBe(companyData.stats.length);
    });

    test('Annual turnover stat displays correct value and label', async () => {
        await expect(companyPage.annualTurnoverValue).toBeVisible();
        await expect(companyPage.annualTurnoverLabel).toBeVisible();
    });

    test('Customers worldwide stat displays correct value and label', async () => {
        await expect(companyPage.customersValue).toBeVisible();
        await expect(companyPage.customersLabel).toBeVisible();
    });

    test('Offices globally stat displays correct value and label', async () => {
        await expect(companyPage.officesValue).toBeVisible();
        await expect(companyPage.officesLabel).toBeVisible();
    });

    test('all stat values and labels match expected data', async ({ page }) => {
        for (const stat of companyData.stats) {
            await expect(
                page.getByText(stat.value),
                `Stat value "${stat.value}" should be visible`
            ).toBeVisible();

            await expect(
                page.getByText(stat.label),
                `Stat label "${stat.label}" should be visible`
            ).toBeVisible();
        }
    });
});