/**
 * Migrate images from the existing WordPress media library into the Media
 * collection, then auto-assign the obvious ones (logo, gallery before/after).
 *
 * Run with:  npm run migrate:media
 * Requires outbound network access to the WP uploads host.
 *
 * Idempotent: images already present (matched by filename) are reused, not
 * re-downloaded. Everything else can be assigned to records in the admin.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const BASE = 'https://posup.co.uk/peninsulasidings/wp-content/uploads/'

type Item = { path: string; alt: string; key: string }

const GALLERY_NS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17]
const CATEGORIES = ['fiber', 'batten', 'cedar', 'shingle']

// Singletons + brand
const BRAND: Item[] = [
  { path: '2025/11/Peninsula-sidings-company.svg', alt: 'Peninsula Siding Company logo', key: 'logo' },
  { path: '2026/02/RS29082_Alliance_elite_contractor-1920w.webp', alt: 'James Hardie Elite Preferred Contractor badge', key: 'elite-badge' },
  { path: '2025/11/Yelp_Logo.svg.png', alt: 'Yelp logo', key: 'yelp' },
  { path: '2025/11/Google_2015_logo.svg.png', alt: 'Google logo', key: 'google' },
  { path: '2025/11/Houzz_logo_2024.png', alt: 'Houzz logo', key: 'houzz' },
  { path: '2025/11/hardie-plank-lap-select-cedarmill.png', alt: 'James Hardie plank lap select cedarmill (wood texture)', key: 'tex-wood' },
  { path: '2025/11/hardie-plank-lap-smooth.png', alt: 'James Hardie plank lap smooth texture', key: 'tex-smooth' },
]

// Services "after" thumbnails (768×768)
const SERVICE_THUMBS: Item[] = [
  { path: '2026/02/13-after-768x768.jpg', alt: 'James Hardie fiber cement siding project', key: 'svc-hardie' },
  { path: '2026/02/12-after-768x768.jpg', alt: 'Cedar Valley cedar siding project', key: 'svc-cedar' },
  { path: '2026/02/7-after-768x768.jpg', alt: 'Shakertown cedar siding project', key: 'svc-shakertown' },
  { path: '2026/02/4-after-768x768.jpg', alt: 'Siding installation project', key: 'svc-install' },
  { path: '2026/02/3-after-768x768.jpg', alt: 'Siding replacement project', key: 'svc-replace' },
  { path: '2026/02/2-after-768x768.jpg', alt: 'Siding repair project', key: 'svc-repair' },
]

const filenameOf = (p: string) => p.split('/').pop() as string

async function run() {
  const payload = await getPayload({ config })

  /** Download (once) and create a Media record; reuse if filename already exists. */
  async function ensureMedia(item: Item): Promise<number | null> {
    const filename = filenameOf(item.path)
    const existing = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })
    if (existing.docs.length) return existing.docs[0].id as number
    try {
      const res = await fetch(BASE + item.path)
      if (!res.ok) {
        payload.logger.warn(`✗ ${filename} — HTTP ${res.status}`)
        return null
      }
      const data = Buffer.from(await res.arrayBuffer())
      const created = await payload.create({
        collection: 'media',
        data: { alt: item.alt },
        file: { data, mimetype: res.headers.get('content-type') || 'image/jpeg', name: filename, size: data.length },
      })
      payload.logger.info(`✓ ${filename}`)
      return created.id as number
    } catch (e) {
      payload.logger.warn(`✗ ${filename} — ${String(e)}`)
      return null
    }
  }

  const ids: Record<string, number> = {}

  // 1) Brand + service thumbs
  for (const item of [...BRAND, ...SERVICE_THUMBS]) {
    const id = await ensureMedia(item)
    if (id) ids[item.key] = id
  }

  // 2) Gallery before/after pairs
  let gi = 0
  for (const n of GALLERY_NS) {
    const before = await ensureMedia({ path: `2026/02/${n}-before.jpg`, alt: `Bay Area siding project ${n} — before`, key: `g${n}-before` })
    const afterPath = n === 8 ? '2026/02/8-sfter.jpg' : `2026/02/${n}-after.jpg` // note: 8-after is misspelled in WP
    const after = await ensureMedia({ path: afterPath, alt: `Bay Area siding project ${n} — after`, key: `g${n}-after` })
    if (!before && !after) continue
    const title = `Bay Area project ${n}`
    const found = await payload.find({ collection: 'gallery-projects', where: { title: { equals: title } }, limit: 1 })
    const data = {
      title,
      location: 'Bay Area',
      category: CATEGORIES[gi % CATEGORIES.length] as never,
      featured: gi === 0,
      beforeImage: before ?? undefined,
      afterImage: after ?? undefined,
      order: 100 + gi,
    }
    if (found.docs.length) await payload.update({ collection: 'gallery-projects', id: found.docs[0].id, data })
    else await payload.create({ collection: 'gallery-projects', data })
    gi++
  }

  // 3) Auto-assign logo to Site Settings
  if (ids.logo) {
    await payload.updateGlobal({ slug: 'site-settings', data: { logo: ids.logo } })
    payload.logger.info('✓ Assigned logo to Site Settings')
  }

  // 4) Assign service thumbnails to the Services page image slots
  const servicesPage = await payload.find({ collection: 'pages', where: { slug: { equals: 'services' } }, limit: 1 })
  if (servicesPage.docs.length) {
    const images = [
      ids['svc-install'] && { key: 'service-install', image: ids['svc-install'] },
      ids['svc-replace'] && { key: 'service-replace', image: ids['svc-replace'] },
      ids['svc-repair'] && { key: 'service-repair', image: ids['svc-repair'] },
    ].filter(Boolean)
    if (images.length) {
      await payload.update({ collection: 'pages', id: servicesPage.docs[0].id, data: { images: images as never } })
      payload.logger.info('✓ Assigned service thumbnails to Services page')
    }
  }

  payload.logger.info('✅ Media migration complete. Remaining images are in the Media library — assign hero/swatch images in the admin.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
