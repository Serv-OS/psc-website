import { headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Data } from '@measured/puck'

import { Editor } from '@/builder/Editor'
import { PAGE_SLUGS } from '@/collections/Pages'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const VALID = new Set(PAGE_SLUGS.map((p) => p.value))

export default async function BuilderPage({ params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params
  const slug = path?.[0] && VALID.has(path[0] as never) ? path[0] : 'home'

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await nextHeaders() })
  if (!user) redirect('/admin/login?redirect=/builder')

  const res = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  const data = (res.docs[0]?.layout as Data | undefined) || null

  return <Editor slug={slug} initialData={data} />
}
