import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { JsonLd } from '@/components/ui/JsonLd'
import { MediaImage } from '@/components/ui/MediaImage'
import { asMedia, getBlogPost, getBlogPosts } from '@/lib/data'
import { blogPostingLd, breadcrumbLd } from '@/lib/jsonld'

export const revalidate = 300

const CAT_LABELS: Record<string, string> = {
  'cost-guide': 'Cost Guide',
  'buying-guide': 'Buying Guide',
  'homeowner-tips': 'Homeowner Tips',
  design: 'Design',
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p) => ({ slug: p.slug as string }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: 'Article not found' }
  const og = asMedia(post.seo?.ogImage) || asMedia(post.heroImage)
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt || undefined,
    alternates: { canonical: `/resources/${slug}` },
    openGraph: og?.url ? { images: [{ url: og.url }] } : undefined,
  }
}

function fmtDate(d?: string | null) {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return ''
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  const hero = asMedia(post.heroImage)
  const ogUrl = (asMedia(post.seo?.ogImage) || hero)?.url

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Home', url: '/' },
            { name: 'Resources', url: '/resources' },
            { name: post.title, url: `/resources/${slug}` },
          ]),
          blogPostingLd({
            title: post.title,
            description: post.excerpt || undefined,
            url: `/resources/${slug}`,
            image: ogUrl ?? undefined,
            datePublished: post.publishedAt || undefined,
            author: post.author || undefined,
          }),
        ]}
      />

      <article style={{ background: '#fff' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px 24px' }}>
          <div style={{ fontSize: 13, color: '#6a766d', fontWeight: 500 }}>
            <Link href="/" style={{ color: '#6a766d' }}>Home</Link> <span style={{ margin: '0 6px', color: '#b8c4ba' }}>/</span>{' '}
            <Link href="/resources" style={{ color: '#6a766d' }}>Resources</Link> <span style={{ margin: '0 6px', color: '#b8c4ba' }}>/</span>{' '}
            <span style={{ color: '#206a38', fontWeight: 600 }}>{CAT_LABELS[post.category] || 'Article'}</span>
          </div>
          <div style={{ marginTop: 22, fontSize: 12.5, fontWeight: 700, color: '#206a38', textTransform: 'uppercase', letterSpacing: '.4px' }}>
            {CAT_LABELS[post.category] || ''}
          </div>
          <h1 style={{ fontSize: 'clamp(30px,4vw,46px)', fontWeight: 800, letterSpacing: '-1.2px', lineHeight: 1.08, color: '#16261c', marginTop: 10 }}>{post.title}</h1>
          <div style={{ marginTop: 14, fontSize: 14, color: '#6a766d' }}>
            {post.author || 'Peninsula Siding Company'}
            {post.publishedAt ? ` · ${fmtDate(post.publishedAt)}` : ''}
          </div>
        </div>

        {hero && (
          <div style={{ maxWidth: 980, margin: '0 auto', padding: '8px 24px' }}>
            <MediaImage media={hero} style={{ aspectRatio: '16/8', borderRadius: 20 }} sizes="(max-width: 1000px) 100vw, 940px" priority />
          </div>
        )}

        <div className="prose" style={{ maxWidth: 740, margin: '0 auto', padding: '32px 24px 72px' }}>
          {post.body ? <RichText data={post.body as never} /> : null}
        </div>
      </article>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#206a38,#0e341d)' }}>
        <div className="container" style={{ padding: '56px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px,2.8vw,32px)', fontWeight: 800, color: '#fff', letterSpacing: '-.6px' }}>Ready to price your project?</h2>
          <p style={{ maxWidth: 540, margin: '12px auto 0', fontSize: 16, color: '#bcd9c2' }}>Build an instant estimate in 60 seconds — we&apos;ll beat any like-for-like quote by 10%.</p>
          <Link href="/instant-quote" className="btn btn-light" style={{ display: 'inline-block', marginTop: 22, fontSize: 16, padding: '15px 28px', borderRadius: 13 }}>Build my instant quote &rarr;</Link>
        </div>
      </section>
    </>
  )
}
