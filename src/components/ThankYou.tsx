'use client'

import { useEffect, useState } from 'react'
import { THANKS_KEY, type ThankYouDetails } from '@/lib/thankYou'

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
        <p style={{ marginTop: 22, fontSize: 14, color: '#56635a' }}>
          Anything urgent? Call <a href="tel:6509105521" style={{ color: '#206a38', fontWeight: 600 }}>650-910-5521</a>.
        </p>
        <a href="/" style={{ display: 'inline-block', marginTop: 18, color: '#206a38', fontWeight: 600, fontSize: 14 }}>Back to the home page</a>
      </div>
    </main>
  )
}
