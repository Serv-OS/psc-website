import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'
import { seedDatabase } from '@/lib/seedData'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Dev convenience: seed the database by hitting this endpoint while `npm run dev`
 * is running. Disabled in production unless ALLOW_SEED=true is set.
 */
export async function GET(req: Request) {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== 'true') {
    return NextResponse.json({ error: 'Seeding is disabled in production.' }, { status: 403 })
  }
  try {
    const force = new URL(req.url).searchParams.get('force') === '1'
    const payload = await getPayloadClient()
    const result = await seedDatabase(payload, { forceHomeLayout: force })
    return NextResponse.json({ ok: true, result })
  } catch (e) {
    console.error('Seed failed', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
