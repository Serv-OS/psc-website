import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * One-off, admin-gated: downloads three official James Hardie home-exterior
 * photos into the Media collection (→ Vercel Blob) for the Design Inspirations
 * gallery. Idempotent — skips files that already exist. Log into /admin, then
 * reload this URL. Safe to delete after running.
 */
const IMAGES: { name: string; alt: string; url: string }[] = [
  {
    name: 'jh-home-fernwood.jpg',
    alt: 'James Hardie fiber cement exterior — coastal grey Colonial with shingle gable',
    url: 'https://images.ctfassets.net/dzi2asncd44t/52GR032JNI5UdYu1uNk181/c440a89352c865f1d7d7ebeba399cf02/RS24749_162_fernwood_terrace_2022.07.11_front_right_side_photo_02-1-HDR-scr.jpg',
  },
  {
    name: 'jh-home-persimmon.jpg',
    alt: 'James Hardie shingle-style craftsman home with a stone base and front porch',
    url: 'https://images.ctfassets.net/dzi2asncd44t/5teyrkjhiImNv9Y9E8NBau/74c771607a83da1d5a6138afc5a7bf05/RS25133_13_Persimmon_Place-Select_17-scr__1_.jpg',
  },
  {
    name: 'jh-home-roosevelt.jpg',
    alt: 'James Hardie HardiePlank lap siding home in charcoal with white trim and a red door',
    url: 'https://images.ctfassets.net/dzi2asncd44t/3GGprhQkBSO8c7QBp1voqV/9138071a8ff98804bd61eefaabe408bb/RS29771_1118_Roosevelt_Ave_11132024_001-lpr.jpg',
  },
]

export async function GET(req: Request) {
  const payload = await getPayloadClient()

  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'Log in to /admin first, then reload this URL.' }, { status: 401 })
  }

  const results: { name: string; status: string }[] = []
  for (const img of IMAGES) {
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: img.name } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs.length) {
      results.push({ name: img.name, status: 'exists' })
      continue
    }
    try {
      const res = await fetch(`${img.url}?w=1600&q=80&fm=jpg`)
      if (!res.ok) {
        results.push({ name: img.name, status: `http ${res.status}` })
        continue
      }
      const data = Buffer.from(await res.arrayBuffer())
      await payload.create({
        collection: 'media',
        overrideAccess: true,
        data: { alt: img.alt },
        file: { data, mimetype: 'image/jpeg', name: img.name, size: data.length },
      })
      results.push({ name: img.name, status: `ok ${data.length}b` })
    } catch (e) {
      results.push({ name: img.name, status: `error ${String(e).slice(0, 80)}` })
    }
  }

  return NextResponse.json({ ok: true, results })
}
