'use client'

import { useState, type CSSProperties } from 'react'

export type MaterialTab = {
  label?: string
  title?: string
  body?: string
  tags?: string // one tag per line (also accepts · or , separators)
  image?: { url?: string; alt?: string } | null
}

// Fallback content — used when the builder block has no tabs configured yet.
export const DEFAULT_TABS: MaterialTab[] = [
  {
    label: 'James Hardie®',
    title: 'James Hardie® Fiber Cement Siding',
    body: 'Durable and low-maintenance, James Hardie siding resists fire, termites, and extreme weather. Made from a composite of sand, cement, and cellulose fibers, it mimics real wood while providing superior protection. As a James Hardie Elite Preferred Contractor, we guarantee precise installation and expert craftsmanship.',
    tags: '30-year siding warranty\n15-year ColorPlus® finish\nFire & termite resistant\nElite Preferred install',
  },
  {
    label: 'Cedar Valley',
    title: 'Cedar Valley Cedar Siding',
    body: 'For the natural beauty of Western Red Cedar, Cedar Valley siding provides exceptional strength and durability. High-quality cedar shingles mounted on a plywood backer with a fiberglass laminate protect your home while allowing for hundreds of factory-finished colors and stains — a personalized, elegant exterior.',
    tags: 'Western Red Cedar\nHundreds of finishes\nFiberglass-backed\nFactory finished',
  },
  {
    label: 'Shakertown®',
    title: 'Shakertown® Cedar Siding',
    body: 'Featuring Western Red Cedar, Shakertown siding combines traditional beauty with efficient installation. Eight-foot panels reduce material waste and installation time while creating a seamless, natural wood look. Available in pre-stained finishes that enhance curb appeal with long-lasting durability.',
    tags: '8-ft panels\nLess material waste\nPre-stained finishes\nSeamless wood look',
  },
]

function pill(active: boolean): CSSProperties {
  return {
    cursor: 'pointer', padding: '12px 22px', borderRadius: 999, fontSize: '14.5px', fontWeight: 600, fontFamily: 'inherit',
    background: active ? '#206a38' : '#fff', color: active ? '#fff' : '#3a4a40',
    border: active ? '2px solid #206a38' : '2px solid #e0e7e0',
  }
}

export function MaterialTabs({ tabs }: { tabs?: MaterialTab[] }) {
  const list = tabs && tabs.length ? tabs : DEFAULT_TABS
  const [idx, setIdx] = useState(0)
  const m = list[idx] || list[0]
  const tagList = (m.tags || '').split(/\n|·|,/).map((t) => t.trim()).filter(Boolean)
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
        {list.map((t, i) => (
          <button key={i} style={pill(idx === i)} onClick={() => setIdx(i)}>{t.label || `Tab ${i + 1}`}</button>
        ))}
      </div>
      <div className="split" style={{ gridTemplateColumns: '1.05fr .95fr', gap: 32, alignItems: 'center', background: '#f4f6f3', border: '1px solid #e7ece7', borderRadius: 22, padding: 36 }}>
        <div>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: '#16261c', letterSpacing: '-.5px' }}>{m.title}</h3>
          <p style={{ marginTop: 14, fontSize: '15.5px', lineHeight: 1.7, color: '#46544a' }}>{m.body}</p>
          <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {tagList.map((t) => (
              <span key={t} style={{ background: '#e7f1e8', color: '#1c5530', fontSize: 13, fontWeight: 600, padding: '8px 14px', borderRadius: 999 }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 16, overflow: 'hidden', background: 'repeating-linear-gradient(0deg,#dde7dd 0 14px,#e6ede6 14px 28px)', display: 'flex', alignItems: 'flex-end', padding: 16, boxShadow: 'inset 0 2px 8px rgba(0,0,0,.05)' }}>
          {m.image?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.image.url} alt={m.image.alt || m.title || ''} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#8a988c' }}>[ material sample photo ]</span>
          )}
        </div>
      </div>
    </>
  )
}
