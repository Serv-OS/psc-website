import Link from 'next/link'
import type { Metadata } from 'next'

import { BeforeAfter } from '@/components/ui/BeforeAfter'
import { JsonLd } from '@/components/ui/JsonLd'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { MaterialTabs } from '@/components/about/MaterialTabs'
import { PuckRender } from '@/builder/PuckRender'
import { builtLayout, getFeaturedGallery, getPage, getSiteSettings } from '@/lib/data'

// Render at request time so builder edits + gallery reflect the DB reliably
// (a throttled build-time query would otherwise bake stale/default content).
export const dynamic = 'force-dynamic'
import { breadcrumbLd, generalContractorLd } from '@/lib/jsonld'
import { resolveBiz } from '@/lib/site'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('about-us')
  return {
    title: page?.seo?.metaTitle || 'About Peninsula Siding Company | San Mateo & Bay Area Siding Experts',
    description:
      page?.seo?.metaDescription ||
      "San Mateo's Elite Preferred James Hardie® siding contractor since 2012 — part of SEA Construction (est. 1989). Bay Area fiber cement & cedar siding experts.",
    alternates: { canonical: '/about-us' },
  }
}

const stat = (value: string, label: string, big = true): { value: string; label: string; big: boolean } => ({ value, label, big })
const stats = [
  stat('35+', 'Years building Bay Area exteriors'),
  stat('2012', 'Siding division founded'),
  stat('Elite Preferred', 'James Hardie® installer', false),
  stat('5.0★', 'Yelp, Google & Houzz'),
]

const whyUs = [
  { icon: '30+', t: 'Experienced Professionals', d: 'Over three decades handling projects of every size, from single homes to large renovations.' },
  { icon: '★', t: 'Top-Quality Materials', d: 'Partnered with James Hardie®, Cedar Valley, and Shakertown® for premium, lasting results.' },
  { icon: '◆', t: 'Custom Solutions', d: 'A personalized consultation tailors every project to your style, budget, and vision.' },
  { icon: '✓', t: 'Attention to Detail', d: 'From precise measurements to flawless installation — accuracy and quality, every time.' },
  { icon: '⚮', t: 'Licensed & Insured', d: 'A fully licensed, bonded, and insured Bay Area contractor — accountability on every project.' },
]

const servicesList = [
  { n: '01', title: 'Siding Installation', body: "Transform your home's appearance and durability with an extensive selection of fiber cement, wood, and more — installed with precise, high-quality craftsmanship." },
  { n: '02', title: 'Siding Replacement', body: 'Outdated or damaged siding replaced for a fresh, modern look — we help you select the perfect materials and deliver a flawless, long-lasting result.' },
  { n: '03', title: 'Siding Repair', body: 'Full-wall repairs from corner to corner and dirt to roof, blending seamlessly with your exterior. (We do not offer patchwork or a few-board repairs.)' },
]

