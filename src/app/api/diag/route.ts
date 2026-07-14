import { NextResponse } from 'next/server'

import { getFeaturedGallery, getGalleryProjects, getPage } from '@/lib/data'
import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Temporary diagnostic: sequential vs concurrent (Promise.all) DB reads, with raw errors surfaced. */
export async function GET() {
  const out: Record<string, unknown> = {}

  // 1) sequential (how diag did it before — known to work)
  try {
    out.seq_gallery = (await getGalleryProjects()).length
  } catch (e) {
    out.seq_err = String(e)
  }

  // 2) via helpers, concurrent (exactly how gallery/page.tsx fetches)
  try {
    const [proj, feat, page] = await Promise.all([
      getGalleryProjects(),
      getFeaturedGallery(),
      getPage('gallery'),
    ])
    out.par_gallery = proj.length
    out.par_featured = feat.length
    out.par_pageHasLayout = Array.isArray((page?.layout as { content?: unknown[] })?.content)
      ? (page?.layout as { content?: unknown[] }).content!.length
      : 'null'
  } catch (e) {
    out.par_err = String(e)
  }

  // 3) RAW payload.find concurrent, no swallow — surfaces the true error
  try {
    const p = await getPayloadClient()
    const [a, b, c] = await Promise.all([
      p.find({ collection: 'gallery-projects', limit: 100, depth: 1, sort: 'order' }),
      p.find({ collection: 'gallery-projects', where: { featured: { equals: true } }, limit: 12, depth: 1 }),
      p.find({ collection: 'pages', where: { slug: { equals: 'gallery' } }, limit: 1, depth: 2 }),
    ])
    out.raw_par = [a.docs.length, b.docs.length, c.docs.length]
  } catch (e) {
    out.raw_par_err = String(e)
    out.raw_par_stack = (e as Error)?.stack?.split('\n').slice(0, 4).join(' | ')
  }

  return NextResponse.json(out)
}
