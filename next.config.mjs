import { withPayload } from '@payloadcms/next/withPayload'

/**
 * Old WordPress/Elementor URLs → new clean routes. Next normalizes the trailing
 * slash automatically, but we keep both shapes for safety on indexed URLs.
 */
const wpRedirect = (from, to) => [
  { source: from, destination: to, permanent: true },
  { source: `${from}/`, destination: to, permanent: true },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'posup.co.uk' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  async redirects() {
    return [
      ...wpRedirect('/index.php/about-us', '/about-us'),
      ...wpRedirect('/index.php/services', '/services'),
      ...wpRedirect('/index.php/design-inspirations', '/services/design-inspirations'),
      ...wpRedirect('/index.php/quality-pricing', '/services/quality-pricing'),
      ...wpRedirect('/index.php/gallery', '/gallery'),
      ...wpRedirect('/index.php/benefits', '/benefits'),
      ...wpRedirect('/index.php/contact-us', '/contact-us'),
      ...wpRedirect('/index.php/siding-san-mateo', '/siding-san-mateo'),
      ...wpRedirect('/index.php/siding-redwood-city', '/siding-redwood-city'),
      ...wpRedirect('/index.php/siding-palo-alto', '/siding-palo-alto'),
      ...wpRedirect('/index.php', '/'),
    ]
  },
}

export default withPayload(nextConfig)
