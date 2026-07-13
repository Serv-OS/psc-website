import { headers as nextHeaders } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

import { PAGE_SLUGS } from '@/collections/Pages'
import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const VALID = new Set(PAGE_SLUGS.map((p) => p.value as string))
const titleFor = (slug: string) => PAGE_SLUGS.find((p) => p.value === slug)?.label || slug

// Most slugs render at /<slug>, but a few live under a nested path. Revalidate
// the real URL so builder saves go live immediately (not the wrong path).
const PATH_FOR: Record<string, string> = {
  home: '/',
  'design-inspirations': '/services/design-inspirations',
  'quality-pricing': '/services/quality-pricing',
}
const pathForSlug = (slug: string) => PATH_FOR[slug] ?? `/${slug}`

export async function POST(req: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await nextHeaders() })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const slug = String(body?.slug || '')
  const data = body?.data
  if (!slug || !VALID.has(slug)) return NextResponse.json({ error: 'Invalid page' }, { status: 400 })

  const found = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 })
  if (found.docs.length) {
    await payload.update({ collection: 'pages', id: found.docs[0].id, data: { layout: data }, overrideAccess: true })
  } else {
    await payload.create({ collection: 'pages', data: { title: titleFor(slug), slug: slug as never, layout: data }, overrideAccess: true })
  }

  // Make the change live immediately (these pages use ISR).
  revalidatePath(pathForSlug(slug))

  return NextResponse.json({ ok: true })
}
