'use client'

import Link from 'next/link'
import { useState, type CSSProperties } from 'react'

type Style = {
  label: string
  tex: 'panel' | 'shingle' | 'lap'
  profile: string
  blurb: string
  colors: { name: string; hex: string }[]
}

const STYLES: Record<string, Style> = {
  modern: { label: 'Modern', tex: 'panel', profile: 'Smooth panel & board-and-batten', blurb: 'Clean lines and bold, dark tones balanced by crisp white trim. Smooth finishes keep the look architectural and contemporary.', colors: [{ name: 'Iron Grey', hex: '#3B3D3C' }, { name: 'Evening Blue', hex: '#3F525A' }, { name: 'Arctic White', hex: '#E9EAE5' }, { name: 'Night Grey', hex: '#4B4E4D' }] },
  craftsman: { label: 'Craftsman', tex: 'lap', profile: 'Lap siding with shingle accents', blurb: 'Earthy, natural tones and mixed textures that celebrate handcrafted detail — lap on the body with shingle gables.', colors: [{ name: 'Mountain Sage', hex: '#8C9379' }, { name: 'Timber Bark', hex: '#6E5D4E' }, { name: 'Khaki Brown', hex: '#8B7B68' }, { name: 'Monterey Taupe', hex: '#9C8E7B' }] },
  ranch: { label: 'Ranch', tex: 'lap', profile: 'Wide horizontal lap', blurb: 'Long, low rooflines paired with warm neutral tones and wide lap boards that emphasize the horizontal.', colors: [{ name: 'Light Mist', hex: '#D3D6CF' }, { name: 'Cobble Stone', hex: '#CABFA4' }, { name: 'Navajo Beige', hex: '#C6B093' }, { name: 'Pearl Grey', hex: '#B9BCB6' }] },
  victorian: { label: 'Victorian', tex: 'shingle', profile: 'Straight-edge shingle', blurb: 'Ornate trim and rich shingle texture in timeless heritage palettes — perfect for detailed, characterful facades.', colors: [{ name: 'Boothbay Blue', hex: '#6E8A95' }, { name: 'Arctic White', hex: '#E9EAE5' }, { name: 'Aged Pewter', hex: '#7C807E' }, { name: 'Mountain Sage', hex: '#8C9379' }] },
  medit: { label: 'Mediterranean', tex: 'panel', profile: 'Smooth panel', blurb: 'Warm, earthen tones with smooth, sun-washed finishes that echo stucco while resisting the elements.', colors: [{ name: 'Navajo Beige', hex: '#C6B093' }, { name: 'Cobble Stone', hex: '#CABFA4' }, { name: 'Monterey Taupe', hex: '#9C8E7B' }, { name: 'Arctic White', hex: '#E9EAE5' }] },
  farmhouse: { label: 'Modern Farmhouse', tex: 'panel', profile: 'Vertical board & batten', blurb: 'High-contrast white board-and-batten with charcoal accents — relaxed, current and endlessly photogenic.', colors: [{ name: 'Arctic White', hex: '#E9EAE5' }, { name: 'Night Grey', hex: '#4B4E4D' }, { name: 'Light Mist', hex: '#D3D6CF' }, { name: 'Iron Grey', hex: '#3B3D3C' }] },
}

function tabStyle(active: boolean): CSSProperties {
  return {
    cursor: 'pointer', padding: '11px 20px', borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
    background: active ? '#206a38' : '#fff', color: active ? '#fff' : '#3a4a40',
    border: active ? '2px solid #206a38' : '2px solid #e0e7e0',
  }
}

