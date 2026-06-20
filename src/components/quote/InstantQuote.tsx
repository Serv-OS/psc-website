'use client'

// Customer-facing instant quote configurator. Flow:
//   1 What are we replacing? (demo)  → 2 Measure (map)  → 3 Storeys & coverage
//   4 Choose siding  → 5 Style it (texture · finish · colour, with a live preview)
// → rough estimate (existing engine, now finish- and demo-aware) → What's included
// → dry-rot note → captured as a Lead. Mirrors James Hardie's picker UX; the colour
// preview is rendered in CSS so every ColorPlus colour updates instantly (no image library).
import { useMemo, useState } from 'react'
import { RoofMeasure, type Measurement } from './RoofMeasure'
import {
  PROFILES, COVERAGE, computeCustomerEstimate,
  DEMO_OPTIONS, TEXTURES, COLORS, INCLUDED, PRIMED_WARNING, COLORPLUS_NOTE,
  type ProfileKey, type CoverageKey, type DemoKey, type FinishKey, type SidingColor,
} from '@/lib/quote'

const WALL_HEIGHT_PER_STORY = 9 // ft — footprint perimeter × this × storeys ≈ wall area to side
const PRIMED_PREVIEW_HEX = '#C9C3B6' // unpainted primer grey
const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

/** CSS background that renders the siding pattern for a profile/texture in a given colour. */
function sidingBackground(hex: string, profile: ProfileKey, texture: string): string {
  const sh = 'rgba(0,0,0,.18)'
  const sh2 = 'rgba(0,0,0,.08)'
  const hi = 'rgba(255,255,255,.16)'
  const grain = 'repeating-linear-gradient(90deg, rgba(0,0,0,.045) 0 1px, transparent 1px 6px)'
  const woodgrain = /cedarmill|sierra|wood/i.test(texture)
  const layers: string[] = []
  if (profile === 'panel') {
    layers.push(`repeating-linear-gradient(90deg, ${hi} 0 3px, ${hex} 3px 58px, ${sh} 58px 63px)`) // boards + battens
    if (woodgrain) layers.push('repeating-linear-gradient(0deg, rgba(0,0,0,.04) 0 1px, transparent 1px 6px)')
  } else if (profile === 'shingle') {
    const stagger = /stagger/i.test(texture)
    layers.push(`repeating-linear-gradient(0deg, ${hex} 0 32px, ${sh2} 32px 33px, ${sh} 33px 35px)`)
    layers.push(`repeating-linear-gradient(90deg, transparent 0 ${stagger ? 26 : 42}px, rgba(0,0,0,.07) ${stagger ? 26 : 42}px ${stagger ? 28 : 44}px)`)
  } else if (profile === 'artisan') {
    layers.push(`repeating-linear-gradient(0deg, ${hi} 0 2px, ${hex} 2px 40px, ${sh} 40px 45px)`) // thick deep-shadow lap
  } else {
    layers.push(`repeating-linear-gradient(0deg, ${hi} 0 2px, ${hex} 2px 28px, ${sh} 28px 31px)`) // lap
    if (woodgrain) layers.push(grain)
  }
  layers.push(hex)
  return layers.join(', ')
}

