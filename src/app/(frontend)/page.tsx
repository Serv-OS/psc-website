import Link from 'next/link'
import type { Metadata } from 'next'

import { BeforeAfter } from '@/components/ui/BeforeAfter'
import { JsonLd } from '@/components/ui/JsonLd'
import { MediaImage } from '@/components/ui/MediaImage'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { QuoteStudio } from '@/components/home/QuoteStudio'
import { asMedia, getFeaturedGallery, getPage, getSiteSettings, getTestimonials, imageSlot } from '@/lib/data'
import { generalContractorLd, serviceCatalogLd } from '@/lib/jsonld'
import { DEFAULT_PRICING } from '@/lib/quote'
import { resolveBiz } from '@/lib/site'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('home')
  return {
    title: page?.seo?.metaTitle || 'Peninsula Siding Company | San Mateo & Bay Area Siding Experts',
    description:
      page?.seo?.metaDescription ||
      'Premium James Hardie® fiber cement & cedar siding across the Bay Area. Build an instant estimate in 60 seconds — we beat any like-for-like quote by 10%.',
    alternates: { canonical: '/' },
  }
}

const STARS = '★★★★★'

const services = [
  { title: 'Fiber Cement Siding', body: 'Durable, low-maintenance James Hardie® board.', key: 'service-lap', label: 'lap siding', bg: 'repeating-linear-gradient(0deg,#dfe7df 0 8px,#e8eee8 8px 16px)' },
  { title: 'Real Wood Shingles', body: 'Timeless coastal character and warmth.', key: 'service-shingle', label: 'shingles', bg: 'repeating-linear-gradient(0deg,#dfe7df 0 18px,#e3ebe3 18px 20px)' },
  { title: 'Wood-Look Fiber Cement', body: 'Authentic grain without the upkeep.', key: 'service-batten', label: 'board & batten', bg: 'repeating-linear-gradient(90deg,#dfe7df 0 22px,#e3ebe3 22px 24px)' },
  { title: 'Windows & Doors', body: 'Energy-efficient replacements that seal tight.', key: 'service-window', label: 'window', bg: 'repeating-linear-gradient(0deg,#e3ebe3 0 30px,#dfe7df 30px 32px),repeating-linear-gradient(90deg,#dfe7df 0 30px,#e8eee8 30px 32px)' },
]

const process = [
  { n: 1, t: 'Phone Consultation', d: 'A short call to understand your home, goals and timeline.' },
  { n: 2, t: 'Home Visit & Quote', d: 'Precise measurements, material samples, and a clear detailed quote.' },
  { n: 3, t: 'Project Management', d: 'A dedicated manager handles permits, timelines and updates.' },
  { n: 4, t: 'Expert Installation', d: 'In-house craftsmen install with precision, backed by warranties.' },
  { n: 5, t: 'Project Sign-Off', d: 'Our President or VP personally reviews every finished project.' },
]

const whyUs = [
  { icon: '★', t: 'Full Service, Start to Finish', d: 'Every stage managed with seamless coordination and expert craftsmanship.' },
  { icon: '♥', t: 'Local, Family Owned', d: 'A family design-build firm delivering every remodel with integrity and care.' },
  { icon: '✉', t: 'Clear Communication', d: 'Regular updates, transparent pricing, and straightforward guidance throughout.' },
  { icon: '⚮', t: '5-Year Warranty', d: 'Full accountability and lasting confidence in the quality of your remodel.' },
]

const fallbackReviews = [
  { quote: 'The crew was meticulous and the new Hardie siding completely transformed our curb appeal. Clear pricing, no surprises.', author: 'San Mateo homeowner', projectType: 'Whole-house re-side' },
  { quote: 'Professional from the first call to the final walkthrough. They beat another quote and still delivered top quality.', author: 'Redwood City homeowner', projectType: 'Siding + windows' },
  { quote: 'Communication was excellent throughout. The 5-year warranty gave us real peace of mind. Highly recommend.', author: 'Palo Alto homeowner', projectType: 'Board & batten' },
]

