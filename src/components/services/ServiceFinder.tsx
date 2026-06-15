'use client'

import { useState, type CSSProperties } from 'react'

import { MediaImage } from '@/components/ui/MediaImage'
import type { Media } from '@/payload-types'

type Svc = { key: string; n: string; title: string; body: string; media: Media | null; label: string }

const CHIPS = [
  { key: 'new', label: 'I want a fresh new look', svc: 'install' },
  { key: 'damaged', label: 'My siding is damaged', svc: 'repair' },
  { key: 'old', label: "It's old & failing", svc: 'replace' },
]

function chipStyle(active: boolean): CSSProperties {
  return {
    cursor: 'pointer',
    padding: '12px 22px',
    borderRadius: 999,
    fontSize: '14.5px',
    fontWeight: 600,
    fontFamily: 'inherit',
    background: active ? '#206a38' : '#fff',
    color: active ? '#fff' : '#3a4a40',
    border: active ? '2px solid #206a38' : '2px solid #e0e7e0',
  }
}

function cardStyle(rec: boolean): CSSProperties {
  return {
    background: rec ? '#f1f8f2' : '#fff',
    border: rec ? '2px solid #206a38' : '2px solid #e7ece7',
    borderRadius: 18,
    padding: 20,
    transition: 'all .2s',
    boxShadow: rec ? '0 16px 36px rgba(32,106,56,.16)' : '0 1px 2px rgba(0,0,0,.03)',
    transform: rec ? 'translateY(-4px)' : 'none',
  }
}

export function ServiceFinder({ services }: { services: Svc[] }) {
  const [need, setNeed] = useState('')
  const recSvcKey = need ? CHIPS.find((c) => c.key === need)?.svc : null
  const recTitle = recSvcKey ? services.find((s) => s.key === recSvcKey)?.title : ''

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
        {CHIPS.map((c) => (
          <button key={c.key} style={chipStyle(need === c.key)} onClick={() => setNeed(need === c.key ? '' : c.key)}>
            {c.label}
          </button>
        ))}
      </div>
      {recSvcKey && (
        <div style={{ maxWidth: 560, margin: '0 auto 30px', textAlign: 'center', background: '#eef6ef', border: '1px solid #cfe3d3', borderRadius: 14, padding: '14px 18px', fontSize: '14.5px', color: '#1c5530', fontWeight: 600, animation: 'psc-fade .3s ease both' }}>
          Based on that, we recommend → {recTitle}
        </div>
      )}
      <div className="cols-3" style={{ marginTop: 18 }}>
        {services.map((s) => (
          <div key={s.key} style={cardStyle(s.key === recSvcKey)}>
            <MediaImage media={s.media} label={s.title} style={{ aspectRatio: '16/10', borderRadius: 12, marginBottom: 18 }} placeholderStyle={{ background: 'repeating-linear-gradient(0deg,#dde7dd 0 14px,#e7ede7 14px 28px)' }} sizes="(max-width: 640px) 100vw, 33vw" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#206a38' }}>{s.n}</span>
              <h3 style={{ fontSize: 19, fontWeight: 700, color: '#16261c' }}>{s.title}</h3>
            </div>
            <p style={{ fontSize: 14, color: '#5b675e', marginTop: 10, lineHeight: 1.6 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </>
  )
}
