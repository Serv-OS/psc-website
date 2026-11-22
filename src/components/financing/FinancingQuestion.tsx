'use client'

import { FIN, type FinancingAnswer } from '@/lib/financing'

const OPTIONS: { key: Exclude<FinancingAnswer, ''>; label: string }[] = [
  { key: 'yes', label: 'Yes, please' },
  { key: 'maybe', label: 'Maybe' },
  { key: 'no', label: 'No thanks' },
]

/** "Interested in financing?" on every quote and contact form. Optional. */
export function FinancingQuestion({ value, onChange }: { value: FinancingAnswer; onChange: (v: FinancingAnswer) => void }) {
  return (
    <div style={{ background: '#f3f8f4', border: '1px solid #dbe8dd', borderRadius: 12, padding: '12px 14px' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#16261c' }}>Interested in financing?</div>
      <div style={{ fontSize: 12, color: '#56635a', marginTop: 2, lineHeight: 1.45 }}>
        Monthly payments with rates from {FIN.lowestApr}% APR. Checking your rate won&apos;t affect your credit score.
      </div>
      <div role="radiogroup" aria-label="Interested in financing?" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
        {OPTIONS.map((o) => {
          const on = value === o.key
          return (
            <button
              key={o.key}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(on ? '' : o.key)}
              style={{
                cursor: 'pointer', padding: '8px 14px', borderRadius: 999, fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit',
                background: on ? '#206a38' : '#fff', color: on ? '#fff' : '#3a4a40', border: on ? '2px solid #206a38' : '2px solid #dfe6df',
              }}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
