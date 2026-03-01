/**
 * Type definitions for the MultiBank automation framework
 */

export interface NavItem {
  label: string;
  href?: string;
  hasDropdown?: boolean;
}

export interface TradingCategory {
  name: string;
  pairs: string[];
}

export interface AppStoreLinks {
  appStore: string;
  googlePlay: string;
}

export interface WhyMultiBankSection {
  heading: string;
  subheadings: string[];
}

export interface TestConfig {
  baseUrl: string;
  timeouts: {
    element: number;
    navigation: number;
    animation: number;
  };
}
