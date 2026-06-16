import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

// Forward each lead into the ServOS CRM (psc-crm) for lead management. Public,
// no-auth ingest endpoint; overridable via env for other environments.
const CRM_FORMS_URL =
  process.env.CRM_FORMS_URL ||
  'https://xxazlzkhwraqfeqjzviz.supabase.co/functions/v1/forms-public'

const usdRange = (lo?: number, hi?: number) => {
  const f = (n?: number) => (typeof n === 'number' ? '$' + Math.round(n).toLocaleString('en-US') : '')
  return lo || hi ? `${f(lo)} – ${f(hi)}`.trim() : ''
}

// Best-effort: never let a CRM hiccup break the website form.
async function forwardToCrm(args: {
  type: 'contact' | 'quote'
  name: string
  email: string
  phone: string
  c: any
  body: any
}) {
  const { type, name, email, phone, c, body } = args
  const parts = name.trim().split(/\s+/)
  const first_name = parts[0] || ''
  const last_name = parts.slice(1).join(' ')

  let slug: string
  let data: Record<string, any>
  if (type === 'contact') {
    slug = 'website-contact'
    data = {
      first_name, last_name, email, phone,
      address: c.address, city: c.city, zip: c.zip,
      interest: body?.interest, message: body?.message,
    }
  } else {
    slug = 'website-estimate'
    const sel = body?.selection || {}
    const proj = body?.project || {}
    const est = body?.estimate || {}
    data = {
      first_name, last_name, email, phone,
      address: c.address,
      profile: sel.profile, texture: sel.texture, color: sel.color,
      sqft: proj.sqft, stories: proj.stories,
      estimate_range: usdRange(est.low, est.high),
      notes: c.notes || body?.notes,
    }
  }
  for (const k of Object.keys(data)) {
    if (data[k] === undefined || data[k] === null || data[k] === '') delete data[k]
  }

  try {
    await fetch(CRM_FORMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, data, page_url: body?.page_url || null }),
    })
  } catch (e) {
    console.error('CRM lead forward failed', e)
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

    // Mirror the lead into the ServOS CRM for lead management (best-effort).
    await forwardToCrm({ type, name, email, phone, c, body })

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
