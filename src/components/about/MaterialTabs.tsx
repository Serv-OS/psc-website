'use client'

import { useState, type CSSProperties } from 'react'

const MATERIALS = {
  hardie: {
    label: 'James Hardie®',
    title: 'James Hardie® Fiber Cement Siding',
    body: 'Durable and low-maintenance, James Hardie siding resists fire, termites, and extreme weather. Made from a composite of sand, cement, and cellulose fibers, it mimics real wood while providing superior protection. As a James Hardie Elite Preferred Contractor, we guarantee precise installation and expert craftsmanship.',
    tags: ['30-year siding warranty', '15-year ColorPlus® finish', 'Fire & termite resistant', 'Elite Preferred install'],
  },
  cedar: {
    label: 'Cedar Valley',
    title: 'Cedar Valley Cedar Siding',
    body: 'For the natural beauty of Western Red Cedar, Cedar Valley siding provides exceptional strength and durability. High-quality cedar shingles mounted on a plywood backer with a fiberglass laminate protect your home while allowing for hundreds of factory-finished colors and stains — a personalized, elegant exterior.',
    tags: ['Western Red Cedar', 'Hundreds of finishes', 'Fiberglass-backed', 'Factory finished'],
  },
  shakertown: {
    label: 'Shakertown®',
    title: 'Shakertown® Cedar Siding',
    body: 'Featuring Western Red Cedar, Shakertown siding combines traditional beauty with efficient installation. Eight-foot panels reduce material waste and installation time while creating a seamless, natural wood look. Available in pre-stained finishes that enhance curb appeal with long-lasting durability.',
    tags: ['8-ft panels', 'Less material waste', 'Pre-stained finishes', 'Seamless wood look'],
  },
}

function pill(active: boolean): CSSProperties {
  return {
    cursor: 'pointer', padding: '12px 22px', borderRadius: 999, fontSize: '14.5px', fontWeight: 600, fontFamily: 'inherit',
    background: active ? '#206a38' : '#fff', color: active ? '#fff' : '#3a4a40',
    border: active ? '2px solid #206a38' : '2px solid #e0e7e0',
  }
}

export function MaterialTabs() {
  const [mat, setMat] = useState<keyof typeof MATERIALS>('hardie')
  const m = MATERIALS[mat]
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
        {(Object.keys(MATERIALS) as (keyof typeof MATERIALS)[]).map((k) => (
          <button key={k} style={pill(mat === k)} onClick={() => setMat(k)}>{MATERIALS[k].label}</button>
        ))}
      </div>
      <div className="split" style={{ gridTemplateColumns: '1.05fr .95fr', gap: 32, alignItems: 'center', background: '#f4f6f3', border: '1px solid #e7ece7', borderRadius: 22, padding: 36 }}>
        <div>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: '#16261c', letterSpacing: '-.5px' }}>{m.title}</h3>
          <p style={{ marginTop: 14, fontSize: '15.5px', lineHeight: 1.7, color: '#46544a' }}>{m.body}</p>
          <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {m.tags.map((t) => (
              <span key={t} style={{ background: '#e7f1e8', color: '#1c5530', fontSize: 13, fontWeight: 600, padding: '8px 14px', borderRadius: 999 }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ aspectRatio: '4/3', borderRadius: 16, background: 'repeating-linear-gradient(0deg,#dde7dd 0 14px,#e6ede6 14px 28px)', display: 'flex', alignItems: 'flex-end', padding: 16, boxShadow: 'inset 0 2px 8px rgba(0,0,0,.05)' }}>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#8a988c' }}>[ material sample photo ]</span>
        </div>
      </div>
    </>
  )
}
