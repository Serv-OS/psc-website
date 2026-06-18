/**
 * Seed ONLY the Terms & Privacy builder layouts into the DB via the
 * authenticated /api/builder/save endpoint — so they open + edit in the page
 * builder like every other page. Deliberately scoped to these two slugs so it
 * never overwrites builder edits on other pages.
 *
 * Usage:
 *   BASE=https://psc-website-7ilb.vercel.app EMAIL=admin@... PASS=... npx tsx scripts/seed-legal.ts
 */
import { PAGE_LAYOUTS } from '../src/builder/pageLayouts'

const ONLY = ['terms', 'privacy'] as const

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
  console.log('Logged in OK. Seeding', ONLY.length, 'legal pages to', BASE)

  for (const slug of ONLY) {
    const data = (PAGE_LAYOUTS as Record<string, unknown>)[slug]
    if (!data) {
      console.error(`  ${slug}: no layout found in PAGE_LAYOUTS`)
      continue
    }
    const res = await fetch(`${BASE}/api/builder/save`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', Authorization: `JWT ${token}` },
      body: JSON.stringify({ slug, data }),
    })
    console.log(`  ${slug.padEnd(10)} ${res.status} ${(await res.text()).slice(0, 80)}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
