import { headers as nextHeaders } from 'next/headers'
import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

/**
 * One-off, admin-gated: pull James Hardie product/lifestyle photos (Contentful
 * CDN) into the Media collection (→ Vercel Blob) for the Design Inspirations
 * showcase. Returns a key→url map to wire into the page layout. Delete after use.
 */
const IMAGES: Array<{ key: string; alt: string; url: string }> = [
  { key: 'hp-mountainsage', alt: 'HardiePlank® lap siding in Mountain Sage on a modern farmhouse', url: 'https://images.ctfassets.net/dzi2asncd44t/4Xg567A4yP2mvynORD9E2Z/654984b43ca871cadda30003072bbc1e/child-farmhouse-hardie-plank-mountain-sage.jpg' },
  { key: 'hp-deepocean-porch', alt: 'HardiePlank® lap siding in Deep Ocean', url: 'https://images.ctfassets.net/dzi2asncd44t/1Yd1JCJ09fvw9JSAWNYSBe/fe18559b9ae7a1411dee10ecb1dd0843/couple-porch-hardie-plank-deep-ocean.jpg' },
  { key: 'hp-deepocean-house', alt: 'Home clad in HardiePlank® in Deep Ocean', url: 'https://images.ctfassets.net/dzi2asncd44t/1MRmRjpjKa60BuCi9AKSi9/154190ebde2eae7d0edb8818006b3861/house-with-couple-hardie-plank-deep-ocean.jpg' },
  { key: 'panel-modern', alt: 'HardiePanel® vertical siding on a modern home', url: 'https://images.ctfassets.net/dzi2asncd44t/7DDE4Tm5qhv4q2XR9SOX4k/196f771d067ebe931cd044019906e86b/mother-daughter-modern-house-hardie-plank-panel.jpg' },
  { key: 'artisan-vgroove', alt: 'Hardie® Artisan® V-Groove siding on a modern white home', url: 'https://images.ctfassets.net/dzi2asncd44t/3q2hIfr21duJI5bUwc1Ngm/9af0cbb5e793160408e0b1b7694f6b4f/modern-house-hardie-artisan-v-groove-white.jpg' },
  { key: 'detail-plank', alt: 'HardiePlank® lap siding texture detail in Mountain Sage', url: 'https://images.ctfassets.net/dzi2asncd44t/2ocjKlG7vy8UB53zs4Zaj1/f993ddf02001ee479b83c5fed54c3237/detail-hardie-plank-mountain-sage-bench.jpg' },
  { key: 'detail-trim', alt: 'HardieTrim® board around a window with HardiePlank® siding', url: 'https://images.ctfassets.net/dzi2asncd44t/4vr19whWkAKEowk6RLWPD7/48ef087fb9c2fc8595cb18050761a18d/window-hardie-plank-grey-shadow-hardie-trim-arctic-white.jpg' },
  { key: 'detail-soffit', alt: 'HardieSoffit® panel detail in Arctic White with HardiePlank®', url: 'https://images.ctfassets.net/dzi2asncd44t/3CHbhEl1icDHfWgRVez8E6/be06ae0b854201fbc6593728d78c687c/detail-hardie-soffit-panel-arctic-white-hardie-plank-deep-ocean.jpg' },
  { key: 'innovation', alt: 'James Hardie innovation lab and engineering', url: 'https://images.ctfassets.net/dzi2asncd44t/7bG9n7zuwXZHQb0oWYHl3i/85ad60973eeb7966172b73ed06c1a6da/lab-technicians-james-hardie-innovation.jpg' },
  { key: 'install', alt: 'Professional James Hardie siding installation', url: 'https://images.ctfassets.net/dzi2asncd44t/yfQkVYQUCAAAm1mCPrK5V/2b455a6cec794ec8c17873dc3ada2778/hardie-plank-contractors.jpg' },
  { key: 'home-after', alt: 'Finished James Hardie home exterior', url: 'https://images.ctfassets.net/dzi2asncd44t/2NwWZX2lW0uWOe2AXesLO3/315a2a3701a23cc2e0ebcc352c1af370/RS21647_HRD1922_Afters_K3_2747-lpr.jpg' },
  { key: 'home-fernwood', alt: 'James Hardie home exterior', url: 'https://images.ctfassets.net/dzi2asncd44t/52GR032JNI5UdYu1uNk181/c440a89352c865f1d7d7ebeba399cf02/RS24749_162_fernwood_terrace.jpg' },
  { key: 'home-persimmon', alt: 'James Hardie home exterior', url: 'https://images.ctfassets.net/dzi2asncd44t/5teyrkjhiImNv9Y9E8NBau/74c771607a83da1d5a6138afc5a7bf05/RS25133_13_Persimmon_Place.jpg' },
  { key: 'home-roosevelt', alt: 'James Hardie home exterior', url: 'https://images.ctfassets.net/dzi2asncd44t/3GGprhQkBSO8c7QBp1voqV/9138071a8ff98804bd61eefaabe408bb/RS29771_1118_Roosevelt_Ave.jpg' },
  { key: 'jh-logo', alt: 'James Hardie logo', url: 'https://images.ctfassets.net/dzi2asncd44t/1zXM9ZVxSHpXuLLWzOIf5s/8c5abf86f25fc326af14728a31407f5d/james-hardie-vector-logo.svg' },
]

export async function POST() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await nextHeaders() })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const media: Record<string, { id: number; url: string }> = {}
  const warnings: string[] = []

  for (const item of IMAGES) {
    const isSvg = item.url.endsWith('.svg')
    const filename = `jh-${item.key}.${isSvg ? 'svg' : 'jpg'}`
    const fetchUrl = isSvg ? item.url : `${item.url}?w=1600&q=80&fm=jpg`
    try {
      const existing = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })
      if (existing.docs.length) {
        const d = existing.docs[0] as { id: number; url?: string }
        media[item.key] = { id: d.id, url: d.url || '' }
        continue
      }
      const res = await fetch(fetchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      if (!res.ok) {
        warnings.push(`${item.key} HTTP ${res.status}`)
        continue
      }
      const data = Buffer.from(await res.arrayBuffer())
      const created = (await payload.create({
        collection: 'media',
        data: { alt: item.alt },
        file: { data, mimetype: isSvg ? 'image/svg+xml' : 'image/jpeg', name: filename, size: data.length },
        overrideAccess: true,
      })) as { id: number; url?: string }
      media[item.key] = { id: created.id, url: created.url || '' }
    } catch (e) {
      warnings.push(`${item.key} ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  return NextResponse.json({ ok: true, count: Object.keys(media).length, warnings, media })
}
