import { expect, Locator, Page } from "@playwright/test";

export class HeaderComponent {
    readonly header: Locator;
    readonly mainNav: Locator;
    readonly navLinks: Locator;
    readonly signInButton: Locator;
    readonly signUpButton: Locator;

    constructor(private readonly page: Page) {
        this.header = page.locator('header').first();
        this.mainNav = page.locator('header nav').first();
        this.navLinks = this.mainNav.locator('a').filter({ hasNotText: /sign/i });
        this.signInButton = page.getByRole('link', { name: /sign in/i }).first();
        this.signUpButton = page.getByRole('link', { name: /sign up/i }).first();
    }

    async getNavLinkLabels(): Promise<string[]> {
        await expect(this.mainNav).toBeVisible();
        const count = await this.navLinks.count();
        const labels: string[] = [];
        for (let i = 0; i < count; i++) {
            const text = (await this.navLinks.nth(i).textContent())?.trim() ?? '';
            if (text) labels.push(text);
        }
        return labels;
    }

    async getNavLinkHref(label: string | RegExp): Promise<string | null> {
        const link = this.mainNav.getByRole('link', { name: label });
        await expect(link).toBeVisible();
        return link.getAttribute('href');
    }

    async clickNavLink(label: string): Promise<void> {
        // const link = this.mainNav.getByRole('link', { name: label });
        // await this.safeClick(link);
        // await this.waitForPageReady();
        await this.page.locator('nav a').filter({ hasText: label }).first().click();
    }

    async areCtaButtonsVisible(): Promise<{ signIn: boolean; signUp: boolean }> {
        return {
            signIn: await this.signInButton.isVisible(),
            signUp: await this.signUpButton.isVisible()
        };
    }
}