'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import { SmsConsent } from '../SmsConsent'

import {
  COLORS,
  COVERAGE,
  DEFAULT_PRICING,
  PROFILES,
  SIZES,
  computeCustomerEstimate,
  fmtUSD,
  guidedSqft,
  type CoverageKey,
  type PricingConstants,
  type ProfileKey,
  type SizeKey,
} from '@/lib/quote'

const pill = (active: boolean): CSSProperties => ({
  cursor: 'pointer',
  padding: '10px 18px',
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 600,
  background: active ? '#206a38' : '#fff',
  color: active ? '#fff' : '#3a4a40',
  border: active ? '2px solid #206a38' : '2px solid #e0e7e0',
  fontFamily: 'inherit',
})

const optionStyle = (active: boolean): CSSProperties => ({
  textAlign: 'left',
  cursor: 'pointer',
  padding: '15px 16px',
  borderRadius: 13,
  background: active ? '#eef6ef' : '#fff',
  border: active ? '2px solid #206a38' : '2px solid #e6ece6',
  boxShadow: active ? '0 6px 16px rgba(32,106,56,.12)' : '0 1px 2px rgba(0,0,0,.03)',
  width: '100%',
  fontFamily: 'inherit',
})

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  border: '2px solid #e6ece6',
  borderRadius: 11,
  fontSize: '14.5px',
  fontFamily: 'inherit',
}

