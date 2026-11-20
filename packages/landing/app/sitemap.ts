import type { MetadataRoute } from 'next';
import { SITE_URL, pages } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    changeFrequency: 'monthly',
    priority: page.priority,
  }));
}
