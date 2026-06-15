'use client'

import { useState, type CSSProperties } from 'react'

const RESULTS = {
  fiber: {
    label: 'James Hardie® fiber cement',
    title: 'Resists ignition, stays stable',
    body: 'Non-combustible fiber cement does not ignite under direct flame. In real-world fire tests it stays stable while traditional materials fail — which is why it is a Class 1A fire-rated choice for NorCal homes.',
    tone: '#206a38',
    bg: '#eef6ef',
    border: '#cfe3d3',
  },
  wood: {
    label: 'Traditional wood / vinyl',
    title: 'Ignites and fuels the fire',
    body: 'Under direct flame, traditional wood and vinyl siding catch quickly and can spread fire across the exterior — a serious risk in wildfire-prone Northern California.',
    tone: '#c0392b',
    bg: '#fdecea',
    border: '#f3c9c2',
  },
}

function btn(active: boolean): CSSProperties {
  return {
    cursor: 'pointer',
    padding: '12px 22px',
    borderRadius: 999,
    fontSize: '14.5px',
    fontWeight: 600,
    fontFamily: 'inherit',
    background: active ? '#fff' : 'rgba(255,255,255,.08)',
    color: active ? '#16261c' : '#cbd9cd',
    border: active ? '2px solid #fff' : '2px solid rgba(255,255,255,.2)',
  }
}

export function FireTest() {
  const [material, setMaterial] = useState<'fiber' | 'wood'>('fiber')
  const r = RESULTS[material]
  return (
    <div style={{ marginTop: 26, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, padding: 20 }}>
      <div style={{ fontSize: '12.5px', color: '#9fc2a6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 }}>
        Under direct flame, choose:
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button style={btn(material === 'fiber')} onClick={() => setMaterial('fiber')}>Fiber cement</button>
        <button style={btn(material === 'wood')} onClick={() => setMaterial('wood')}>Traditional wood</button>
      </div>
      <div style={{ marginTop: 18 }}>
        <div style={{ background: r.bg, border: `1px solid ${r.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#6a766d' }}>{r.label}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: r.tone, letterSpacing: '-.4px', marginTop: 2 }}>{r.title}</div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: '#46544a', marginTop: 8 }}>{r.body}</p>
        </div>
      </div>
    </div>
  )
}
