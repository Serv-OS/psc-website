import type { ReactNode, HTMLAttributes } from 'react'

/** Shared styling for static legal pages (Terms, Privacy). Renders inside the
 *  (frontend) layout, so the site Header/Footer wrap it automatically. Used as
 *  the fallback when the page has no builder (Puck) layout yet. */
export function LegalDoc({
  title,
  updated,
  children,
}: {
  title: string
  updated?: string
  children: ReactNode
}) {
  return (
    <main style={{ background: '#fff' }}>
      <div
        className="container"
        style={{ maxWidth: 860, margin: '0 auto', padding: '72px 24px 96px' }}
      >
        <h1
          style={{
            fontSize: 'clamp(30px,4vw,44px)',
            fontWeight: 800,
            letterSpacing: '-1px',
            color: '#0e341d',
            margin: '0 0 6px',
          }}
        >
          {title}
        </h1>
        {updated && (
          <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 30px' }}>
            Last updated: {updated}
          </p>
        )}
        <div style={{ color: '#27303a', fontSize: 16, lineHeight: 1.7 }}>{children}</div>
      </div>
    </main>
  )
}

export const H2 = (p: HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    style={{ fontSize: 20, fontWeight: 700, color: '#0e341d', margin: '32px 0 10px' }}
    {...p}
  />
)

export const P = (p: HTMLAttributes<HTMLParagraphElement>) => (
  <p style={{ margin: '0 0 14px' }} {...p} />
)

export const UL = (p: HTMLAttributes<HTMLUListElement>) => (
  <ul style={{ margin: '0 0 14px', paddingLeft: 22, listStyle: 'disc' }} {...p} />
)
