import Link from 'next/link'
import type { Metadata } from 'next'

import { FAQ, type FAQItem } from '@/components/ui/FAQ'
import { JsonLd } from '@/components/ui/JsonLd'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StyleExplorer } from '@/components/design/StyleExplorer'
import { getPage } from '@/lib/data'
import { breadcrumbLd, faqPageLd } from '@/lib/jsonld'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('design-inspirations')
  return {
    title: page?.seo?.metaTitle || 'Siding Design Inspirations | Colors, Textures & Styles for Bay Area Homes',
    description:
      page?.seo?.metaDescription ||
      'Explore siding design ideas for Bay Area homes — James Hardie® ColorPlus® palettes, Woodtone Rustic, Cedar Valley & Shakertown® cedar.',
    alternates: { canonical: '/services/design-inspirations' },
  }
}

const collections = [
  { name: 'James Hardie® Collection', body: 'Premium fiber cement engineered to resist moisture, pests and environmental wear. Most products feature ColorPlus® Technology — a factory-applied, fade-resistant finish backed by a 15-year warranty — plus a 30-year limited product warranty. Choose the Statement Collection&apos;s 15 curated colors, the Dream Collection&apos;s 700+ options, or primed boards for fully custom paint.', pdf: 'https://irp.cdn-website.com/51668bf6/files/uploaded/James_Hardie_Catalogue_2024.pdf', pdfLabel: 'James Hardie Catalog (PDF)', bg: 'repeating-linear-gradient(0deg,#dde7dd 0 16px,#e7ede7 16px 32px)', label: 'James Hardie®' },
  { name: 'Woodtone Rustic Series', body: 'Developed with James Hardie, the Rustic Series blends the authentic look of natural wood with the durability of fiber cement. Rich wood-grain textures and warm, natural color tones resist fading, rot, pests and moisture — an ideal accent to add depth and contemporary character to a facade.', pdf: 'https://irp.cdn-website.com/51668bf6/files/uploaded/Woodtone-Rustic-Series.pdf', pdfLabel: 'Woodtone Rustic Series (PDF)', bg: 'repeating-linear-gradient(0deg,#cdbfa6 0 14px,#d8ccb6 14px 28px)', label: 'Woodtone Rustic' },
  { name: 'Cedar Valley', body: 'The timeless beauty of real cedar in a pre-assembled panel system that simplifies installation while preserving premium craftsmanship. Authentic cedar panels deliver a classic, natural appearance and can be customized with stains or finishes to match your design — a high-end natural exterior with modern performance.', pdf: 'https://irp.cdn-website.com/51668bf6/files/uploaded/Cedar-Valley-Brochure.pdf', pdfLabel: 'Cedar Valley Brochure (PDF)', bg: 'repeating-linear-gradient(0deg,#d6c8b2 0 18px,#e0d4c0 18px 36px)', label: 'Cedar Valley' },
  { name: 'Shakertown® Cedar Siding', body: 'A distinctive, timeless exterior in premium cedar shingles and shakes — rich texture and handcrafted quality for a rustic yet refined look. Naturally resistant to decay and insects, with multiple finish options and eco-friendly construction that adds lasting curb appeal and value.', pdf: '', pdfLabel: '', bg: 'repeating-linear-gradient(0deg,#c9bba2 0 12px,#d4c7b0 12px 24px)', label: 'Shakertown®' },
]

const colorWays = [
  { big: '15', t: 'Statement Collection', d: 'Fifteen regionally curated colors, pre-selected to flatter local architecture — the easiest place to start.' },
  { big: '700+', t: 'Dream Collection', d: 'Over seven hundred customizable colors for full creative control — match a mood board or your existing palette exactly.' },
  { big: '∞', t: 'Primed & Custom', d: 'Prefer a one-of-a-kind shade? Primed products are engineered to hold any paint color your heart desires.' },
]

