import { NextResponse } from 'next/server'

import { getGalleryProjects, getPage } from '@/lib/data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Temporary diagnostic: does the render-path data layer read the DB at runtime? */
export async function GET() {
  const gp = await getGalleryProjects()
  const about = await getPage('about-us')
  const services = await getPage('services')
  const content = (p: unknown) =>
    ((p as { layout?: { content?: { type?: string; props?: Record<string, unknown> }[] } })?.layout
      ?.content) || []
  const tabs = content(about).find((b) => b.type === 'MaterialsTabs') as
    | { props?: { tabs?: { label?: string }[] } }
    | undefined
  const grid = content(services).find(
    (b) => (b.props as { id?: string })?.id === 'materials-services',
  ) as { props?: { items?: { title?: string }[] } } | undefined
  return NextResponse.json({
    galleryCount: gp.length,
    firstTitle: gp[0]?.title ?? null,
    aboutTabs: tabs?.props?.tabs?.map((t) => t.label) ?? null,
    servicesGrid: grid?.props?.items?.map((i) => i.title) ?? null,
  })
}
