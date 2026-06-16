import Link from 'next/link'
import type { Metadata } from 'next'

import { JsonLd } from '@/components/ui/JsonLd'
import { MediaImage } from '@/components/ui/MediaImage'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { PuckRender } from '@/builder/PuckRender'
import { asMedia, builtLayout, getBlogPosts, getPage } from '@/lib/data'
import { breadcrumbLd } from '@/lib/jsonld'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Resources | Siding Guides, Cost Tips & Design Ideas | Peninsula Siding',
  description:
    'Siding cost guides, buying advice, homeowner tips and design ideas for Bay Area homes — from the Peninsula Siding Company team.',
  alternates: { canonical: '/resources' },
}

const CAT_LABELS: Record<string, string> = {
  'cost-guide': 'Cost Guide',
  'buying-guide': 'Buying Guide',
  'homeowner-tips': 'Homeowner Tips',
  design: 'Design',
}

function fmtDate(d?: string | null) {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

export default async function ResourcesPage() {
  const [posts, page] = await Promise.all([getBlogPosts(), getPage('resources')])
  const layout = builtLayout(page)
  if (layout) return <PuckRender data={layout} />

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Home', url: '/' }, { name: 'Resources', url: '/resources' }])} />

      {/* HERO */}
      <section style={{ background: 'radial-gradient(120% 130% at 15% 0%,#224631 0%,#0e341d 62%,#091c12 100%)', color: '#eaf3ec', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,rgba(255,255,255,.03) 0 1px,transparent 1px 26px)' }} />
        <div className="container" style={{ position: 'relative', maxWidth: 900, padding: '64px 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', color: '#bfe0c6', fontSize: '12.5px', fontWeight: 600, padding: '8px 16px', borderRadius: 999, letterSpacing: '.4px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d058' }} />SIDING RESOURCES
          </div>
          <h1 style={{ fontSize: 'clamp(34px,4.6vw,56px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, marginTop: 22, color: '#fff' }}>Guides, costs &amp; design ideas</h1>
          <p style={{ maxWidth: 620, margin: '20px auto 0', fontSize: 18, lineHeight: 1.65, color: '#bdd4c2' }}>
            Practical advice on siding materials, cost, color and care — written for Bay Area homeowners.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '72px 24px' }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
              <SectionHeader eyebrow="Coming soon" title="Fresh siding guides on the way" copy="We're putting our best advice together. In the meantime, build an instant estimate or get in touch." marginBottom={24} />
              <Link href="/#quote" className="btn btn-primary" style={{ fontSize: 16, padding: '15px 28px' }}>Build my instant quote &rarr;</Link>
            </div>
          ) : (
            <div className="cols-3">
              {posts.map((p) => {
                const hero = asMedia(p.heroImage)
                return (
                  <Link key={p.id} href={`/resources/${p.slug}`} className="lift" style={{ display: 'block', border: '1px solid #e7ece7', borderRadius: 18, overflow: 'hidden', background: '#fbfcfa' }}>
                    <MediaImage media={hero} label={CAT_LABELS[p.category] || 'Article'} style={{ aspectRatio: '16/9' }} sizes="(max-width: 640px) 100vw, 33vw" />
                    <div style={{ padding: '18px 20px 22px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#206a38', textTransform: 'uppercase', letterSpacing: '.4px' }}>{CAT_LABELS[p.category] || ''}</div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#16261c', marginTop: 6, lineHeight: 1.3 }}>{p.title}</h3>
                      {p.excerpt ? <p style={{ fontSize: 14, color: '#5b675e', marginTop: 8, lineHeight: 1.55 }}>{p.excerpt}</p> : null}
                      <div style={{ fontSize: 12.5, color: '#9aa69d', marginTop: 12 }}>{fmtDate(p.publishedAt)}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
