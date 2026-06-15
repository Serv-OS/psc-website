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

    // Create/sync the DB schema. Payload only auto-pushes in dev (NODE_ENV check),
    // so on production Postgres we push it explicitly here. Safe on a fresh DB
    // (no destructive changes → no prompt) and idempotent on re-run.
    let schema = 'skipped'
    try {
      // Force the push (bypass pushDevSchema's "no changes detected" dequal skip,
      // which no-ops against a fresh prod DB and leaves tables uncreated).
      process.env.PAYLOAD_FORCE_DRIZZLE_PUSH = 'true'
      const { pushDevSchema } = await import('@payloadcms/drizzle')
      await pushDevSchema(payload.db as never)
      schema = 'pushed'
    } catch (e) {
      console.error('Schema push failed', e)
      return NextResponse.json({ error: 'Schema push failed: ' + String(e) }, { status: 500 })
    }

    const result = await seedDatabase(payload, { forceHomeLayout: force })
    return NextResponse.json({ ok: true, schema, result })
  } catch (e) {
    console.error('Seed failed', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
