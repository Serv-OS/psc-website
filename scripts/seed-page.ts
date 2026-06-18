/**
 * Seed specific page builder layouts into the DB via the authenticated
 * /api/builder/save endpoint — scoped to the slugs you pass, so it never
 * overwrites other pages' builder edits.
 *
 * Usage:
 *   BASE=https://psc-website-7ilb.vercel.app SLUGS=about-us EMAIL=admin@... PASS=... npx tsx scripts/seed-page.ts
 *   (SLUGS is a comma-separated list, e.g. SLUGS=about-us,services)
 */
import { PAGE_LAYOUTS } from '../src/builder/pageLayouts'
import { HOME_LAYOUT } from '../src/builder/homeLayout'

const ALL: Record<string, unknown> = { home: HOME_LAYOUT, ...PAGE_LAYOUTS }

const BASE = process.env.BASE || 'http://127.0.0.1:3100'
const EMAIL = process.env.EMAIL || 'admin@peninsulasidingcompany.com'
const PASS = process.env.PASS || 'ChangeMe!2026'
const SLUGS = (process.env.SLUGS || '').split(',').map((s) => s.trim()).filter(Boolean)

async function main() {
  if (!SLUGS.length) {
    console.error('Pass SLUGS=slug1,slug2 (e.g. SLUGS=about-us)')
    process.exit(1)
  }
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
  console.log('Logged in OK. Seeding', SLUGS.join(', '), 'to', BASE)

  for (const slug of SLUGS) {
    const data = ALL[slug]
    if (!data) {
      console.error(`  ${slug}: no layout found in PAGE_LAYOUTS`)
      continue
    }
    const res = await fetch(`${BASE}/api/builder/save`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', Authorization: `JWT ${token}` },
      body: JSON.stringify({ slug, data }),
    })
    console.log(`  ${slug.padEnd(20)} ${res.status} ${(await res.text()).slice(0, 600)}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