export function QuoteStudio({ pricing = DEFAULT_PRICING }: { pricing?: PricingConstants }) {
  const [texture, setTexture] = useState<'wood' | 'smooth'>('wood')
  const [profile, setProfile] = useState<ProfileKey>('lap')
  const [colorIdx, setColorIdx] = useState(7) // Mountain Sage
  const [qStep, setQStep] = useState(1)
  const [homeSize, setHomeSize] = useState<SizeKey | ''>('')
  const [stories, setStories] = useState('2')
  const [coverage, setCoverage] = useState<CoverageKey>('whole')
  const [knowSqft, setKnowSqft] = useState(false)
  const [manualSqft, setManualSqft] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [smsOptIn, setSmsOptIn] = useState(false)
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [hp, setHp] = useState('') // honeypot
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const sqft = knowSqft
    ? Math.max(0, parseFloat(manualSqft) || 0)
    : homeSize
      ? guidedSqft(homeSize, coverage)
      : 0
  const hasSize = knowSqft ? parseFloat(manualSqft) > 0 : !!homeSize
  const activeColor = COLORS[colorIdx]
  const prof = PROFILES[profile]

  const est = useMemo(
    () => computeCustomerEstimate({ profile, sqft, stories: parseFloat(stories) || 1 }, pricing),
    [profile, sqft, stories, pricing],
  )

  const sidingStyle = useMemo<CSSProperties>(() => {
    const c = activeColor.hex
    const sh = 'rgba(0,0,0,.16)'
    const sh2 = 'rgba(0,0,0,.07)'
    const hi = 'rgba(255,255,255,.14)'
    const layers: string[] = []
    if (texture === 'wood') layers.push('repeating-linear-gradient(90deg, rgba(0,0,0,.035) 0 1px, transparent 1px 7px)')
    if (profile === 'panel') layers.push(`repeating-linear-gradient(90deg, ${hi} 0 2px, ${c} 2px 46px, ${sh} 46px 48px)`)
    else if (profile === 'shingle') {
      layers.push(`repeating-linear-gradient(0deg, ${c} 0 30px, ${sh2} 30px 31px, ${sh} 31px 33px)`)
      layers.push(`repeating-linear-gradient(90deg, transparent 0 38px, rgba(0,0,0,.05) 38px 40px)`)
    } else if (profile === 'artisan') layers.push(`repeating-linear-gradient(0deg, ${c} 0 38px, ${sh} 38px 42px)`)
    else layers.push(`repeating-linear-gradient(0deg, ${hi} 0 2px, ${c} 2px 30px, ${sh} 30px 33px)`)
    layers.push(c)
    return { position: 'absolute', inset: 0, background: layers.join(', ') }
  }, [activeColor.hex, profile, texture])

  const submit = async () => {
    if (!(name && email && phone)) {
      setError('Please add your name, email and phone so we can reach you.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quote',
          company: hp, // honeypot
          customer: { name, email, phone, address, notes },
          selection: { profile: prof.label, texture, color: activeColor.name },
          project: { sqft: Math.round(sqft), stories: parseInt(stories, 10) },
          estimate: { low: est.low, high: est.high },
          sms_consent: smsOptIn,
          source: 'home-quote',
        }),
      })
      if (!res.ok) throw new Error('Request failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please call 650-910-5521 or try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="split" style={{ gridTemplateColumns: '1.15fr .85fr', gap: 28, alignItems: 'start' }}>
      {/* LEFT: VISUALIZER */}
      <div style={{ background: '#fff', border: '1px solid #e7ece7', borderRadius: 22, padding: 24, boxShadow: 'var(--shadow-soft)' }}>
        {/* preview house */}
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '16/10', background: 'linear-gradient(180deg,#cfe0ee 0%,#e9f0e4 60%)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '26%', background: '#2c3631', clipPath: 'polygon(0 100%,12% 0,88% 0,100% 100%)', zIndex: 3 }} />
          <div style={{ position: 'absolute', left: '6%', right: '6%', top: '23%', bottom: 0, borderRadius: '6px 6px 0 0', overflow: 'hidden', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.3)', zIndex: 1 }}>
            <div style={sidingStyle} />
          </div>
          <div style={{ position: 'absolute', left: '14%', bottom: 0, width: '13%', height: '46%', background: '#3a4a40', borderRadius: '5px 5px 0 0', zIndex: 2, boxShadow: '0 0 0 3px rgba(255,255,255,.25)' }} />
          <div style={{ position: 'absolute', right: '16%', bottom: '18%', width: '16%', height: '26%', background: 'linear-gradient(135deg,#dbe8f2,#b9cfe0)', borderRadius: 4, zIndex: 2, boxShadow: '0 0 0 4px rgba(255,255,255,.55)' }} />
          <div style={{ position: 'absolute', right: '40%', bottom: '18%', width: '13%', height: '26%', background: 'linear-gradient(135deg,#dbe8f2,#b9cfe0)', borderRadius: 4, zIndex: 2, boxShadow: '0 0 0 4px rgba(255,255,255,.55)' }} />
          <div style={{ position: 'absolute', left: 14, top: '31%', zIndex: 4, background: 'rgba(255,255,255,.92)', borderRadius: 9, padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,.12)' }}>
            <div style={{ fontSize: 11, color: '#7a857d', fontWeight: 600, letterSpacing: '.4px', textTransform: 'uppercase' }}>{prof.label}</div>
            <div style={{ fontSize: 15, color: '#16261c', fontWeight: 700 }}>{activeColor.name}</div>
          </div>
        </div>

        {/* texture pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#56635a', textTransform: 'uppercase', letterSpacing: '.6px', marginRight: 4 }}>Texture</span>
          <button style={pill(texture === 'wood')} onClick={() => setTexture('wood')}>Wood grain</button>
          <button style={pill(texture === 'smooth')} onClick={() => setTexture('smooth')}>Smooth</button>
        </div>

        {/* profile options */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#56635a', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 10 }}>Profile</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
            {(Object.keys(PROFILES) as ProfileKey[]).map((k) => (
              <button key={k} style={optionStyle(profile === k)} onClick={() => setProfile(k)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PROFILES[k].img} alt={PROFILES[k].label} loading="lazy" style={{ width: 46, height: 46, borderRadius: 9, objectFit: 'cover', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#16261c' }}>{PROFILES[k].label}</div>
                    <div style={{ fontSize: 12, color: '#6a766d', marginTop: 2 }}>{PROFILES[k].blurb}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* colors */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#56635a', textTransform: 'uppercase', letterSpacing: '.6px' }}>ColorPlus&reg; finish</div>
            <div style={{ fontSize: '12.5px', color: '#206a38', fontWeight: 600 }}>{activeColor.name}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 9 }}>
            {COLORS.map((c, i) => {
              const sel = i === colorIdx
              return (
                <button
                  key={c.name}
                  title={c.name}
                  aria-label={c.name}
                  onClick={() => setColorIdx(i)}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: 10,
                    cursor: 'pointer',
                    background: c.hex,
                    border: sel ? '2.5px solid #206a38' : '2.5px solid rgba(0,0,0,.06)',
                    boxShadow: sel ? '0 0 0 3px rgba(32,106,56,.18), 0 4px 10px rgba(0,0,0,.12)' : '0 1px 3px rgba(0,0,0,.1)',
                    transform: sel ? 'scale(1.06)' : 'none',
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: QUOTE WIZARD */}
      <div id="quote" style={{ background: '#fff', border: '1px solid #e7ece7', borderRadius: 22, boxShadow: '0 14px 40px rgba(14,52,29,.1)', overflow: 'hidden', position: 'sticky', top: 88, scrollMarginTop: 96 }}>
        <div style={{ background: 'linear-gradient(135deg,#224631,#0e341d)', padding: '22px 24px', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Instant estimate</div>
            <div style={{ fontSize: '12.5px', color: '#9ec5a6', fontWeight: 600 }}>
              Step {qStep} of 3 &middot; {qStep === 1 ? 'Project size' : qStep === 2 ? 'A few details' : 'Your estimate'}
            </div>
          </div>
          <div style={{ marginTop: 14, height: 5, background: 'rgba(255,255,255,.16)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${(qStep / 3) * 100}%`, height: '100%', background: '#206a38', borderRadius: 999, transition: 'width .3s ease' }} />
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {qStep === 1 && (
            <div style={{ animation: 'psc-fade .3s ease both' }}>
              <div style={{ fontSize: '15.5px', fontWeight: 700, color: '#16261c', marginBottom: 14 }}>How big is your home?</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {(Object.keys(SIZES) as SizeKey[]).map((k) => (
                  <button key={k} style={optionStyle(homeSize === k)} onClick={() => { setHomeSize(k); setKnowSqft(false) }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#16261c' }}>{SIZES[k].label}</div>
                    <div style={{ fontSize: 12, color: '#6a766d', marginTop: 2 }}>{SIZES[k].sub}</div>
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#56635a', margin: '18px 0 9px', textTransform: 'uppercase', letterSpacing: '.5px' }}>How much are we covering?</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(Object.keys(COVERAGE) as CoverageKey[]).map((k) => (
                  <button key={k} style={pill(coverage === k)} onClick={() => setCoverage(k)}>{COVERAGE[k].label}</button>
                ))}
              </div>
              <button onClick={() => setKnowSqft((v) => !v)} style={{ marginTop: 18, background: 'none', border: 'none', color: '#206a38', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>
                I know my square footage
              </button>
              {knowSqft && (
                <input type="number" value={manualSqft} onChange={(e) => setManualSqft(e.target.value)} placeholder="Enter total sq ft" style={{ ...inputStyle, marginTop: 10 }} />
              )}
              <button
                onClick={() => hasSize && setQStep(2)}
                disabled={!hasSize}
                className="btn btn-primary"
                style={{ marginTop: 22, width: '100%', padding: 15, fontSize: '15.5px', border: 'none', opacity: hasSize ? 1 : 0.55 }}
              >
                Continue &rarr;
              </button>
            </div>
          )}

          {qStep === 2 && (
            <div style={{ animation: 'psc-fade .3s ease both' }}>
              <div style={{ fontSize: '15.5px', fontWeight: 700, color: '#16261c', marginBottom: 6 }}>A few quick details</div>
              <p style={{ fontSize: 13, color: '#6a766d', marginBottom: 16 }}>We use these to refine your estimate. No obligation.</p>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#56635a', marginBottom: 9, textTransform: 'uppercase', letterSpacing: '.5px' }}>Number of stories</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['1', '2', '3'].map((v) => (
                  <button key={v} style={pill(stories === v)} onClick={() => setStories(v)}>{v}{v === '1' ? ' story' : ' stories'}</button>
                ))}
              </div>
              <div style={{ marginTop: 22, background: '#f4f8f4', border: '1px solid #dfe9df', borderRadius: 14, padding: 18 }}>
                <div style={{ fontSize: '12.5px', color: '#56635a', fontWeight: 600 }}>Estimated siding area</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#16261c', letterSpacing: '-.5px' }}>{Math.round(sqft).toLocaleString('en-US')} sq ft</div>
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#46544a' }}>
                  <span style={{ width: 14, height: 14, borderRadius: 4, background: '#206a38' }} />
                  {prof.label} &middot; {activeColor.name}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                <button onClick={() => setQStep(1)} className="btn btn-ghost" style={{ flex: '0 0 auto', padding: '15px 20px', fontSize: 15, borderRadius: 13 }}>Back</button>
                <button onClick={() => setQStep(3)} className="btn btn-primary" style={{ flex: 1, padding: 15, fontSize: '15.5px', border: 'none' }}>See my estimate &rarr;</button>
              </div>
            </div>
          )}

          {qStep === 3 && (
            <div style={{ animation: 'psc-fade .3s ease both' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '14px 4px' }}>
                  <div style={{ width: 60, height: 60, margin: '0 auto 16px', borderRadius: '50%', background: '#e7f1e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, color: '#206a38' }}>✓</div>
                  <div style={{ fontSize: 19, fontWeight: 800, color: '#16261c' }}>Request received!</div>
                  <p style={{ fontSize: 14, color: '#56635a', marginTop: 8, lineHeight: 1.55 }}>
                    Thanks {name.split(' ')[0]} — a Peninsula Siding specialist will call you within one business day to lock in your quote and book your free on-site visit.
                  </p>
                  <div style={{ marginTop: 18, background: '#f4f8f4', border: '1px solid #dfe9df', borderRadius: 12, padding: 14, fontSize: 14, color: '#224631', fontWeight: 600 }}>
                    Your estimate: {fmtUSD(est.low)} – {fmtUSD(est.high)}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ background: 'linear-gradient(135deg,#eef6ef,#f4f8f4)', border: '1px solid #cfe3d3', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#206a38', textTransform: 'uppercase', letterSpacing: '.6px' }}>Your estimated project</div>
                    <div style={{ fontSize: 30, fontWeight: 800, color: '#16261c', letterSpacing: '-1px', marginTop: 6 }}>{fmtUSD(est.low)} – {fmtUSD(est.high)}</div>
                    <div style={{ fontSize: '12.5px', color: '#6a766d', marginTop: 6 }}>{Math.round(sqft).toLocaleString('en-US')} sq ft &middot; {prof.label} &middot; {activeColor.name}</div>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#7a857d', lineHeight: 1.5, marginTop: 12, textAlign: 'center' }}>
                    A ballpark based on your inputs. We&apos;ll confirm the exact price on a free on-site visit — and beat any like-for-like quote by 10%.
                  </p>
                  <div style={{ height: 1, background: '#eef1ee', margin: '18px 0' }} />
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#16261c', marginBottom: 14 }}>Where should we send it?</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name *" style={inputStyle} />
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" style={{ ...inputStyle, flex: 1, minWidth: 0 }} />
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone *" style={{ ...inputStyle, flex: 1, minWidth: 0 }} />
                    </div>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Property address" style={inputStyle} />
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything else? (optional)" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
                    {/* honeypot */}
                    <input value={hp} onChange={(e) => setHp(e.target.value)} name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                  </div>
                  {error && (
                    <div style={{ marginTop: 12, background: '#fdecea', border: '1px solid #f3c9c2', borderRadius: 11, padding: '10px 14px', fontSize: '13.5px', color: '#c0392b', fontWeight: 500 }}>{error}</div>
                  )}
                  <SmsConsent checked={smsOptIn} onChange={setSmsOptIn} />
                  <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                    <button onClick={() => setQStep(2)} className="btn btn-ghost" style={{ flex: '0 0 auto', padding: '15px 20px', fontSize: 15, borderRadius: 13 }}>Back</button>
                    <button onClick={submit} disabled={submitting} className="btn btn-primary" style={{ flex: 1, padding: 15, fontSize: 15, border: 'none', opacity: submitting ? 0.7 : 1 }}>
                      {submitting ? 'Sending…' : 'Book my free visit'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
