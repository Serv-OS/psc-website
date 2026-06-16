import Link from 'next/link'
import type { Metadata } from 'next'

import { BeforeAfter } from '@/components/ui/BeforeAfter'
import { JsonLd } from '@/components/ui/JsonLd'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { PuckRender } from '@/builder/PuckRender'
import { builtLayout, getFeaturedGallery, getGalleryProjects, getPage } from '@/lib/data'
import { breadcrumbLd } from '@/lib/jsonld'
import type { GalleryProject } from '@/payload-types'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('gallery')
  return {
    title: page?.seo?.metaTitle || 'Siding Gallery | Before & After Transformations in the Bay Area',
    description:
      page?.seo?.metaDescription ||
      'See real Bay Area siding transformations from Peninsula Siding Company. Drag through before & after photos of fiber cement, cedar, board & batten and shingle projects.',
    alternates: { canonical: '/gallery' },
  }
}

// Shown until the owner adds real before/after pairs in the admin.
const FALLBACK: GalleryProject[] = [
  { id: 'p1', title: 'Hillsborough re-side', location: 'Hillsborough', category: 'fiber' },
  { id: 'p2', title: 'San Mateo board & batten', location: 'San Mateo', category: 'batten' },
  { id: 'p3', title: 'Burlingame cedar shingle', location: 'Burlingame', category: 'shingle' },
  { id: 'p4', title: 'Redwood City modern panel', location: 'Redwood City', category: 'batten' },
  { id: 'p5', title: 'Palo Alto Craftsman', location: 'Palo Alto', category: 'fiber' },
  { id: 'p6', title: 'Belmont cedar refresh', location: 'Belmont', category: 'cedar' },
  { id: 'p7', title: 'Foster City lap siding', location: 'Foster City', category: 'fiber' },
  { id: 'p8', title: 'Menlo Park shingle', location: 'Menlo Park', category: 'shingle' },
  { id: 'p9', title: 'San Carlos board & batten', location: 'San Carlos', category: 'batten' },
  { id: 'p10', title: 'Millbrae lap refresh', location: 'Millbrae', category: 'fiber' },
  { id: 'p11', title: 'Atherton cedar estate', location: 'Atherton', category: 'cedar' },
  { id: 'p12', title: 'Half Moon Bay coastal', location: 'Half Moon Bay', category: 'shingle' },
].map((p) => ({ ...p, updatedAt: '', createdAt: '' }) as unknown as GalleryProject)

export default async function GalleryPage() {
  const [projects, featured, page] = await Promise.all([getGalleryProjects(), getFeaturedGallery(), getPage('gallery')])
  const layout = builtLayout(page)
  if (layout) return <PuckRender data={layout} />
  const list = projects.length > 0 ? projects : FALLBACK
  const feature = featured[0]

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Home', url: '/' }, { name: 'Gallery', url: '/gallery' }])} />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(180deg,#fbfcfa 0%,#eef4ee 100%)' }}>
        <div className="container" style={{ padding: '30px 24px 0' }}>
          <div style={{ fontSize: 13, color: '#6a766d', fontWeight: 500 }}>
            <Link href="/" style={{ color: '#6a766d' }}>Home</Link> <span style={{ margin: '0 6px', color: '#b8c4ba' }}>/</span> <span style={{ color: '#206a38', fontWeight: 600 }}>Gallery</span>
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 52px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e7f1e8', color: '#1c5530', fontSize: '12.5px', fontWeight: 600, padding: '7px 14px', borderRadius: 999, letterSpacing: '.3px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c40a' }} />OLD SIDING TO NEW EXTERIOR — SEE IT HAPPEN
          </div>
          <h1 style={{ fontSize: 'clamp(32px,4.4vw,54px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, color: '#16261c', marginTop: 20 }}>Bay Area siding<br />transformations</h1>
          <p style={{ maxWidth: 600, margin: '18px auto 0', fontSize: 17, lineHeight: 1.6, color: '#46544a' }}>
            Drag any photo to reveal the before and after. Real homes, real craftsmanship — from San Mateo to Palo Alto.
          </p>
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 8px' }}>
          <BeforeAfter before={feature?.beforeImage} after={feature?.afterImage} aspect="16/8" radius={22} big initial={50} />
          <div style={{ textAlign: 'center', marginTop: 14, fontSize: 14, color: '#56635a' }}>
            <strong style={{ color: '#16261c' }}>Featured: {feature?.title || 'Hillsborough whole-home re-side'}</strong> &middot; {feature?.location || 'James Hardie® ColorPlus® Lap'}
          </div>
        </div>
      </section>

      {/* FILTER + GRID */}
      <section style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '48px 24px 84px' }}>
          <GalleryGrid projects={list} />
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/#quote" className="btn btn-primary" style={{ fontSize: 16, padding: '16px 32px', borderRadius: 13 }}>Start my transformation &rarr;</Link>
          </div>
        </div>
      </section>
    </>
  )
}
