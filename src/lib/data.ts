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
 * per-render dedupe. Queries are resilient: if the DB is empty (pre-seed) they
 * return null/[] and components fall back to the design's seeded defaults.
 */

export const getSiteSettings = cache(async (): Promise<SiteSetting | null> => {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'site-settings', depth: 1 })
  } catch {
    return null
  }
})

export const getPage = cache(async (slug: string): Promise<Page | null> => {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    })
    return res.docs[0] ?? null
  } catch {
    return null
  }
})

/**
 * Returns a page's visual-builder (Puck) layout, but only when it actually has
 * blocks. Frontend pages use this to render the builder layout when the owner
 * has built one, otherwise they fall back to their hand-coded design.
 */
export function builtLayout(page: Page | null): { content?: unknown[] } | null {
  const l = (page?.layout as { content?: unknown[] } | null) || null
  return l && Array.isArray(l.content) && l.content.length > 0 ? l : null
}

export const getServiceArea = cache(async (slug: string): Promise<ServiceArea | null> => {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'service-areas',
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    })
    return res.docs[0] ?? null
  } catch {
    return null
  }
})

export const getServiceAreas = cache(async (): Promise<ServiceArea[]> => {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'service-areas', depth: 1, limit: 50 })
    return res.docs
  } catch {
    return []
  }
})

export const getGalleryProjects = cache(async (): Promise<GalleryProject[]> => {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'gallery-projects',
      depth: 1,
      limit: 100,
      sort: 'order',
    })
    return res.docs
  } catch {
    return []
  }
})

export const getFeaturedGallery = cache(async (): Promise<GalleryProject[]> => {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'gallery-projects',
      where: { featured: { equals: true } },
      depth: 1,
      limit: 12,
      sort: 'order',
    })
    return res.docs
  } catch {
    return []
  }
})

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'testimonials',
      where: { featured: { equals: true } },
      depth: 0,
      limit: 12,
      sort: 'order',
    })
    return res.docs
  } catch {
    return []
  }
})

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'blog-posts',
      where: { _status: { equals: 'published' } },
      depth: 1,
      limit: 100,
      sort: '-publishedAt',
    })
    return res.docs
  } catch {
    return []
  }
})

export const getBlogPost = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      depth: 2,
      limit: 1,
    })
    return res.docs[0] ?? null
  } catch {
    return null
  }
})

