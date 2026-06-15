import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { BlogPosts } from './collections/BlogPosts'
import { ServiceAreas } from './collections/ServiceAreas'
import { GalleryProjects } from './collections/GalleryProjects'
import { Testimonials } from './collections/Testimonials'
import { Leads } from './collections/Leads'
import { Quotes } from './collections/Quotes'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Accept our own var first, then Vercel/Neon's auto-injected names, then SQLite dev default.
// Prefer the UNPOOLED/direct connection — pgBouncer transaction pooling breaks
// node-postgres prepared statements + Payload's schema push/DDL.
const databaseURI =
  process.env.DATABASE_URI ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  'file:./psc.db'
const usePostgres = !databaseURI.startsWith('file:')

// Parse EMAIL_FROM of the form: Name <email@domain>
const fromRaw = process.env.EMAIL_FROM || 'Peninsula Siding <info@peninsulasidingcompany.com>'
const fromMatch = fromRaw.match(/^\s*(.*?)\s*<([^>]+)>\s*$/)
const fromName = fromMatch?.[1] || 'Peninsula Siding'
const fromAddress = fromMatch?.[2] || fromRaw

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      title: 'Peninsula Siding — Staff Portal',
      titleSuffix: ' · Peninsula Siding',
      description: 'Peninsula Siding Company staff portal & content management.',
    },
    components: {
      beforeDashboard: ['/admin/DashboardKpis#DashboardKpis'],
      afterNavLinks: ['/admin/BuilderNavLink#BuilderNavLink', '/admin/QuoteBuilderNavLink#QuoteBuilderNavLink'],
      views: {
        quoteBuilder: {
          Component: '/admin/QuoteBuilder#QuoteBuilder',
          path: '/quote-builder',
        },
      },
    },
  },
  collections: [
    Pages,
    BlogPosts,
    ServiceAreas,
    GalleryProjects,
    Testimonials,
    Media,
    Leads,
    Quotes,
    Users,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  db: usePostgres
    ? // push:true auto-creates/syncs the schema on boot so the first Vercel deploy
      // works without a manual migration step. Switch to committed migrations later.
      postgresAdapter({ pool: { connectionString: databaseURI }, push: true })
    : sqliteAdapter({ client: { url: databaseURI } }),
  secret: process.env.PAYLOAD_SECRET || 'INSECURE-DEV-SECRET-CHANGE-ME',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  sharp,
  ...(process.env.RESEND_API_KEY
    ? {
        email: resendAdapter({
          defaultFromAddress: fromAddress,
          defaultFromName: fromName,
          apiKey: process.env.RESEND_API_KEY,
        }),
      }
    : {}),
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
