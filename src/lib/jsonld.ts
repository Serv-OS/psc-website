import type { Biz } from './site'
import { SITE_URL } from './site'
import type { FAQItem } from '@/components/ui/FAQ'

const address = (b: Biz) => ({
  '@type': 'PostalAddress',
  streetAddress: b.street,
  addressLocality: b.city,
  addressRegion: b.region,
  postalCode: b.zip,
  addressCountry: 'US',
})

export function generalContractorLd(b: Biz, opts: { url?: string; areaServed?: string[] } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: b.name,
    image: b.logoUrl ? `${SITE_URL}${b.logoUrl}` : `${SITE_URL}/logo.svg`,
    telephone: b.phoneE164,
    email: b.email,
    url: opts.url || SITE_URL,
    foundingDate: '2012',
    parentOrganization: {
      '@type': 'Organization',
      name: 'SEA Construction, Inc.',
      foundingDate: '1989',
    },
    address: address(b),
    geo: { '@type': 'GeoCoordinates', latitude: b.geo.latitude, longitude: b.geo.longitude },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.name}, ${b.street}, ${b.city}, ${b.region} ${b.zip}`)}`,
    priceRange: b.priceRange,
    areaServed: opts.areaServed || [...b.areaServed],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: b.rating.value.toFixed(1),
      reviewCount: String(b.rating.count),
    },
  }
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
    })),
  }
}

export function serviceCatalogLd(b: Biz) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Siding installation, replacement and repair',
    provider: {
      '@type': 'GeneralContractor',
      name: b.name,
      telephone: b.phoneE164,
      areaServed: 'San Mateo County, California',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Siding Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Siding Installation' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Siding Replacement' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Siding Repair' } },
      ],
    },
  }
}

export function faqPageLd(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function contactPageLd(b: Biz, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${b.shortName}`,
    url: `${SITE_URL}${url}`,
    mainEntity: {
      '@type': 'GeneralContractor',
      name: b.name,
      telephone: b.phoneE164,
      email: b.email,
      address: address(b),
    },
  }
}

export function cityContractorLd(b: Biz, city: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: b.name,
    image: `${SITE_URL}/logo.svg`,
    telephone: b.phoneE164,
    url: `${SITE_URL}${url}`,
    address: address(b),
    geo: { '@type': 'GeoCoordinates', latitude: b.geo.latitude, longitude: b.geo.longitude },
    priceRange: b.priceRange,
    areaServed: { '@type': 'City', name: `${city}, California` },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(b.rating.value),
      reviewCount: String(b.rating.count),
    },
  }
}

export function blogPostingLd(opts: {
  title: string
  description?: string
  url: string
  image?: string
  datePublished?: string
  author?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    image: opts.image ? (opts.image.startsWith('http') ? opts.image : `${SITE_URL}${opts.image}`) : undefined,
    datePublished: opts.datePublished,
    author: { '@type': 'Organization', name: opts.author || 'Peninsula Siding Company' },
    publisher: {
      '@type': 'Organization',
      name: 'Peninsula Siding Company',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
    },
    mainEntityOfPage: `${SITE_URL}${opts.url}`,
  }
}
