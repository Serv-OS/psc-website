'use client'

import { useEffect, useState } from 'react'
import { THANKS_KEY, type ThankYouDetails } from '@/lib/thankYou'
import { ApplyButton } from '@/components/financing/ApplyButton'
import { EXAMPLE_APR, EXAMPLE_YEARS, FIN, monthlyPayment, usd } from '@/lib/financing'

type Saved = ThankYouDetails & { form?: string; at?: number }

const ADS_SEND_TO = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION || ''

declare global { interface Window { gtag?: (...args: unknown[]) => void } }

export function ThankYou() {
  const [saved, setSaved] = useState<Saved | null>(null)

  useEffect(() => {
    let s: Saved | null = null
    try { s = JSON.parse(sessionStorage.getItem(THANKS_KEY) || 'null') } catch { /* ignore */ }
    setSaved(s)
    // Count the conversion once per sign up, not on every refresh of this page.
    if (ADS_SEND_TO && s?.at && !sessionStorage.getItem(`${THANKS_KEY}_counted_${s.at}`)) {
      const fire = () => {
        if (!window.gtag) return false
        window.gtag('event', 'conversion', { send_to: ADS_SEND_TO })
        try { sessionStorage.setItem(`${THANKS_KEY}_counted_${s!.at}`, '1') } catch { /* ignore */ }
        return true
      }
      if (!fire()) { const t = setInterval(() => { if (fire()) clearInterval(t) }, 300); setTimeout(() => clearInterval(t), 8000) }
    }
  }, [])

  const first = saved?.first?.trim()
  const quote = saved?.form === 'quote' || saved?.form === 'instant-quote'

  return (
    <main style={{ padding: '72px 20px 96px', background: '#f6f9f6' }}>
      <div style={{ maxWidth: 620, margin: '0 auto', background: '#fff', border: '1px solid #e7ece7', borderRadius: 22, padding: 36, textAlign: 'center', boxShadow: 'var(--shadow-soft)' }}>
        <div style={{ width: 64, height: 64, margin: '0 auto 18px', borderRadius: '50%', background: '#e7f1e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#206a38' }}>✓</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#16261c' }}>{first ? `Thank you, ${first}!` : 'Thank you!'}</h1>
        <p style={{ maxWidth: 460, margin: '12px auto 0', fontSize: 16, color: '#46544a', lineHeight: 1.6 }}>
          {quote
            ? 'Your quote request is in. A Peninsula Siding specialist will call you within one business day to confirm it and book your free on-site visit.'
            : 'Your request is in. A Peninsula Siding specialist will reach out within one business day to book your free consultation.'}
        </p>
        {saved?.estimate && (
          <div style={{ marginTop: 20, background: '#f4f8f4', border: '1px solid #dfe9df', borderRadius: 12, padding: 14, fontSize: 15, color: '#224631', fontWeight: 600 }}>
            Your estimate: {saved.estimate}{saved.note ? <div style={{ fontWeight: 400, fontSize: 13, marginTop: 4, color: '#56635a' }}>{saved.note}</div> : null}
          </div>
        )}
        {/* Financing: strike while they're keen. Yes/maybe get the full box,
            everyone else a one line link. */}
        {saved && (saved.financing === 'yes' || saved.financing === 'maybe') ? (
          <div style={{ marginTop: 22, background: '#eef6ef', border: '1px solid #cfe3d3', borderRadius: 16, padding: 22, textAlign: 'left' }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#16261c' }}>Check your financing rate now</div>
            <p style={{ fontSize: 14, color: '#46544a', marginTop: 6, lineHeight: 1.55 }}>
              You said you&apos;re interested in financing. It takes about 2 minutes, uses a soft credit check that won&apos;t affect your score, and you&apos;ll know your options before we visit.
            </p>
            {saved.amount ? (
              <div style={{ fontSize: 14, color: '#224631', marginTop: 10 }}>
                <strong>About {usd(monthlyPayment(saved.amount, EXAMPLE_APR, EXAMPLE_YEARS))} a month*</strong> on {usd(saved.amount)}
                <div style={{ fontSize: 11, color: '#8a958c', marginTop: 3 }}>*Example at {EXAMPLE_APR}% APR over {EXAMPLE_YEARS} years. Your rate depends on your credit; not an offer.</div>
              </div>
            ) : null}
            <ApplyButton place="thank-you" style={{ display: 'block', textAlign: 'center', marginTop: 14, padding: '14px 20px', fontSize: 16 }}>Check your rate &rarr;</ApplyButton>
            <div style={{ fontSize: 11, color: '#8a958c', marginTop: 8 }}>Through Enhancify and its lending partners, subject to credit approval. Rates from {FIN.lowestApr}% APR.</div>
          </div>
        ) : (
          <p style={{ marginTop: 20, fontSize: 14, color: '#56635a' }}>
            Want to spread the cost? <a href="/financing" style={{ color: '#206a38', fontWeight: 600 }}>See our financing options</a>.
          </p>
        )}
        <p style={{ marginTop: 22, fontSize: 14, color: '#56635a' }}>
          Anything urgent? Call <a href="tel:6509105521" style={{ color: '#206a38', fontWeight: 600 }}>650-910-5521</a>.
        </p>
        <a href="/" style={{ display: 'inline-block', marginTop: 18, color: '#206a38', fontWeight: 600, fontSize: 14 }}>Back to the home page</a>
      </div>
    </main>
  )
}
