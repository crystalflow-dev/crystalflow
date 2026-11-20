/** Where the site is served, and every page the static export builds. */
export const SITE_URL = 'https://crystalflow.dev';

export const pages = [
  { path: '/', priority: 1 },
  { path: '/demo/', priority: 0.8 },
  { path: '/demo/advanced/', priority: 0.6 },
] as const;
