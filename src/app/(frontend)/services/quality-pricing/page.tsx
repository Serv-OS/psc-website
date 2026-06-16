import Link from 'next/link'
import type { Metadata } from 'next'

import { FAQ, type FAQItem } from '@/components/ui/FAQ'
import { JsonLd } from '@/components/ui/JsonLd'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EstimateSlider } from '@/components/pricing/EstimateSlider'
import { PuckRender } from '@/builder/PuckRender'
import { builtLayout, getPage, getSiteSettings } from '@/lib/data'
import { breadcrumbLd, faqPageLd } from '@/lib/jsonld'
import { DEFAULT_PRICING } from '@/lib/quote'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('quality-pricing')
  return {
    title: page?.seo?.metaTitle || 'Quality Pricing & Honest Siding Proposals | Bay Area | Peninsula Siding',
    description:
      page?.seo?.metaDescription ||
      'Transparent, itemized siding pricing with no hidden costs — and we beat any like-for-like quote by 10%. See how our free measurement & proposal process works.',
    alternates: { canonical: '/services/quality-pricing' },
  }
}

const included = [
  { t: 'Premium materials', d: 'James Hardie® fiber cement or natural cedar, your chosen profile and color.' },
  { t: 'Professional installation', d: 'In-house craftsmen, precise reveals, clean detailing.' },
  { t: 'Weather barriers & flashing', d: 'Proper moisture protection behind every board — never skipped.' },
  { t: 'Permits', d: 'We handle the paperwork with your local Bay Area building department.' },
  { t: 'Debris removal & cleanup', d: 'Old siding hauled away; your property left spotless.' },
  { t: 'Workmanship warranty', d: 'Our 5-year guarantee plus full manufacturer warranties.' },
]

const steps = [
  { n: 1, t: 'Book your visit', d: "Call or submit our form and we'll schedule a convenient time to come to your home." },
  { n: 2, t: 'Precise measurement', d: 'We measure accurately, review your existing siding’s condition, and discuss styles, colors and any window or door changes.' },
  { n: 3, t: 'Detailed proposal', d: 'We email a clear, itemized proposal — every potential cost outlined, plus the safety precautions we’ll take.' },
  { n: 4, t: 'Understand before you sign', d: "We walk you through products, process and warranties so you're fully confident in your investment." },
]

const faqs: FAQItem[] = [
  { q: 'Is my siding quote really free?', a: "Yes. We provide a free, no-obligation in-home measurement and a detailed written proposal by email. There's never any pressure or cost to find out where you stand." },
  { q: 'How accurate is the online instant estimate?', a: 'Our instant estimate gives a close ballpark range based on your home size, style and material. We confirm the exact price during a free on-site visit, where we take precise measurements and check the condition of your existing siding.' },
  { q: 'Do you really beat any like-for-like quote by 10%?', a: "Yes. Bring us a genuine, comparable written quote for the same scope and materials and we'll beat it by 10%. Our goal is the best value on the Peninsula without cutting corners." },
  { q: "What's included in the price — are there hidden costs?", a: "Every proposal is fully itemized: materials, professional installation, weather barriers and flashing, permits, debris removal and cleanup, and our workmanship warranty. You'll understand every line before you sign anything." },
  { q: "What if I don't actually need new siding?", a: "We'll tell you honestly. We never recommend siding you don't need — sometimes a fresh coat of paint is enough, and we're happy to refer you to a trusted Bay Area painter when that's the right call." },
]

