import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/ui/JsonLd'
import { ALL_CITIES } from '@/lib/cities'
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

export default async function ServiceAreasPage() {
  const settings = await getSiteSettings()
  const biz = resolveBiz(settings)

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

      {/* HERO */}
      <section style={{ background: 'linear-gradient(180deg,#fbfcfa 0%,#f1f5f0 100%)' }}>
        <div className="container" style={{ padding: '64px 24px 40px', maxWidth: 880, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e7f1e8', color: '#1c5530', fontSize: '12.5px', fontWeight: 600, padding: '7px 14px', borderRadius: 999, marginBottom: 20, letterSpacing: '.3px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c40a' }} />
            SERVING THE SF PENINSULA &amp; BAY AREA
          </div>
          <h1 style={{ fontSize: 'clamp(30px,4vw,48px)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-1.2px', color: '#16261c' }}>
            Your local siding contractor across the Bay Area
          </h1>
          <p style={{ marginTop: 18, fontSize: '17px', lineHeight: 1.65, color: '#46544a' }}>
            From San Mateo to the coast and down into the South Bay, Peninsula Siding Company installs, replaces and repairs
            James Hardie® fiber cement and cedar siding for homeowners in {ALL_CITIES.length}+ communities. Find your city below for
            local know-how — or get an instant estimate in 60 seconds.
          </p>
          <div style={{ marginTop: 26, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <Link href="/#quote" className="btn btn-primary" style={{ fontSize: '15.5px', padding: '15px 28px' }}>Get my instant estimate</Link>
            <a href={biz.phoneHref} className="btn btn-ghost" style={{ fontSize: '15.5px', padding: '15px 28px' }}>Call {biz.phone}</a>
          </div>
        </div>
      </section>

      {/* CITY GRID */}
      <section>
        <div className="container" style={{ padding: '40px 24px 72px' }}>
          <h2 style={{ fontSize: 'clamp(22px,2.6vw,30px)', fontWeight: 800, letterSpacing: '-.6px', color: '#16261c', marginBottom: 22 }}>
            Cities we serve
          </h2>
          <div className="cols-3">
            {ALL_CITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/siding-${c.slug}`}
                className="lift"
                style={{ display: 'block', border: '1px solid #e7ece7', borderRadius: 16, padding: '18px 20px', background: '#fbfcfa' }}
              >
                <div style={{ fontSize: '16.5px', fontWeight: 700, color: '#16261c' }}>Siding in {c.name}</div>
                <div style={{ fontSize: '13px', color: '#5b675e', marginTop: 6, lineHeight: 1.5 }}>
                  {c.neighborhoods.slice(0, 3).join(' · ')}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#206a38', marginTop: 10 }}>View {c.name} siding →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0e341d' }}>
        <div className="container" style={{ padding: '56px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px,2.8vw,34px)', fontWeight: 800, color: '#fff', letterSpacing: '-.6px' }}>
            Don&apos;t see your town? We probably cover it.
          </h2>
          <p style={{ fontSize: 16, color: '#bcd9c2', marginTop: 10, maxWidth: 600, margin: '10px auto 0' }}>
            We work throughout San Mateo and Santa Clara counties. Reach out and we&apos;ll confirm your area and get you a free quote.
          </p>
          <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <Link href="/contact-us" className="btn btn-light" style={{ fontSize: '15.5px', padding: '15px 28px' }}>Contact us</Link>
            <Link href="/#quote" className="btn btn-ghost" style={{ fontSize: '15.5px', padding: '15px 28px' }}>Get a free quote</Link>
          </div>
        </div>
      </section>
    </>
  )
}
