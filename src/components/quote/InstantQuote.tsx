'use client'

// Customer-facing instant quote: measure the house on a map → pick storeys +
// coverage + siding → rough estimate (existing engine) → captured as a Lead.
import { useMemo, useState } from 'react'
import { RoofMeasure, type Measurement } from './RoofMeasure'
import { PROFILES, COVERAGE, computeCustomerEstimate, type ProfileKey, type CoverageKey } from '@/lib/quote'

const WALL_HEIGHT_PER_STORY = 9 // ft — footprint perimeter × this × storeys ≈ wall area to side
const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

export function InstantQuote() {
  const [m, setM] = useState<Measurement | null>(null)
  const [stories, setStories] = useState(2)
  const [coverage, setCoverage] = useState<CoverageKey>('whole')
  const [profile, setProfile] = useState<ProfileKey>('lap')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [hp, setHp] = useState('') // honeypot
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Siding wall area ≈ perimeter × wall height × storeys × coverage factor.
  const sqft = useMemo(() => {
    if (!m) return 0
    return Math.round(m.perimeterFt * WALL_HEIGHT_PER_STORY * stories * COVERAGE[coverage].factor)
  }, [m, stories, coverage])

  const est = useMemo(() => (sqft > 0 ? computeCustomerEstimate({ profile, sqft, stories }) : null), [profile, sqft, stories])

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
            notes: `Instant map quote — footprint ${m?.areaFt2.toLocaleString('en-US')} sq ft, perimeter ${m?.perimeterFt.toLocaleString('en-US')} ft, ${stories} storey, coverage: ${COVERAGE[coverage].label}. Estimated siding area ${sqft.toLocaleString('en-US')} sq ft.`,
          },
          selection: { profile: PROFILES[profile].label, texture: '', color: '' },
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
          Your ballpark for {PROFILES[profile].label.toLowerCase()} on ~{sqft.toLocaleString('en-US')} sq ft is{' '}
          <strong>{est ? `${money(est.low)} – ${money(est.high)}` : ''}</strong>. We&apos;ll be in touch shortly to confirm and book a free on‑site measure.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: 24, alignItems: 'start' }} className="split">
      {/* Left: measure + options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={card}>
          <div style={stepLabel}>1 · Measure your home</div>
          <RoofMeasure onMeasure={setM} />
        </div>

        <div style={card}>
          <div style={stepLabel}>2 · Storeys &amp; coverage</div>
          <div style={{ fontSize: 13, color: '#46544a', marginBottom: 8 }}>How many storeys?</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
            {[1, 2].map((v) => <button key={v} type="button" style={pill(stories === v)} onClick={() => setStories(v)}>{v} stor{v === 1 ? 'ey' : 'eys'}</button>)}
          </div>
          <div style={{ fontSize: 13, color: '#46544a', marginBottom: 8 }}>How much of the house?</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {(Object.keys(COVERAGE) as CoverageKey[]).map((k) => <button key={k} type="button" style={pill(coverage === k)} onClick={() => setCoverage(k)}>{COVERAGE[k].label}</button>)}
          </div>
        </div>

        <div style={card}>
          <div style={stepLabel}>3 · Choose your siding</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {(Object.keys(PROFILES) as ProfileKey[]).map((k) => (
              <button key={k} type="button" onClick={() => setProfile(k)} style={{
                textAlign: 'left', padding: 14, borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit',
                background: profile === k ? '#e7f1e8' : '#fff', border: profile === k ? '2px solid #206a38' : '2px solid #e0e7e0',
              }}>
                <div style={{ fontWeight: 700, color: '#16261c', fontSize: 14.5 }}>{PROFILES[k].label}</div>
                <div style={{ fontSize: 12.5, color: '#6a766d', marginTop: 3 }}>{PROFILES[k].blurb}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: estimate + lead */}
      <div style={{ ...card, position: 'sticky', top: 90 }}>
        <div style={stepLabel}>Your rough estimate</div>
        {est ? (
          <>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#16261c', letterSpacing: '-.5px' }}>{money(est.low)} – {money(est.high)}</div>
            <div style={{ fontSize: 13, color: '#6a766d', marginTop: 6 }}>
              ~{sqft.toLocaleString('en-US')} sq ft of {PROFILES[profile].label.toLowerCase()} · {stories} storey · {COVERAGE[coverage].label.toLowerCase()}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 14, color: '#6a766d' }}>Search your address and trace your roof to see a ballpark.</div>
        )}

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
