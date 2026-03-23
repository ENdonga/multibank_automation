import { test as base } from '@playwright/test';
import { HomePage } from "@pages/HomePage"
import { TradingPage } from "@pages/TradingPage";
import { WhyMultibankPage } from "@pages/WhyMultibankPage";

type PageFixtures = {
    homePage: HomePage;
    tradingPage: TradingPage;
    companyPage: WhyMultibankPage;
};

export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await use(homePage);
    },

    tradingPage: async ({ page }, use) => {
        const tradingPage = new TradingPage(page);
        await tradingPage.open();
        await use(tradingPage);
    },

    companyPage: async ({ page }, use) => {
        const companyPage = new WhyMultibankPage(page);
        await companyPage.open();
        await use(companyPage);
    },
});

export { expect } from '@playwright/test'