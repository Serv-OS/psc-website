import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/ui/JsonLd'
import { ALL_CITIES, type CityData } from '@/lib/cities'
import { getSiteSettings } from '@/lib/data'
import { resolveBiz, SITE_URL } from '@/lib/site'
import { breadcrumbLd, generalContractorLd } from '@/lib/jsonld'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Siding Contractor Service Areas | SF Peninsula & Bay Area',
  description:
    'Peninsula Siding Company serves 25+ Bay Area cities — San Mateo, Burlingame, Redwood City, Palo Alto, Half Moon Bay & more. James Hardie® siding installation, repair & replacement.',
  alternates: { canonical: '/service-areas' },
}

/** Geographic grouping so the 25 cities read as a coverage map, not a wall of links. */
const REGIONS: { name: string; tag: string; blurb: string; slugs: string[] }[] = [
  {
    name: 'Mid-Peninsula',
    tag: 'San Mateo County · Bayside',
    blurb: 'Our home turf — from Daly City down through San Mateo, Burlingame and Redwood City to Menlo Park.',
    slugs: [
      'san-mateo', 'burlingame', 'millbrae', 'hillsborough', 'san-bruno', 'belmont', 'redwood-city',
      'atherton', 'menlo-park', 'woodside', 'portola-valley', 'emerald-hills', 'colma', 'brisbane', 'daly-city',
    ],
  },
  {
    name: 'Coastside',
    tag: 'San Mateo County · Pacific Coast',
    blurb: 'Salt-air-tough fiber cement and cedar exteriors for the coast, from Pacifica to Half Moon Bay.',
    slugs: ['pacifica', 'montara', 'moss-beach', 'el-granada', 'half-moon-bay'],
  },
  {
    name: 'South Bay',
    tag: 'Santa Clara County',
    blurb: 'Premium James Hardie® and cedar siding across the Peninsula’s southern cities.',
    slugs: ['palo-alto', 'los-altos', 'mountain-view', 'sunnyvale', 'santa-clara'],
  },
]

const BY_SLUG: Record<string, CityData> = Object.fromEntries(ALL_CITIES.map((c) => [c.slug, c]))

const STATS = [
  { num: `${ALL_CITIES.length}+`, label: 'Cities served' },
  { num: '2', label: 'Counties covered' },
  { num: '2012', label: 'Serving since' },
  { num: 'Elite', label: 'James Hardie® Preferred' },
]

function PinIcon({ color = '#206a38' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flex: '0 0 auto' }}>
      <path
        d="M12 2c-3.87 0-7 3.13-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
        fill={color}
      />
    </svg>
  )
}

function CityCard({ c }: { c: CityData }) {
  return (
    <Link
      href={`/siding-${c.slug}`}
      className="lift"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        border: '1px solid var(--border)',
        borderTop: '3px solid var(--green)',
        borderRadius: 16,
        padding: '18px 20px',
        background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <PinIcon />
        <span style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--ink)' }}>{c.name}</span>
      </div>
      {c.neighborhoods?.length ? (
        <div style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.55 }}>
          {c.neighborhoods.slice(0, 3).join(' · ')}
        </div>
      ) : null}
      <div style={{ marginTop: 'auto', paddingTop: 8, fontSize: '13.5px', fontWeight: 600, color: 'var(--green)' }}>
        View {c.name} siding →
      </div>
    </Link>
  )
}

