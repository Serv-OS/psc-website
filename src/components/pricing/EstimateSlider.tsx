'use client'

import Link from 'next/link'
import { useState } from 'react'

import { DEFAULT_PRICING, computeCustomerEstimate, fmtUSD, type PricingConstants } from '@/lib/quote'

export function EstimateSlider({ pricing = DEFAULT_PRICING }: { pricing?: PricingConstants }) {
  const [sqft, setSqft] = useState(1800)
  const est = computeCustomerEstimate({ profile: 'lap', sqft, stories: 2 }, pricing)

  return (
    <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 20, padding: 30 }}>
      <div style={{ fontSize: 13, color: '#9fc2a6', fontWeight: 600 }}>Approximate siding area</div>
      <div style={{ fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginTop: 4 }}>{sqft.toLocaleString('en-US')} sq ft</div>
      <input
        type="range"
        min={600}
        max={4000}
        step={100}
        value={sqft}
        onChange={(e) => setSqft(parseFloat(e.target.value))}
        aria-label="Approximate siding area in square feet"
        style={{ width: '100%', marginTop: 18, height: 6, cursor: 'pointer', accentColor: '#206a38' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#7f9a85', marginTop: 6 }}>
        <span>Small home</span>
        <span>Large / custom</span>
      </div>
      <div style={{ marginTop: 26, background: 'rgba(255,255,255,.06)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
        <div style={{ fontSize: '12.5px', color: '#9fc2a6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>Estimated range</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginTop: 6 }}>{fmtUSD(est.low)} – {fmtUSD(est.high)}</div>
        <div style={{ fontSize: 12, color: '#8fae96', marginTop: 8, lineHeight: 1.5 }}>Ballpark for a typical two-story ColorPlus® project. Your on-site visit confirms the exact figure.</div>
      </div>
      <Link href="/#quote" className="btn btn-primary" style={{ marginTop: 20, display: 'block', textAlign: 'center', fontSize: 15, padding: 14, borderRadius: 12 }}>
        Build my detailed quote &rarr;
      </Link>
    </div>
  )
}
