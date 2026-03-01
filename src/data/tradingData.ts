/**
 * Test data for the Explore / Spot Market page (mb.io/en/explore).
 */

/** The three filter tabs visible above the crypto price table */
export const priceTabs = ['Hot', 'Gainers', 'Losers'] as const;
export type PriceTab = typeof priceTabs[number];

/** Hero and section copy */
export const explorePageCopy = {
  heroHeading: 'Markets at your fingertips',
  spotMarketHeading: 'Spot market',
  spotMarketDescriptionContains: 'cryptocurrency spot market',
  cryptoPricesHeading: "Today's top crypto prices",
} as const;

/** The 3 feature banner cards visible below the hero */
export interface FeatureBanner {
  title: string;
  ctaText: string;
}

export const featureBanners: FeatureBanner[] = [
  { title: 'Earn interest on your assets', ctaText: 'Up to 35% APY' },
  { title: 'Get crypto with your card', ctaText: 'Instant buy' },
  { title: 'Deposits using card or wire transfer', ctaText: 'Top up today' },
];

/**
 * Known crypto tickers listed on the Hot tab (from screenshot).
 * Prices change in real-time — only symbols/names are asserted, not prices.
 */
export const knownHotPairSymbols = [
  'MBG', 'BTC', 'ETH', 'SOL', 'XRP',
  'DOGE', 'ADA', 'LINK', 'TRX', 'AVAX',
  'BCH', 'LTC', 'DOT', 'AAVE', 'UNI',
] as const;

export const knownHotPairNames: Record<string, string> = {
  MBG: 'MultiBank Group',
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  SOL: 'Solana',
  XRP: 'XRP',
  DOGE: 'Dogecoin',
  ADA: 'Cardano',
  LINK: 'Chainlink',
  TRX: 'TRON',
  AVAX: 'Avalanche',
  BCH: 'Bitcoin Cash',
  LTC: 'Litecoin',
  DOT: 'Polkadot',
  AAVE: 'Aave',
  UNI: 'Uniswap',
};

/** Price string must match $N,NNN.NN or $N.NN format */
export const priceRegex = /^\$[\d,]+\.?\d*$/;

/** Change string must be a % value, positive or negative */
export const changeRegex = /[▲▼+\-]?\s*\d+\.\d+%/;