const designGuide = [
  { t: 'Built for coastal moisture & fog', d: 'Peninsula weather swings from coastal damp to inland heat. Fiber cement resists moisture and rot, and mid-tone ColorPlus® finishes hide fog-borne grime between washes — keeping your exterior looking fresh year-round.' },
  { t: 'Wildfire-conscious materials', d: 'In fire-aware Bay Area communities, non-combustible fiber cement is a smart, design-forward choice — letting you achieve a wood look while meeting tougher exterior standards.' },
  { t: 'Curb appeal & resale value', d: "Color and texture are the first thing buyers notice. Pairing the right profile with your home's architecture lifts curb appeal and protects long-term value — especially in competitive Peninsula neighborhoods." },
]

const faqs: FAQItem[] = [
  { q: 'What are the most popular siding colors for Bay Area homes?', a: "Soft greys, sage greens, warm taupes and crisp whites are the most requested ColorPlus® finishes on the Peninsula. They complement coastal light, hide fog-borne grime well, and suit the region's mix of Craftsman, Ranch and modern architecture." },
  { q: 'Can James Hardie siding be painted a custom color?', a: 'Yes. James Hardie offers primed products engineered to hold paint, so you can match any custom color. For lower long-term maintenance, most homeowners choose factory-applied ColorPlus® finishes, which resist fading and rarely need repainting.' },
  { q: 'What is the difference between the ColorPlus Statement and Dream Collections?', a: 'The Statement Collection features 15 regionally curated colors chosen to suit local architecture, while the Dream Collection offers over 700 customizable colors for full creative control. Both are backed by a 15-year ColorPlus® finish warranty.' },
  { q: 'Which siding style suits a Craftsman or modern home?', a: 'Craftsman homes shine with horizontal lap siding plus shingle accents in earthy tones, while modern homes favor smooth panels or board-and-batten in bold, dark colors with crisp white trim. Our design explorer suggests a profile and palette for each architectural style.' },
  { q: 'Does siding color affect home value or energy efficiency?', a: 'Color strongly influences curb appeal and resale value, and lighter ColorPlus® finishes reflect more heat, which can help keep homes cooler. Durable factory finishes also protect the surface, extending the life and look of your siding.' },
]

