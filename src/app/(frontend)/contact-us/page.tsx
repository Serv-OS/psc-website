import Link from 'next/link'
import type { Metadata } from 'next'

import { JsonLd } from '@/components/ui/JsonLd'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ContactForm } from '@/components/contact/ContactForm'
import { getPage, getSiteSettings } from '@/lib/data'
import { contactPageLd } from '@/lib/jsonld'
import { resolveBiz } from '@/lib/site'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('contact-us')
  return {
    title: page?.seo?.metaTitle || 'Contact Peninsula Siding Company | Free Siding Consultation | San Mateo, CA',
    description:
      page?.seo?.metaDescription ||
      "Book a free siding consultation with Peninsula Siding Company in San Mateo — call 650-287-4208 or send your details and we'll get right back to you.",
    alternates: { canonical: '/contact-us' },
  }
}

const cover = [
  { n: '01', t: 'Project details', d: 'We review the service you need — installation, replacement, repair or remodel — and the size, style and location of your home.' },
  { n: '02', t: 'Design preferences', d: "Share materials, colors, styles or reference photos. We'll guide you to energy-efficient, durable, fire-resistant options that suit your home." },
  { n: '03', t: 'Timeline & budget', d: 'Tell us your ideal start date and budget range so we can recommend the best solutions that maximize value and efficiency.' },
]

const working = [
  { t: 'Design consultation', d: 'An expert visits with product samples, walks you through options, and helps you visualize the perfect siding, trim and window styles for your home.' },
  { t: 'Detailed quote', d: 'A clear, transparent quote outlining every part of your project — materials, steps and costs — so there are no surprises.' },
  { t: 'Expert installation', d: 'Skilled craftsmen install with precision, backed by our 5-year workmanship guarantee and full manufacturer warranties.' },
]

const mapQuery = encodeURIComponent('763 Polhemus Road, Suite 2, San Mateo, CA 94402')

export default async function ContactPage() {
  const settings = await getSiteSettings()
  const biz = resolveBiz(settings)

  return (
    <>
      <JsonLd data={contactPageLd(biz, '/contact-us')} />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(180deg,#fbfcfa 0%,#eef4ee 100%)' }}>
        <div className="container" style={{ padding: '30px 24px 0' }}>
          <div style={{ fontSize: 13, color: '#6a766d', fontWeight: 500 }}>
            <Link href="/" style={{ color: '#6a766d' }}>Home</Link> <span style={{ margin: '0 6px', color: '#b8c4ba' }}>/</span> <span style={{ color: '#206a38', fontWeight: 600 }}>Contact Us</span>
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 44px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(32px,4.4vw,54px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, color: '#16261c' }}>Let&apos;s discuss your project</h1>
          <p style={{ maxWidth: 620, margin: '18px auto 0', fontSize: 17, lineHeight: 1.6, color: '#46544a' }}>
            Not sure where to start? Share your ideas and we&apos;ll help you explore the best siding, window, and exterior solutions for your Bay Area home. No pressure, ever.
          </p>
        </div>
      </section>

      {/* FORM + INFO */}
      <section style={{ background: '#fff' }}>
        <div className="split container" style={{ padding: '32px 24px 84px', gridTemplateColumns: '1.25fr .75fr', gap: 32, alignItems: 'start' }}>
          <ContactForm />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ background: 'linear-gradient(135deg,#224631,#0e341d)', borderRadius: 20, padding: 28, color: '#fff' }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Get in touch directly</div>
              <a href={`tel:${biz.phone.replace(/[^0-9]/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, color: '#fff' }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flex: '0 0 auto' }}>✆</span>
                <span><span style={{ display: 'block', fontSize: 12, color: '#9fc2a6' }}>Call us</span><span style={{ fontSize: 15, fontWeight: 600 }}>{biz.phone}</span></span>
              </a>
              <a href={`mailto:${biz.email}`} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, color: '#fff' }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flex: '0 0 auto' }}>✉</span>
                <span><span style={{ display: 'block', fontSize: 12, color: '#9fc2a6' }}>Email</span><span style={{ fontSize: 14, fontWeight: 600, wordBreak: 'break-all' }}>{biz.email}</span></span>
              </a>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flex: '0 0 auto' }}>⚑</span>
                <span><span style={{ display: 'block', fontSize: 12, color: '#9fc2a6' }}>Visit (by appointment)</span><span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{biz.street}<br />{biz.city}, {biz.region} {biz.zip}</span></span>
              </div>
            </div>

            <div style={{ border: '1px solid #e7ece7', borderRadius: 20, overflow: 'hidden' }}>
              <iframe
                title="Map to Peninsula Siding Company"
                src={`https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`}
                style={{ width: '100%', aspectRatio: '16/10', border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00c40a' }} />
                <span style={{ fontSize: '13.5px', color: '#46544a', fontWeight: 500 }}>{biz.hours}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE'LL COVER */}
      <section style={{ background: '#f4f6f3' }}>
        <div className="container" style={{ padding: '80px 24px' }}>
          <SectionHeader eyebrow="What we'll cover" title="Your consultation, step by step" maxWidth={720} />
          <div className="cols-3">
            {cover.map((c) => (
              <div key={c.n} style={{ background: '#fff', border: '1px solid #e7ece7', borderRadius: 18, padding: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#206a38' }}>{c.n}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#16261c', marginTop: 8 }}>{c.t}</h3>
                <p style={{ fontSize: 14, color: '#5b675e', marginTop: 10, lineHeight: 1.6 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONSULTATION CARDS */}
      <section style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '80px 24px' }}>
          <SectionHeader eyebrow="From hello to handover" title="What working with us looks like" maxWidth={760} />
          <div className="cols-3">
            {working.map((w) => (
              <div key={w.t} style={{ border: '1px solid #e7ece7', borderRadius: 18, padding: 28 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#16261c' }}>{w.t}</h3>
                <p style={{ fontSize: 14, color: '#5b675e', marginTop: 10, lineHeight: 1.6 }}>{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#206a38,#0e341d)' }}>
        <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: '#fff', letterSpacing: '-.8px' }}>Prefer to see a number first?</h2>
          <p style={{ maxWidth: 560, margin: '12px auto 0', fontSize: 16, color: '#bcd9c2', lineHeight: 1.6 }}>
            Build an instant estimate in 60 seconds — then book your free consultation. We&apos;ll beat any like-for-like quote by 10%.
          </p>
          <Link href="/#quote" className="btn btn-light" style={{ display: 'inline-block', marginTop: 24, fontSize: 16, padding: '16px 30px', borderRadius: 13 }}>Build my instant quote &rarr;</Link>
        </div>
      </section>
    </>
  )
}
