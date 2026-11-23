'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { MediaImage } from '@/components/ui/MediaImage'
import type { BlogPost, GalleryProject, Media } from '@/payload-types'
import { autoCategory, autoHero, getAutoPosts, type AutoPost } from '@/lib/autopilot'

/** Client-side fetch of a Payload collection's REST endpoint. Lets builder
 *  blocks show live collection data both in the editor and on the public page. */
function useCollection<T>(path: string): { docs: T[]; loading: boolean } {
  const [docs, setDocs] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let alive = true
    fetch(path, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (alive) setDocs((d?.docs as T[]) || [])
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [path])
  return { docs, loading }
}

const asMedia = (v: unknown): Media | null => (v && typeof v === 'object' ? (v as Media) : null)

/** Live gallery grid (pulls from the Gallery Projects collection). */
export function GalleryProjectsLive() {
  const { docs, loading } = useCollection<GalleryProject>('/api/gallery-projects?depth=1&limit=100')
  if (loading && docs.length === 0) {
    return <div style={{ textAlign: 'center', padding: 40, color: '#6a766d' }}>Loading projects…</div>
  }
  return <GalleryGrid projects={docs} />
}

const CAT_LABELS: Record<string, string> = {
  guide: 'Guide',
  cost: 'Cost & Pricing',
  design: 'Design',
  maintenance: 'Maintenance',
  news: 'News',
}

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''

/** Live blog/resources list (pulls from the Blog Posts collection). */
export function BlogPostsLive() {
  const { docs, loading } = useCollection<BlogPost>(
    '/api/blog-posts?where[_status][equals]=published&depth=1&limit=50&sort=-publishedAt',
  )
  // Autopilot posts from the CRM (only due ones come back), merged in.
  const [auto, setAuto] = useState<AutoPost[]>([])
  useEffect(() => { getAutoPosts().then(setAuto).catch(() => {}) }, [])
  const items = [
    ...docs.map((p) => ({ key: `cms-${p.id}`, slug: p.slug, title: p.title, excerpt: p.excerpt, date: p.publishedAt, cat: CAT_LABELS[p.category as string] || '', media: asMedia(p.heroImage) })),
    ...auto.map((p) => ({ key: `auto-${p.id}`, slug: p.slug, title: p.title, excerpt: p.excerpt, date: p.publish_at, cat: autoCategory(p), media: autoHero(p) ? ({ url: autoHero(p), alt: p.title } as never) : null })),
  ].sort((x, y) => new Date(y.date || 0).getTime() - new Date(x.date || 0).getTime())
  if (loading && items.length === 0) {
    return <div style={{ textAlign: 'center', padding: 40, color: '#6a766d' }}>Loading articles…</div>
  }
  if (items.length === 0) {
    return <div style={{ textAlign: 'center', padding: 40, color: '#6a766d' }}>No articles published yet.</div>
  }
  return (
    <div className="cols-3">
      {items.map((p) => (
        <Link
          key={p.key}
          href={`/resources/${p.slug}`}
          className="lift"
          style={{ display: 'block', border: '1px solid #e7ece7', borderRadius: 18, overflow: 'hidden', background: '#fbfcfa' }}
        >
          <MediaImage media={p.media} label={p.cat || 'Article'} style={{ aspectRatio: '16/9' }} sizes="(max-width: 640px) 100vw, 33vw" />
          <div style={{ padding: '18px 20px 22px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#206a38', textTransform: 'uppercase', letterSpacing: '.4px' }}>{p.cat}</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#16261c', marginTop: 6, lineHeight: 1.3 }}>{p.title}</h3>
            {p.excerpt ? <p style={{ fontSize: 14, color: '#5b675e', marginTop: 8, lineHeight: 1.55 }}>{p.excerpt}</p> : null}
            <div style={{ fontSize: 12.5, color: '#9aa69d', marginTop: 12 }}>{fmtDate(p.date)}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
