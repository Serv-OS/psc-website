import type { ReactNode } from 'react'

/** Eyebrow → bold H2 → optional copy. The recurring section header pattern. */
export function SectionHeader({
  eyebrow,
  title,
  copy,
  dark = false,
  maxWidth = 720,
  marginBottom = 48,
}: {
  eyebrow: string
  title: ReactNode
  copy?: ReactNode
  dark?: boolean
  maxWidth?: number
  marginBottom?: number
}) {
  return (
    <div style={{ maxWidth, margin: `0 auto ${marginBottom}px`, textAlign: 'center' }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '1.5px',
          color: dark ? '#7fd28d' : '#206a38',
          textTransform: 'uppercase',
        }}
      >
        {eyebrow}
      </div>
      <h2
        style={{
          fontSize: 'clamp(28px,3.4vw,40px)',
          fontWeight: 800,
          letterSpacing: '-1px',
          marginTop: 12,
          color: dark ? '#fff' : '#16261c',
        }}
      >
        {title}
      </h2>
      {copy ? (
        <p style={{ marginTop: 14, fontSize: 16, color: dark ? '#bcd2bf' : '#56635a', lineHeight: 1.6 }}>
          {copy}
        </p>
      ) : null}
    </div>
  )
}