export default async function ServiceAreasPage() {
  const settings = await getSiteSettings()
  const biz = resolveBiz(settings)

  // Defensive: surface any city not assigned to a region so none are ever dropped.
  const assigned = new Set(REGIONS.flatMap((r) => r.slugs))
  const extras = ALL_CITIES.filter((c) => !assigned.has(c.slug))
  const regions = extras.length
    ? [...REGIONS, { name: 'More Bay Area cities', tag: '', blurb: '', slugs: extras.map((c) => c.slug) }]
    : REGIONS

  return (
    <>
      <JsonLd
        data={[
          generalContractorLd(biz, { url: `${SITE_URL}/service-areas`, areaServed: ALL_CITIES.map((c) => c.name) }),
          breadcrumbLd([
            { name: 'Home', url: '/' },
            { name: 'Service Areas', url: '/service-areas' },
          ]),
        ]}
      />

      {/* HERO — dark, premium, with a stat band */}
      <section
        style={{
          position: 'relative',
          background:
            'radial-gradient(1100px 480px at 50% -10%, #1c5a32 0%, transparent 60%), linear-gradient(180deg,#0e341d 0%,#091c12 100%)',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ padding: '76px 24px 64px', maxWidth: 960, textAlign: 'center', position: 'relative' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,.07)',
              border: '1px solid rgba(255,255,255,.16)',
              color: '#cde7d3',
              fontSize: '12.5px',
              fontWeight: 600,
              padding: '7px 15px',
              borderRadius: 999,
              marginBottom: 22,
              letterSpacing: '.4px',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 0 3px rgba(0,196,10,.25)' }} />
            SERVING THE SF PENINSULA &amp; BAY AREA
          </div>
          <h1 style={{ fontSize: 'clamp(32px,4.4vw,52px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-1.4px', color: '#fff' }}>
            Your local siding contractor,
            <br />
            right across the Bay Area
          </h1>
          <p style={{ marginTop: 18, fontSize: '17px', lineHeight: 1.65, color: '#bcd9c2', maxWidth: 680, margin: '18px auto 0' }}>
            From San Mateo to the coast and down into the South Bay, we install, replace and repair James Hardie® fiber
            cement and cedar siding for homeowners in {ALL_CITIES.length}+ communities. Find your city below — or get an
            instant estimate in 60 seconds.
          </p>
          <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <Link href="/instant-quote" className="btn btn-light" style={{ fontSize: '15.5px', padding: '15px 28px' }}>
              Get my instant estimate
            </Link>
            <a
              href={biz.phoneHref}
              className="btn"
              style={{ fontSize: '15.5px', padding: '15px 28px', background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,.35)' }}
            >
              Call {biz.phone}
            </a>
          </div>

          {/* STAT BAND */}
          <div className="cols-4" style={{ marginTop: 44, gap: 14 }}>
            {STATS.map((s) => (
              <div
                key={s.label}
                style={{
                  background: 'rgba(255,255,255,.05)',
                  border: '1px solid rgba(255,255,255,.12)',
                  borderRadius: 16,
                  padding: '20px 14px',
                }}
              >
                <div style={{ fontSize: 'clamp(24px,3vw,32px)', fontWeight: 800, color: '#fff', letterSpacing: '-.6px' }}>{s.num}</div>
                <div style={{ fontSize: '12.5px', color: '#9cc2a6', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGION SECTIONS */}
      {regions.map((region, i) => {
        const cities = region.slugs.map((s) => BY_SLUG[s]).filter(Boolean) as CityData[]
        if (!cities.length) return null
        return (
          <section key={region.name} style={{ background: i % 2 === 0 ? '#fff' : 'var(--soft-2)' }}>
            <div className="container" style={{ padding: '60px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px 14px', marginBottom: 6 }}>
                <h2 style={{ fontSize: 'clamp(22px,2.6vw,30px)', fontWeight: 800, letterSpacing: '-.7px', color: 'var(--ink)' }}>
                  {region.name}
                </h2>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green)', background: 'var(--green-soft)', padding: '4px 11px', borderRadius: 999 }}>
                  {cities.length} {cities.length === 1 ? 'city' : 'cities'}
                </span>
                {region.tag ? <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{region.tag}</span> : null}
              </div>
              {region.blurb ? (
                <p style={{ fontSize: '15px', color: 'var(--body)', lineHeight: 1.6, maxWidth: 620, marginBottom: 26 }}>{region.blurb}</p>
              ) : (
                <div style={{ height: 18 }} />
              )}
              <div className="cols-3">
                {cities.map((c) => (
                  <CityCard key={c.slug} c={c} />
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* CLOSING CTA */}
      <section style={{ background: 'linear-gradient(180deg,#0e341d 0%,#091c12 100%)' }}>
        <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px,2.8vw,34px)', fontWeight: 800, color: '#fff', letterSpacing: '-.6px' }}>
            Don&apos;t see your town? We probably cover it.
          </h2>
          <p style={{ fontSize: 16, color: '#bcd9c2', marginTop: 12, maxWidth: 600, margin: '12px auto 0', lineHeight: 1.6 }}>
            We work throughout San Mateo and Santa Clara counties. Reach out and we&apos;ll confirm your area and get you a free quote.
          </p>
          <div style={{ marginTop: 26, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <Link href="/contact-us" className="btn btn-light" style={{ fontSize: '15.5px', padding: '15px 28px' }}>Contact us</Link>
            <Link
              href="/instant-quote"
              className="btn"
              style={{ fontSize: '15.5px', padding: '15px 28px', background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,.35)' }}
            >
              Get a free quote
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
