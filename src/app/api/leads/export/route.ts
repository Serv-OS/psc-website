import { headers as nextHeaders } from 'next/headers'

import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function csvCell(v: unknown): string {
  const s = v === null || v === undefined ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Auth-gated CSV export of all leads (staff only). */
export async function GET() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await nextHeaders() })
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { docs } = await payload.find({ collection: 'leads', limit: 5000, depth: 0, sort: '-createdAt' })

  const cols = ['createdAt', 'type', 'status', 'name', 'email', 'phone', 'address', 'city', 'zip', 'interest', 'message', 'estimateLow', 'estimateHigh', 'sqft', 'stories', 'source']
  const rows = docs.map((l: Record<string, any>) =>
    [
      l.createdAt,
      l.type,
      l.status,
      l.name,
      l.email,
      l.phone,
      l.address,
      l.city,
      l.zip,
      l.interest,
      l.message,
      l.estimate?.low,
      l.estimate?.high,
      l.project?.sqft,
      l.project?.stories,
      l.source,
    ]
      .map(csvCell)
      .join(','),
  )
  const csv = [cols.join(','), ...rows].join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="psc-leads.csv"`,
    },
  })
}