export function InstantQuote() {
  const [demoKey, setDemoKey] = useState<DemoKey>('siding')
  const [m, setM] = useState<Measurement | null>(null)
  const [stories, setStories] = useState(2)
  const [coverage, setCoverage] = useState<CoverageKey>('whole')
  const [profile, setProfile] = useState<ProfileKey>('lap')
  const [texture, setTexture] = useState<string>(TEXTURES.lap[0].key)
  const [finish, setFinish] = useState<FinishKey>('colorplus')
  const [color, setColor] = useState<SidingColor>(COLORS[0])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [hp, setHp] = useState('') // honeypot
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const chooseProfile = (k: ProfileKey) => {
    setProfile(k)
    setTexture(TEXTURES[k][0].key) // reset texture to a valid one for the new profile
  }

  // Siding wall area ≈ perimeter × wall height × storeys × coverage factor.
  const sqft = useMemo(() => {
    if (!m) return 0
    return Math.round(m.perimeterFt * WALL_HEIGHT_PER_STORY * stories * COVERAGE[coverage].factor)
  }, [m, stories, coverage])

  const est = useMemo(
    () => (sqft > 0 ? computeCustomerEstimate({ profile, sqft, stories, finish, demoKey }) : null),
    [profile, sqft, stories, finish, demoKey],
  )

  const previewHex = finish === 'primed' ? PRIMED_PREVIEW_HEX : color.hex
  const previewLabel = finish === 'primed' ? 'Primed (unpainted)' : color.name
  const textureLabel = TEXTURES[profile].find((t) => t.key === texture)?.label ?? ''
  const replacing = demoKey !== 'newbuild'

  const submit = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) { setError('Please add your name, email and phone.'); return }
    if (!est) { setError('Measure your home first.'); return }
    setSubmitting(true); setError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quote',
          company: hp,
          customer: {
            name, email, phone, address: m?.address || '',
            notes: `Instant map quote — replacing: ${DEMO_OPTIONS[demoKey].label}. Footprint ${m?.areaFt2.toLocaleString('en-US')} sq ft, perimeter ${m?.perimeterFt.toLocaleString('en-US')} ft, ${stories} storey, coverage: ${COVERAGE[coverage].label}. Siding area ~${sqft.toLocaleString('en-US')} sq ft. ${PROFILES[profile].label} · ${textureLabel} · ${finish === 'primed' ? 'Primed for paint' : 'ColorPlus ' + color.name}.`,
          },
          selection: {
            profile: PROFILES[profile].label,
            texture: textureLabel,
            color: finish === 'primed' ? 'Primed for paint' : color.name,
            finish: finish === 'primed' ? 'Primed' : 'ColorPlus',
            replacing: DEMO_OPTIONS[demoKey].label,
          },
          project: { sqft, stories },
          estimate: { low: est.low, high: est.high },
          source: 'instant-quote',
        }),
      })
      if (!res.ok) throw new Error('Request failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please call 650-287-4208 or try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── shared styles ──────────────────────────────────────────────────────────
  const card: React.CSSProperties = { background: '#fff', border: '1px solid #e7ece7', borderRadius: 18, padding: 22 }
  const stepLabel: React.CSSProperties = { fontSize: 12.5, fontWeight: 700, color: '#206a38', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 }
  const pill = (active: boolean): React.CSSProperties => ({
    cursor: 'pointer', padding: '10px 16px', borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
    background: active ? '#206a38' : '#fff', color: active ? '#fff' : '#3a4a40', border: active ? '2px solid #206a38' : '2px solid #e0e7e0',
  })
  const input: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #d6ded6', fontSize: 15, fontFamily: 'inherit' }

  if (submitted) {
    return (
      <div style={{ ...card, textAlign: 'center', maxWidth: 560, margin: '0 auto', padding: 36 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#16261c' }}>Quote sent — thank you, {name.split(' ')[0]}!</h2>
        <p style={{ color: '#46544a', marginTop: 10, lineHeight: 1.6 }}>
          Your ballpark for {PROFILES[profile].label.toLowerCase()} ({finish === 'primed' ? 'primed' : color.name}) on ~{sqft.toLocaleString('en-US')} sq ft is{' '}
          <strong>{est ? `${money(est.low)} – ${money(est.high)}` : ''}</strong>. We&apos;ll be in touch shortly to confirm and book a free on‑site measure.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: 24, alignItems: 'start' }} className="split">
      {/* Left: configurator */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* 1 · What are we replacing? */}
        <div style={card}>
          <div style={stepLabel}>1 · What are we replacing?</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {(Object.keys(DEMO_OPTIONS) as DemoKey[]).map((k) => {
              const d = DEMO_OPTIONS[k]; const active = demoKey === k
              return (
                <button key={k} type="button" onClick={() => setDemoKey(k)} style={{
                  textAlign: 'left', padding: '13px 15px', borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit',
                  background: active ? '#e7f1e8' : '#fff', border: active ? '2px solid #206a38' : '2px solid #e0e7e0',
                }}>
                  <div style={{ fontWeight: 700, color: '#16261c', fontSize: 14.5 }}>{d.label}</div>
                  <div style={{ fontSize: 12, color: '#6a766d', marginTop: 3, lineHeight: 1.35 }}>{d.sub}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 2 · Measure */}
        <div style={card}>
          <div style={stepLabel}>2 · Measure your home</div>
          <RoofMeasure onMeasure={setM} />
        </div>

        {/* 3 · Storeys & coverage */}
        <div style={card}>
          <div style={stepLabel}>3 · Storeys &amp; coverage</div>
          <div style={{ fontSize: 13, color: '#46544a', marginBottom: 8 }}>How many storeys?</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
            {[1, 2].map((v) => <button key={v} type="button" style={pill(stories === v)} onClick={() => setStories(v)}>{v} stor{v === 1 ? 'ey' : 'eys'}</button>)}
          </div>
          <div style={{ fontSize: 13, color: '#46544a', marginBottom: 8 }}>How much of the house?</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {(Object.keys(COVERAGE) as CoverageKey[]).map((k) => <button key={k} type="button" style={pill(coverage === k)} onClick={() => setCoverage(k)}>{COVERAGE[k].label}</button>)}
          </div>
        </div>

        {/* 4 · Choose your siding */}
        <div style={card}>
          <div style={stepLabel}>4 · Choose your siding</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {(Object.keys(PROFILES) as ProfileKey[]).map((k) => (
              <button key={k} type="button" onClick={() => chooseProfile(k)} style={{
                textAlign: 'left', padding: 0, borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit', overflow: 'hidden',
                background: profile === k ? '#e7f1e8' : '#fff', border: profile === k ? '2px solid #206a38' : '2px solid #e0e7e0',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PROFILES[k].img} alt={PROFILES[k].label} loading="lazy" style={{ display: 'block', width: '100%', height: 104, objectFit: 'cover' }} />
                <div style={{ padding: '10px 12px 12px' }}>
                  <div style={{ fontWeight: 700, color: '#16261c', fontSize: 14.5 }}>{PROFILES[k].label}</div>
                  <div style={{ fontSize: 12.5, color: '#6a766d', marginTop: 3 }}>{PROFILES[k].blurb}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 5 · Style it: live preview + texture + finish + colour */}
        <div style={card}>
          <div style={stepLabel}>5 · Style your {PROFILES[profile].label}</div>

          {/* live preview house */}
          <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', aspectRatio: '16 / 9', background: 'linear-gradient(180deg,#cfe0ee 0%,#e9f0e4 62%)', border: '1px solid #e3e9e3' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '24%', background: '#2c3631', clipPath: 'polygon(0 100%,12% 0,88% 0,100% 100%)', zIndex: 3 }} />
            <div style={{ position: 'absolute', left: '5%', right: '5%', top: '21%', bottom: 0, borderRadius: '6px 6px 0 0', overflow: 'hidden', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.3)', zIndex: 1, background: sidingBackground(previewHex, profile, texture) }} />
            <div style={{ position: 'absolute', left: '13%', bottom: 0, width: '14%', height: '48%', background: '#3a4a40', borderRadius: '5px 5px 0 0', zIndex: 2, boxShadow: '0 0 0 3px rgba(255,255,255,.3)' }} />
            <div style={{ position: 'absolute', right: '15%', bottom: '20%', width: '17%', height: '27%', background: 'linear-gradient(135deg,#dbe8f2,#b9cfe0)', borderRadius: 4, zIndex: 2, boxShadow: '0 0 0 4px rgba(255,255,255,.6)' }} />
            <div style={{ position: 'absolute', right: '40%', bottom: '20%', width: '13%', height: '27%', background: 'linear-gradient(135deg,#dbe8f2,#b9cfe0)', borderRadius: 4, zIndex: 2, boxShadow: '0 0 0 4px rgba(255,255,255,.6)' }} />
            <div style={{ position: 'absolute', left: 12, top: 12, zIndex: 4, background: 'rgba(255,255,255,.94)', borderRadius: 9, padding: '7px 11px', boxShadow: '0 4px 12px rgba(0,0,0,.12)' }}>
              <div style={{ fontSize: 10.5, color: '#7a857d', fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase' }}>{PROFILES[profile].label} · {textureLabel}</div>
              <div style={{ fontSize: 15, color: '#16261c', fontWeight: 800 }}>{previewLabel}</div>
            </div>
            {/* real texture reference */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PROFILES[profile].img} alt="" aria-hidden style={{ position: 'absolute', right: 12, bottom: 12, width: 70, height: 52, objectFit: 'cover', borderRadius: 8, zIndex: 4, border: '2px solid rgba(255,255,255,.85)', boxShadow: '0 4px 12px rgba(0,0,0,.18)' }} />
          </div>

          {/* texture */}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 13, color: '#46544a', marginBottom: 8 }}>Texture <span style={{ color: '#8a988c' }}>· look only, same price</span></div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TEXTURES[profile].map((t) => <button key={t.key} type="button" style={pill(texture === t.key)} onClick={() => setTexture(t.key)}>{t.label}</button>)}
            </div>
          </div>

          {/* finish */}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 13, color: '#46544a', marginBottom: 8 }}>Finish</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button type="button" onClick={() => setFinish('colorplus')} style={{
                textAlign: 'left', padding: '12px 14px', borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit',
                background: finish === 'colorplus' ? '#e7f1e8' : '#fff', border: finish === 'colorplus' ? '2px solid #206a38' : '2px solid #e0e7e0',
              }}>
                <div style={{ fontWeight: 700, color: '#16261c', fontSize: 14 }}>ColorPlus® finish</div>
                <div style={{ fontSize: 12, color: '#6a766d', marginTop: 3 }}>Factory colour · 15-yr warranty</div>
              </button>
              <button type="button" onClick={() => setFinish('primed')} style={{
                textAlign: 'left', padding: '12px 14px', borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit',
                background: finish === 'primed' ? '#e7f1e8' : '#fff', border: finish === 'primed' ? '2px solid #206a38' : '2px solid #e0e7e0',
              }}>
                <div style={{ fontWeight: 700, color: '#16261c', fontSize: 14 }}>Primed for paint</div>
                <div style={{ fontSize: 12, color: '#6a766d', marginTop: 3 }}>You paint after install</div>
              </button>
            </div>
          </div>

          {/* colour grid (ColorPlus only) or primed warning */}
          {finish === 'colorplus' ? (
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 13, color: '#46544a', marginBottom: 10 }}>Colour <span style={{ color: '#8a988c' }}>· Statement Collection®</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8 }}>
                {COLORS.map((c) => {
                  const active = color.name === c.name && finish === 'colorplus'
                  return (
                    <button key={c.name} type="button" title={c.name} onClick={() => setColor(c)} aria-label={c.name} style={{
                      aspectRatio: '1 / 1', borderRadius: '50%', cursor: 'pointer', background: c.hex,
                      border: active ? '2px solid #206a38' : '1px solid rgba(0,0,0,.18)',
                      boxShadow: active ? '0 0 0 3px rgba(32,106,56,.25)' : 'none', padding: 0,
                    }} />
                  )
                })}
              </div>
              <div style={{ fontSize: 13, color: '#16261c', marginTop: 10, fontWeight: 600 }}>{color.name}</div>
              <div style={{ fontSize: 12, color: '#6a766d', marginTop: 4, lineHeight: 1.45 }}>{COLORPLUS_NOTE}</div>
            </div>
          ) : (
            <div style={{ marginTop: 18, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '12px 14px', display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>⚠️</span>
              <div style={{ fontSize: 12.5, color: '#7c4a13', lineHeight: 1.5 }}>{PRIMED_WARNING}</div>
            </div>
          )}
        </div>
      </div>

      {/* Right: estimate + what's included + lead */}
      <div style={{ ...card, position: 'sticky', top: 90 }}>
        <div style={stepLabel}>Your rough estimate</div>
        {est ? (
          <>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#16261c', letterSpacing: '-.5px' }}>{money(est.low)} – {money(est.high)}</div>
            <div style={{ fontSize: 13, color: '#6a766d', marginTop: 6, lineHeight: 1.5 }}>
              ~{sqft.toLocaleString('en-US')} sq ft of {PROFILES[profile].label.toLowerCase()} · {stories} storey · {COVERAGE[coverage].label.toLowerCase()}<br />
              {finish === 'primed' ? 'Primed for paint' : `ColorPlus ${color.name}`} · replacing {DEMO_OPTIONS[demoKey].label.toLowerCase()}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 14, color: '#6a766d' }}>Search your address and trace your roof to see a ballpark.</div>
        )}

        {/* What's included */}
        <div style={{ height: 1, background: '#eef2ee', margin: '18px 0' }} />
        <div style={{ fontSize: 13, fontWeight: 800, color: '#16261c', marginBottom: 10 }}>What&apos;s included</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {replacing && (
            <Included title="Removal &amp; disposal of your old siding" body={INCLUDED.removalDisposal} />
          )}
          <Included title="All permits &amp; inspections" body={INCLUDED.permits} />
          <Included title="Complete installation, to spec" body={INCLUDED.installation} />
        </div>

        {/* Dry-rot note */}
        <div style={{ marginTop: 14, background: '#fafaf8', border: '1px solid #e6e3da', borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: '#5b4a2e', marginBottom: 4 }}>A note on dry rot</div>
          <div style={{ fontSize: 12, color: '#6a665c', lineHeight: 1.5 }}>{INCLUDED.dryRotExclusion}</div>
        </div>

        {/* Lead form */}
        <div style={{ height: 1, background: '#eef2ee', margin: '18px 0' }} />
        <div style={{ fontSize: 13, fontWeight: 700, color: '#16261c', marginBottom: 10 }}>Get your detailed quote</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input style={input} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input style={input} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input style={input} placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input style={{ position: 'absolute', left: '-9999px' }} tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} aria-hidden />
          {error && <div style={{ fontSize: 13, color: '#b91c1c' }}>{error}</div>}
          <button type="button" onClick={submit} disabled={submitting} className="btn btn-primary" style={{ padding: '13px 20px', fontSize: 15, opacity: submitting ? 0.6 : 1 }}>
            {submitting ? 'Sending…' : 'Send me my quote'}
          </button>
          <div style={{ fontSize: 11.5, color: '#8a988c' }}>Free, no obligation. We beat any like‑for‑like quote by 10%.</div>
        </div>
      </div>
    </div>
  )
}

function Included({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: '#e7f1e8', color: '#206a38', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, marginTop: 1 }}>✓</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#16261c' }} dangerouslySetInnerHTML={{ __html: title }} />
        <div style={{ fontSize: 12, color: '#6a766d', marginTop: 2, lineHeight: 1.5 }}>{body}</div>
      </div>
    </div>
  )
}
