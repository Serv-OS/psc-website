import Link from 'next/link'
import type { Metadata } from 'next'

import { JsonLd } from '@/components/ui/JsonLd'
import { MediaImage } from '@/components/ui/MediaImage'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FireTest } from '@/components/benefits/FireTest'
import { getPage, imageSlot } from '@/lib/data'
import { breadcrumbLd } from '@/lib/jsonld'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('benefits')
  return {
    title: page?.seo?.metaTitle || 'Benefits of New Siding | Fire-Resistant, Durable & Built for NorCal',
    description:
      page?.seo?.metaDescription ||
      'Why Bay Area homeowners choose Peninsula Siding — expert in-house installation, James Hardie® & LP® SmartSide® materials, Class 1A fire-rated options, and NorCal-rated durability.',
    alternates: { canonical: '/benefits' },
  }
}

const pillars = [
  { icon: '✎', t: 'Expert Design & Consultation', items: ['Visualize your finished exterior before work begins', 'In-house installation team — no subcontractors', 'Custom colors, styles, and accent guidance', '3D exterior renderings available'] },
  { icon: '☶', t: 'Premium Materials & Installation', items: ['James Hardie® and LP® SmartSide® authorized installer', 'Class 1A fire-rated product options', 'Energy-efficient insulation upgrades available', 'Backed by strong manufacturer warranties'] },
  { icon: '☀', t: 'Built for Northern California', items: ['Fade-resistant finishes rated for NorCal sun & heat', 'Pest and moisture protection built in', 'Wildfire defense upgrade options', 'Proven to increase home resale value'] },
]

const trust = [
  ['Elite Preferred', 'James Hardie® installer'],
  ['LP® SmartSide®', 'Authorized installer'],
  ['Class 1A', 'Fire-rated options'],
  ['5-Year', 'Workmanship warranty'],
]

