import type { Metadata } from 'next'

import { CityBody } from '@/components/city/CityBody'
import { JsonLd } from '@/components/ui/JsonLd'
import { PuckRender } from '@/builder/PuckRender'
import { asMedia, builtLayout, getPage, getServiceArea, getSiteSettings } from '@/lib/data'
import { DEFAULT_CITIES, type CityData } from '@/lib/cities'
import { breadcrumbLd, cityContractorLd } from '@/lib/jsonld'
import { resolveBiz } from '@/lib/site'

export async function cityMetadata(slug: string): Promise<Metadata> {
  const [area] = await Promise.all([getServiceArea(slug)])
  const def = DEFAULT_CITIES[slug]
  const name = area?.city || def.name
  return {
    title: `Siding Contractor in ${name}, CA | James Hardie® Installation, Repair & Replacement`,
    description:
      `Local ${name} siding contractor — expert James Hardie® fiber cement & cedar siding installation, replacement & repair. Free quotes; we beat any like-for-like quote by 10%.`,
    alternates: { canonical: `/siding-${slug}` },
  }
}

export async function CityRoute({ slug }: { slug: string }) {
  const [area, settings, page] = await Promise.all([getServiceArea(slug), getSiteSettings(), getPage(`siding-${slug}`)])
  // If this location page has been customised in the visual builder, render that.
  const layout = builtLayout(page)
  if (layout) return <PuckRender data={layout} />
  const def = DEFAULT_CITIES[slug]
  const city: CityData = area
    ? {
        slug,
        name: area.city,
        h1: area.h1,
        intro: area.intro,
        localPoints: (area.localPoints || []).map((p) => ({ title: p.title, description: p.description })),
        closingBlurb: area.closingBlurb || def.closingBlurb,
        neighborhoods: (area.neighborhoods || []).map((n) => n.name),
      }
    : def
  const heroMedia = asMedia(area?.heroImage)
  const biz = resolveBiz(settings)
  const url = `/siding-${slug}`

  return (
    <>
      <JsonLd data={[cityContractorLd(biz, city.name, url), breadcrumbLd([{ name: 'Home', url: '/' }, { name: `${city.name} Siding`, url }])]} />
      <CityBody city={city} heroMedia={heroMedia} />
    </>
  )
}