export default async function QualityPricingPage() {
  const [page, settings] = await Promise.all([getPage('quality-pricing'), getSiteSettings()])
  const layout = builtLayout(page)
  if (layout) return <PuckRender data={layout} />
  const pricing = {
    ...DEFAULT_PRICING,
    markup: settings?.pricing?.markup ?? DEFAULT_PRICING.markup,
    rangeLow: settings?.pricing?.rangeLow ?? DEFAULT_PRICING.rangeLow,
    rangeHigh: settings?.pricing?.rangeHigh ?? DEFAULT_PRICING.rangeHigh,
    installMatPer1000PerStory: settings?.pricing?.installMatPer1000PerStory ?? DEFAULT_PRICING.installMatPer1000PerStory,
    permitsPerSqft: settings?.pricing?.permitsPerSqft ?? DEFAULT_PRICING.permitsPerSqft,
    debrisPerSqft: settings?.pricing?.debrisPerSqft ?? DEFAULT_PRICING.debrisPerSqft,
  }

  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: 'Home', url: '/' }, { name: 'Services', url: '/services' }, { name: 'Quality Pricing', url: '/services/quality-pricing' }]), faqPageLd(faqs)]} />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(180deg,#fbfcfa 0%,#eef4ee 100%)' }}>
        <div className="container" style={{ padding: '30px 24px 0' }}>
          <div style={{ fontSize: 13, color: '#6a766d', fontWeight: 500 }}>
            <Link href="/" style={{ color: '#6a766d' }}>Home</Link> <span style={{ margin: '0 6px', color: '#b8c4ba' }}>/</span> <Link href="/services" style={{ color: '#6a766d' }}>Services</Link> <span style={{ margin: '0 6px', color: '#b8c4ba' }}>/</span> <span style={{ color: '#206a38', fontWeight: 600 }}>Quality Pricing</span>
          </div>
        </div>
        <div className="split container" style={{ padding: '40px 24px 64px', gridTemplateColumns: '1.05fr .95fr', gap: 50 }}>
          <div style={{ animation: 'psc-fade .6s ease both' }}>
            <h1 style={{ fontSize: 'clamp(32px,4.2vw,52px)', fontWeight: 800, letterSpacing: '-1.4px', lineHeight: 1.06, color: '#16261c' }}>
              Honest pricing.<br />Detailed proposals.<br /><span style={{ color: '#206a38' }}>Zero hidden costs.</span>
            </h1>
            <p style={{ marginTop: 20, fontSize: 17, lineHeight: 1.65, color: '#46544a', maxWidth: 520 }}>
              Every proposal is built around your home&apos;s real needs and laid out line by line — so you know exactly what you&apos;re paying for, and why. And we&apos;ll beat any like-for-like quote by 10%.
            </p>
            <div style={{ marginTop: 30, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <Link href="#estimate" className="btn btn-primary" style={{ fontSize: '15.5px', padding: '15px 28px' }}>See how pricing works</Link>
              <Link href="/#quote" className="btn btn-ghost" style={{ fontSize: '15.5px', padding: '15px 28px' }}>Get my instant estimate</Link>
            </div>
          </div>
          <div style={{ animation: 'psc-fade .6s .1s ease both', background: 'linear-gradient(135deg,#206a38,#0e341d)', borderRadius: 22, padding: 34, color: '#fff', boxShadow: '0 24px 56px rgba(14,52,29,.22)' }}>
            <div style={{ fontSize: 54, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1 }}>10%</div>
            <div style={{ fontSize: 19, fontWeight: 700, marginTop: 8 }}>Our beat-any-quote promise</div>
            <p style={{ fontSize: '14.5px', color: '#bcd9c2', marginTop: 12, lineHeight: 1.6 }}>
              Found a genuine like-for-like written quote for the same scope and materials? We&apos;ll beat it by 10% — quality and value, never one or the other.
            </p>
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Free in-home measurement', 'Itemized written proposal', 'No pressure, no obligation'].map((t) => (
                <div key={t} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: '#eaf3ec' }}>
                  <span style={{ color: '#7fd28d', fontWeight: 800 }}>✓</span>{t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE ESTIMATE */}
      <section id="estimate" style={{ background: '#0e341d', color: '#eaf2ea' }}>
        <div className="container" style={{ padding: '80px 24px' }}>
          <SectionHeader eyebrow="Transparent by design" title="What goes into your price" copy="Slide to your approximate home size for a ballpark range — then see exactly what every proposal includes." dark maxWidth={720} marginBottom={44} />
          <div className="cols-2" style={{ gap: 24, alignItems: 'stretch' }}>
            <EstimateSlider pricing={pricing} />
            <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 20, padding: 30 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Every proposal includes</div>
              <div style={{ fontSize: 13, color: '#9fc2a6', marginBottom: 18 }}>No surprises, no hidden line items.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {included.map((inc) => (
                  <div key={inc.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: '#7fd28d', fontSize: 16, fontWeight: 800, flex: '0 0 auto', marginTop: 1 }}>✓</span>
                    <div>
                      <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#fff' }}>{inc.t}</div>
                      <div style={{ fontSize: '12.5px', color: '#9fc2a6', lineHeight: 1.45 }}>{inc.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROPOSAL PROCESS */}
      <section style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="Our measurement & proposal process" title="From first call to clear proposal" maxWidth={760} />
          <div className="cols-4">
            {steps.map((s) => (
              <div key={s.n} style={{ paddingTop: 18, borderTop: '3px solid #e7ece7' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', background: '#206a38', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>{s.n}</div>
                <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#16261c' }}>{s.t}</h3>
                <p style={{ fontSize: '13.5px', color: '#5b675e', marginTop: 8, lineHeight: 1.55 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HONEST ADVICE */}
      <section style={{ background: '#f4f6f3' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px' }}>
          <div className="split" style={{ gridTemplateColumns: 'auto 1fr', gap: 32, background: '#fff', border: '1px solid #e7ece7', borderRadius: 22, padding: 44 }}>
            <div style={{ width: 84, height: 84, borderRadius: 20, background: '#e7f1e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, color: '#206a38' }}>♥</div>
            <div>
              <h2 style={{ fontSize: 'clamp(22px,2.6vw,30px)', fontWeight: 800, letterSpacing: '-.6px', color: '#16261c' }}>We&apos;ll never recommend siding you don&apos;t need</h2>
              <p style={{ marginTop: 12, fontSize: 16, lineHeight: 1.7, color: '#46544a' }}>
                Not sure if it&apos;s time for new siding? Our experts give honest guidance on the condition of your siding and trim. Sometimes a fresh coat of paint is all you need — and when that&apos;s the case, we&apos;ll happily refer you to a trusted Bay Area painter. We treat your home like our own.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '84px 24px' }}>
          <SectionHeader eyebrow="Pricing questions" title="Straight answers on cost" marginBottom={40} />
          <FAQ items={faqs} soft />
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#206a38,#0e341d)' }}>
        <div className="container" style={{ padding: '64px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 800, color: '#fff', letterSpacing: '-.8px' }}>Request your free siding consultation</h2>
          <p style={{ maxWidth: 600, margin: '14px auto 0', fontSize: 16, color: '#bcd9c2', lineHeight: 1.6 }}>
            A detailed, no-obligation proposal tailored to your home and goals — and our promise to beat any like-for-like quote by 10%.
          </p>
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 14 }}>
            <Link href="/#quote" className="btn btn-light" style={{ fontSize: 16, padding: '16px 30px', borderRadius: 13 }}>Build my instant quote &rarr;</Link>
            <Link href="/contact-us" className="btn" style={{ fontSize: 16, padding: '16px 30px', borderRadius: 13, background: 'rgba(255,255,255,.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,.3)' }}>Contact us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
