import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'
import { ALL_CITIES } from '@/lib/cities'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * One-time, admin-gated seed: loads every city from lib/cities.ts into the
 * Service Areas collection so all location pages are editable in the admin.
 * Idempotent — skips cities that already exist. Visit /api/seed-service-areas
 * while logged into /admin. Safe to remove after running.
 */
export async function GET(req: Request) {
  const payload = await getPayloadClient()

  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'Log in to /admin first, then reload this URL.' }, { status: 401 })
  }

  const existing = await payload.find({ collection: 'service-areas', limit: 500, depth: 0 })
  const have = new Set(existing.docs.map((d: { slug?: string | null }) => d.slug))

  const created: string[] = []
  const skipped: string[] = []
  for (const c of ALL_CITIES) {
    if (have.has(c.slug)) {
      skipped.push(c.slug)
      continue
    }
    await payload.create({
      collection: 'service-areas',
      overrideAccess: true,
      data: {
        city: c.name,
        slug: c.slug,
        h1: c.h1,
        intro: c.intro,
        localPoints: c.localPoints.map((p) => ({ title: p.title, description: p.description })),
        closingBlurb: c.closingBlurb,
        neighborhoods: c.neighborhoods.map((n) => ({ name: n })),
      } as never,
    })
    created.push(c.slug)
  }

  return NextResponse.json({ ok: true, createdCount: created.length, created, skippedCount: skipped.length, skipped })
}
