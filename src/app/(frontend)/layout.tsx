import './globals.css'

import type { Metadata } from 'next'
import Script from 'next/script'
import { Poppins } from 'next/font/google'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { asMedia, getSiteSettings } from '@/lib/data'
import { resolveBiz, SITE_URL, NAV, DEFAULT_FOOTER_COLUMNS, type NavItem, type FooterColumn } from '@/lib/site'

/** Drop empty/blank entries so a half-filled CMS menu never wipes the defaults. */
const cleanNav = (items: unknown): NavItem[] | null => {
  if (!Array.isArray(items)) return null
  const out = items
    .filter((i): i is NavItem => !!i && typeof (i as NavItem).label === 'string' && !!(i as NavItem).href)
    .map((i) => ({ label: i.label, href: i.href, children: Array.isArray(i.children) ? i.children.filter((c) => c?.label && c?.href) : undefined }))
  return out.length ? out : null
}
const cleanCols = (cols: unknown): FooterColumn[] | null => {
  if (!Array.isArray(cols)) return null
  const out = cols
    .filter((c): c is FooterColumn => !!c && typeof (c as FooterColumn).heading === 'string')
    .map((c) => ({ heading: c.heading, links: Array.isArray(c.links) ? c.links.filter((l) => l?.label && l?.href) : [] }))
  return out.length ? out : null
}

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Peninsula Siding Company | San Mateo & Bay Area Siding Experts',
    template: '%s | Peninsula Siding Company',
  },
  description:
    'Elite Preferred James Hardie® siding contractor serving San Mateo, Redwood City, Palo Alto & the Bay Area. Premium fiber cement & cedar siding — we beat any like-for-like quote by 10%.',
  openGraph: {
    type: 'website',
    siteName: 'Peninsula Siding Company',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peninsula Siding Company | Bay Area Siding Experts',
    description:
      'James Hardie® fiber cement & cedar siding across the Bay Area — installation, repair & replacement. We beat any like-for-like quote by 10%.',
  },
  robots: { index: true, follow: true },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const biz = resolveBiz(settings)
  const logoUrl = asMedia(settings?.logo)?.url || '/logo.svg'
  const s = settings as unknown as { headerNav?: unknown; footerColumns?: unknown } | null
  const nav = cleanNav(s?.headerNav) ?? (NAV as unknown as NavItem[])
  const footerColumns = cleanCols(s?.footerColumns) ?? DEFAULT_FOOTER_COLUMNS

  return (
    <html lang="en" className={poppins.variable}>
      <body>
        {/* overflow-x: clip (not hidden) prevents horizontal scroll WITHOUT creating a
            scroll container that would break position: sticky on descendant elements. */}
        <div style={{ overflowX: 'clip' }}>
          <Header announcement={biz.announcement} phone={biz.phone} logoUrl={logoUrl} nav={nav} />
          {children}
          <Footer biz={biz} logoUrl={logoUrl} columns={footerColumns} />
        </div>

        {/* Sales chat. Qualifies the enquiry, prices it from the live catalogue
            and writes the lead straight into the CRM. Served from the CRM so the
            widget and the assistant behind it are never out of step.

            Deliberately in the (frontend) layout only: the Payload admin and the
            page builder must not carry it.

            The heading, subtitle and colour live on the embed in the CRM under
            Settings → Sales chat; they are passed here because the widget reads
            them from this tag. Change them there and re-copy the snippet. */}
        <Script
          src="https://psc-crm.vercel.app/chat.js"
          data-site-key="chat_4b7a8a496496f2171ccd"
          data-title="Peninsula Siding Company"
          data-subtitle="How can we help?"
          data-accent="#008f1e"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
