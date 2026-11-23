import { NextResponse } from 'next/server'

import { forwardToCrm } from '@/lib/crmForward'
import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

// Instant-quote submissions get the full treatment in the CRM: contact + location
// + lead + deal + a DRAFT quote built by the real quote engine, round-robin assigned.
// The CRM function is JWT-protected → authenticate with the CRM anon key (public) via env.
const CRM_INSTANT_QUOTE_URL =
  process.env.CRM_INSTANT_QUOTE_URL ||
  'https://xxazlzkhwraqfeqjzviz.supabase.co/functions/v1/instant-quote'

async function forwardInstantQuoteToCrm(args: { name: string; email: string; phone: string; c: any; body: any }) {
  const { name, email, phone, c, body } = args
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (process.env.CRM_ANON_KEY) headers.Authorization = `Bearer ${process.env.CRM_ANON_KEY}`
    await fetch(CRM_INSTANT_QUOTE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        secret: process.env.CRM_INGEST_SECRET || undefined,
        sms_consent: body?.sms_consent === true,
        financing: ['yes', 'maybe', 'no'].includes(body?.financing) ? body.financing : undefined,
        customer: { name, email, phone, address: c.address, city: c.city, zip: c.zip, notes: c.notes || body?.notes },
        selection: body?.selection || {},
        project: body?.project || {},
        estimate: body?.estimate || {},
        page_url: body?.page_url || null,
      }),
    })
  } catch (e) {
    console.error('CRM instant-quote forward failed', e)
  }
}

// Soft in-memory rate limit (per server instance): 6 submissions / 10 min / IP.
const hits = new Map<string, number[]>()
const WINDOW = 10 * 60 * 1000
const MAX = 6
function rateLimited(ip: string): boolean {
  const now = Date.now()
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW)
  arr.push(now)
  hits.set(ip, arr)
  return arr.length > MAX
}

const usd = (n?: number) => (typeof n === 'number' ? '$' + Math.round(n).toLocaleString('en-US') : '—')

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Honeypot: bots fill the hidden "company" field. Pretend success, save nothing.
  if (body?.company) return NextResponse.json({ ok: true })

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests — please try again shortly.' }, { status: 429 })
  }

  const type = body?.type === 'contact' ? 'contact' : 'quote'
  const c = body?.customer || {}
  const name = String(c.name || '').trim()
  const email = String(c.email || '').trim()
  const phone = String(c.phone || '').trim()

  if (!name || !EMAIL_RE.test(email) || !phone) {
    return NextResponse.json(
      { error: 'Please provide your name, a valid email, and a phone number.' },
      { status: 422 },
    )
  }

  const data: Record<string, any> = {
    type,
    status: 'New',
    name,
    email,
    phone,
    address: c.address || undefined,
    city: c.city || undefined,
    zip: c.zip || undefined,
    source: String(body?.source || (type === 'quote' ? 'home-quote' : 'contact-form')),
  }

  if (type === 'contact') {
    data.interest = body?.interest || undefined
    data.message = body?.message || undefined
  } else {
    data.selection = body?.selection || undefined
    data.project = body?.project || undefined
    data.estimate = body?.estimate || undefined
    data.notes = c.notes || body?.notes || undefined
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({ collection: 'leads', data: data as never, overrideAccess: true })

    // Mirror into the ServOS CRM (best-effort). Instant-quote → full lead+deal+quote;
    // everything else → a plain lead.
    if (data.source === 'instant-quote') {
      await forwardInstantQuoteToCrm({ name, email, phone, c, body })
    } else {
      await forwardToCrm({ type, name, email, phone, c, body })
    }

    // Notify sales (only when an email adapter is configured).
    if (process.env.RESEND_API_KEY) {
      const to = process.env.SALES_INBOX || 'info@peninsulasidingcompany.com'
      const lines =
        type === 'quote'
          ? [
              `New QUOTE lead from the website.`,
              ``,
              `Name:   ${name}`,
              `Email:  ${email}`,
              `Phone:  ${phone}`,
              `Address:${data.address || '—'}`,
              `Selection: ${body?.selection?.profile || '—'} · ${body?.selection?.texture || '—'} · ${body?.selection?.color || '—'}`,
              `Project: ${body?.project?.sqft || '—'} sq ft · ${body?.project?.stories || '—'} stories`,
              `Estimate: ${usd(body?.estimate?.low)} – ${usd(body?.estimate?.high)}`,
              data.notes ? `Notes: ${data.notes}` : '',
            ]
          : [
              `New CONTACT lead from the website.`,
              ``,
              `Name:   ${name}`,
              `Email:  ${email}`,
              `Phone:  ${phone}`,
              `Address:${data.address || '—'}`,
              `City/Zip: ${data.city || '—'} ${data.zip || ''}`,
              `Interested in: ${data.interest || '—'}`,
              data.message ? `Message: ${data.message}` : '',
            ]
      try {
        await payload.sendEmail({
          to,
          subject: `New ${type} lead — ${name}`,
          text: lines.filter(Boolean).join('\n'),
        })
      } catch (e) {
        payload.logger.error({ err: e }, 'Lead notification email failed')
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Lead create failed', e)
    return NextResponse.json({ error: 'Could not save your request. Please call us.' }, { status: 500 })
  }
}
