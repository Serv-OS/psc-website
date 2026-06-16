import { headers as nextHeaders } from 'next/headers'
import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'
import { NAV, DEFAULT_FOOTER_COLUMNS } from '@/lib/site'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120

/**
 * One-off, admin-gated: apply the additive schema for editable menus + the
 * location-page slugs to the production DB, then seed the menu defaults.
 * DDL was generated and tested against a local Postgres mirror of the live
 * schema. Idempotent. Delete this route after running it.
 */
const ENUM_VALUES = ['siding-san-mateo', 'siding-redwood-city', 'siding-palo-alto']

const TABLE_DDL = [
  `CREATE TABLE IF NOT EXISTS public.site_settings_header_nav (
     _order integer NOT NULL, _parent_id integer NOT NULL,
     id character varying NOT NULL PRIMARY KEY,
     label character varying NOT NULL, href character varying NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS public.site_settings_header_nav_children (
     _order integer NOT NULL, _parent_id character varying NOT NULL,
     id character varying NOT NULL PRIMARY KEY,
     label character varying NOT NULL, href character varying NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS public.site_settings_footer_columns (
     _order integer NOT NULL, _parent_id integer NOT NULL,
     id character varying NOT NULL PRIMARY KEY,
     heading character varying NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS public.site_settings_footer_columns_links (
     _order integer NOT NULL, _parent_id character varying NOT NULL,
     id character varying NOT NULL PRIMARY KEY,
     label character varying NOT NULL, href character varying NOT NULL)`,
]

const INDEX_DDL = [
  `CREATE INDEX IF NOT EXISTS site_settings_header_nav_order_idx ON public.site_settings_header_nav USING btree (_order)`,
  `CREATE INDEX IF NOT EXISTS site_settings_header_nav_parent_id_idx ON public.site_settings_header_nav USING btree (_parent_id)`,
  `CREATE INDEX IF NOT EXISTS site_settings_header_nav_children_order_idx ON public.site_settings_header_nav_children USING btree (_order)`,
  `CREATE INDEX IF NOT EXISTS site_settings_header_nav_children_parent_id_idx ON public.site_settings_header_nav_children USING btree (_parent_id)`,
  `CREATE INDEX IF NOT EXISTS site_settings_footer_columns_order_idx ON public.site_settings_footer_columns USING btree (_order)`,
  `CREATE INDEX IF NOT EXISTS site_settings_footer_columns_parent_id_idx ON public.site_settings_footer_columns USING btree (_parent_id)`,
  `CREATE INDEX IF NOT EXISTS site_settings_footer_columns_links_order_idx ON public.site_settings_footer_columns_links USING btree (_order)`,
  `CREATE INDEX IF NOT EXISTS site_settings_footer_columns_links_parent_id_idx ON public.site_settings_footer_columns_links USING btree (_parent_id)`,
]

// FKs wrapped so a re-run doesn't error if the constraint already exists.
const FK_DDL = [
  ['site_settings_header_nav', 'site_settings_header_nav_parent_id_fk', 'public.site_settings'],
  ['site_settings_header_nav_children', 'site_settings_header_nav_children_parent_id_fk', 'public.site_settings_header_nav'],
  ['site_settings_footer_columns', 'site_settings_footer_columns_parent_id_fk', 'public.site_settings'],
  ['site_settings_footer_columns_links', 'site_settings_footer_columns_links_parent_id_fk', 'public.site_settings_footer_columns'],
].map(
  ([tbl, name, ref]) => `DO $$ BEGIN
    ALTER TABLE ONLY public.${tbl} ADD CONSTRAINT ${name}
      FOREIGN KEY (_parent_id) REFERENCES ${ref}(id) ON DELETE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
)

export async function POST() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await nextHeaders() })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const pool = (payload.db as unknown as { pool?: { query: (s: string) => Promise<unknown> } }).pool
  if (!pool) return NextResponse.json({ error: 'No pg pool on adapter' }, { status: 500 })

  const log: string[] = []
  const run = async (sql: string, label: string) => {
    try {
      await pool.query(sql)
      log.push(`ok: ${label}`)
    } catch (e) {
      log.push(`ERR ${label}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  // 1) enum values (each separate; ADD VALUE can't share a tx with usage)
  for (const v of ENUM_VALUES) {
    await run(`ALTER TYPE public.enum_pages_slug ADD VALUE IF NOT EXISTS '${v}'`, `enum ${v}`)
  }
  // 2) tables, indexes, FKs
  for (const s of TABLE_DDL) await run(s, 'table')
  for (const s of INDEX_DDL) await run(s, 'index')
  for (const s of FK_DDL) await run(s, 'fk')

  // 3) seed menu defaults so the admin shows the current menu, editable
  let seeded = false
  try {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        headerNav: NAV.map((i) => ({
          label: i.label,
          href: i.href,
          children: 'children' in i && i.children ? i.children.map((c) => ({ label: c.label, href: c.href })) : [],
        })),
        footerColumns: DEFAULT_FOOTER_COLUMNS.map((c) => ({ heading: c.heading, links: c.links.map((l) => ({ label: l.label, href: l.href })) })),
      } as never,
      overrideAccess: true,
    })
    seeded = true
  } catch (e) {
    log.push(`seed ERR: ${e instanceof Error ? e.message : String(e)}`)
  }

  return NextResponse.json({ ok: true, seeded, log })
}
