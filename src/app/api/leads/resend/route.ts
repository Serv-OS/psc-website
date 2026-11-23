import { NextResponse } from 'next/server'

import { forwardToCrm } from '@/lib/crmForward'
import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

/**
 * One off repair (23 Nov 2026). Until then the CRM refused every website
 * contact form and home quote (no reCAPTCHA token, nobody read the answer), so
 * those leads sit only in this site's Leads list. This sends them on.
 *
 * POST { key, since?, until?, list?, send?, skip? }
 *   key    CRM_WEBSITE_SECRET
 *   list   true: also return each lead's date, type and email (to check for
 *          ones the CRM already has)
 *   send   true: send them to the CRM. Without it nothing is sent.
 *   skip   emails to leave out (already in the CRM)
 *
 * Instant quote leads are left out: they use a different CRM function and
 * always arrived. Sending twice makes duplicate leads, so send once.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const key = process.env.CRM_WEBSITE_SECRET
  if (!key || body.key !== key) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const since = String(body.since || '2026-01-01')
  const until = String(body.until || new Date().toISOString())
  const skip = new Set((Array.isArray(body.skip) ? body.skip : []).map((e: string) => String(e).trim().toLowerCase()))
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'leads', limit: 2000, depth: 0, sort: 'createdAt', overrideAccess: true,
    where: { and: [{ createdAt: { greater_than_equal: since } }, { createdAt: { less_than_equal: until } }, { source: { not_equals: 'instant-quote' } }] },
  })
  const leads = (docs as any[]).filter((l) => !skip.has(String(l.email || '').trim().toLowerCase()))
  const summary: Record<string, unknown> = {
    found: docs.length, skipped: docs.length - leads.length, toSend: leads.length,
    contact: leads.filter((l) => l.type === 'contact').length,
    quote: leads.filter((l) => l.type !== 'contact').length,
    first: leads[0]?.createdAt || null, last: leads[leads.length - 1]?.createdAt || null,
  }
  if (body.list) summary.leads = (docs as any[]).map((l) => ({ at: l.createdAt, type: l.type, status: l.status, source: l.source, email: l.email }))
  if (!body.send) return NextResponse.json({ dryRun: true, ...summary })

  let sent = 0
  const failed: string[] = []
  for (const l of leads) {
    const type = l.type === 'contact' ? 'contact' : 'quote'
    const ok = await forwardToCrm({
      type, name: l.name, email: l.email, phone: l.phone,
      c: { address: l.address, city: l.city, zip: l.zip, notes: l.notes },
      body: { source: l.source, interest: l.interest, message: l.message, selection: l.selection, project: l.project, estimate: l.estimate, notes: l.notes, page_url: null },
      labelNote: `SENT LATE: filled in on the website on ${String(l.createdAt).slice(0, 10)}`,
    })
    if (ok) sent++
    else failed.push(String(l.createdAt))
  }
  return NextResponse.json({ ...summary, sent, failed })
}
