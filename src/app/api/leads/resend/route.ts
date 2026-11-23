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
 *   GET /api/leads/resend?key=<CRM_WEBSITE_SECRET>            counts, sends nothing
 *   GET /api/leads/resend?key=...&send=1                      sends them to the CRM
 *   optional: &since=2026-06-18&until=2026-11-24
 *
 * Instant quote leads are left out: they use a different CRM function and
 * always arrived. Sending twice makes duplicate leads in the CRM, so run
 * send=1 once.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const key = process.env.CRM_WEBSITE_SECRET
  if (!key || url.searchParams.get('key') !== key) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const since = url.searchParams.get('since') || '2026-01-01'
  const until = url.searchParams.get('until') || new Date().toISOString()
  const send = url.searchParams.get('send') === '1'
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'leads', limit: 2000, depth: 0, sort: 'createdAt', overrideAccess: true,
    where: { and: [{ createdAt: { greater_than_equal: since } }, { createdAt: { less_than_equal: until } }, { source: { not_equals: 'instant-quote' } }] },
  })
  const leads = docs as any[]
  const summary = {
    found: leads.length,
    contact: leads.filter((l) => l.type === 'contact').length,
    quote: leads.filter((l) => l.type !== 'contact').length,
    first: leads[0]?.createdAt || null,
    last: leads[leads.length - 1]?.createdAt || null,
  }
  if (!send) return NextResponse.json({ dryRun: true, ...summary })

  let sent = 0
  const failed: string[] = []
  for (const l of leads) {
    const type = l.type === 'contact' ? 'contact' : 'quote'
    const ok = await forwardToCrm({
      type, name: l.name, email: l.email, phone: l.phone,
      c: { address: l.address, city: l.city, zip: l.zip, notes: l.notes },
      body: {
        interest: l.interest,
        message: [l.message, `(Sent late: filled in on the website on ${String(l.createdAt).slice(0, 10)}.)`].filter(Boolean).join('\n\n'),
        selection: l.selection, project: l.project, estimate: l.estimate, notes: l.notes,
        page_url: null,
      },
    })
    if (ok) sent++
    else failed.push(String(l.createdAt))
  }
  return NextResponse.json({ ...summary, sent, failed })
}
