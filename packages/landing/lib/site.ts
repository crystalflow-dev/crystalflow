/** Where the site is served, and every page the static export builds. */
export const SITE_URL = 'https://crystalflow.dev';

export const pages = [
  { path: '/', priority: 1 },
  { path: '/demo/', priority: 0.8 },
] as const;
