'use client'

import { useState } from 'react'

export type FAQItem = { q: string; a: string }

/** Accordion FAQ (Design Inspirations + Quality Pricing). */
export function FAQ({ items, soft = false }: { items: FAQItem[]; soft?: boolean }) {
  const [open, setOpen] = useState(-1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            background: soft ? '#fbfcfa' : '#fff',
            border: '1px solid #e7ece7',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              padding: '20px 22px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: '#16261c' }}>{item.q}</span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#206a38',
                flex: '0 0 auto',
                width: 24,
                textAlign: 'center',
              }}
            >
              {open === i ? '–' : '+'}
            </span>
          </button>
          {open === i && (
            <div style={{ padding: '0 22px 22px', fontSize: 14.5, lineHeight: 1.7, color: '#46544a' }}>
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
