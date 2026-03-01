/**
 * Test data for the Company / Why MultiBank page (mb.io/en/company).
 */

export interface StatCard {
    value: string;
    label: string;
}

export interface CompanyData {
    url: string;
    heading: string;
    subheadingContains: string;
    stats: StatCard[];
}

export const companyData: CompanyData = {
    url: '/en/company',

    heading: 'Why MultiBank Group?',

    subheadingContains: 'For nearly two decades',

    stats: [
        { value: '$2 trillion', label: 'Annual turnover' },
        { value: '2,000,000+', label: 'Customers worldwide' },
        { value: '25+', label: 'Offices globally' },
    ],
};