export default async function AboutPage() {
  const [page, settings, featured] = await Promise.all([getPage('about-us'), getSiteSettings(), getFeaturedGallery()])
  const layout = builtLayout(page)
  if (layout) return <PuckRender data={layout} />
  const biz = resolveBiz(settings)
  const feature = featured[0]

  return (
    <>
      <JsonLd data={[generalContractorLd(biz, { url: `${''}/about-us` }), breadcrumbLd([{ name: 'Home', url: '/' }, { name: 'About', url: '/about-us' }])]} />

      {/* HERO */}
      <section style={{ position: 'relative', background: 'radial-gradient(120% 120% at 80% 0%,#224631 0%,#0e341d 60%,#091c12 100%)', color: '#eaf3ec', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,rgba(255,255,255,.03) 0 1px,transparent 1px 26px)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', maxWidth: 1100, padding: '84px 24px 72px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', color: '#bfe0c6', fontSize: '12.5px', fontWeight: 600, padding: '8px 16px', borderRadius: 999, letterSpacing: '.4px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d058' }} />EST. 2012 &middot; A DIVISION OF SEA CONSTRUCTION (1989)
          </div>
          <h1 style={{ fontSize: 'clamp(36px,5.2vw,62px)', fontWeight: 800, letterSpacing: '-1.6px', lineHeight: 1.04, marginTop: 22, color: '#fff' }}>
            {page?.hero?.heading || 'Bay Area siding, done the right way.'}
          </h1>
          <p style={{ maxWidth: 660, margin: '22px auto 0', fontSize: 18, lineHeight: 1.65, color: '#bdd4c2' }}>
            {page?.hero?.subheading ||
              'We specialize in premium exterior siding that protects your home, elevates curb appeal, and delivers long-term value — backed by decades of construction expertise and a focused commitment to siding excellence.'}
          </p>
          <div className="cols-4" style={{ marginTop: 40, gap: 16 }}>
            {stats.map((s) => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, padding: '22px 16px' }}>
                <div style={{ fontSize: s.big ? 34 : 21, fontWeight: 800, color: '#fff', letterSpacing: s.big ? '-1px' : '-.4px', marginTop: s.big ? 0 : 6 }}>{s.value}</div>
                <div style={{ fontSize: '12.5px', color: '#9fc2a6', marginTop: s.big ? 4 : 6, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY + MISSION */}
      <section style={{ background: '#fff' }}>
        <div className="split container" style={{ padding: '84px 24px', gap: 56, alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '1.5px', color: '#206a38', textTransform: 'uppercase' }}>Our story</div>
            <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, letterSpacing: '-1px', marginTop: 12, color: '#16261c' }}>A specialist born from decades of craftsmanship</h2>
            <p style={{ marginTop: 18, fontSize: 16, lineHeight: 1.7, color: '#46544a' }}>
              Peninsula Siding Company was founded in 2012 as the dedicated exterior division of SEA Construction, Inc. — a full-service design and remodeling firm established in 1989. After decades of building and renovating homes across the Bay Area, we recognized the need for a siding specialist focused purely on quality exterior solutions.
            </p>
            <p style={{ marginTop: 14, fontSize: 16, lineHeight: 1.7, color: '#46544a' }}>
              Today we&apos;re a trusted local contractor and an Elite Preferred installer of James Hardie® products, proudly serving homeowners throughout San Mateo, Redwood City, Palo Alto, and the greater Bay Area — continuing a legacy built on craftsmanship, integrity, and long-term performance.
            </p>
          </div>
          <div style={{ background: '#f4f6f3', border: '1px solid #e7ece7', borderRadius: 20, padding: 34 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '1.5px', color: '#206a38', textTransform: 'uppercase' }}>Our mission</div>
            <p style={{ marginTop: 16, fontSize: 17, lineHeight: 1.6, color: '#22312a', fontWeight: 500 }}>
              To help homeowners protect and elevate their homes through high-quality siding solutions delivered with honesty, craftsmanship, and care.
            </p>
            <div style={{ height: 1, background: '#e1e8e1', margin: '24px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Industry-leading materials, including James Hardie® products', 'Expert installation engineered to last for decades', 'A stress-free, transparent experience — every home treated like our own'].map((t) => (
                <div key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ color: '#206a38', fontSize: 18, lineHeight: 1, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: '14.5px', color: '#3a4a40', lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section style={{ background: '#0e341d', color: '#eaf2ea' }}>
        <div className="split container" style={{ padding: '80px 24px', gridTemplateColumns: '.9fr 1.1fr', gap: 56 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '1.5px', color: '#7fd28d', textTransform: 'uppercase' }}>See it happen</div>
            <h2 style={{ fontSize: 'clamp(26px,3.2vw,40px)', fontWeight: 800, letterSpacing: '-1px', marginTop: 14, lineHeight: 1.08 }}>Old siding to<br />new exterior.</h2>
            <p style={{ marginTop: 18, fontSize: 16, lineHeight: 1.65, color: '#bcd2bf', maxWidth: 420 }}>
              Drag the handle to see how we transform outdated exteriors into beautiful, durable, energy-efficient homes built for Bay Area living — and yours could be next.
            </p>
            <Link href="/instant-quote" className="btn btn-primary" style={{ marginTop: 28, fontSize: 15, padding: '14px 26px' }}>Get a free siding estimate</Link>
          </div>
          <BeforeAfter before={feature?.beforeImage} after={feature?.afterImage} aspect="16/11" />
        </div>
      </section>

      {/* MATERIALS */}
      <section style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="Premium materials" title="The best siding brands, expertly installed" copy="We partner with trusted manufacturers to deliver exteriors that stand up to Bay Area weather and add lasting value." maxWidth={720} marginBottom={40} />
          <MaterialTabs />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ background: '#f4f6f3' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="Why choose us" title="What sets Peninsula Siding apart in San Mateo" maxWidth={720} />
          <div className="cols-3">
            {whyUs.map((w) => (
              <div key={w.t} style={{ background: '#fff', border: '1px solid #e7ece7', borderRadius: 18, padding: 26 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: '#e7f1e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: w.icon.length > 2 ? 20 : 22, color: '#206a38', marginBottom: 16, fontWeight: 800 }}>{w.icon}</div>
                <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#16261c' }}>{w.t}</h3>
                <p style={{ fontSize: '13.5px', color: '#5b675e', marginTop: 8, lineHeight: 1.55 }}>{w.d}</p>
              </div>
            ))}
            <div style={{ background: 'linear-gradient(135deg,#206a38,#0e341d)', borderRadius: 18, padding: 26, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.3 }}>Backed by a 5-year workmanship warranty</h3>
              <p style={{ fontSize: '13.5px', color: '#bcd9c2', marginTop: 8, lineHeight: 1.55 }}>Plus full manufacturer warranties — lasting confidence in every exterior we build.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="Our siding services" title="Installation, replacement & full-wall repair" maxWidth={720} />
          <div className="cols-3">
            {servicesList.map((s) => (
              <div key={s.n} style={{ border: '1px solid #e7ece7', borderRadius: 18, padding: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#206a38' }}>{s.n}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#16261c', marginTop: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#5b675e', marginTop: 10, lineHeight: 1.6 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#206a38,#0e341d)' }}>
        <div className="container" style={{ padding: '60px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <h2 style={{ fontSize: 'clamp(24px,2.8vw,34px)', fontWeight: 800, color: '#fff', letterSpacing: '-.6px' }}>Let&apos;s protect and elevate your home.</h2>
            <p style={{ fontSize: 16, color: '#bcd9c2', marginTop: 8 }}>Build your quote in 60 seconds — we&apos;ll beat any like-for-like quote by 10%.</p>
          </div>
          <Link href="/instant-quote" className="btn btn-light" style={{ fontSize: 16, padding: '16px 30px', borderRadius: 13 }}>Start my free quote &rarr;</Link>
        </div>
      </section>
    </>
  )
}
