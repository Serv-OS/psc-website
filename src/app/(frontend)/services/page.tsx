import Link from 'next/link'
import type { Metadata } from 'next'

import { JsonLd } from '@/components/ui/JsonLd'
import { MediaImage } from '@/components/ui/MediaImage'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ServiceFinder } from '@/components/services/ServiceFinder'
import { PuckRender } from '@/builder/PuckRender'
import { builtLayout, getPage, getSiteSettings, imageSlot } from '@/lib/data'
import { breadcrumbLd, serviceCatalogLd } from '@/lib/jsonld'
import { resolveBiz, SITE } from '@/lib/site'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('services')
  return {
    title: page?.seo?.metaTitle || 'Siding Services in the Bay Area | Installation, Repair & Replacement',
    description:
      page?.seo?.metaDescription ||
      'Expert siding installation, replacement & full-wall repair across San Mateo and the Bay Area. James Hardie® fiber cement, Cedar Valley & Shakertown® cedar.',
    alternates: { canonical: '/services' },
  }
}

const materials = [
  { title: 'James Hardie® Fiber Cement', body: 'Resists fire, termites, and extreme weather. A 30-year warranty and 15-year ColorPlus® finish make it a long-lasting investment — installed by an Elite Preferred Contractor.', bg: 'repeating-linear-gradient(0deg,#dde7dd 0 16px,#e7ede7 16px 32px)', label: 'James Hardie®' },
  { title: 'Cedar Valley Cedar', body: 'The natural beauty of Western Red Cedar — shingles on a fiberglass-laminate backer, available in hundreds of factory-finished colors and stains for a personalized, elegant exterior.', bg: 'repeating-linear-gradient(0deg,#e0d8c8 0 14px,#e8e2d6 14px 28px)', label: 'Cedar Valley' },
  { title: 'Shakertown® Cedar', body: 'Western Red Cedar in efficient 8-ft panels — less waste, faster installation, and a seamless natural wood look, available in durable pre-stained finishes.', bg: 'repeating-linear-gradient(0deg,#d8ccbc 0 18px,#e2d8c8 18px 36px)', label: 'Shakertown®' },
]

