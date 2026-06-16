/**
 * Push the builder layouts in src/builder/pageLayouts.ts into the database
 * via the authenticated /api/builder/save endpoint.
 *
 * Usage:
 *   BASE=http://127.0.0.1:3100 EMAIL=admin@... PASS=... npx tsx scripts/seed-layouts.ts
 */
import { PAGE_LAYOUTS } from '../src/builder/pageLayouts'
import { HOME_LAYOUT } from '../src/builder/homeLayout'

const ALL_LAYOUTS: Record<string, unknown> = { home: HOME_LAYOUT, ...PAGE_LAYOUTS }

const BASE = process.env.BASE || 'http://127.0.0.1:3100'
const EMAIL = process.env.EMAIL || 'admin@peninsulasidingcompany.com'
const PASS = process.env.PASS || 'ChangeMe!2026'

async function main() {
  const loginRes = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASS }),
  })
  const loginJson = await loginRes.json()
  const token = loginJson?.token
  if (!token) {
    console.error('Login failed:', loginRes.status, JSON.stringify(loginJson).slice(0, 200))
    process.exit(1)
  }
  console.log('Logged in OK. Seeding', Object.keys(ALL_LAYOUTS).length, 'layouts to', BASE)

  for (const [slug, data] of Object.entries(ALL_LAYOUTS)) {
    const res = await fetch(`${BASE}/api/builder/save`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', Authorization: `JWT ${token}` },
      body: JSON.stringify({ slug, data }),
    })
    const txt = await res.text()
    console.log(`  ${slug.padEnd(22)} ${res.status} ${txt.slice(0, 80)}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
