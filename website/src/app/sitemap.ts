import type { MetadataRoute } from 'next';

import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/for-families', '/help', '/privacy'].map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.6,
  }));
}
