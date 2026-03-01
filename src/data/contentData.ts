/**
 * Test data for content validation — banners, download links, etc.
 */

export interface AppStoreLinks {
  appStore: string;
  googlePlay: string;
}

export interface ContentData {
  appStoreLinks: AppStoreLinks;
  bannerCount: number;
  footerSections: string[];
}

export const contentData: ContentData = {
  appStoreLinks: {
    appStore: 'apps.apple.com',
    googlePlay: 'play.google.com',
  },

  bannerCount: 1,
  footerSections: [
    'Company',
    'Trading',
    'Platforms',
    'Legal',
  ],
};
