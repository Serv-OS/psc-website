import Link from 'next/link'
import type { Config } from '@measured/puck'
import type { CSSProperties, ReactNode } from 'react'

import { BeforeAfter } from '@/components/ui/BeforeAfter'
import { MediaImage } from '@/components/ui/MediaImage'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FAQ } from '@/components/ui/FAQ'
import { QuoteStudio } from '@/components/home/QuoteStudio'
import { MaterialTabs, DEFAULT_TABS } from '@/components/about/MaterialTabs'
import { AreasWeServe } from '@/components/areas/AreasWeServe'
import { ServiceFinder } from '@/components/services/ServiceFinder'
import { StyleExplorer } from '@/components/design/StyleExplorer'
import { EstimateSlider } from '@/components/pricing/EstimateSlider'
import { FireTest } from '@/components/benefits/FireTest'
import { ContactForm } from '@/components/contact/ContactForm'
import { GalleryProjectsLive, BlogPostsLive } from './DynamicCollections'
import { ImageField, type ImageValue } from './ImageField'

/* ── shared helpers ─────────────────────────────────────────────────────── */

type Band = 'white' | 'soft' | 'forest' | 'green'

const bandStyle = (b: Band): CSSProperties => {
  switch (b) {
    case 'soft':
      return { background: '#f4f6f3' }
    case 'forest':
      return { background: 'radial-gradient(120% 120% at 80% 0%,#224631 0%,#0e341d 60%,#091c12 100%)', color: '#eaf3ec' }
    case 'green':
      return { background: 'linear-gradient(135deg,#206a38,#0e341d)', color: '#fff' }
    default:
      return { background: '#fff' }
  }
}

const bandField = {
  type: 'select' as const,
  label: 'Background',
  options: [
    { label: 'White', value: 'white' },
    { label: 'Soft grey', value: 'soft' },
    { label: 'Dark forest', value: 'forest' },
    { label: 'Green', value: 'green' },
  ],
}

const imageField = (label: string) => ({
  type: 'custom' as const,
  label,
  render: ({ value, onChange }: { value: ImageValue; onChange: (v: ImageValue) => void }) => (
    <ImageField value={value} onChange={onChange} />
  ),
})

function Btn({ label, href, variant = 'primary' }: { label?: string; href?: string; variant?: 'primary' | 'ghost' | 'light' }) {
  if (!label) return null
  const cls = variant === 'light' ? 'btn btn-light' : variant === 'ghost' ? 'btn btn-ghost' : 'btn btn-primary'
  return (
    <Link href={href || '#'} className={cls} style={{ fontSize: '15.5px', padding: '15px 28px' }}>
      {label}
    </Link>
  )
}

const eyebrowStyle = (dark: boolean): CSSProperties => ({
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '1.5px',
  color: dark ? '#7fd28d' : '#206a38',
  textTransform: 'uppercase',
})

/* ── config ─────────────────────────────────────────────────────────────── */