export default async function ServicesPage() {
  const [page, settings] = await Promise.all([getPage('services'), getSiteSettings()])
  const layout = builtLayout(page)
  if (layout) return <PuckRender data={layout} />
  const biz = resolveBiz(settings)

  const finderServices = [
    { key: 'install', n: '01', title: 'Siding Installation', body: "Transform your home's appearance and durability with an extensive selection of fiber cement, wood, and more — installed with precise, high-quality craftsmanship that boosts curb appeal and structural integrity.", media: imageSlot(page, 'service-install'), label: 'Siding Installation' },
    { key: 'replace', n: '02', title: 'Siding Replacement', body: 'Outdated, damaged, or failing siding replaced for a fresh, modern look. We help you select the perfect materials and design, delivering a flawless replacement with long-lasting protection.', media: imageSlot(page, 'service-replace'), label: 'Siding Replacement' },
    { key: 'repair', n: '03', title: 'Siding Repair', body: 'Full-wall repairs from corner to corner and dirt to roof, restoring weather-, pest-, or age-affected siding. (We do not offer patchwork or repairs limited to a few failing boards.)', media: imageSlot(page, 'service-repair'), label: 'Siding Repair' },
  ]

  return (
    <>
      <JsonLd data={[serviceCatalogLd(biz), breadcrumbLd([{ name: 'Home', url: '/' }, { name: 'Services', url: '/services' }])]} />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(180deg,#fbfcfa 0%,#eef4ee 100%)' }}>
        <div className="container" style={{ padding: '34px 24px 0' }}>
          <div style={{ fontSize: 13, color: '#6a766d', fontWeight: 500 }}>
            <Link href="/" style={{ color: '#6a766d' }}>Home</Link> <span style={{ margin: '0 6px', color: '#b8c4ba' }}>/</span> <span style={{ color: '#206a38', fontWeight: 600 }}>Services</span>
          </div>
        </div>
        <div className="split container" style={{ padding: '40px 24px 72px', gridTemplateColumns: '1.1fr .9fr', gap: 50 }}>
          <div style={{ animation: 'psc-fade .6s ease both' }}>
            <h1 style={{ fontSize: 'clamp(32px,4.2vw,52px)', fontWeight: 800, letterSpacing: '-1.4px', lineHeight: 1.06, color: '#16261c' }}>
              Siding in the Bay Area —<br />installation, repair<br />&amp; <span style={{ color: '#206a38' }}>replacement.</span>
            </h1>
            <p style={{ marginTop: 20, fontSize: 17, lineHeight: 1.65, color: '#46544a', maxWidth: 520 }}>
              As the region&apos;s trusted siding specialists, we deliver expert workmanship using high-quality materials to enhance your home&apos;s beauty, durability, and value — exteriors built to last.
            </p>
            <div style={{ marginTop: 30, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <Link href="/#quote" className="btn btn-primary" style={{ fontSize: '15.5px', padding: '15px 28px' }}>Get my free estimate</Link>
              <Link href="#materials" className="btn btn-ghost" style={{ fontSize: '15.5px', padding: '15px 28px' }}>Explore materials</Link>
            </div>
          </div>
          <MediaImage media={imageSlot(page, 'hero')} label="finished siding project photo" style={{ aspectRatio: '4/3.2', borderRadius: 20, boxShadow: '0 24px 56px rgba(14,52,29,.18)' }} placeholderStyle={{ background: 'repeating-linear-gradient(0deg,#dde7dd 0 22px,#e7ede7 22px 25px)' }} sizes="(max-width: 900px) 100vw, 500px" priority />
        </div>
      </section>

      {/* SERVICE FINDER */}
      <section style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '80px 24px' }}>
          <SectionHeader eyebrow="Our services" title="Not sure what you need? Start here." maxWidth={720} marginBottom={26} />
          <ServiceFinder services={finderServices} />
        </div>
      </section>

      {/* MATERIALS */}
      <section id="materials" style={{ background: '#f4f6f3' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="Premium materials we install" title="Built for Bay Area homes" maxWidth={720} />
          <div className="cols-3">
            {materials.map((m) => (
              <div key={m.title} style={{ background: '#fff', border: '1px solid #e7ece7', borderRadius: 20, overflow: 'hidden' }}>
                <MediaImage media={null} label={m.label} style={{ aspectRatio: '1' }} placeholderStyle={{ background: m.bg }} sizes="(max-width: 640px) 100vw, 33vw" />
                <div style={{ padding: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#16261c' }}>{m.title}</h3>
                  <p style={{ fontSize: 14, color: '#5b675e', marginTop: 10, lineHeight: 1.6 }}>{m.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUB-PAGE FEATURE BAND */}
      <section style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="Explore further" title="Design & pricing, made simple" maxWidth={720} />
          <div className="cols-2">
            <Link href="/services/design-inspirations" className="lift" style={{ display: 'block', position: 'relative', borderRadius: 22, overflow: 'hidden', minHeight: 300, background: 'linear-gradient(135deg,#224631,#0e341d)', color: '#fff', padding: 36, boxShadow: '0 14px 40px rgba(14,52,29,.12)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg,rgba(255,255,255,.04) 0 1px,transparent 1px 24px)' }} />
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 700, letterSpacing: '1px', color: '#7fd28d', textTransform: 'uppercase' }}>Sub-page</div>
                <h3 style={{ fontSize: 26, fontWeight: 800, marginTop: 10, letterSpacing: '-.5px' }}>Design Inspirations</h3>
                <p style={{ fontSize: 15, color: '#bcd2bf', marginTop: 12, lineHeight: 1.6, maxWidth: 380 }}>Browse textures, profiles, and ColorPlus® palettes to picture your home&apos;s next exterior.</p>
                <span style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 15, color: '#fff' }}>View design inspirations &rarr;</span>
              </div>
            </Link>
            <Link href="/services/quality-pricing" className="lift" style={{ display: 'block', position: 'relative', borderRadius: 22, overflow: 'hidden', minHeight: 300, background: '#f4f6f3', border: '1px solid #e1e8e1', color: '#16261c', padding: 36 }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 700, letterSpacing: '1px', color: '#206a38', textTransform: 'uppercase' }}>Sub-page</div>
                <h3 style={{ fontSize: 26, fontWeight: 800, marginTop: 10, letterSpacing: '-.5px' }}>Quality Pricing</h3>
                <p style={{ fontSize: 15, color: '#56635a', marginTop: 12, lineHeight: 1.6, maxWidth: 380 }}>Transparent, fair pricing with no hidden costs — and our promise to beat any like-for-like quote by 10%.</p>
                <span style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 15, color: '#206a38' }}>See how pricing works &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{ background: '#0e341d', color: '#eaf2ea' }}>
        <div className="container" style={{ padding: '64px 24px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto 40px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, letterSpacing: '-.8px' }}>Local San Mateo siding experts you can trust</h2>
            <p style={{ fontSize: '15.5px', color: '#bcd2bf', marginTop: 12, lineHeight: 1.6 }}>Deep roots on the Peninsula and hands-on knowledge of Bay Area homes, weather, and design — on every project.</p>
          </div>
          <div className="cols-5">
            {[
              ['Experienced', '30+ years, projects of every size'],
              ['Top materials', 'Hardie®, Cedar Valley, Shakertown®'],
              ['Custom solutions', 'Tailored to your style & budget'],
              ['Detail-driven', 'Precise, flawless, stress-free'],
              ['Licensed & insured', 'Fully bonded & accountable'],
            ].map(([t, d]) => (
              <div key={t} style={{ textAlign: 'center', padding: '18px 10px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{t}</div>
                <div style={{ fontSize: '12.5px', color: '#9fc2a6', marginTop: 5, lineHeight: 1.4 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AREAS */}
      <section style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '72px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '1.5px', color: '#206a38', textTransform: 'uppercase' }}>Areas we serve</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,34px)', fontWeight: 800, letterSpacing: '-.8px', marginTop: 12, color: '#16261c' }}>Trusted across the Peninsula since 2012</h2>
          <p style={{ maxWidth: 640, margin: '14px auto 28px', fontSize: '15.5px', color: '#56635a', lineHeight: 1.6 }}>
            Based in San Mateo and serving the greater Bay Area. If your city isn&apos;t listed, reach out — we likely serve your area.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 840, margin: '0 auto' }}>
            {SITE.areaServed.map((a) => (
              <span key={a} style={{ background: '#f4f6f3', border: '1px solid #e3e9e3', borderRadius: 999, padding: '9px 18px', fontSize: 14, fontWeight: 500, color: '#33433a' }}>{a}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#206a38,#0e341d)' }}>
        <div className="container" style={{ padding: '64px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 800, color: '#fff', letterSpacing: '-.8px' }}>Request your free siding consultation</h2>
          <p style={{ maxWidth: 600, margin: '14px auto 0', fontSize: 16, color: '#bcd9c2', lineHeight: 1.6 }}>
            A detailed, no-obligation quote — we&apos;ll review your needs, material options, and design preferences to find the best solution for durability, curb appeal, and long-term value.
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