export default async function HomePage() {
  const [page, settings, featured, testimonials] = await Promise.all([
    getPage('home'),
    getSiteSettings(),
    getFeaturedGallery(),
    getTestimonials(),
  ])
  const biz = resolveBiz(settings)
  const heroImg = imageSlot(page, 'hero') || asMedia(page?.hero?.image)
  const feature = featured[0]
  const reviews =
    testimonials.length > 0
      ? testimonials.map((t) => ({ quote: t.quote, author: t.author, projectType: t.projectType || '' }))
      : fallbackReviews

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
      <JsonLd data={[generalContractorLd(biz), serviceCatalogLd(biz)]} />

      {/* HERO */}
      <section id="top" style={{ position: 'relative', background: 'linear-gradient(180deg,#fbfcfa 0%,#f1f5f0 100%)' }}>
        <div className="split container" style={{ padding: '72px 24px 80px', gridTemplateColumns: '1.05fr .95fr', gap: 56 }}>
          <div style={{ animation: 'psc-fade .7s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e7f1e8', color: '#1c5530', fontSize: '12.5px', fontWeight: 600, padding: '7px 14px', borderRadius: 999, marginBottom: 22, letterSpacing: '.3px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c40a' }} />
              {(page?.hero?.eyebrow || '5-STAR RATED BAY AREA SIDING EXPERTS').toUpperCase()}
            </div>
            {page?.hero?.heading ? (
              <h1 style={{ fontSize: 'clamp(34px,4.4vw,56px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-1.4px', color: '#16261c' }}>{page.hero.heading}</h1>
            ) : (
              <h1 style={{ fontSize: 'clamp(34px,4.4vw,56px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-1.4px', color: '#16261c' }}>
                Siding that protects
                <br />and transforms your
                <br />
                <span style={{ color: '#206a38' }}>Bay Area home.</span>
              </h1>
            )}
            <p style={{ marginTop: 22, fontSize: '17.5px', lineHeight: 1.6, color: '#46544a', maxWidth: 520 }}>
              {page?.hero?.subheading ||
                'Premium James Hardie® materials, expert craftsmanship, and a quote you can build in 60 seconds — with transparent pricing and zero hidden costs.'}
            </p>
            <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <Link href="#quote" className="btn btn-primary" style={{ fontSize: '15.5px', padding: '15px 28px' }}>Get my instant estimate</Link>
              <Link href="#visualizer" className="btn btn-ghost" style={{ fontSize: '15.5px', padding: '15px 28px' }}>Design my exterior</Link>
            </div>
            <div style={{ marginTop: 34, display: 'flex', alignItems: 'center', gap: 26, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ color: '#f5a623', fontSize: 15, letterSpacing: 2 }}>{STARS}</div>
                <div style={{ fontSize: '12.5px', color: '#6a766d', fontWeight: 500 }}>Rated 5/5 on Yelp, Google &amp; Houzz</div>
              </div>
              <div style={{ height: 34, width: 1, background: '#d8e0d8' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#224631', letterSpacing: '-.5px' }}>15+ yrs</div>
                <div style={{ fontSize: '12.5px', color: '#6a766d', fontWeight: 500 }}>local craftsmanship</div>
              </div>
            </div>
          </div>
          <div style={{ animation: 'psc-fade .7s .12s ease both', position: 'relative' }}>
            <MediaImage
              media={heroImg}
              label="HERO PHOTO — finished Hardie exterior"
              priority
              sizes="(max-width: 900px) 100vw, 600px"
              style={{ aspectRatio: '4/3.4', borderRadius: 22, boxShadow: '0 30px 70px rgba(14,52,29,.22)', border: '1px solid #dde4dd' }}
              placeholderStyle={{ background: 'repeating-linear-gradient(135deg,#e7ece7 0 14px,#eef3ee 14px 28px)', alignItems: 'center', justifyContent: 'center' }}
            />
            <div style={{ position: 'absolute', left: -22, bottom: 34, background: '#fff', borderRadius: 14, padding: '14px 18px', boxShadow: '0 16px 34px rgba(14,52,29,.18)', display: 'flex', alignItems: 'center', gap: 12, animation: 'psc-fade .8s .4s ease both' }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: '#e7f1e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✓</div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#16261c' }}>Wildfire-resistant</div>
                <div style={{ fontSize: 12, color: '#6a766d' }}>Non-combustible fiber cement</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="What we install" title="Complete exterior solutions, built to last" maxWidth={680} />
          <div className="cols-4">
            {services.map((s) => (
              <div key={s.title} className="lift" style={{ border: '1px solid #e7ece7', borderRadius: 18, overflow: 'hidden', background: '#fbfcfa' }}>
                <MediaImage media={imageSlot(page, s.key)} label={s.label} style={{ aspectRatio: '4/3' }} placeholderStyle={{ background: s.bg }} sizes="(max-width: 640px) 100vw, 25vw" />
                <div style={{ padding: '18px 18px 22px' }}>
                  <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#16261c' }}>{s.title}</h3>
                  <p style={{ fontSize: '13.5px', color: '#5b675e', marginTop: 6, lineHeight: 1.5 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section style={{ background: '#0e341d', color: '#eaf2ea' }}>
        <div className="split container" style={{ padding: '84px 24px', gridTemplateColumns: '.9fr 1.1fr', gap: 56 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '1.5px', color: '#7fd28d', textTransform: 'uppercase' }}>Before &amp; after</div>
            <h2 style={{ fontSize: 'clamp(28px,3.4vw,42px)', fontWeight: 800, letterSpacing: '-1px', marginTop: 14, lineHeight: 1.08 }}>Old exteriors,<br />reimagined.</h2>
            <p style={{ marginTop: 18, fontSize: 16, lineHeight: 1.65, color: '#bcd2bf', maxWidth: 420 }}>
              Drag the handle to see how Peninsula Siding Company transforms a tired facade into a durable, energy-efficient home. Yours could be next.
            </p>
            <Link href="#quote" className="btn btn-primary" style={{ marginTop: 28, fontSize: 15, padding: '14px 26px', boxShadow: '0 10px 24px rgba(0,0,0,.3)' }}>Get my free estimate</Link>
          </div>
          <BeforeAfter before={feature?.beforeImage} after={feature?.afterImage} aspect="16/11" />
        </div>
      </section>

      {/* VISUALIZER + QUOTE */}
      <section id="visualizer" style={{ background: '#f4f6f3' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader
            eyebrow="Design it · Price it · Book it"
            title="Find your perfect James Hardie® siding"
            copy="Pick a profile, texture and ColorPlus® finish — then get an instant, accurate estimate for your home. Your selection flows straight into the quote."
            maxWidth={720}
            marginBottom={50}
          />
          <QuoteStudio pricing={pricing} />
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="How it works" title="From first call to final sign-off" copy="On time, on budget, and built to withstand Bay Area weather for years." maxWidth={720} marginBottom={52} />
          <div className="cols-5">
            {process.map((p) => (
              <div key={p.n} style={{ paddingTop: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', background: '#206a38', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>{p.n}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#16261c' }}>{p.t}</h3>
                <p style={{ fontSize: '13.5px', color: '#5b675e', marginTop: 8, lineHeight: 1.55 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ background: '#f4f6f3' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="Why choose us" title="Curb appeal, durability, and confidence that lasts" maxWidth={720} />
          <div className="cols-4">
            {whyUs.map((w) => (
              <div key={w.t} style={{ background: '#fff', border: '1px solid #e7ece7', borderRadius: 18, padding: 24 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: '#e7f1e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#206a38', marginBottom: 16 }}>{w.icon}</div>
                <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#16261c' }}>{w.t}</h3>
                <p style={{ fontSize: '13.5px', color: '#5b675e', marginTop: 8, lineHeight: 1.55 }}>{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 40 }}>
            <div style={{ maxWidth: 560 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '1.5px', color: '#206a38', textTransform: 'uppercase' }}>What homeowners say</div>
              <h2 style={{ fontSize: 'clamp(28px,3.4vw,40px)', fontWeight: 800, letterSpacing: '-1px', marginTop: 12, color: '#16261c' }}>Trusted across the Peninsula</h2>
            </div>
            <div style={{ display: 'flex', gap: 26 }}>
              {['Yelp', 'Google', 'Houzz'].map((p) => (
                <div key={p} style={{ textAlign: 'center' }}>
                  <div style={{ color: '#f5a623', fontSize: 14, letterSpacing: 1 }}>{STARS}</div>
                  <div style={{ fontSize: '12.5px', color: '#6a766d', fontWeight: 600, marginTop: 4 }}>{p} 5/5</div>
                </div>
              ))}
            </div>
          </div>
          <div className="cols-3">
            {reviews.slice(0, 3).map((r, i) => (
              <div key={i} style={{ background: '#fbfcfa', border: '1px solid #e7ece7', borderRadius: 18, padding: 26 }}>
                <div style={{ color: '#f5a623', fontSize: 15, letterSpacing: 1 }}>{STARS}</div>
                <p style={{ fontSize: 15, color: '#2c3a31', lineHeight: 1.6, marginTop: 14 }}>&ldquo;{r.quote}&rdquo;</p>
                <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#dde7dd' }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#16261c' }}>{r.author}</div>
                    <div style={{ fontSize: 12, color: '#6a766d' }}>{r.projectType}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section style={{ background: 'linear-gradient(135deg,#206a38,#0e341d)' }}>
        <div className="container" style={{ padding: '60px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <h2 style={{ fontSize: 'clamp(24px,2.8vw,34px)', fontWeight: 800, color: '#fff', letterSpacing: '-.6px' }}>Ready for your free estimate?</h2>
            <p style={{ fontSize: 16, color: '#bcd9c2', marginTop: 8 }}>Build your quote in 60 seconds — we&apos;ll beat any like-for-like quote by 10%.</p>
          </div>
          <Link href="#quote" className="btn btn-light" style={{ fontSize: 16, padding: '16px 30px', borderRadius: 13 }}>Start my quote &rarr;</Link>
        </div>
      </section>
    </>
  )
}
