import Link from 'next/link'

import { MediaImage } from '@/components/ui/MediaImage'
import type { CityData } from '@/lib/cities'
import { SITE } from '@/lib/site'
import type { Media } from '@/payload-types'

const SERVICES = [
  { n: '01', title: 'Siding Installation', body: 'New fiber cement or cedar siding installed with precise, high-quality craftsmanship that lifts curb appeal and protects your home.' },
  { n: '02', title: 'Siding Replacement', body: 'Outdated or failing siding replaced for a fresh, modern look — the perfect materials and a flawless, long-lasting result.' },
  { n: '03', title: 'Siding Repair', body: 'Full-wall repairs from corner to corner and dirt to roof, restoring weather-, pest-, or age-affected siding (no patchwork).' },
]

export function CityBody({ city, heroMedia }: { city: CityData; heroMedia?: Media | null }) {
  const phoneDigits = SITE.phone.replace(/[^0-9]/g, '')
  return (
    <div style={{ fontFamily: 'inherit' }}>
      {/* LOCAL HERO */}
      <section style={{ background: 'linear-gradient(180deg,#fbfcfa 0%,#eef4ee 100%)' }}>
        <div className="container" style={{ padding: '30px 24px 0' }}>
          <div style={{ fontSize: 13, color: '#6a766d', fontWeight: 500 }}>
            <Link href="/" style={{ color: '#6a766d' }}>Home</Link> <span style={{ margin: '0 6px', color: '#b8c4ba' }}>/</span> <span style={{ color: '#206a38', fontWeight: 600 }}>{city.name} Siding</span>
          </div>
        </div>
        <div className="split container" style={{ padding: '38px 24px 68px', gridTemplateColumns: '1.1fr .9fr', gap: 50 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e7f1e8', color: '#1c5530', fontSize: '12.5px', fontWeight: 600, padding: '7px 14px', borderRadius: 999, letterSpacing: '.3px', whiteSpace: 'nowrap' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c40a', flex: '0 0 auto' }} />PROUDLY SERVING {city.name.toUpperCase()}
            </div>
            <h1 style={{ fontSize: 'clamp(31px,4vw,50px)', fontWeight: 800, letterSpacing: '-1.3px', lineHeight: 1.07, color: '#16261c', marginTop: 18 }}>{city.h1}</h1>
            <p style={{ marginTop: 18, fontSize: '16.5px', lineHeight: 1.7, color: '#46544a', maxWidth: 540 }}>{city.intro}</p>
            <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <Link href="/#quote" className="btn btn-primary" style={{ fontSize: '15.5px', padding: '15px 28px' }}>Get my {city.name} estimate</Link>
              <a href={`tel:${phoneDigits}`} className="btn btn-ghost" style={{ fontSize: '15.5px', padding: '15px 28px' }}>✆ {SITE.phone}</a>
            </div>
          </div>
          <MediaImage media={heroMedia} label={`${city.name} siding project photo`} style={{ aspectRatio: '4/3.2', borderRadius: 20, boxShadow: '0 24px 56px rgba(14,52,29,.18)' }} placeholderStyle={{ background: 'repeating-linear-gradient(0deg,#dde7dd 0 22px,#e7ede7 22px 25px)' }} sizes="(max-width: 900px) 100vw, 500px" priority />
        </div>
      </section>

      {/* LOCAL CONSIDERATIONS */}
      <section style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto 44px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '1.5px', color: '#206a38', textTransform: 'uppercase' }}>Local know-how</div>
            <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 800, letterSpacing: '-1px', marginTop: 12, color: '#16261c' }}>Siding built for {city.name} homes</h2>
          </div>
          <div className="cols-3">
            {city.localPoints.map((pt) => (
              <div key={pt.title} style={{ borderLeft: '3px solid #206a38', padding: '6px 0 6px 22px' }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#16261c' }}>{pt.title}</h3>
                <p style={{ fontSize: 14, color: '#5b675e', marginTop: 10, lineHeight: 1.65 }}>{pt.description}</p>
              </div>
            ))}
          </div>
          <p style={{ maxWidth: 880, margin: '40px auto 0', textAlign: 'center', fontSize: 16, lineHeight: 1.75, color: '#46544a' }}>{city.closingBlurb}</p>
        </div>
      </section>

      {/* NEIGHBORHOODS */}
      <section style={{ background: '#f4f6f3' }}>
        <div className="container" style={{ padding: '72px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '1.5px', color: '#206a38', textTransform: 'uppercase' }}>Where we work</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,34px)', fontWeight: 800, letterSpacing: '-.8px', marginTop: 12, color: '#16261c' }}>Neighborhoods we serve in {city.name}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 860, margin: '26px auto 0' }}>
            {city.neighborhoods.map((n) => (
              <span key={n} style={{ background: '#fff', border: '1px solid #e3e9e3', borderRadius: 999, padding: '9px 18px', fontSize: 14, fontWeight: 500, color: '#33433a' }}>{n}</span>
            ))}
          </div>
          <p style={{ maxWidth: 640, margin: '24px auto 0', fontSize: '14.5px', color: '#56635a', lineHeight: 1.6 }}>
            Don&apos;t see your street? We cover all of {city.name} and the surrounding Peninsula — just reach out and we&apos;ll confirm.
          </p>
        </div>
      </section>

      {/* SERVICES IN CITY */}
      <section style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto 44px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '1.5px', color: '#206a38', textTransform: 'uppercase' }}>What we do here</div>
            <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 800, letterSpacing: '-1px', marginTop: 12, color: '#16261c' }}>Our {city.name} siding services</h2>
          </div>
          <div className="cols-3">
            {SERVICES.map((s) => (
              <div key={s.n} style={{ border: '1px solid #e7ece7', borderRadius: 18, padding: 26 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#206a38' }}>{s.n}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#16261c', marginTop: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#5b675e', marginTop: 10, lineHeight: 1.6 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCAL CTA */}
      <section style={{ background: 'linear-gradient(135deg,#206a38,#0e341d)' }}>
        <div className="container" style={{ padding: '64px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: '#fff', letterSpacing: '-.8px' }}>Your {city.name} neighbors trust us — you can too</h2>
          <p style={{ maxWidth: 600, margin: '14px auto 0', fontSize: 16, color: '#bcd9c2', lineHeight: 1.6 }}>
            A family-owned, Elite Preferred James Hardie® contractor right here on the Peninsula. Free, no-obligation quotes — and we&apos;ll beat any like-for-like quote by 10%.
          </p>
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 14 }}>
            <Link href="/#quote" className="btn btn-light" style={{ fontSize: 16, padding: '16px 30px', borderRadius: 13 }}>Build my instant quote &rarr;</Link>
            <Link href="/contact-us" className="btn" style={{ fontSize: 16, padding: '16px 30px', borderRadius: 13, background: 'rgba(255,255,255,.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,.3)' }}>Contact us</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
