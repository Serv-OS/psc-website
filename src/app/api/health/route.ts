// Temporary diagnostic: why can Payload not initialise in production?
//
// The site fails soft by design — src/lib/data.ts catches every query error and
// returns a fallback — so a dead database looks like a page with placeholder
// text and no images rather than an error. That is friendly to visitors and
// useless to whoever has to fix it. This route answers the one question the
// symptom hides: is the database configured, and can we reach it.
//
// SAFETY: reports the PRESENCE of env vars, never their values, and scrubs any
// connection string out of the error text before returning it.

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Strip anything that could carry a credential out of a driver error message.
const redact = (s: string) =>
  String(s || '')
    .replace(/postgres(ql)?:\/\/[^\s"']+/gi, 'postgres://[redacted]')
    .replace(/password[=:]\s*\S+/gi, 'password=[redacted]')
    .slice(0, 300)

export async function GET() {
  const names = [
    'DATABASE_URI',
    'POSTGRES_URL_NON_POOLING',
    'DATABASE_URL_UNPOOLED',
    'POSTGRES_URL',
    'DATABASE_URL',
  ]
  const present = Object.fromEntries(names.map((n) => [n, Boolean(process.env[n])]))

  // Mirrors the resolution order in payload.config.ts exactly.
  const resolved =
    process.env.DATABASE_URI ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    'file:./psc.db'

  const usingSqlite = resolved.startsWith('file:')
  // Host only — never the credentials.
  let host: string | null = null
  if (!usingSqlite) {
    try { host = new URL(resolved).host } catch { host = 'unparseable' }
  }

  let db: { ok: boolean; detail: string } = { ok: false, detail: 'not attempted' }
  if (usingSqlite) {
    db = {
      ok: false,
      detail:
        'No Postgres env var is set, so the config fell back to SQLite (file:./psc.db). ' +
        'That file does not exist on Vercel, which is why Payload cannot initialise.',
    }
  } else {
    try {
      const { Client } = await import('pg')
      const c = new Client({ connectionString: resolved, ssl: { rejectUnauthorized: false } })
      await c.connect()
      const r = await c.query('select count(*)::int as media from media')
      await c.end()
      db = { ok: true, detail: `connected; media rows = ${r.rows[0].media}` }
    } catch (e) {
      db = { ok: false, detail: redact((e as Error).message) }
    }
  }

  return NextResponse.json({
    env_present: present,
    resolved_to: usingSqlite ? 'sqlite (fallback)' : 'postgres',
    db_host: host,
    blob_token_present: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    payload_secret_present: Boolean(process.env.PAYLOAD_SECRET),
    database: db,
  })
}
