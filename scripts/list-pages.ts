/** Read-only: list every `pages` record and whether it has a builder layout. */
const BASE = process.env.BASE || 'https://psc-website-7ilb.vercel.app'
const EMAIL = process.env.EMAIL || 'admin@peninsulasidingcompany.com'
const PASS = process.env.PASS || 'ChangeMe!2026'

async function main() {
  const login = await fetch(`${BASE}/api/users/login`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASS }),
  })
  const token = (await login.json())?.token
  if (!token) { console.error('login failed', login.status); process.exit(1) }

  const res = await fetch(`${BASE}/api/pages?limit=200&depth=0`, { headers: { Authorization: `JWT ${token}` } })
  const json = await res.json()
  const docs: Array<{ slug?: string; title?: string; layout?: { content?: unknown[] } | null }> = json?.docs || []
  console.log(`Total pages records: ${docs.length} (totalDocs=${json?.totalDocs})\n`)
  const withLayout: string[] = []
  const emptyLayout: string[] = []
  for (const d of docs.sort((a, b) => (a.slug || '').localeCompare(b.slug || ''))) {
    const n = d.layout?.content?.length || 0
    const tag = n > 0 ? `layout(${n} blocks)` : 'NO/EMPTY layout'
    if (n > 0) withLayout.push(d.slug || '?'); else emptyLayout.push(d.slug || '?')
    console.log(`  ${(d.slug || '?').padEnd(26)} ${tag}`)
  }
  console.log(`\nWith real layout (${withLayout.length}):`, withLayout.join(', '))
  console.log(`Empty/none (${emptyLayout.length}):`, emptyLayout.join(', '))
  const cityRecords = docs.filter((d) => (d.slug || '').startsWith('siding-')).map((d) => d.slug)
  console.log(`\nCity (siding-*) records that EXIST: ${cityRecords.length ? cityRecords.join(', ') : 'NONE'}`)
}
main().catch((e) => { console.error(e); process.exit(1) })

export {}