export default async function BenefitsPage() {
  const page = await getPage('benefits')

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Home', url: '/' }, { name: 'Benefits', url: '/benefits' }])} />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(180deg,#fbfcfa 0%,#eef4ee 100%)' }}>
        <div className="container" style={{ padding: '30px 24px 0' }}>
          <div style={{ fontSize: 13, color: '#6a766d', fontWeight: 500 }}>
            <Link href="/" style={{ color: '#6a766d' }}>Home</Link> <span style={{ margin: '0 6px', color: '#b8c4ba' }}>/</span> <span style={{ color: '#206a38', fontWeight: 600 }}>Benefits</span>
          </div>
        </div>
        <div className="split container" style={{ padding: '40px 24px 64px', gridTemplateColumns: '1.05fr .95fr', gap: 50 }}>
          <div style={{ animation: 'psc-fade .6s ease both' }}>
            <h1 style={{ fontSize: 'clamp(32px,4.2vw,54px)', fontWeight: 800, letterSpacing: '-1.4px', lineHeight: 1.05, color: '#16261c' }}>
              Your home, protected<br />&amp; transformed <span style={{ color: '#206a38' }}>to last.</span>
            </h1>
            <p style={{ marginTop: 20, fontSize: 17, lineHeight: 1.65, color: '#46544a', maxWidth: 520 }}>
              Bay Area homeowners trust Peninsula Siding Company for expert installation, premium materials, and results built to stand up to Northern California for decades.
            </p>
            <div style={{ marginTop: 30, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <Link href="/gallery" className="btn btn-primary" style={{ fontSize: '15.5px', padding: '15px 28px' }}>See our work</Link>
              <Link href="/contact-us" className="btn btn-ghost" style={{ fontSize: '15.5px', padding: '15px 28px' }}>Get a free consultation</Link>
            </div>
          </div>
          <MediaImage media={imageSlot(page, 'hero')} label="finished protected home exterior" style={{ aspectRatio: '4/3.2', borderRadius: 20, boxShadow: '0 24px 56px rgba(14,52,29,.18)' }} placeholderStyle={{ background: 'repeating-linear-gradient(0deg,#dde7dd 0 22px,#e7ede7 22px 25px)' }} sizes="(max-width: 900px) 100vw, 500px" priority />
        </div>
      </section>

      {/* PILLARS */}
      <section style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="Why it pays off" title="Three ways new siding works harder for you" maxWidth={720} />
          <div className="cols-3">
            {pillars.map((p) => (
              <div key={p.t} style={{ background: '#fbfcfa', border: '1px solid #e7ece7', borderRadius: 20, padding: 30 }}>
                <div style={{ width: 50, height: 50, borderRadius: 13, background: '#e7f1e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#206a38', marginBottom: 18 }}>{p.icon}</div>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: '#16261c' }}>{p.t}</h3>
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {p.items.map((it) => (
                    <div key={it} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', fontSize: '14.5px', color: '#3a4a40', lineHeight: 1.5 }}>
                      <span style={{ color: '#206a38', fontWeight: 800, flex: '0 0 auto' }}>✓</span>{it}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{ background: '#f4f6f3' }}>
        <div className="container" style={{ padding: '48px 24px' }}>
          <div className="cols-4">
            {trust.map(([t, d]) => (
              <div key={t} style={{ background: '#fff', border: '1px solid #e7ece7', borderRadius: 14, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#16261c' }}>{t}</div>
                <div style={{ fontSize: '12.5px', color: '#6a766d', marginTop: 4 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FIRE DEMONSTRATION */}
      <section style={{ background: 'radial-gradient(120% 130% at 85% 0%,#224631 0%,#0e341d 62%,#091c12 100%)', color: '#eaf3ec', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,rgba(255,255,255,.03) 0 1px,transparent 1px 26px)' }} />
        <div className="split container" style={{ position: 'relative', padding: '84px 24px', gap: 48 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '1.5px', color: '#7fd28d', textTransform: 'uppercase' }}>Real-world fire test</div>
            <h2 style={{ fontSize: 'clamp(26px,3.2vw,40px)', fontWeight: 800, letterSpacing: '-1px', marginTop: 14, lineHeight: 1.1, color: '#fff' }}>Fire-resistant siding, demonstrated</h2>
            <p style={{ marginTop: 16, fontSize: 16, lineHeight: 1.7, color: '#bcd2bf', maxWidth: 480 }}>
              In a real fire test, exterior materials are exposed to direct flame and extreme heat. Traditional materials ignite — while fiber cement siding stays stable and does not catch. See the difference for yourself.
            </p>
            <FireTest />
          </div>
          <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '16/11', background: 'linear-gradient(160deg,#2a2320,#171311)', boxShadow: '0 24px 56px rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '42%', background: 'linear-gradient(0deg,rgba(214,90,30,.55),transparent)' }} />
            <div style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ width: 14, height: 46, borderRadius: '50% 50% 50% 50%/60% 60% 40% 40%', background: 'linear-gradient(0deg,#f5a623,#d65a1e)', animation: 'psc-flick 1.1s ease-in-out infinite' }} />
              <div style={{ width: 18, height: 64, borderRadius: '50% 50% 50% 50%/60% 60% 40% 40%', background: 'linear-gradient(0deg,#f5c542,#e8731c)', animation: 'psc-flick .85s ease-in-out infinite' }} />
              <div style={{ width: 14, height: 50, borderRadius: '50% 50% 50% 50%/60% 60% 40% 40%', background: 'linear-gradient(0deg,#f5a623,#d65a1e)', animation: 'psc-flick 1.25s ease-in-out infinite' }} />
            </div>
            <div style={{ position: 'relative', zIndex: 2, width: 62, height: 62, borderRadius: '50%', background: 'rgba(255,255,255,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,.4)' }}>
              <span style={{ fontSize: 22, color: '#206a38', marginLeft: 4 }}>▶</span>
            </div>
            <span style={{ position: 'absolute', top: 14, left: 14, fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#e8e8e2', background: 'rgba(0,0,0,.45)', padding: '5px 10px', borderRadius: 6, zIndex: 3 }}>[ fire-test video ]</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px' }}>
          <div style={{ background: 'linear-gradient(135deg,#206a38,#0e341d)', borderRadius: 22, padding: 48, textAlign: 'center', color: '#fff' }}>
            <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 800, letterSpacing: '-.8px' }}>Protect and transform your home</h2>
            <p style={{ maxWidth: 560, margin: '14px auto 0', fontSize: 16, color: '#bcd9c2', lineHeight: 1.6 }}>
              Get a free consultation and a detailed quote — and see how the right siding pays you back in protection, efficiency, and resale value.
            </p>
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 14 }}>
              <Link href="/#quote" className="btn btn-light" style={{ fontSize: 16, padding: '16px 30px', borderRadius: 13 }}>Build my instant quote &rarr;</Link>
              <Link href="/contact-us" className="btn" style={{ fontSize: 16, padding: '16px 30px', borderRadius: 13, background: 'rgba(255,255,255,.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,.3)' }}>Get a free consultation</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
