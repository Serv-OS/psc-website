import Link from 'next/link'

import { ALL_CITIES } from '@/lib/cities'

/** City chip-cloud + a link to the full Service Areas page. Rendered inside a
 * builder block that supplies the section header (eyebrow/title/copy). */
export function AreasWeServe({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 9, maxWidth: 920, margin: '0 auto' }}>
        {ALL_CITIES.map((c) => (
          <Link
            key={c.slug}
            href={`/siding-${c.slug}`}
            className="lift"
            style={{
              fontSize: '13.5px',
              fontWeight: 600,
              padding: '8px 14px',
              borderRadius: 999,
              background: dark ? 'rgba(255,255,255,.08)' : '#fff',
              color: dark ? '#eaf4ec' : 'var(--ink)',
              border: dark ? '1px solid rgba(255,255,255,.18)' : '1px solid var(--border)',
            }}
          >
            {c.name}
          </Link>
        ))}
      </div>
      <Link
        href="/service-areas"
        className="btn btn-primary"
        style={{ display: 'inline-block', marginTop: 30, fontSize: '15px', padding: '14px 26px' }}
      >
        View all {ALL_CITIES.length} service areas →
      </Link>
    </div>
  )
}
