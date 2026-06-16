import { headers as nextHeaders } from 'next/headers'
import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

/**
 * One-off: pull the real photos from the old WordPress site into the Media
 * collection (→ Vercel Blob), then wire the obvious ones up (gallery
 * before/after pairs, logo). Returns a key→{id,url} map so the page-builder
 * layouts can reference the uploaded URLs. Admin-auth required; delete after use.
 */
const BASE = 'https://posup.co.uk/peninsulasidings/wp-content/uploads/'

type Item = { path: string; alt: string; key: string }

const BRAND: Item[] = [
  { path: '2025/11/Peninsula-sidings-company.svg', alt: 'Peninsula Siding Company logo', key: 'logo' },
  { path: '2026/02/RS29082_Alliance_elite_contractor-1920w.webp', alt: 'James Hardie Elite Preferred Contractor badge', key: 'elite-badge' },
  { path: '2025/11/hardie-plank-lap-select-cedarmill.png', alt: 'James Hardie plank lap select cedarmill texture', key: 'tex-wood' },
  { path: '2025/11/hardie-plank-lap-smooth.png', alt: 'James Hardie plank lap smooth texture', key: 'tex-smooth' },
]

const THUMBS: Item[] = [
  { path: '2026/02/13-after-768x768.jpg', alt: 'James Hardie fiber cement siding project', key: 'mat-hardie' },
  { path: '2026/02/12-after-768x768.jpg', alt: 'Cedar Valley cedar siding project', key: 'mat-cedar' },
  { path: '2026/02/7-after-768x768.jpg', alt: 'Shakertown cedar siding project', key: 'mat-shakertown' },
]

const GALLERY_NS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17]
const CATEGORIES = ['fiber', 'batten', 'cedar', 'shingle']
const afterPath = (n: number) => (n === 8 ? '2026/02/8-sfter.jpg' : `2026/02/${n}-after.jpg`)
const filenameOf = (p: string) => p.split('/').pop() as string

export async function POST() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await nextHeaders() })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const media: Record<string, { id: number; url: string; filename: string }> = {}
  const warnings: string[] = []

  async function ensure(item: Item): Promise<{ id: number; url: string; filename: string } | null> {
    const filename = filenameOf(item.path)
    const existing = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })
    if (existing.docs.length) {
      const d = existing.docs[0] as { id: number; url?: string; filename?: string }
      return { id: d.id, url: d.url || '', filename: d.filename || filename }
    }
    try {
      const res = await fetch(BASE + item.path)
      if (!res.ok) {
        warnings.push(`${filename} HTTP ${res.status}`)
        return null
      }
      const data = Buffer.from(await res.arrayBuffer())
      const created = (await payload.create({
        collection: 'media',
        data: { alt: item.alt },
        file: { data, mimetype: res.headers.get('content-type') || 'image/jpeg', name: filename, size: data.length },
        overrideAccess: true,
      })) as { id: number; url?: string; filename?: string }
      return { id: created.id, url: created.url || '', filename: created.filename || filename }
    } catch (e) {
      warnings.push(`${filename} ${String(e)}`)
      return null
    }
  }

  // 1) Brand + material thumbnails
  for (const item of [...BRAND, ...THUMBS]) {
    const m = await ensure(item)
    if (m) media[item.key] = m
  }

  // 2) Gallery before/after pairs
  const pairs: Array<{ before: number | null; after: number | null; n: number }> = []
  for (const n of GALLERY_NS) {
    const before = await ensure({ path: `2026/02/${n}-before.jpg`, alt: `Bay Area siding project ${n} — before`, key: `g${n}-before` })
    const after = await ensure({ path: afterPath(n), alt: `Bay Area siding project ${n} — after`, key: `g${n}-after` })
    if (before) media[`g${n}-before`] = before
    if (after) media[`g${n}-after`] = after
    if (before || after) pairs.push({ before: before?.id ?? null, after: after?.id ?? null, n })
  }

  // 3) Assign pairs to gallery projects: fill existing first, then create the rest
  const existing = await payload.find({ collection: 'gallery-projects', limit: 100, sort: 'order' })
  let assigned = 0
  let created = 0
  for (let i = 0; i < pairs.length; i++) {
    const p = pairs[i]
    const existingDoc = existing.docs[i] as { id: number } | undefined
    if (existingDoc) {
      await payload.update({
        collection: 'gallery-projects',
        id: existingDoc.id,
        data: { beforeImage: p.before ?? undefined, afterImage: p.after ?? undefined },
        overrideAccess: true,
      })
      assigned++
    } else {
      await payload.create({
        collection: 'gallery-projects',
        data: {
          title: `Bay Area project ${p.n}`,
          location: 'Bay Area',
          category: CATEGORIES[i % CATEGORIES.length] as never,
          featured: false,
          beforeImage: p.before ?? undefined,
          afterImage: p.after ?? undefined,
          order: 100 + i,
        },
        overrideAccess: true,
      })
      created++
    }
  }

  // 4) Logo → Site Settings
  let logoAssigned = false
  if (media.logo) {
    await payload.updateGlobal({ slug: 'site-settings', data: { logo: media.logo.id }, overrideAccess: true })
    logoAssigned = true
  }

  return NextResponse.json({
    ok: true,
    mediaCount: Object.keys(media).length,
    galleryAssigned: assigned,
    galleryCreated: created,
    logoAssigned,
    warnings,
    media,
  })
}
