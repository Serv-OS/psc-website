import { cache } from 'react'

import { getPayloadClient } from './payload'
import type {
  SiteSetting,
  Page,
  ServiceArea,
  GalleryProject,
  Testimonial,
  BlogPost,
} from '@/payload-types'

// Re-export pure media helpers (defined in lib/media so client components can
// use them without dragging in the Node-only Payload client).
export { asMedia, imageSlot } from './media'

/**
 * Data access for the public site. Each helper is wrapped in React cache() for
 * per-render dedupe. Queries retry a few times before giving up: a transient DB
 * hiccup (Neon cold-start or connection pressure during a mass prerender) would
 * otherwise be swallowed and silently bake an EMPTY page into the static cache.
 * Only after the retries are exhausted do we fall back to null/[] so components
 * can use the design's seeded defaults.
 */

type PayloadClient = Awaited<ReturnType<typeof getPayloadClient>>

async function query<T>(fn: (payload: PayloadClient) => Promise<T>, fallback: T): Promise<T> {
  let lastErr: unknown
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const payload = await getPayloadClient()
      return await fn(payload)
    } catch (e) {
      lastErr = e
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)))
    }
  }
  console.error('[data] query failed after retries:', lastErr)
  return fallback
}

export const getSiteSettings = cache((): Promise<SiteSetting | null> =>
  query((p) => p.findGlobal({ slug: 'site-settings', depth: 1 }), null),
)

export const getPage = cache((slug: string): Promise<Page | null> =>
  query(
    async (p) =>
      (await p.find({ collection: 'pages', where: { slug: { equals: slug } }, depth: 2, limit: 1 }))
        .docs[0] ?? null,
    null,
  ),
)

/**
 * Returns a page's visual-builder (Puck) layout, but only when it actually has
 * blocks. Frontend pages use this to render the builder layout when the owner
 * has built one, otherwise they fall back to their hand-coded design.
 */
export function builtLayout(page: Page | null): { content?: unknown[] } | null {
  const l = (page?.layout as { content?: unknown[] } | null) || null
  return l && Array.isArray(l.content) && l.content.length > 0 ? l : null
}

export const getServiceArea = cache((slug: string): Promise<ServiceArea | null> =>
  query(
    async (p) =>
      (await p.find({ collection: 'service-areas', where: { slug: { equals: slug } }, depth: 2, limit: 1 }))
        .docs[0] ?? null,
    null,
  ),
)

export const getServiceAreas = cache((): Promise<ServiceArea[]> =>
  query(async (p) => (await p.find({ collection: 'service-areas', depth: 1, limit: 50 })).docs, []),
)

export const getGalleryProjects = cache((): Promise<GalleryProject[]> =>
  query(
    async (p) => (await p.find({ collection: 'gallery-projects', depth: 1, limit: 100, sort: 'order' })).docs,
    [],
  ),
)

export const getFeaturedGallery = cache((): Promise<GalleryProject[]> =>
  query(
    async (p) =>
      (await p.find({ collection: 'gallery-projects', where: { featured: { equals: true } }, depth: 1, limit: 12, sort: 'order' })).docs,
    [],
  ),
)

export const getTestimonials = cache((): Promise<Testimonial[]> =>
  query(
    async (p) =>
      (await p.find({ collection: 'testimonials', where: { featured: { equals: true } }, depth: 0, limit: 12, sort: 'order' })).docs,
    [],
  ),
)

export const getBlogPosts = cache((): Promise<BlogPost[]> =>
  query(
    async (p) =>
      (await p.find({ collection: 'blog-posts', where: { _status: { equals: 'published' } }, depth: 1, limit: 100, sort: '-publishedAt' })).docs,
    [],
  ),
)

export const getBlogPost = cache((slug: string): Promise<BlogPost | null> =>
  query(
    async (p) =>
      (await p.find({ collection: 'blog-posts', where: { slug: { equals: slug }, _status: { equals: 'published' } }, depth: 2, limit: 1 }))
        .docs[0] ?? null,
    null,
  ),
)