export default async function DesignInspirationsPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: 'Home', url: '/' }, { name: 'Services', url: '/services' }, { name: 'Design Inspirations', url: '/services/design-inspirations' }]), faqPageLd(faqs)]} />

      {/* HERO */}
      <section style={{ background: 'radial-gradient(120% 130% at 15% 0%,#224631 0%,#0e341d 62%,#091c12 100%)', color: '#eaf3ec', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,rgba(255,255,255,.03) 0 1px,transparent 1px 26px)' }} />
        <div className="container" style={{ position: 'relative', padding: '30px 24px 0' }}>
          <div style={{ fontSize: 13, color: '#9fc2a6', fontWeight: 500 }}>
            <Link href="/" style={{ color: '#9fc2a6' }}>Home</Link> <span style={{ margin: '0 6px', color: '#4f6b58' }}>/</span> <Link href="/services" style={{ color: '#9fc2a6' }}>Services</Link> <span style={{ margin: '0 6px', color: '#4f6b58' }}>/</span> <span style={{ color: '#fff', fontWeight: 600 }}>Design Inspirations</span>
          </div>
        </div>
        <div className="container" style={{ position: 'relative', maxWidth: 900, padding: '44px 24px 64px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', color: '#bfe0c6', fontSize: '12.5px', fontWeight: 600, padding: '8px 16px', borderRadius: 999, letterSpacing: '.4px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d058' }} />DESIGN INSPIRATIONS
          </div>
          <h1 style={{ fontSize: 'clamp(36px,5vw,58px)', fontWeight: 800, letterSpacing: '-1.6px', lineHeight: 1.05, marginTop: 22, color: '#fff' }}>Picture your home&apos;s<br />perfect new exterior.</h1>
          <p style={{ maxWidth: 620, margin: '22px auto 0', fontSize: 18, lineHeight: 1.65, color: '#bdd4c2' }}>
            Every home has a style. Explore the textures, profiles and ColorPlus® palettes that bring out the best in yours — then take it straight into an instant quote.
          </p>
        </div>
      </section>

      {/* STYLE EXPLORER */}
      <section style={{ background: '#f4f6f3' }}>
        <div className="container" style={{ padding: '72px 24px' }}>
          <SectionHeader eyebrow="Design by home style" title="Start with your architecture" copy="Pick the style closest to your home and we'll suggest a siding profile and a curated palette. Tap any swatch to preview it." maxWidth={760} marginBottom={36} />
          <StyleExplorer />
        </div>
      </section>

      {/* COLLECTIONS */}
      <section style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="The collections" title="Premium siding lines we design with" copy="Four trusted collections, each with its own character — from engineered fiber cement to authentic Western Red Cedar." maxWidth={760} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {collections.map((c) => (
              <div key={c.name} className="cols-2" style={{ gridTemplateColumns: '.8fr 1.2fr', gap: 0, border: '1px solid #e7ece7', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ background: c.bg, minHeight: 240, display: 'flex', alignItems: 'flex-end', padding: 16 }}>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: '#8a988c' }}>[ {c.label} ]</span>
                </div>
                <div style={{ padding: 32 }}>
                  <h3 style={{ fontSize: 21, fontWeight: 800, color: '#16261c' }}>{c.name}</h3>
                  <p style={{ marginTop: 12, fontSize: '14.5px', lineHeight: 1.7, color: '#46544a' }}>{c.body}</p>
                  {c.pdf ? (
                    <a href={c.pdf} target="_blank" rel="noopener noreferrer" style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 14, fontWeight: 600, color: '#206a38' }}>⭳ {c.pdfLabel}</a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLORPLUS */}
      <section style={{ background: '#f4f6f3' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="ColorPlus® Technology" title="Three ways to choose your color" maxWidth={760} />
          <div className="cols-3">
            {colorWays.map((c) => (
              <div key={c.t} style={{ background: '#fff', border: '1px solid #e7ece7', borderRadius: 18, padding: 30 }}>
                <div style={{ fontSize: 34, fontWeight: 800, color: '#206a38', letterSpacing: '-1px' }}>{c.big}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#16261c', marginTop: 6 }}>{c.t}</h3>
                <p style={{ fontSize: 14, color: '#5b675e', marginTop: 10, lineHeight: 1.6 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESIGN GUIDE */}
      <section style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="Designing for the Bay Area" title="Choices that look right and last" maxWidth={760} />
          <div className="cols-3">
            {designGuide.map((g) => (
              <div key={g.t} style={{ borderLeft: '3px solid #206a38', padding: '6px 0 6px 22px' }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#16261c' }}>{g.t}</h3>
                <p style={{ fontSize: 14, color: '#5b675e', marginTop: 10, lineHeight: 1.65 }}>{g.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#f4f6f3' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '84px 24px' }}>
          <SectionHeader eyebrow="Common questions" title="Siding design, answered" marginBottom={40} />
          <FAQ items={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#206a38,#0e341d)' }}>
        <div className="container" style={{ padding: '64px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 800, color: '#fff', letterSpacing: '-.8px' }}>Found a look you love?</h2>
          <p style={{ maxWidth: 600, margin: '14px auto 0', fontSize: 16, color: '#bcd9c2', lineHeight: 1.6 }}>
            Take your style and color straight into an instant estimate — or book a free design consultation with product samples at your home.
          </p>
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 14 }}>
            <Link href="/#quote" className="btn btn-light" style={{ fontSize: 16, padding: '16px 30px', borderRadius: 13 }}>Build my instant quote &rarr;</Link>
            <Link href="/contact-us" className="btn" style={{ fontSize: 16, padding: '16px 30px', borderRadius: 13, background: 'rgba(255,255,255,.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,.3)' }}>Book a design consultation</Link>
          </div>
        </div>
      </section>
    </>
  )
}
