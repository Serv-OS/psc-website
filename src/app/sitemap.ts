import type { MetadataRoute } from 'next'

import { getBlogPosts, getServiceAreas } from '@/lib/data'
import { CITY_SLUGS } from '@/lib/cities'
import { SITE_URL } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/about-us',
    '/services',
    '/services/design-inspirations',
    '/services/quality-pricing',
    '/gallery',
    '/benefits',
    '/contact-us',
    '/resources',
    '/service-areas',
  ]

  const now = new Date()
  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }))

  // City pages — union of code-defined cities and any CMS-only service areas.
  const areas = await getServiceAreas()
  const citySlugs = Array.from(new Set([...CITY_SLUGS, ...areas.map((a) => a.slug)]))
  for (const slug of citySlugs) {
    entries.push({ url: `${SITE_URL}/siding-${slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 })
  }

  // Blog posts
  const posts = await getBlogPosts()
  for (const p of posts) {
    entries.push({
      url: `${SITE_URL}/resources/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: 'yearly',
      priority: 0.6,
    })
  }

  return entries
}