export function StyleExplorer() {
  const [styleKey, setStyleKey] = useState('modern')
  const [colorIdx, setColorIdx] = useState(0)
  const st = STYLES[styleKey]
  const c = st.colors[colorIdx].hex

  const sidingStyle = (): CSSProperties => {
    const sh = 'rgba(0,0,0,.16)', sh2 = 'rgba(0,0,0,.07)', hi = 'rgba(255,255,255,.13)'
    const layers: string[] = []
    if (st.tex === 'panel') layers.push(`repeating-linear-gradient(90deg, ${hi} 0 2px, ${c} 2px 46px, ${sh} 46px 48px)`)
    else if (st.tex === 'shingle') {
      layers.push(`repeating-linear-gradient(0deg, ${c} 0 30px, ${sh2} 30px 31px, ${sh} 31px 33px)`)
      layers.push(`repeating-linear-gradient(90deg, transparent 0 38px, rgba(0,0,0,.05) 38px 40px)`)
    } else layers.push(`repeating-linear-gradient(0deg, ${hi} 0 2px, ${c} 2px 30px, ${sh} 30px 33px)`)
    layers.push(c)
    return { position: 'absolute', inset: 0, background: layers.join(', ') }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
        {Object.keys(STYLES).map((k) => (
          <button key={k} style={tabStyle(styleKey === k)} onClick={() => { setStyleKey(k); setColorIdx(0) }}>
            {STYLES[k].label}
          </button>
        ))}
      </div>

      <div className="split" style={{ gridTemplateColumns: '1.1fr .9fr', gap: 28, alignItems: 'stretch', background: '#fff', border: '1px solid #e7ece7', borderRadius: 22, padding: 24, boxShadow: '0 14px 40px rgba(14,52,29,.07)' }}>
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', minHeight: 320, background: 'linear-gradient(180deg,#cfe0ee 0%,#e9f0e4 60%)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '24%', background: '#2c3631', clipPath: 'polygon(0 100%,12% 0,88% 0,100% 100%)', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '6%', right: '6%', top: '21%', bottom: 0, borderRadius: '6px 6px 0 0', overflow: 'hidden', zIndex: 1 }}>
            <div style={sidingStyle()} />
          </div>
          <div style={{ position: 'absolute', left: '14%', bottom: 0, width: '13%', height: '44%', background: '#3a4a40', borderRadius: '5px 5px 0 0', zIndex: 2, boxShadow: '0 0 0 3px rgba(255,255,255,.25)' }} />
          <div style={{ position: 'absolute', right: '16%', bottom: '18%', width: '16%', height: '26%', background: 'linear-gradient(135deg,#dbe8f2,#b9cfe0)', borderRadius: 4, zIndex: 2, boxShadow: '0 0 0 4px rgba(255,255,255,.55)' }} />
          <div style={{ position: 'absolute', left: 14, top: '29%', zIndex: 4, background: 'rgba(255,255,255,.92)', borderRadius: 9, padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,.12)' }}>
            <div style={{ fontSize: 11, color: '#7a857d', fontWeight: 600, letterSpacing: '.4px', textTransform: 'uppercase' }}>{st.label}</div>
            <div style={{ fontSize: 15, color: '#16261c', fontWeight: 700 }}>{st.colors[colorIdx].name}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: '#16261c', letterSpacing: '-.4px' }}>{st.label} style</h3>
          <div style={{ marginTop: 8, display: 'inline-flex', alignSelf: 'flex-start', background: '#e7f1e8', color: '#1c5530', fontSize: '12.5px', fontWeight: 600, padding: '6px 13px', borderRadius: 999 }}>
            Recommended: {st.profile}
          </div>
          <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.65, color: '#46544a' }}>{st.blurb}</p>
          <div style={{ marginTop: 20, fontSize: '12.5px', fontWeight: 700, color: '#56635a', textTransform: 'uppercase', letterSpacing: '.6px' }}>Curated palette</div>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {st.colors.map((sw, i) => {
              const sel = i === colorIdx
              return (
                <button key={i} title={sw.name} onClick={() => setColorIdx(i)} style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: '100%', aspectRatio: '1.4', borderRadius: 10, background: sw.hex, border: sel ? '2.5px solid #206a38' : '2.5px solid rgba(0,0,0,.06)', boxShadow: sel ? '0 0 0 3px rgba(32,106,56,.18)' : '0 1px 3px rgba(0,0,0,.12)', transform: sel ? 'scale(1.04)' : 'none' }} />
                  <span style={{ fontSize: 11, color: '#46544a', fontWeight: 600, lineHeight: 1.2, textAlign: 'center' }}>{sw.name}</span>
                </button>
              )
            })}
          </div>
          <Link href="/instant-quote" className="btn btn-primary" style={{ marginTop: 24, alignSelf: 'flex-start', fontSize: '14.5px', padding: '13px 22px', borderRadius: 11 }}>
            Quote this look &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
