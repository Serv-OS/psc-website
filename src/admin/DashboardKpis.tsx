import { getPayloadClient } from '../lib/payload'

const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

const card: React.CSSProperties = { background: 'var(--theme-elevation-0,#fff)', border: '1px solid var(--theme-elevation-100,#e7ece7)', borderRadius: 12, padding: 18 }
const label: React.CSSProperties = { fontSize: 12, color: 'var(--theme-elevation-500,#6a766d)', fontWeight: 600 }
const value: React.CSSProperties = { fontSize: 26, fontWeight: 800, letterSpacing: '-.6px', marginTop: 6 }
const action: React.CSSProperties = { display: 'block', textAlign: 'left', background: '#f4f8f4', border: '1px solid #dfe9df', borderRadius: 10, padding: '12px 14px', color: '#16261c', fontSize: 13, fontWeight: 700 }

/** KPI panel + quick actions, shown above the Payload dashboard. */
export async function DashboardKpis() {
  let newLeads = 0
  let quotesCount = 0
  let won = 0
  let lost = 0
  let pipeline = 0
  try {
    const payload = await getPayloadClient()
    const [leads, quotes] = await Promise.all([
      payload.count({ collection: 'leads', where: { status: { equals: 'New' } } }),
      payload.find({ collection: 'quotes', limit: 500, depth: 0 }),
    ])
    newLeads = leads.totalDocs
    quotesCount = quotes.totalDocs
    for (const q of quotes.docs) {
      if (q.status === 'Won') won++
      else if (q.status === 'Lost') lost++
      else pipeline += q.salePrice || 0
    }
  } catch {
    /* DB not ready — render zeros */
  }
  const winRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--theme-elevation-800,#16261c)', marginBottom: 14 }}>Peninsula Siding — Overview</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <div style={card}><div style={label}>New leads</div><div style={{ ...value, color: '#206a38' }}>{newLeads}</div></div>
        <div style={card}><div style={label}>Quotes saved</div><div style={value}>{quotesCount}</div></div>
        <div style={card}><div style={label}>Pipeline value</div><div style={value}>{usd(pipeline)}</div></div>
        <div style={card}><div style={label}>Win rate</div><div style={value}>{winRate}%</div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 16 }}>
        <a href="/builder" style={action}>✎ Edit pages (Builder)<div style={{ fontSize: 11, color: '#6a766d', fontWeight: 500, marginTop: 2 }}>Visual drag-and-drop editor</div></a>
        <a href="/admin/collections/blog-posts/create" style={action}>✎ Write a blog post<div style={{ fontSize: 11, color: '#6a766d', fontWeight: 500, marginTop: 2 }}>Publish to the website</div></a>
        <a href="/admin/collections/media" style={action}>▣ Upload photos<div style={{ fontSize: 11, color: '#6a766d', fontWeight: 500, marginTop: 2 }}>Media library &amp; gallery</div></a>
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 18, fontSize: 13, fontWeight: 600 }}>
        <a href="/admin/collections/leads" style={{ color: '#206a38' }}>✉ View all leads &rarr;</a>
        <a href="/api/leads/export" style={{ color: '#206a38' }}>⭳ Export leads (CSV)</a>
      </div>
    </div>
  )
}

export default DashboardKpis
