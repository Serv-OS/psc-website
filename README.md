# Peninsula Siding Company — Website, CMS & Staff Portal

A fast, SEO-strong marketing site for **Peninsula Siding Company** (Bay Area siding
contractor), with an owner-editable CMS, a customer **instant-quote engine**, and a
**staff quoting portal** — built on **Next.js (App Router) + Payload CMS 3**.

- **Public site** — Home, About, Services (+ Design Inspirations, Quality Pricing),
  Gallery, Benefits, Contact, three city pages, and a Resources blog.
- **Instant quote engine** (`/#quote`) — profile/texture/color visualizer → 3-step
  estimate → lead. Returns an estimate **range** only (never cost/markup).
- **Staff portal** (`/admin`) — login, dashboard KPIs, **Quote Builder** (full
  internal cost/markup/P&L calculator), leads inbox + CSV export, blog editor,
  media library, and all content collections.
- **Every image is a Media record** — swap any photo from the admin, no code.

---

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript), SSG/ISR |
| CMS / admin / auth | Payload CMS 3 (mounted at `/admin`) |
| DB (dev) | SQLite (`@payloadcms/db-sqlite`) — zero infra |
| DB (prod) | Vercel Postgres / Neon (`@payloadcms/db-postgres`) |
| Media | Local FS (dev) / Vercel Blob (prod, `@payloadcms/storage-vercel-blob`) |
| Email | Resend (`@payloadcms/email-resend`) — optional |
| Fonts | Poppins via `next/font` |

The DB adapter is chosen automatically: a `DATABASE_URI` starting with `file:` uses
SQLite; anything else is treated as Postgres.

---

## Quick start (local)

```bash
npm install
cp .env.example .env        # the committed .env already has working dev defaults
npm run dev                 # http://localhost:3000  (admin at /admin)
```

Then **seed launch content** (admin user, pages, cities, gallery, posts, testimonials):

```bash
npm run seed
# — or, while `npm run dev` is running, just open: http://localhost:3000/api/seed
```

Seed creates an admin login (override with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`):

```
admin@peninsulasidingcompany.com  /  ChangeMe!2026     ← change this in /admin
```

> `/api/seed` is automatically disabled in production (unless `ALLOW_SEED=true`).

### Migrate the existing WordPress photos

```bash
npm run migrate:media       # needs outbound network to the WP uploads host
```

Downloads the images named in the migration manifest into the Media library, then
auto-assigns the logo, gallery before/after pairs, and service thumbnails. Remaining
hero/swatch images can be assigned per record in the admin.

---

## Environment variables

See **`.env.example`** for the full list. Key ones:

| Var | Purpose |
|---|---|
| `DATABASE_URI` | `file:./psc.db` (SQLite dev) or a Postgres URL (prod) |
| `PAYLOAD_SECRET` | Signs cookies/JWTs — set a long random value in prod |
| `NEXT_PUBLIC_SERVER_URL` | Public base URL (canonical/OG/sitemap) |
| `SALES_INBOX` | Where new-lead emails go |
| `RESEND_API_KEY` / `EMAIL_FROM` | Lead notification emails (optional) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob media storage (required in prod) |

---

## Project structure

```
src/
  app/
    (frontend)/        # public site (layout, pages, globals.css)
    (payload)/         # Payload admin + REST/GraphQL routes
    api/
      leads/           # POST lead, GET leads/export (CSV)
      seed/            # dev-only seeding endpoint
    robots.ts, sitemap.ts
  admin/               # custom admin UI (Quote Builder, dashboard KPIs, nav link)
  collections/         # Pages, BlogPosts, ServiceAreas, GalleryProjects,
                       # Testimonials, Media, Leads, Quotes, Users
  globals/             # SiteSettings (NAP, socials, promise, quote constants)
  components/          # Header, Footer, UI kit, page-specific client components
  lib/                 # quote engine, data access, jsonld, site config, cities
  fields/              # shared SEO field group
scripts/               # seed.ts, migrate-wp-media.ts
```

## CMS collections

`Pages` · `BlogPosts` · `ServiceAreas` · `GalleryProjects` · `Testimonials` ·
`Media` · `Leads` · `Quotes` · `Users`, plus the `SiteSettings` global. Each public
collection includes an SEO field group (metaTitle, metaDescription, ogImage, canonical).

The page components ship with the seeded design copy as defaults and read editable
overrides (hero copy + named image slots) from the `Pages` collection, so the owner
can change copy and swap any image without touching code.

## Quote engine

All pricing lives in `src/lib/quote.ts` and is shared between the customer estimate
and the staff Quote Builder. The customer-tunable constants are mirrored in
`SiteSettings → Quote pricing`. Customer-facing code returns only a rounded **range**;
cost / markup / P&L are exposed exclusively in the staff Quote Builder.

## SEO

Per-page title/description/canonical/OG, one H1/page, JSON-LD
(`GeneralContractor`/`LocalBusiness`, `BreadcrumbList`, `Service`/`OfferCatalog`,
`FAQPage`, `BlogPosting`, `ContactPage`), auto `sitemap.xml` + `robots.txt`, and
301s from the old WordPress URLs (`next.config.mjs`).

---

## Deploy (Vercel + GitHub)

1. Push to GitHub (`https://github.com/Serv-OS/psc-website`).
2. Create a Vercel project from the repo.
3. Provision **Vercel Postgres / Neon** and **Vercel Blob**.
4. Set env vars in Vercel: `DATABASE_URI` (Postgres URL), `PAYLOAD_SECRET`,
   `NEXT_PUBLIC_SERVER_URL`, `BLOB_READ_WRITE_TOKEN`, `SALES_INBOX`, and
   (optional) `RESEND_API_KEY` / `EMAIL_FROM`.
5. Deploy. On first deploy, run the seed once (set `ALLOW_SEED=true` and hit
   `/api/seed`, then remove it) or run `npm run seed` against the prod DB, then
   `npm run migrate:media`.

Payload pushes the schema automatically in dev (SQLite). For Postgres in production,
generate and commit migrations with `npm run payload migrate:create` and run
`npm run payload migrate` on deploy.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run seed` | Seed launch content |
| `npm run migrate:media` | Import WordPress images → Media |
| `npm run generate:types` | Regenerate `payload-types.ts` |
| `npm run generate:importmap` | Regenerate the admin import map |
