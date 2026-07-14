/**
 * Push the builder layouts in src/builder/pageLayouts.ts into the database
 * via the authenticated /api/builder/save endpoint.
 *
 * ⚠️  DESTRUCTIVE: /api/builder/save OVERWRITES a page's `layout`, wiping any
 * edits made in the visual builder for that page. On 2026-07-13 an unfiltered
 * run of this script reverted every page to its code default and lost a day of
 * builder image edits. Therefore this script now REFUSES to touch prod unless
 * you name exactly what to push:
 *
 *   SLUG=design-inspirations BASE=<prod> EMAIL=... PASS=... npx tsx scripts/seed-layouts.ts
 *   ALL=1                    BASE=<prod> EMAIL=... PASS=... npx tsx scripts/seed-layouts.ts   # every page — only for a fresh/empty DB
 */
import { PAGE_LAYOUTS } from '../src/builder/pageLayouts'
import { HOME_LAYOUT } from '../src/builder/homeLayout'

const ALL_LAYOUTS: Record<string, unknown> = { home: HOME_LAYOUT, ...PAGE_LAYOUTS }

// SLUG=<slug> pushes just that page. ALL=1 pushes every page (overwrites all
// builder edits — only safe on a fresh/empty DB). One of them is required.
const ONLY = process.env.SLUG
const PUSH_ALL = process.env.ALL === '1'
if (!ONLY && !PUSH_ALL) {
  console.error(
    'Refusing to run: set SLUG=<slug> for one page, or ALL=1 to overwrite EVERY page.\n' +
      'ALL=1 wipes builder edits on every page — only use it on a fresh/empty DB.',
  )
  process.exit(1)
}
if (ONLY && !(ONLY in ALL_LAYOUTS)) {
  console.error(`Unknown SLUG "${ONLY}". Known: ${Object.keys(ALL_LAYOUTS).join(', ')}`)
  process.exit(1)
}
const LAYOUTS = ONLY ? { [ONLY]: ALL_LAYOUTS[ONLY] } : ALL_LAYOUTS

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
  console.log('Logged in OK. Seeding', Object.keys(LAYOUTS).length, 'layouts to', BASE)

  for (const [slug, data] of Object.entries(LAYOUTS)) {
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
