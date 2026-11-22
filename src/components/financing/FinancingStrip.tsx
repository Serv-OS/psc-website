import Link from 'next/link'

import { FIN } from '@/lib/financing'
import { ApplyButton } from './ApplyButton'

/** Short financing section for the home, pricing and town pages. */
export function FinancingStrip({ place, city }: { place: string; city?: string }) {
  return (
    <section style={{ background: '#fff' }}>
      <div className="container" style={{ padding: '56px 24px' }}>
        <div className="split" style={{ background: '#eef6ef', border: '1px solid #cfe3d3', borderRadius: 22, padding: '34px 36px', gridTemplateColumns: '1.3fr .7fr', gap: 28 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '1.5px', color: '#206a38', textTransform: 'uppercase' }}>Financing available</div>
            <h2 style={{ fontSize: 'clamp(24px,2.8vw,34px)', fontWeight: 800, letterSpacing: '-.8px', color: '#16261c', marginTop: 10, lineHeight: 1.15 }}>
              {city ? `New siding for your ${city} home, paid monthly` : 'New siding now, paid monthly'}
            </h2>
            <p style={{ marginTop: 12, fontSize: 16, color: '#46544a', lineHeight: 1.6, maxWidth: 600 }}>
              Borrow from $500 to ${FIN.maxLoan.toLocaleString('en-US')} with rates from {FIN.lowestApr}% APR*. See your options in about 2 minutes with a soft credit check that won&apos;t affect your score.
            </p>
            <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: '6px 18px', fontSize: 13.5, color: '#3a4a40', fontWeight: 600 }}>
              <span>✓ Soft credit check</span><span>✓ Scores from {FIN.lowestScore}</span><span>✓ Funds in 2 to 3 days</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ApplyButton place={place} style={{ textAlign: 'center', padding: '15px 22px', fontSize: 16 }}>Check your rate &rarr;</ApplyButton>
            <Link href="/financing#calculator" className="btn btn-ghost" style={{ textAlign: 'center', padding: '14px 22px', fontSize: 15 }}>Estimate my monthly payment</Link>
            <div style={{ fontSize: 11, color: '#8a958c', lineHeight: 1.45 }}>*Your rate depends on your credit. Through Enhancify and its lending partners, subject to approval.</div>
          </div>
        </div>
      </div>
    </section>
  )
}
