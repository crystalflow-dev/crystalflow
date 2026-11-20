import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // Required for Cloudflare Pages static hosting
  trailingSlash: true,
  // one 404 page for the whole site: the pages live in a route group, which has no root not-found
  experimental: { globalNotFound: true },
};

export default nextConfig;
