/**
 * Two surgical live patches (no clobber):
 *  1. site-settings.headerNav → add "Service Areas" under the Services dropdown.
 *  2. Services page layout → swap the `areas-services` block type Heading→AreasWeServe.
 */
const BASE = process.env.BASE || 'https://psc-website-7ilb.vercel.app'
const EMAIL = process.env.EMAIL || 'admin@peninsulasidingcompany.com'
const PASS = process.env.PASS || 'ChangeMe!2026'

type NavChild = { id?: string; label: string; href: string }
type NavItem = { id?: string; label: string; href: string; children?: NavChild[] }

async function main() {
  const login = await fetch(`${BASE}/api/users/login`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASS }),
  })
  const token = (await login.json())?.token
  if (!token) { console.error('login failed', login.status); process.exit(1) }
  const auth = { Authorization: `JWT ${token}` }

  // ── 1. NAV ───────────────────────────────────────────────
  const ss = await (await fetch(`${BASE}/api/globals/site-settings?depth=0`, { headers: auth })).json()
  const nav: NavItem[] = Array.isArray(ss.headerNav) ? ss.headerNav : []
  const services = nav.find((n) => n.href === '/services' || n.label === 'Services')
  if (!services) { console.error('No Services nav item; nav:', nav.map((n) => n.label)) ; process.exit(1) }
  services.children = services.children || []
  if (services.children.some((c) => c.href === '/service-areas')) {
    console.log('NAV: Service Areas already present — skipping')
  } else {
    services.children.push({ label: 'Service Areas', href: '/service-areas' })
    const res = await fetch(`${BASE}/api/globals/site-settings`, {
      method: 'POST', headers: { 'content-type': 'application/json', ...auth },
      body: JSON.stringify({ headerNav: nav }),
    })
    console.log('NAV update:', res.status, res.ok ? 'ok' : (await res.text()).slice(0, 200))
  }

  // ── 2. SERVICES LAYOUT BLOCK SWAP ────────────────────────
  const pg = (await (await fetch(`${BASE}/api/pages?where[slug][equals]=services&depth=0&limit=1`, { headers: auth })).json())?.docs?.[0]
  if (!pg?.layout?.content) { console.error('No services layout'); process.exit(1) }
  const layout = pg.layout
  const block = layout.content.find((b: { props?: { id?: string } }) => b.props?.id === 'areas-services')
  if (!block) {
    console.error('No areas-services block. ids:', layout.content.map((b: { props?: { id?: string } }) => b.props?.id).join(', '))
    process.exit(1)
  }
  if (block.type === 'AreasWeServe') {
    console.log('LAYOUT: areas-services already AreasWeServe — skipping')
  } else {
    console.log(`LAYOUT: swapping areas-services type ${block.type} → AreasWeServe`)
    block.type = 'AreasWeServe'
    const res = await fetch(`${BASE}/api/builder/save`, {
      method: 'POST', headers: { 'content-type': 'application/json', ...auth },
      body: JSON.stringify({ slug: 'services', data: layout }),
    })
    console.log('LAYOUT save:', res.status, (await res.text()).slice(0, 200))
  }
}
main().catch((e) => { console.error(e); process.exit(1) })

export {}
