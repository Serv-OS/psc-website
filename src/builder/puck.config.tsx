import Link from 'next/link'
import type { Config } from '@measured/puck'
import type { CSSProperties, ReactNode } from 'react'

import { BeforeAfter } from '@/components/ui/BeforeAfter'
import { MediaImage } from '@/components/ui/MediaImage'
import { QuoteStudio } from '@/components/home/QuoteStudio'
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
    layout: { title: 'Sections', components: ['Hero', 'Heading', 'Text', 'CallToAction', 'Spacer'] },
    content: { title: 'Content', components: ['ServicesGrid', 'FeatureCards', 'BeforeAfter', 'Reviews', 'ImageBlock'] },
    interactive: { title: 'Interactive', components: ['QuoteEngine'] },
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
          },
          defaultItemProps: { icon: '★', title: 'Feature', body: 'Short description.' },
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
              {(items || []).map((w: { icon?: string; title?: string; body?: string }, i: number) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e7ece7', borderRadius: 18, padding: 24 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: '#e7f1e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#206a38', marginBottom: 16 }}>{w.icon}</div>
                  <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#16261c' }}>{w.title}</h3>
                  <p style={{ fontSize: '13.5px', color: '#5b675e', marginTop: 8, lineHeight: 1.55 }}>{w.body}</p>
                </div>
              ))}
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
  },
}

export default config
