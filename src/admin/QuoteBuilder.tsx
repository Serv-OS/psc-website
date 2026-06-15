'use client'

import { useMemo, useState, type CSSProperties } from 'react'

import { STAFF_PRODUCTS, computeStaffQuote, fmtUSD, fmtUSD2 } from '../lib/quote'

const field: CSSProperties = { padding: '11px 13px', border: '1.5px solid #e6ece6', borderRadius: 10, fontSize: 14, width: '100%', fontFamily: 'inherit' }
const card: CSSProperties = { background: '#fff', border: '1px solid #e7ece7', borderRadius: 16, padding: 22 }
const cardTitle: CSSProperties = { fontSize: 14, fontWeight: 700, color: '#16261c', marginBottom: 16 }
const lbl: CSSProperties = { fontSize: '11.5px', fontWeight: 600, color: '#6a766d', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 5 }

/** Internal staff Quote Builder — shows cost / markup / P&L (staff only). */
export function QuoteBuilder() {
  const [c, setC] = useState({ name: '', email: '', phone: '', address: '' })
  const [sqft, setSqft] = useState('')
  const [stories, setStories] = useState('2')
  const [demo, setDemo] = useState('')
  const [markup, setMarkup] = useState('1.6')
  const [qty, setQty] = useState<Record<number, string>>({})
  const [status, setStatus] = useState('Draft')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState('')

  const q = useMemo(
    () =>
      computeStaffQuote({
        sqft: parseFloat(sqft) || 0,
        stories: parseFloat(stories) || 0,
        demo,
        markup: parseFloat(markup) || 1.6,
        qty,
      }),
    [sqft, stories, demo, markup, qty],
  )

  const reset = () => {
    setC({ name: '', email: '', phone: '', address: '' })
    setSqft(''); setStories('2'); setDemo(''); setMarkup('1.6'); setQty({}); setSaved('')
  }

  const save = async () => {
    setSaving(true)
    setSaved('')
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          customerName: c.name || 'Unnamed customer',
          customerEmail: c.email || undefined,
          customerPhone: c.phone || undefined,
          customerAddress: c.address || undefined,
          sqft: parseFloat(sqft) || 0,
          stories: parseFloat(stories) || 0,
          demo: demo || undefined,
          markup: parseFloat(markup) || 1.6,
          status,
          lineItems: q.rows.filter((r) => r.qty > 0).map((r) => ({ product: r.name, cost: r.cost, qty: r.qty, lineTotal: r.lineTotal })),
          totalCost: Math.round(q.totalCost),
          salePrice: Math.round(q.sale),
          profit: Math.round(q.profit),
          margin: Math.round(q.margin * 10) / 10,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSaved('Saved to Quotes ✓')
    } catch (e) {
      setSaved(`Save failed: ${String(e)}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ padding: 28, background: '#f4f6f3', minHeight: '100%', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#16261c' }}>Quote Builder</div>
          <div style={{ fontSize: 13, color: '#6a766d' }}>Internal cost &amp; markup calculator — staff only.</div>
        </div>
        <a href="/admin" style={{ fontSize: 13, fontWeight: 600, color: '#206a38' }}>&larr; Back to dashboard</a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 330px', gap: 20, alignItems: 'start' }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={card}>
            <div style={cardTitle}>Customer information</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <input style={field} placeholder="Customer name" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} />
              <input style={field} placeholder="Email" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} />
              <input style={field} placeholder="Phone" value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} />
              <input style={field} placeholder="Property address" value={c.address} onChange={(e) => setC({ ...c, address: e.target.value })} />
            </div>
          </div>

          <div style={card}>
            <div style={cardTitle}>Project details</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
              <div><label style={lbl}>Total Sq Ft</label><input type="number" style={field} placeholder="0" value={sqft} onChange={(e) => setSqft(e.target.value)} /></div>
              <div><label style={lbl}>Stories</label>
                <select style={{ ...field, background: '#fff' }} value={stories} onChange={(e) => setStories(e.target.value)}>
                  <option value="1">1 Story</option><option value="2">2 Stories</option><option value="3">3 Stories</option>
                </select>
              </div>
              <div><label style={lbl}>Demo</label>
                <select style={{ ...field, background: '#fff' }} value={demo} onChange={(e) => setDemo(e.target.value)}>
                  <option value="">None</option><option value="Demo Siding and Trim">Siding &amp; Trim</option><option value="Demo Trim">Trim only</option><option value="Demo Stucco">Stucco</option>
                </select>
              </div>
              <div><label style={lbl}>Markup ×</label><input type="number" step="0.05" style={{ ...field, background: '#f0fdf4', border: '1.5px solid #bbf7d0', color: '#15803d', fontWeight: 600 }} value={markup} onChange={(e) => setMarkup(e.target.value)} /></div>
            </div>
          </div>

          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #eef1ee', fontSize: 14, fontWeight: 700, color: '#16261c' }}>Siding products</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#fafbfa' }}>
                    <th style={{ textAlign: 'left', padding: '9px 16px', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '.4px', color: '#6a766d', fontWeight: 700 }}>Product</th>
                    <th style={{ textAlign: 'right', padding: '9px 12px', fontSize: '10.5px', textTransform: 'uppercase', color: '#6a766d', fontWeight: 700 }}>Cost</th>
                    <th style={{ textAlign: 'right', padding: '9px 12px', fontSize: '10.5px', textTransform: 'uppercase', color: '#6a766d', fontWeight: 700 }}>Qty</th>
                    <th style={{ textAlign: 'right', padding: '9px 16px', fontSize: '10.5px', textTransform: 'uppercase', color: '#6a766d', fontWeight: 700 }}>Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {STAFF_PRODUCTS.map((p, i) => {
                    const lineTotal = (p.cost + p.install) * (parseFloat(qty[i] || '') || 0)
                    return (
                      <tr key={i} style={{ borderTop: '1px solid #f3f5f3' }}>
                        <td style={{ padding: '9px 16px' }}><div style={{ fontWeight: 600, color: '#16261c' }}>{p.name}</div><div style={{ fontSize: 11, color: '#9aa69d' }}>{p.unit}</div></td>
                        <td style={{ padding: '9px 12px', textAlign: 'right', color: '#56635a' }}>{fmtUSD2(p.cost)}</td>
                        <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                          <input type="number" placeholder="0" value={qty[i] || ''} onChange={(e) => setQty({ ...qty, [i]: e.target.value })} style={{ width: 74, padding: '6px 8px', border: '1.5px solid #e6ece6', borderRadius: 7, textAlign: 'right', fontSize: 13 }} />
                        </td>
                        <td style={{ padding: '9px 16px', textAlign: 'right', fontWeight: 700, color: '#16261c' }}>{fmtUSD2(lineTotal)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={card}>
            <div style={cardTitle}>Quote summary</div>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>Total project cost</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#92400e', marginTop: 2 }}>{fmtUSD(q.totalCost)}</div>
            </div>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>Sale price (cost × markup)</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#1d4ed8', marginTop: 2 }}>{fmtUSD(q.sale)}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>P&amp;L</div>
                <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4, color: q.profit < 0 ? '#dc2626' : '#15803d' }}>{fmtUSD(q.profit)}</div>
              </div>
              <div style={{ background: '#f4f6f3', border: '1px solid #e3e9e3', borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6a766d', textTransform: 'uppercase' }}>Margin</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#16261c', marginTop: 4 }}>{q.margin.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#16261c', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.4px' }}>Cost breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              {[
                ['Siding materials', q.material],
                ['Install labor', q.labor],
                ['Install materials', q.installMat],
                ['Demo', q.demoCost],
                ['Permits', q.permits],
                ['Debris / waste', q.debris],
              ].map(([label, val]) => (
                <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6a766d' }}>{label as string}</span>
                  <span style={{ fontWeight: 600 }}>{fmtUSD(val as number)}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ ...field, background: '#fff' }}>
              {['Draft', 'Sent', 'Won', 'Lost'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={save} disabled={saving} style={{ background: '#206a38', color: '#fff', fontWeight: 700, fontSize: 14, padding: 13, border: 'none', borderRadius: 11, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : 'Save quote'}
            </button>
            <button onClick={() => window.print()} style={{ background: '#fff', color: '#224631', fontWeight: 600, fontSize: 13, padding: 11, border: '1.5px solid #d6ded6', borderRadius: 11, cursor: 'pointer' }}>Print</button>
            <button onClick={reset} style={{ background: 'none', color: '#9aa69d', fontWeight: 600, fontSize: '12.5px', padding: 8, border: 'none', cursor: 'pointer' }}>Reset quote</button>
            {saved && <div style={{ fontSize: 13, fontWeight: 600, textAlign: 'center', color: saved.startsWith('Save failed') ? '#dc2626' : '#15803d' }}>{saved}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuoteBuilder
