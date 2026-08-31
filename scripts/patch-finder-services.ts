/**
 * Surgically inject the editable `services` array into the live Services page's
 * ServiceFinder block WITHOUT overwriting any other builder edits on that page.
 * Fetches the current saved layout, patches only the finder-services block, saves.
 *
 * Usage: BASE=https://psc-website-7ilb.vercel.app npx tsx scripts/patch-finder-services.ts
 */
const BASE = process.env.BASE || 'https://psc-website-7ilb.vercel.app'
const EMAIL = process.env.EMAIL || 'admin@peninsulasidingcompany.com'
const PASS = process.env.PASS || 'ChangeMe!2026'

const SERVICES = [
  { n: '01', title: 'Siding Installation', body: "Transform your home's appearance and durability with fiber cement, wood, and more — installed with precise, high-quality craftsmanship.", label: 'Siding Installation', image: null },
  { n: '02', title: 'Siding Replacement', body: 'Outdated, damaged, or failing siding replaced for a fresh, modern look with long-lasting protection.', label: 'Siding Replacement', image: null },
  { n: '03', title: 'Siding Repair', body: 'Full-wall repairs from corner to corner, restoring weather-, pest-, or age-affected siding.', label: 'Siding Repair', image: null },
]

async function main() {
  const loginRes = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASS }),
  })
  const token = (await loginRes.json())?.token
  if (!token) { console.error('Login failed', loginRes.status); process.exit(1) }

  const getRes = await fetch(`${BASE}/api/pages?where[slug][equals]=services&depth=0&limit=1`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const doc = (await getRes.json())?.docs?.[0]
  if (!doc?.layout?.content) { console.error('No services layout found', getRes.status); process.exit(1) }

  const layout = doc.layout
  const ids = layout.content.map((c: { props?: { id?: string }; type?: string }) => `${c.type}#${c.props?.id}`)
  const item = layout.content.find((c: { type?: string; props?: { id?: string } }) => c.props?.id === 'finder-services' || c.type === 'ServiceFinderBlock')
  if (!item) { console.error('No ServiceFinder block. Blocks:', ids.join(', ')); process.exit(1) }

  item.props.services = SERVICES
  console.log('Patched block:', item.type, item.props.id, '— now has', SERVICES.length, 'editable services')

  const saveRes = await fetch(`${BASE}/api/builder/save`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ slug: 'services', data: layout }),
  })
  console.log('Save:', saveRes.status, (await saveRes.text()).slice(0, 300))
}

main().catch((e) => { console.error(e); process.exit(1) })

export {}
