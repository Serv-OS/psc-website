'use client'

import { useState, type CSSProperties } from 'react'

import { BeforeAfter } from '@/components/ui/BeforeAfter'
import type { GalleryProject } from '@/payload-types'

const CATS: Record<string, { c: string; tex: 'lap' | 'panel' | 'shingle'; label: string }> = {
  fiber: { c: '#6E746F', tex: 'lap', label: 'Fiber Cement Lap' },
  batten: { c: '#3F525A', tex: 'panel', label: 'Board & Batten' },
  cedar: { c: '#8B7B68', tex: 'lap', label: 'Cedar' },
  shingle: { c: '#8C9379', tex: 'shingle', label: 'Shingle' },
}

const FILTERS = [
  { key: 'all', label: 'All projects' },
  { key: 'fiber', label: 'Fiber Cement' },
  { key: 'batten', label: 'Board & Batten' },
  { key: 'cedar', label: 'Cedar' },
  { key: 'shingle', label: 'Shingle' },
]

function pillStyle(active: boolean): CSSProperties {
  return {
    cursor: 'pointer', padding: '11px 20px', borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
    background: active ? '#206a38' : '#fff', color: active ? '#fff' : '#3a4a40',
    border: active ? '2px solid #206a38' : '2px solid #e0e7e0',
  }
}

function afterBg(cat: string) {
  const m = CATS[cat] || CATS.fiber
  const c = m.c, sh = 'rgba(0,0,0,.16)', sh2 = 'rgba(0,0,0,.07)', hi = 'rgba(255,255,255,.12)'
  const layers: string[] = []
  if (m.tex === 'panel') layers.push(`repeating-linear-gradient(90deg, ${hi} 0 2px, ${c} 2px 38px, ${sh} 38px 40px)`)
  else if (m.tex === 'shingle') {
    layers.push(`repeating-linear-gradient(0deg, ${c} 0 24px, ${sh2} 24px 25px, ${sh} 25px 27px)`)
    layers.push(`repeating-linear-gradient(90deg, transparent 0 32px, rgba(0,0,0,.05) 32px 34px)`)
  } else layers.push(`repeating-linear-gradient(0deg, ${hi} 0 2px, ${c} 2px 24px, ${sh} 24px 26px)`)
  layers.push(c)
  return layers.join(', ')
}

export function GalleryGrid({ projects }: { projects: GalleryProject[] }) {
  const [filter, setFilter] = useState('all')
  const list = projects.filter((p) => filter === 'all' || p.category === filter)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 34 }}>
        {FILTERS.map((f) => (
          <button key={f.key} style={pillStyle(filter === f.key)} onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>
      <div className="cols-3">
        {list.map((p) => (
          <div key={p.id} style={{ border: '1px solid #e7ece7', borderRadius: 18, overflow: 'hidden', background: '#fbfcfa' }}>
            <BeforeAfter before={p.beforeImage} after={p.afterImage} afterBg={afterBg(p.category)} aspect="4/3" radius={0} shadow={false} sizes="(max-width: 640px) 100vw, 33vw" />
            <div style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#16261c' }}>{p.title}</div>
              <div style={{ fontSize: '12.5px', color: '#6a766d', marginTop: 3 }}>{p.location} &middot; {CATS[p.category]?.label || ''}</div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6a766d' }}>
            No projects in this category yet — check back soon.
          </p>
        )}
      </div>
    </>
  )
}
