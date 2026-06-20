import type { Metadata } from 'next'

import { InstantQuote } from '@/components/quote/InstantQuote'

export const metadata: Metadata = {
  title: 'Instant Siding Quote — Measure Your Home | Peninsula Siding Company',
  description:
    'Get a ballpark siding quote in under a minute — find your home on the map, trace your roof, pick your siding, and we’ll send your estimate. Free, no obligation.',
  alternates: { canonical: '/instant-quote' },
}

export default function InstantQuotePage() {
  return (
    <>
      <section style={{ background: 'radial-gradient(1100px 460px at 50% -10%, #1c5a32 0%, transparent 60%), linear-gradient(180deg,#0e341d 0%,#091c12 100%)' }}>
        <div className="container" style={{ padding: '60px 24px 40px', maxWidth: 880, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.16)', color: '#cde7d3', fontSize: 12.5, fontWeight: 600, padding: '7px 15px', borderRadius: 999, marginBottom: 20, letterSpacing: '.4px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c40a' }} /> 60‑SECOND ESTIMATE
          </div>
          <h1 style={{ fontSize: 'clamp(30px,4vw,46px)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-1.2px', color: '#fff' }}>
            Your instant siding estimate
          </h1>
          <p style={{ marginTop: 16, fontSize: 17, lineHeight: 1.6, color: '#bcd9c2', maxWidth: 620, margin: '16px auto 0' }}>
            Find your home on the map, trace your roof, pick your siding — and we&apos;ll send a ballpark price straight away. No measuring, no waiting.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--soft-2)' }}>
        <div className="container" style={{ padding: '36px 24px 72px' }}>
          <InstantQuote />
        </div>
      </section>
    </>
  )
}
