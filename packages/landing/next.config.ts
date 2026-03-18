import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // Required for Cloudflare Pages static hosting
  trailingSlash: true,
};

export default nextConfig;
