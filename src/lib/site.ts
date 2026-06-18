import type { SiteSetting } from '@/payload-types'
import { ALL_CITIES } from './cities'

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  'http://localhost:3000'
).replace(/\/$/, '')

/** Default NAP / brand info. Mirrors the .dc.html designs; overridden by SiteSettings. */
export const SITE = {
  name: 'Peninsula Siding Company, Inc.',
  shortName: 'Peninsula Siding Company',
  phone: '650-287-4208',
  phoneE164: '+1-650-287-4208',
  phoneHref: 'tel:6502874208',
  email: 'info@peninsulasidingcompany.com',
  street: '763 Polhemus Road, Suite 2',
  city: 'San Mateo',
  region: 'CA',
  zip: '94402',
  hours: 'Office open by appointment only.',
  promise: 'We beat any like-for-like quote by 10%',
  announcement: "We'll beat any like-for-like quote by 10% — Bay Area siding, no hidden costs.",
  socials: {
    facebook: 'https://www.facebook.com/peninsulasidingcompany',
    instagram: 'https://www.instagram.com/peninsulasidingcompany/',
    yelp: 'https://www.yelp.com/biz/peninsula-siding-company-san-mateo-5',
    pinterest: 'https://www.pinterest.com/peninsulasidingcompany/',
  },
  areaServed: ALL_CITIES.map((c) => c.name),
  geo: { latitude: 37.5403, longitude: -122.3372 },
  priceRange: '$$$',
  rating: { value: 5, count: 50 },
} as const

export interface Biz {
  name: string
  shortName: string
  phone: string
  phoneE164: string
  phoneHref: string
  email: string
  street: string
  city: string
  region: string
  zip: string
  hours: string
  promise: string
  announcement: string
  socials: { facebook: string; instagram: string; yelp: string; pinterest: string }
  areaServed: readonly string[]
  geo: { latitude: number; longitude: number }
  priceRange: string
  rating: { value: number; count: number }
  logoUrl?: string
}

/** Merge owner-edited SiteSettings over the static defaults. */
export function resolveBiz(settings: SiteSetting | null): Biz {
  if (!settings) return { ...SITE }
  return {
    ...SITE,
    name: settings.companyName || SITE.name,
    phone: settings.phone || SITE.phone,
    email: settings.email || SITE.email,
    street: settings.street || SITE.street,
    city: settings.city || SITE.city,
    region: settings.region || SITE.region,
    zip: settings.zip || SITE.zip,
    hours: settings.hours || SITE.hours,
    promise: settings.promiseText || SITE.promise,
    announcement: settings.announcement || SITE.announcement,
    socials: {
      facebook: settings.facebook || SITE.socials.facebook,
      instagram: settings.instagram || SITE.socials.instagram,
      yelp: settings.yelp || SITE.socials.yelp,
      pinterest: settings.pinterest || SITE.socials.pinterest,
    },
    rating: {
      value: settings.reviews?.ratingValue ?? SITE.rating.value,
      count: settings.reviews?.reviewCount ?? SITE.rating.count,
    },
  }
}

/** Main navigation. */
export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Design Inspirations', href: '/services/design-inspirations' },
      { label: 'Quality Pricing', href: '/services/quality-pricing' },
      { label: 'Service Areas', href: '/service-areas' },
    ],
  },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Benefits', href: '/benefits' },
  { label: 'Contact Us', href: '/contact-us' },
] as const

export const CITY_LINKS = [
  { label: 'San Mateo', href: '/siding-san-mateo' },
  { label: 'Redwood City', href: '/siding-redwood-city' },
  { label: 'Palo Alto', href: '/siding-palo-alto' },
]

/** A header/footer link (optionally with dropdown children). */
export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] }
export type FooterColumn = { heading: string; links: { label: string; href: string }[] }

/** Default footer link columns — used when Site Settings → Menus → Footer is empty. */
export const DEFAULT_FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: 'Areas we serve',
    links: [
      { label: 'All service areas', href: '/service-areas' },
      { label: 'San Mateo', href: '/siding-san-mateo' },
      { label: 'Burlingame', href: '/siding-burlingame' },
      { label: 'Redwood City', href: '/siding-redwood-city' },
      { label: 'Palo Alto', href: '/siding-palo-alto' },
      { label: 'Half Moon Bay', href: '/siding-half-moon-bay' },
    ],
  },
  {
    heading: 'Quick links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about-us' },
      { label: 'Services', href: '/services' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Benefits', href: '/benefits' },
    ],
  },
  {
    heading: 'Get in touch',
    links: [
      { label: 'Contact Us', href: '/contact-us' },
      { label: 'Free Quote', href: '/#quote' },
      { label: 'Resources', href: '/resources' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
    ],
  },
]
