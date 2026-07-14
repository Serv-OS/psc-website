'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'

// Compliant SMS opt-in for A2P 10DLC. Rendered at every point where a customer
// enters a phone number. Requirements it satisfies:
//  • unchecked by default (active consent), and NOT a condition of purchase;
//  • full CTIA disclosure — program, frequency, rates, STOP/HELP;
//  • links to the Privacy Policy and Terms next to the checkbox.
export function SmsConsent({
  checked,
  onChange,
  accent = '#206a38',
}: {
  checked: boolean
  onChange: (v: boolean) => void
  accent?: string
}) {
  const wrap: CSSProperties = { display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 14 }
  const box: CSSProperties = { width: 17, height: 17, marginTop: 2, flexShrink: 0, accentColor: accent, cursor: 'pointer' }
  const txt: CSSProperties = { fontSize: '11.5px', color: '#6a766d', lineHeight: 1.55 }
  const lnk: CSSProperties = { color: accent, fontWeight: 600, textDecoration: 'underline' }
  return (
    <label style={wrap}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={box} />
      <span style={txt}>
        I agree to receive SMS text messages from Peninsula Siding Company about my quote, appointment,
        and project updates at the phone number provided. Consent is not a condition of purchase.
        Message frequency varies. Message &amp; data rates may apply. Reply STOP to opt out, HELP for help.
        See our{' '}
        <Link href="/privacy" style={lnk}>Privacy Policy</Link> and{' '}
        <Link href="/terms" style={lnk}>Terms</Link>.
      </span>
    </label>
  )
}
