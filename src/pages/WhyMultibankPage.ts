import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class WhyMultibankPage extends BasePage {
  readonly pageHeading: Locator;
  readonly pageSubheading: Locator;

  // Stats cards
  readonly annualTurnoverValue: Locator;
  readonly annualTurnoverLabel: Locator;
  readonly customersValue: Locator;
  readonly customersLabel: Locator;
  readonly officesValue: Locator;
  readonly officesLabel: Locator;
  readonly statCards: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.locator('h1').first();
    this.pageSubheading = page.locator('h2').first();

    // Each stat card contains a value span and a label span
    this.statCards = page.locator('section div.flex.flex-1');
    this.annualTurnoverValue = page.getByText('$2 trillion');
    this.annualTurnoverLabel = page.getByText('Annual turnover');
    this.customersValue = page.getByText('2,000,000+');
    this.customersLabel = page.getByText('Customers worldwide');
    this.officesValue = page.getByText('25+');
    this.officesLabel = page.getByText('Offices globally');
  }

  async open(): Promise<void> {
    await this.goto('/en/company');
    await this.dismissConsentBanner();
  }

  async getHeadingText(): Promise<string> {
    await expect(this.pageHeading).toBeVisible();
    return (await this.pageHeading.textContent())?.trim() ?? '';
  }

  async getSubheadingText(): Promise<string> {
    await expect(this.pageSubheading).toBeVisible();
    return (await this.pageSubheading.textContent())?.trim() ?? '';
  }

  async getStatCardCount(): Promise<number> {
    return this.statCards.count();
  }

  async isStatVisible(value: string, label: string): Promise<void> {
    await expect(this.page.getByText(value)).toBeVisible();
    await expect(this.page.getByText(label)).toBeVisible();
  }
}