export const config: Config = {
  root: {
    render: ({ children }: { children?: ReactNode }) => <div style={{ overflowX: 'hidden' }}>{children}</div>,
  },
  categories: {
    layout: { title: 'Sections', components: ['Hero', 'CenteredHero', 'Heading', 'Text', 'CallToAction', 'Spacer'] },
    content: { title: 'Content', components: ['SplitContent', 'ServicesGrid', 'FeatureCards', 'NumberedCards', 'CheckList', 'BeforeAfter', 'Reviews', 'ImageBlock'] },
    interactive: { title: 'Interactive', components: ['QuoteEngine', 'MaterialsTabs', 'ServiceFinderBlock', 'StyleExplorerBlock', 'EstimateSliderBlock', 'FireTestBlock', 'FAQBlock', 'GalleryBlock', 'ContactBlock', 'BlogListBlock'] },
  },
  components: {
    // ─────────── HERO ───────────
    Hero: {
      label: 'Hero',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        heading: { type: 'textarea', label: 'Heading' },
        subheading: { type: 'textarea', label: 'Subheading' },
        primaryLabel: { type: 'text', label: 'Primary button label' },
        primaryHref: { type: 'text', label: 'Primary button link' },
        secondaryLabel: { type: 'text', label: 'Secondary button label' },
        secondaryHref: { type: 'text', label: 'Secondary button link' },
        image: imageField('Hero image'),
        background: bandField,
      },
      defaultProps: {
        eyebrow: '5-Star Rated Bay Area Siding Experts',
        heading: 'Siding that protects and transforms your Bay Area home.',
        subheading: 'Premium James Hardie® materials, expert craftsmanship, and a quote you can build in 60 seconds.',
        primaryLabel: 'Get my instant estimate',
        primaryHref: '/#quote',
        secondaryLabel: 'Design my exterior',
        secondaryHref: '/#quote',
        image: null,
        background: 'white',
      },
      render: ({ eyebrow, heading, subheading, primaryLabel, primaryHref, secondaryLabel, secondaryHref, image, background }) => {
        const dark = background === 'forest' || background === 'green'
        return (
          <section style={{ ...bandStyle(background as Band) }}>
            <div className="split container" style={{ padding: '72px 24px 80px', gridTemplateColumns: '1.05fr .95fr', gap: 56 }}>
              <div>
                {eyebrow ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: dark ? 'rgba(255,255,255,.08)' : '#e7f1e8', color: dark ? '#bfe0c6' : '#1c5530', fontSize: '12.5px', fontWeight: 600, padding: '7px 14px', borderRadius: 999, marginBottom: 22 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c40a' }} />
                    {eyebrow}
                  </div>
                ) : null}
                <h1 style={{ fontSize: 'clamp(34px,4.4vw,56px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-1.4px', color: dark ? '#fff' : '#16261c' }}>{heading}</h1>
                <p style={{ marginTop: 22, fontSize: '17.5px', lineHeight: 1.6, color: dark ? '#bdd4c2' : '#46544a', maxWidth: 520 }}>{subheading}</p>
                <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  <Btn label={primaryLabel} href={primaryHref} variant={dark ? 'light' : 'primary'} />
                  <Btn label={secondaryLabel} href={secondaryHref} variant="ghost" />
                </div>
              </div>
              <MediaImage
                media={image?.url ? ({ url: image.url, alt: image.alt } as never) : null}
                label="HERO PHOTO — finished Hardie exterior"
                priority
                style={{ aspectRatio: '4/3.4', borderRadius: 22, boxShadow: '0 30px 70px rgba(14,52,29,.22)' }}
                placeholderStyle={{ background: 'repeating-linear-gradient(135deg,#e7ece7 0 14px,#eef3ee 14px 28px)', alignItems: 'center', justifyContent: 'center' }}
              />
            </div>
          </section>
        )
      },
    },

    // ─────────── HEADING ───────────
    Heading: {
      label: 'Section heading',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'textarea', label: 'Title' },
        copy: { type: 'textarea', label: 'Copy' },
        background: bandField,
      },
      defaultProps: { eyebrow: 'Why choose us', title: 'A bold section heading goes here', copy: '', background: 'white' },
      render: ({ eyebrow, title, copy, background }) => {
        const dark = background === 'forest' || background === 'green'
        return (
          <section style={{ ...bandStyle(background as Band) }}>
            <div className="container" style={{ padding: '64px 24px 0' }}>
              <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
                {eyebrow ? <div style={eyebrowStyle(dark)}>{eyebrow}</div> : null}
                <h2 style={{ fontSize: 'clamp(28px,3.4vw,40px)', fontWeight: 800, letterSpacing: '-1px', marginTop: 12, color: dark ? '#fff' : '#16261c' }}>{title}</h2>
                {copy ? <p style={{ marginTop: 14, fontSize: 16, color: dark ? '#bcd2bf' : '#56635a', lineHeight: 1.6 }}>{copy}</p> : null}
              </div>
            </div>
          </section>
        )
      },
    },

    // ─────────── TEXT ───────────
    Text: {
      label: 'Text',
      fields: {
        content: { type: 'textarea', label: 'Text' },
        align: { type: 'select', label: 'Align', options: [{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }] },
        background: bandField,
      },
      defaultProps: { content: 'Write a paragraph of copy here.', align: 'left', background: 'white' },
      render: ({ content, align, background }) => (
        <section style={{ ...bandStyle(background as Band) }}>
          <div className="container" style={{ padding: '24px 24px' }}>
            <p style={{ maxWidth: 760, margin: align === 'center' ? '0 auto' : '0', textAlign: align as CSSProperties['textAlign'], fontSize: 16.5, lineHeight: 1.8, color: '#46544a' }}>{content}</p>
          </div>
        </section>
      ),
    },

    // ─────────── SERVICES GRID ───────────
    ServicesGrid: {
      label: 'Services grid',
      fields: {
        columns: { type: 'select', label: 'Columns', options: [{ label: '3', value: '3' }, { label: '4', value: '4' }] },
        background: bandField,
        items: {
          type: 'array',
          label: 'Cards',
          getItemSummary: (i: { title?: string }) => i.title || 'Card',
          arrayFields: {
            title: { type: 'text', label: 'Title' },
            body: { type: 'textarea', label: 'Body' },
            image: imageField('Image'),
          },
          defaultItemProps: { title: 'Service', body: 'Short description.', image: null },
        },
      },
      defaultProps: {
        columns: '4',
        background: 'white',
        items: [
          { title: 'Fiber Cement Siding', body: 'Durable, low-maintenance James Hardie® board.', image: null },
          { title: 'Real Wood Shingles', body: 'Timeless coastal character and warmth.', image: null },
          { title: 'Wood-Look Fiber Cement', body: 'Authentic grain without the upkeep.', image: null },
          { title: 'Windows & Doors', body: 'Energy-efficient replacements that seal tight.', image: null },
        ],
      },
      render: ({ columns, items, background }) => (
        <section style={{ ...bandStyle(background as Band) }}>
          <div className="container" style={{ padding: '40px 24px 84px' }}>
            <div className={columns === '3' ? 'cols-3' : 'cols-4'}>
              {(items || []).map((s: { title?: string; body?: string; image?: ImageValue }, i: number) => (
                <div key={i} className="lift" style={{ border: '1px solid #e7ece7', borderRadius: 18, overflow: 'hidden', background: '#fbfcfa' }}>
                  <MediaImage media={s.image?.url ? ({ url: s.image.url, alt: s.image.alt } as never) : null} label={s.title} style={{ aspectRatio: '4/3' }} placeholderStyle={{ background: 'repeating-linear-gradient(0deg,#dfe7df 0 8px,#e8eee8 8px 16px)' }} sizes="(max-width:640px) 100vw, 25vw" />
                  <div style={{ padding: '18px 18px 22px' }}>
                    <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#16261c' }}>{s.title}</h3>
                    <p style={{ fontSize: '13.5px', color: '#5b675e', marginTop: 6, lineHeight: 1.5 }}>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
    },

    // ─────────── FEATURE CARDS ───────────
    FeatureCards: {
      label: 'Feature cards',
      fields: {
        columns: { type: 'select', label: 'Columns', options: [{ label: '3', value: '3' }, { label: '4', value: '4' }] },
        background: bandField,
        items: {
          type: 'array',
          label: 'Cards',
          getItemSummary: (i: { title?: string }) => i.title || 'Card',
          arrayFields: {
            icon: { type: 'text', label: 'Icon (emoji/char)' },
            title: { type: 'text', label: 'Title' },
            body: { type: 'textarea', label: 'Body' },
            highlight: { type: 'radio', label: 'Style', options: [{ label: 'Normal', value: false }, { label: 'Highlighted', value: true }] },
          },
          defaultItemProps: { icon: '★', title: 'Feature', body: 'Short description.', highlight: false },
        },
      },
      defaultProps: {
        columns: '4',
        background: 'soft',
        items: [
          { icon: '★', title: 'Full Service', body: 'Every stage managed with expert craftsmanship.' },
          { icon: '♥', title: 'Local, Family Owned', body: 'Delivering every project with integrity and care.' },
          { icon: '✉', title: 'Clear Communication', body: 'Regular updates and transparent pricing.' },
          { icon: '⚮', title: '5-Year Warranty', body: 'Lasting confidence in the quality of your project.' },
        ],
      },
      render: ({ columns, items, background }) => (
        <section style={{ ...bandStyle(background as Band) }}>
          <div className="container" style={{ padding: '40px 24px 84px' }}>
            <div className={columns === '3' ? 'cols-3' : 'cols-4'}>
              {(items || []).map((w: { icon?: string; title?: string; body?: string; highlight?: boolean }, i: number) =>
                w.highlight ? (
                  <div key={i} style={{ background: 'linear-gradient(135deg,#206a38,#0e341d)', borderRadius: 18, padding: 26, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.3 }}>{w.title}</h3>
                    <p style={{ fontSize: '13.5px', color: '#bcd9c2', marginTop: 8, lineHeight: 1.55 }}>{w.body}</p>
                  </div>
                ) : (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e7ece7', borderRadius: 18, padding: 24 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: '#e7f1e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#206a38', marginBottom: 16 }}>{w.icon}</div>
                    <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#16261c' }}>{w.title}</h3>
                    <p style={{ fontSize: '13.5px', color: '#5b675e', marginTop: 8, lineHeight: 1.55 }}>{w.body}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      ),
    },

    // ─────────── BEFORE / AFTER ───────────
    BeforeAfter: {
      label: 'Before / after slider',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        heading: { type: 'textarea', label: 'Heading' },
        text: { type: 'textarea', label: 'Text' },
        buttonLabel: { type: 'text', label: 'Button label' },
        buttonHref: { type: 'text', label: 'Button link' },
        beforeImage: imageField('Before image'),
        afterImage: imageField('After image'),
        background: bandField,
      },
      defaultProps: {
        eyebrow: 'Before & after',
        heading: 'Old exteriors, reimagined.',
        text: 'Drag the handle to see the transformation. Yours could be next.',
        buttonLabel: 'Get my free estimate',
        buttonHref: '/#quote',
        beforeImage: null,
        afterImage: null,
        background: 'forest',
      },
      render: ({ eyebrow, heading, text, buttonLabel, buttonHref, beforeImage, afterImage, background }) => {
        const dark = background === 'forest' || background === 'green'
        return (
          <section style={{ ...bandStyle(background as Band) }}>
            <div className="split container" style={{ padding: '84px 24px', gridTemplateColumns: '.9fr 1.1fr', gap: 56 }}>
              <div>
                {eyebrow ? <div style={eyebrowStyle(dark)}>{eyebrow}</div> : null}
                <h2 style={{ fontSize: 'clamp(28px,3.4vw,42px)', fontWeight: 800, letterSpacing: '-1px', marginTop: 14, lineHeight: 1.08, color: dark ? '#fff' : '#16261c' }}>{heading}</h2>
                <p style={{ marginTop: 18, fontSize: 16, lineHeight: 1.65, color: dark ? '#bcd2bf' : '#46544a', maxWidth: 420 }}>{text}</p>
                <div style={{ marginTop: 28 }}>
                  <Btn label={buttonLabel} href={buttonHref} variant={dark ? 'light' : 'primary'} />
                </div>
              </div>
              <BeforeAfter
                before={beforeImage?.url ? ({ url: beforeImage.url, alt: beforeImage.alt } as never) : null}
                after={afterImage?.url ? ({ url: afterImage.url, alt: afterImage.alt } as never) : null}
                aspect="16/11"
              />
            </div>
          </section>
        )
      },
    },

    // ─────────── REVIEWS ───────────
    Reviews: {
      label: 'Reviews',
      fields: {
        background: bandField,
        items: {
          type: 'array',
          label: 'Reviews',
          getItemSummary: (i: { author?: string }) => i.author || 'Review',
          arrayFields: {
            quote: { type: 'textarea', label: 'Quote' },
            author: { type: 'text', label: 'Author' },
            projectType: { type: 'text', label: 'Project type' },
          },
          defaultItemProps: { quote: 'Great work!', author: 'Homeowner', projectType: 'Siding' },
        },
      },
      defaultProps: {
        background: 'white',
        items: [
          { quote: 'The crew was meticulous and transformed our curb appeal. Clear pricing, no surprises.', author: 'San Mateo homeowner', projectType: 'Whole-house re-side' },
          { quote: 'Professional from first call to final walkthrough. They beat another quote and delivered top quality.', author: 'Redwood City homeowner', projectType: 'Siding + windows' },
          { quote: 'Excellent communication. The 5-year warranty gave us real peace of mind.', author: 'Palo Alto homeowner', projectType: 'Board & batten' },
        ],
      },
      render: ({ items, background }) => (
        <section style={{ ...bandStyle(background as Band) }}>
          <div className="container" style={{ padding: '64px 24px' }}>
            <div className="cols-3">
              {(items || []).map((r: { quote?: string; author?: string; projectType?: string }, i: number) => (
                <div key={i} style={{ background: '#fbfcfa', border: '1px solid #e7ece7', borderRadius: 18, padding: 26 }}>
                  <div style={{ color: '#f5a623', fontSize: 15, letterSpacing: 1 }}>★★★★★</div>
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
      ),
    },

    // ─────────── IMAGE ───────────
    ImageBlock: {
      label: 'Image',
      fields: {
        image: imageField('Image'),
        aspect: { type: 'text', label: 'Aspect ratio (e.g. 16/9)' },
        background: bandField,
      },
      defaultProps: { image: null, aspect: '16/9', background: 'white' },
      render: ({ image, aspect, background }) => (
        <section style={{ ...bandStyle(background as Band) }}>
          <div className="container" style={{ padding: '40px 24px' }}>
            <MediaImage media={image?.url ? ({ url: image.url, alt: image.alt } as never) : null} label="Image" style={{ aspectRatio: aspect || '16/9', borderRadius: 20 }} sizes="100vw" />
          </div>
        </section>
      ),
    },

    // ─────────── QUOTE ENGINE ───────────
    QuoteEngine: {
      label: 'Instant quote engine',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'textarea', label: 'Title' },
        copy: { type: 'textarea', label: 'Copy' },
      },
      defaultProps: {
        eyebrow: 'Design it · Price it · Book it',
        title: 'Find your perfect James Hardie® siding',
        copy: 'Pick a profile, texture and ColorPlus® finish — then get an instant estimate.',
      },
      render: ({ eyebrow, title, copy }) => (
        <section style={{ background: '#f4f6f3' }}>
          <div className="container" style={{ padding: '84px 24px' }}>
            <div style={{ maxWidth: 720, margin: '0 auto 50px', textAlign: 'center' }}>
              {eyebrow ? <div style={eyebrowStyle(false)}>{eyebrow}</div> : null}
              <h2 style={{ fontSize: 'clamp(28px,3.6vw,44px)', fontWeight: 800, letterSpacing: '-1.1px', marginTop: 12, color: '#16261c' }}>{title}</h2>
              {copy ? <p style={{ marginTop: 14, fontSize: '16.5px', color: '#56635a', lineHeight: 1.6 }}>{copy}</p> : null}
            </div>
            <QuoteStudio />
          </div>
        </section>
      ),
    },

    // ─────────── CTA ───────────
    CallToAction: {
      label: 'Call to action',
      fields: {
        heading: { type: 'textarea', label: 'Heading' },
        copy: { type: 'textarea', label: 'Copy' },
        buttonLabel: { type: 'text', label: 'Button label' },
        buttonHref: { type: 'text', label: 'Button link' },
        background: bandField,
      },
      defaultProps: {
        heading: 'Ready for your free estimate?',
        copy: "Build your quote in 60 seconds — we'll beat any like-for-like quote by 10%.",
        buttonLabel: 'Start my quote →',
        buttonHref: '/#quote',
        background: 'green',
      },
      render: ({ heading, copy, buttonLabel, buttonHref, background }) => (
        <section style={{ ...bandStyle(background as Band) }}>
          <div className="container" style={{ padding: '60px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <h2 style={{ fontSize: 'clamp(24px,2.8vw,34px)', fontWeight: 800, color: '#fff', letterSpacing: '-.6px' }}>{heading}</h2>
              <p style={{ fontSize: 16, color: '#bcd9c2', marginTop: 8 }}>{copy}</p>
            </div>
            <Btn label={buttonLabel} href={buttonHref} variant="light" />
          </div>
        </section>
      ),
    },

    // ─────────── SPACER ───────────
    Spacer: {
      label: 'Spacer',
      fields: { size: { type: 'select', label: 'Size', options: [{ label: 'Small', value: '32' }, { label: 'Medium', value: '64' }, { label: 'Large', value: '96' }] } },
      defaultProps: { size: '64' },
      render: ({ size }) => <div style={{ height: Number(size) }} />,
    },

    // ─────────── CENTERED HERO (with optional stats) ───────────
    CenteredHero: {
      label: 'Centered hero',
      fields: {
        badge: { type: 'text', label: 'Badge' },
        heading: { type: 'textarea', label: 'Heading' },
        subheading: { type: 'textarea', label: 'Subheading' },
        stats: {
          type: 'array',
          label: 'Stats (optional)',
          getItemSummary: (i: { value?: string }) => i.value || 'Stat',
          arrayFields: { value: { type: 'text', label: 'Value' }, label: { type: 'text', label: 'Label' } },
          defaultItemProps: { value: '10+', label: 'Stat' },
        },
        background: bandField,
      },
      defaultProps: { badge: '', heading: 'A bold page headline', subheading: '', stats: [], background: 'forest' },
      render: ({ badge, heading, subheading, stats, background }) => {
        const dark = background === 'forest' || background === 'green'
        return (
          <section style={{ position: 'relative', overflow: 'hidden', ...bandStyle(background as Band) }}>
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,rgba(255,255,255,.03) 0 1px,transparent 1px 26px)', pointerEvents: 'none' }} />
            <div className="container" style={{ position: 'relative', maxWidth: 1100, padding: '84px 24px 72px', textAlign: 'center' }}>
              {badge ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: dark ? 'rgba(255,255,255,.08)' : '#e7f1e8', border: dark ? '1px solid rgba(255,255,255,.14)' : '1px solid #cfe3d3', color: dark ? '#bfe0c6' : '#1c5530', fontSize: '12.5px', fontWeight: 600, padding: '8px 16px', borderRadius: 999, letterSpacing: '.4px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d058' }} />
                  {badge}
                </div>
              ) : null}
              <h1 style={{ fontSize: 'clamp(36px,5.2vw,62px)', fontWeight: 800, letterSpacing: '-1.6px', lineHeight: 1.04, marginTop: badge ? 22 : 0, color: dark ? '#fff' : '#16261c' }}>{heading}</h1>
              {subheading ? <p style={{ maxWidth: 660, margin: '22px auto 0', fontSize: 18, lineHeight: 1.65, color: dark ? '#bdd4c2' : '#46544a' }}>{subheading}</p> : null}
              {stats && stats.length ? (
                <div className="cols-4" style={{ marginTop: 40, gap: 16 }}>
                  {stats.map((s: { value?: string; label?: string }, i: number) => (
                    <div key={i} style={{ background: dark ? 'rgba(255,255,255,.06)' : '#f4f6f3', border: dark ? '1px solid rgba(255,255,255,.12)' : '1px solid #e7ece7', borderRadius: 16, padding: '22px 16px' }}>
                      <div style={{ fontSize: 30, fontWeight: 800, color: dark ? '#fff' : '#16261c', letterSpacing: '-1px' }}>{s.value}</div>
                      <div style={{ fontSize: '12.5px', color: dark ? '#9fc2a6' : '#5b675e', marginTop: 6, lineHeight: 1.4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        )
      },
    },

    // ─────────── SPLIT: text + checklist card ───────────
    SplitContent: {
      label: 'Split: text + card',
      fields: {
        eyebrow: { type: 'text', label: 'Left eyebrow' },
        heading: { type: 'textarea', label: 'Left heading' },
        body: { type: 'textarea', label: 'Left body (blank line = new paragraph)' },
        cardEyebrow: { type: 'text', label: 'Card eyebrow' },
        cardText: { type: 'textarea', label: 'Card text' },
        checklist: {
          type: 'array',
          label: 'Card checklist',
          getItemSummary: (i: { text?: string }) => i.text || 'Item',
          arrayFields: { text: { type: 'textarea', label: 'Item' } },
          defaultItemProps: { text: 'A key benefit' },
        },
        background: bandField,
      },
      defaultProps: {
        eyebrow: 'Our story',
        heading: 'A bold heading for this section',
        body: 'Write the first paragraph here.\n\nAdd a blank line to start a new paragraph.',
        cardEyebrow: 'Our mission',
        cardText: 'A short mission or summary statement.',
        checklist: [{ text: 'First highlight' }, { text: 'Second highlight' }],
        background: 'white',
      },
      render: ({ eyebrow, heading, body, cardEyebrow, cardText, checklist, background }) => {
        const paras = String(body || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
        return (
          <section style={{ ...bandStyle(background as Band) }}>
            <div className="split container" style={{ padding: '84px 24px', gap: 56, alignItems: 'start' }}>
              <div>
                {eyebrow ? <div style={eyebrowStyle(false)}>{eyebrow}</div> : null}
                <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, letterSpacing: '-1px', marginTop: 12, color: '#16261c' }}>{heading}</h2>
                {paras.map((p, i) => (
                  <p key={i} style={{ marginTop: i ? 14 : 18, fontSize: 16, lineHeight: 1.7, color: '#46544a' }}>{p}</p>
                ))}
              </div>
              <div style={{ background: '#f4f6f3', border: '1px solid #e7ece7', borderRadius: 20, padding: 34 }}>
                {cardEyebrow ? <div style={eyebrowStyle(false)}>{cardEyebrow}</div> : null}
                {cardText ? <p style={{ marginTop: 16, fontSize: 17, lineHeight: 1.6, color: '#22312a', fontWeight: 500 }}>{cardText}</p> : null}
                {checklist && checklist.length ? (
                  <>
                    <div style={{ height: 1, background: '#e1e8e1', margin: '24px 0' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {checklist.map((c: { text?: string }, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                          <span style={{ color: '#206a38', fontSize: 18, lineHeight: 1, marginTop: 1 }}>✓</span>
                          <span style={{ fontSize: '14.5px', color: '#3a4a40', lineHeight: 1.5 }}>{c.text}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </section>
        )
      },
    },

    // ─────────── NUMBERED CARDS ───────────
    NumberedCards: {
      label: 'Numbered cards',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'textarea', label: 'Title' },
        columns: { type: 'select', label: 'Columns', options: [{ label: '3', value: '3' }, { label: '4', value: '4' }] },
        background: bandField,
        items: {
          type: 'array',
          label: 'Cards',
          getItemSummary: (i: { title?: string }) => i.title || 'Card',
          arrayFields: { n: { type: 'text', label: 'Number' }, title: { type: 'text', label: 'Title' }, body: { type: 'textarea', label: 'Body' } },
          defaultItemProps: { n: '01', title: 'Step title', body: 'Short description.' },
        },
      },
      defaultProps: {
        eyebrow: 'Our services',
        title: 'A numbered list of offerings',
        columns: '3',
        background: 'white',
        items: [
          { n: '01', title: 'First', body: 'Short description.' },
          { n: '02', title: 'Second', body: 'Short description.' },
          { n: '03', title: 'Third', body: 'Short description.' },
        ],
      },
      render: ({ eyebrow, title, columns, items, background }) => {
        const dark = background === 'forest' || background === 'green'
        return (
          <section style={{ ...bandStyle(background as Band) }}>
            <div className="container" style={{ padding: '84px 24px' }}>
              {title ? <SectionHeader eyebrow={eyebrow || ''} title={title} dark={dark} maxWidth={720} /> : null}
              <div className={columns === '4' ? 'cols-4' : 'cols-3'}>
                {(items || []).map((s: { n?: string; title?: string; body?: string }, i: number) => (
                  <div key={i} style={{ border: dark ? '1px solid rgba(255,255,255,.14)' : '1px solid #e7ece7', borderRadius: 18, padding: 28, background: dark ? 'rgba(255,255,255,.04)' : 'transparent' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: dark ? '#7fd28d' : '#206a38' }}>{s.n}</div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: dark ? '#fff' : '#16261c', marginTop: 8 }}>{s.title}</h3>
                    <p style={{ fontSize: 14, color: dark ? '#bcd2bf' : '#5b675e', marginTop: 10, lineHeight: 1.6 }}>{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      },
    },

    // ─────────── CHECK LIST ───────────
    CheckList: {
      label: 'Check list',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'textarea', label: 'Title' },
        columns: { type: 'select', label: 'Columns', options: [{ label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }] },
        background: bandField,
        items: {
          type: 'array',
          label: 'Items',
          getItemSummary: (i: { title?: string }) => i.title || 'Item',
          arrayFields: { title: { type: 'text', label: 'Title' }, body: { type: 'textarea', label: 'Body (optional)' } },
          defaultItemProps: { title: 'A point', body: '' },
        },
      },
      defaultProps: {
        eyebrow: '',
        title: '',
        columns: '2',
        background: 'white',
        items: [{ title: 'First point', body: '' }, { title: 'Second point', body: '' }],
      },
      render: ({ eyebrow, title, columns, items, background }) => {
        const dark = background === 'forest' || background === 'green'
        return (
          <section style={{ ...bandStyle(background as Band) }}>
            <div className="container" style={{ padding: '64px 24px' }}>
              {title ? <SectionHeader eyebrow={eyebrow || ''} title={title} dark={dark} maxWidth={720} /> : null}
              <div className={columns === '3' ? 'cols-3' : columns === '1' ? '' : 'cols-2'} style={{ maxWidth: columns === '1' ? 760 : undefined, margin: columns === '1' ? '0 auto' : undefined, display: columns === '1' ? 'flex' : undefined, flexDirection: columns === '1' ? 'column' : undefined, gap: columns === '1' ? 14 : undefined }}>
                {(items || []).map((c: { title?: string; body?: string }, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: dark ? 'rgba(255,255,255,.04)' : '#fff', border: dark ? '1px solid rgba(255,255,255,.12)' : '1px solid #e7ece7', borderRadius: 14, padding: 18 }}>
                    <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: dark ? 'rgba(127,210,141,.18)' : '#e7f1e8', color: dark ? '#7fd28d' : '#206a38', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800 }}>✓</span>
                    <div>
                      <div style={{ fontSize: '15.5px', fontWeight: 700, color: dark ? '#fff' : '#16261c' }}>{c.title}</div>
                      {c.body ? <p style={{ fontSize: 14, color: dark ? '#bcd2bf' : '#5b675e', marginTop: 4, lineHeight: 1.55 }}>{c.body}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      },
    },

    // ─────────── MATERIALS TABS ───────────
    MaterialsTabs: {
      label: 'Materials tabs',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'textarea', label: 'Title' },
        copy: { type: 'textarea', label: 'Copy' },
        background: bandField,
        tabs: {
          type: 'array',
          label: 'Material tabs',
          getItemSummary: (i: { label?: string }) => i.label || 'Tab',
          arrayFields: {
            label: { type: 'text', label: 'Tab label' },
            title: { type: 'text', label: 'Heading' },
            body: { type: 'textarea', label: 'Body' },
            tags: { type: 'textarea', label: 'Tags (one per line)' },
            image: imageField('Photo'),
          },
          defaultItemProps: { label: 'Material', title: 'Material name', body: 'Short description.', tags: '', image: null },
        },
      },
      defaultProps: { eyebrow: 'Premium materials', title: 'The best siding brands, expertly installed', copy: 'We partner with trusted manufacturers to deliver exteriors that stand up to Bay Area weather and add lasting value.', background: 'white', tabs: DEFAULT_TABS },
      render: ({ eyebrow, title, copy, background, tabs }) => {
        const dark = background === 'forest' || background === 'green'
        return (
          <section style={{ ...bandStyle(background as Band) }}>
            <div className="container" style={{ padding: '84px 24px' }}>
              {title ? <SectionHeader eyebrow={eyebrow || ''} title={title} copy={copy} dark={dark} maxWidth={720} marginBottom={40} /> : null}
              <MaterialTabs tabs={tabs as never} />
            </div>
          </section>
        )
      },
    },

    // ─────────── AREAS WE SERVE ───────────
    AreasWeServe: {
      label: 'Areas we serve',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'textarea', label: 'Title' },
        copy: { type: 'textarea', label: 'Copy' },
        background: bandField,
      },
      defaultProps: {
        eyebrow: 'Areas we serve',
        title: 'Trusted across the Peninsula since 2012',
        copy: 'Based in San Mateo and serving the greater Bay Area. If your city isn’t listed, reach out — we likely serve your area.',
        background: 'white',
      },
      render: ({ eyebrow, title, copy, background }) => {
        const dark = background === 'forest' || background === 'green'
        return (
          <section style={{ ...bandStyle(background as Band) }}>
            <div className="container" style={{ padding: '72px 24px' }}>
              {title ? <SectionHeader eyebrow={eyebrow || ''} title={title} copy={copy} dark={dark} maxWidth={720} marginBottom={32} /> : null}
              <AreasWeServe dark={dark} />
            </div>
          </section>
        )
      },
    },

    // ─────────── SERVICE FINDER ───────────
    ServiceFinderBlock: {
      label: 'Service finder',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'textarea', label: 'Title' },
        copy: { type: 'textarea', label: 'Copy' },
        background: bandField,
        services: {
          type: 'array',
          label: 'Service cards',
          getItemSummary: (i: { title?: string }) => i.title || 'Service',
          arrayFields: {
            n: { type: 'text', label: 'Number (e.g. 01)' },
            title: { type: 'text', label: 'Title' },
            body: { type: 'textarea', label: 'Body' },
            label: { type: 'text', label: 'Chip label' },
            image: imageField('Photo'),
          },
          defaultItemProps: { n: '01', title: 'Service', body: 'Short description.', label: 'Service', image: null },
        },
      },
      defaultProps: {
        eyebrow: 'Find your fit', title: 'Not sure what you need?', copy: 'Tell us about your home and we’ll point you to the right service.', background: 'soft',
        services: [
          { n: '01', title: 'Siding Installation', body: "Transform your home's appearance and durability with fiber cement, wood, and more — installed with precise, high-quality craftsmanship.", label: 'Siding Installation', image: null },
          { n: '02', title: 'Siding Replacement', body: 'Outdated, damaged, or failing siding replaced for a fresh, modern look with long-lasting protection.', label: 'Siding Replacement', image: null },
          { n: '03', title: 'Siding Repair', body: 'Full-wall repairs from corner to corner, restoring weather-, pest-, or age-affected siding.', label: 'Siding Repair', image: null },
        ],
      },
      render: ({ eyebrow, title, copy, background, services }) => {
        const dark = background === 'forest' || background === 'green'
        // Recommendation chips map to the first three cards by position.
        const KEYS = ['install', 'replace', 'repair']
        const list = services && services.length ? services : [
          { n: '01', title: 'Siding Installation', body: "Transform your home's appearance and durability with fiber cement, wood, and more — installed with precise, high-quality craftsmanship.", label: 'Siding Installation', image: null },
          { n: '02', title: 'Siding Replacement', body: 'Outdated, damaged, or failing siding replaced for a fresh, modern look with long-lasting protection.', label: 'Siding Replacement', image: null },
          { n: '03', title: 'Siding Repair', body: 'Full-wall repairs from corner to corner, restoring weather-, pest-, or age-affected siding.', label: 'Siding Repair', image: null },
        ]
        const finderServices = list.map((s: { n?: string; title?: string; body?: string; label?: string; image?: { url?: string; alt?: string } | null }, i: number) => ({
          key: KEYS[i] || `svc${i}`,
          n: s.n || String(i + 1).padStart(2, '0'),
          title: s.title || '',
          body: s.body || '',
          label: s.label || s.title || `Service ${i + 1}`,
          media: s.image?.url ? { url: s.image.url, alt: s.image.alt } : null,
        }))
        return (
          <section style={{ ...bandStyle(background as Band) }}>
            <div className="container" style={{ padding: '84px 24px' }}>
              {title ? <SectionHeader eyebrow={eyebrow || ''} title={title} copy={copy} dark={dark} maxWidth={720} marginBottom={40} /> : null}
              <ServiceFinder services={finderServices as never} />
            </div>
          </section>
        )
      },
    },

    // ─────────── STYLE EXPLORER ───────────
    StyleExplorerBlock: {
      label: 'Style explorer',
      fields: { eyebrow: { type: 'text', label: 'Eyebrow' }, title: { type: 'textarea', label: 'Title' }, copy: { type: 'textarea', label: 'Copy' }, background: bandField },
      defaultProps: { eyebrow: 'Design explorer', title: 'Picture your home’s perfect new exterior', copy: 'Choose an architectural style and a ColorPlus® finish to preview a look for your home.', background: 'soft' },
      render: ({ eyebrow, title, copy, background }) => {
        const dark = background === 'forest' || background === 'green'
        return (
          <section style={{ ...bandStyle(background as Band) }}>
            <div className="container" style={{ padding: '84px 24px' }}>
              {title ? <SectionHeader eyebrow={eyebrow || ''} title={title} copy={copy} dark={dark} maxWidth={720} marginBottom={40} /> : null}
              <StyleExplorer />
            </div>
          </section>
        )
      },
    },

    // ─────────── ESTIMATE SLIDER ───────────
    EstimateSliderBlock: {
      label: 'Estimate slider',
      fields: { eyebrow: { type: 'text', label: 'Eyebrow' }, title: { type: 'textarea', label: 'Title' }, copy: { type: 'textarea', label: 'Copy' }, background: bandField },
      defaultProps: { eyebrow: 'Ballpark it', title: 'Estimate your project in seconds', copy: 'Slide to your home’s approximate siding area for an instant ballpark range.', background: 'forest' },
      render: ({ eyebrow, title, copy, background }) => {
        const dark = background === 'forest' || background === 'green'
        return (
          <section style={{ ...bandStyle(background as Band) }}>
            <div className="container" style={{ padding: '84px 24px', maxWidth: 820 }}>
              {title ? <SectionHeader eyebrow={eyebrow || ''} title={title} copy={copy} dark={dark} maxWidth={720} marginBottom={40} /> : null}
              <EstimateSlider />
            </div>
          </section>
        )
      },
    },

    // ─────────── FIRE TEST ───────────
    FireTestBlock: {
      label: 'Fire-test demo',
      fields: { eyebrow: { type: 'text', label: 'Eyebrow' }, title: { type: 'textarea', label: 'Title' }, copy: { type: 'textarea', label: 'Copy' }, background: bandField },
      defaultProps: { eyebrow: 'Built to protect', title: 'See how fiber cement stands up to fire', copy: 'Compare fiber cement and wood under the same conditions.', background: 'forest' },
      render: ({ eyebrow, title, copy, background }) => {
        const dark = background === 'forest' || background === 'green'
        return (
          <section style={{ ...bandStyle(background as Band) }}>
            <div className="container" style={{ padding: '84px 24px', maxWidth: 820 }}>
              {title ? <SectionHeader eyebrow={eyebrow || ''} title={title} copy={copy} dark={dark} maxWidth={720} marginBottom={20} /> : null}
              <FireTest />
            </div>
          </section>
        )
      },
    },

    // ─────────── FAQ ───────────
    FAQBlock: {
      label: 'FAQ accordion',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'textarea', label: 'Title' },
        background: bandField,
        items: {
          type: 'array',
          label: 'Questions',
          getItemSummary: (i: { q?: string }) => i.q || 'Question',
          arrayFields: { q: { type: 'text', label: 'Question' }, a: { type: 'textarea', label: 'Answer' } },
          defaultItemProps: { q: 'A question?', a: 'The answer.' },
        },
      },
      defaultProps: {
        eyebrow: 'FAQ',
        title: 'Frequently asked questions',
        background: 'white',
        items: [{ q: 'A common question?', a: 'A helpful answer.' }],
      },
      render: ({ eyebrow, title, items, background }) => {
        const dark = background === 'forest' || background === 'green'
        return (
          <section style={{ ...bandStyle(background as Band) }}>
            <div className="container" style={{ padding: '84px 24px', maxWidth: 880 }}>
              {title ? <SectionHeader eyebrow={eyebrow || ''} title={title} dark={dark} maxWidth={720} marginBottom={36} /> : null}
              <FAQ items={(items || []) as never} />
            </div>
          </section>
        )
      },
    },

    // ─────────── GALLERY GRID ───────────
    GalleryBlock: {
      label: 'Gallery grid (live)',
      fields: { eyebrow: { type: 'text', label: 'Eyebrow' }, title: { type: 'textarea', label: 'Title' }, copy: { type: 'textarea', label: 'Copy' }, background: bandField },
      defaultProps: { eyebrow: 'Our work', title: 'Bay Area siding transformations', copy: '', background: 'white' },
      render: ({ eyebrow, title, copy, background }) => {
        const dark = background === 'forest' || background === 'green'
        return (
          <section style={{ ...bandStyle(background as Band) }}>
            <div className="container" style={{ padding: '64px 24px 84px' }}>
              {title ? <SectionHeader eyebrow={eyebrow || ''} title={title} copy={copy} dark={dark} maxWidth={720} marginBottom={40} /> : null}
              <GalleryProjectsLive />
            </div>
          </section>
        )
      },
    },

    // ─────────── CONTACT FORM ───────────
    ContactBlock: {
      label: 'Contact form',
      fields: { eyebrow: { type: 'text', label: 'Eyebrow' }, title: { type: 'textarea', label: 'Title' }, copy: { type: 'textarea', label: 'Copy' }, background: bandField },
      defaultProps: { eyebrow: 'Get in touch', title: 'Request your free estimate', copy: 'Tell us about your project and we’ll be in touch shortly.', background: 'soft' },
      render: ({ eyebrow, title, copy, background }) => {
        const dark = background === 'forest' || background === 'green'
        return (
          <section style={{ ...bandStyle(background as Band) }}>
            <div className="container" style={{ padding: '84px 24px', maxWidth: 880 }}>
              {title ? <SectionHeader eyebrow={eyebrow || ''} title={title} copy={copy} dark={dark} maxWidth={720} marginBottom={36} /> : null}
              <ContactForm />
            </div>
          </section>
        )
      },
    },

    // ─────────── BLOG / RESOURCES LIST ───────────
    BlogListBlock: {
      label: 'Articles list (live)',
      fields: { eyebrow: { type: 'text', label: 'Eyebrow' }, title: { type: 'textarea', label: 'Title' }, copy: { type: 'textarea', label: 'Copy' }, background: bandField },
      defaultProps: { eyebrow: 'Resources', title: 'Guides, costs & design ideas', copy: '', background: 'white' },
      render: ({ eyebrow, title, copy, background }) => {
        const dark = background === 'forest' || background === 'green'
        return (
          <section style={{ ...bandStyle(background as Band) }}>
            <div className="container" style={{ padding: '64px 24px 84px' }}>
              {title ? <SectionHeader eyebrow={eyebrow || ''} title={title} copy={copy} dark={dark} maxWidth={720} marginBottom={40} /> : null}
              <BlogPostsLive />
            </div>
          </section>
        )
      },
    },
  },
}

export default config
