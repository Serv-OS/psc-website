import './globals.css'

import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { asMedia, getSiteSettings } from '@/lib/data'
import { resolveBiz, SITE_URL } from '@/lib/site'

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
  robots: { index: true, follow: true },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const biz = resolveBiz(settings)
  const logoUrl = asMedia(settings?.logo)?.url || '/logo.svg'

  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <div style={{ overflowX: 'hidden' }}>
          <Header announcement={biz.announcement} phone={biz.phone} logoUrl={logoUrl} />
          {children}
          <Footer biz={biz} logoUrl={logoUrl} />
        </div>
      </body>
    </html>
  )
}
