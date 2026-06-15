import type { Payload } from 'payload'

import { DEFAULT_CITIES } from './cities'

/** Minimal Lexical rich-text from plain paragraphs. */
function richText(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        version: 1,
        format: '',
        indent: 0,
        direction: 'ltr',
        children: [{ type: 'text', version: 1, text, format: 0, style: '', mode: 'normal', detail: 0 }],
      })),
    },
  }
}

const PAGES = [
  { slug: 'home', title: 'Home' },
  { slug: 'about-us', title: 'About Us', heading: 'Bay Area siding, done the right way.' },
  { slug: 'services', title: 'Services' },
  { slug: 'design-inspirations', title: 'Design Inspirations' },
  { slug: 'quality-pricing', title: 'Quality Pricing' },
  { slug: 'gallery', title: 'Gallery' },
  { slug: 'benefits', title: 'Benefits' },
  { slug: 'contact-us', title: 'Contact Us' },
  { slug: 'resources', title: 'Resources' },
]

const GALLERY = [
  { title: 'Hillsborough re-side', location: 'Hillsborough', category: 'fiber', featured: true },
  { title: 'San Mateo board & batten', location: 'San Mateo', category: 'batten', featured: false },
  { title: 'Burlingame cedar shingle', location: 'Burlingame', category: 'shingle', featured: false },
  { title: 'Redwood City modern panel', location: 'Redwood City', category: 'batten', featured: false },
  { title: 'Palo Alto Craftsman', location: 'Palo Alto', category: 'fiber', featured: false },
  { title: 'Belmont cedar refresh', location: 'Belmont', category: 'cedar', featured: false },
  { title: 'Foster City lap siding', location: 'Foster City', category: 'fiber', featured: false },
  { title: 'Menlo Park shingle', location: 'Menlo Park', category: 'shingle', featured: false },
  { title: 'San Carlos board & batten', location: 'San Carlos', category: 'batten', featured: false },
]

const TESTIMONIALS = [
  { author: 'San Mateo homeowner', location: 'San Mateo', projectType: 'Whole-house re-side', rating: 5, quote: 'The crew was meticulous and the new Hardie siding completely transformed our curb appeal. Clear pricing, no surprises.', order: 1 },
  { author: 'Redwood City homeowner', location: 'Redwood City', projectType: 'Siding + windows', rating: 5, quote: 'Professional from the first call to the final walkthrough. They beat another quote and still delivered top quality.', order: 2 },
  { author: 'Palo Alto homeowner', location: 'Palo Alto', projectType: 'Board & batten', rating: 5, quote: 'Communication was excellent throughout. The 5-year warranty gave us real peace of mind. Highly recommend.', order: 3 },
]

const POSTS = [
  { title: 'How Much Does Siding Cost in the Bay Area?', slug: 'how-much-does-siding-cost-bay-area', category: 'cost-guide', status: 'published', excerpt: 'A clear breakdown of what drives siding cost on the Peninsula — materials, labor, permits and more.', body: ['Siding cost in the Bay Area depends on a handful of factors: the square footage of your home, the material and profile you choose, the number of stories, and the condition of your existing exterior.', 'James Hardie® fiber cement is the most popular choice locally for its durability and fire resistance. ColorPlus® finishes cost a little more up front but save on repainting over the life of the siding.', 'The best way to know your number is a free on-site measurement — and remember, we beat any like-for-like quote by 10%.'] },
  { title: 'James Hardie ColorPlus vs. Primed & Painted', slug: 'colorplus-vs-primed-and-painted', category: 'buying-guide', status: 'published', excerpt: 'Factory-applied ColorPlus® or a custom paint job? Here is how to choose for a Bay Area home.', body: ['ColorPlus® is a factory-applied, fade-resistant finish backed by a 15-year warranty. It resists the coastal grime and UV that wear down field-applied paint.', 'Primed boards let you match any custom color, which is ideal for HOA palettes or a very specific look — at the cost of more frequent repainting.', 'For most Peninsula homeowners, ColorPlus® delivers the best long-term value and the lowest maintenance.'] },
  { title: "7 Signs It's Time to Replace Your Siding", slug: '7-signs-time-to-replace-your-siding', category: 'homeowner-tips', status: 'draft', excerpt: 'Warping, rot, rising energy bills and more — the warning signs worth watching for.', body: ['From cracked boards to peeling paint and soft spots, here are the signs your siding may be due for replacement.'] },
  { title: 'Choosing Siding Colors for a Craftsman Home', slug: 'choosing-siding-colors-craftsman-home', category: 'design', status: 'draft', excerpt: 'Earthy palettes and mixed textures that make a Craftsman exterior sing.', body: ['Craftsman homes shine with earthy, natural tones and mixed textures — lap on the body with shingle accents in the gables.'] },
]

export type SeedResult = Record<string, number | string>

/** Idempotent seed of launch content. Returns a summary of what now exists. */
export async function seedDatabase(
  payload: Payload,
  opts: { adminEmail?: string; adminPassword?: string } = {},
): Promise<SeedResult> {
  const adminEmail = opts.adminEmail || process.env.SEED_ADMIN_EMAIL || 'admin@peninsulasidingcompany.com'
  const adminPassword = opts.adminPassword || process.env.SEED_ADMIN_PASSWORD || 'ChangeMe!2026'
  const result: SeedResult = {}

  // 1) Admin user
  const users = await payload.count({ collection: 'users' })
  if (users.totalDocs === 0) {
    await payload.create({ collection: 'users', data: { email: adminEmail, password: adminPassword, name: 'Site Owner', role: 'admin' } })
    result.adminCreated = adminEmail
  } else {
    result.adminCreated = 'skipped (users exist)'
  }

  // 2) Site settings (ensure pricing profiles)
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      pricing: {
        markup: 1.6, rangeLow: 0.92, rangeHigh: 1.12, installMatPer1000PerStory: 1067.39, permitsPerSqft: 0.96, debrisPerSqft: 2,
        profiles: [
          { key: 'lap', label: 'Lap Siding', cost: 4.8, install: 5.5 },
          { key: 'panel', label: 'Board & Batten', cost: 5.0, install: 5.5 },
          { key: 'shingle', label: 'Shingle', cost: 11.0, install: 6.5 },
          { key: 'artisan', label: 'Artisan V-Rustic', cost: 9.0, install: 8.0 },
        ],
      },
    },
  })
  result.siteSettings = 'updated'

  // 3) Pages
  let pagesCreated = 0
  for (const p of PAGES) {
    const found = await payload.find({ collection: 'pages', where: { slug: { equals: p.slug } }, limit: 1 })
    if (found.docs.length === 0) {
      await payload.create({
        collection: 'pages',
        data: { title: p.title, slug: p.slug as never, hero: { heading: (p as { heading?: string }).heading } },
      })
      pagesCreated++
    }
  }
  result.pagesCreated = pagesCreated

  // 4) Service areas
  let citiesCreated = 0
  for (const slug of Object.keys(DEFAULT_CITIES)) {
    const c = DEFAULT_CITIES[slug]
    const found = await payload.find({ collection: 'service-areas', where: { slug: { equals: slug } }, limit: 1 })
    if (found.docs.length === 0) {
      await payload.create({
        collection: 'service-areas',
        data: { city: c.name, slug, h1: c.h1, intro: c.intro, localPoints: c.localPoints, closingBlurb: c.closingBlurb, neighborhoods: c.neighborhoods.map((name) => ({ name })) },
      })
      citiesCreated++
    }
  }
  result.citiesCreated = citiesCreated

  // 5) Gallery
  const gallery = await payload.count({ collection: 'gallery-projects' })
  if (gallery.totalDocs === 0) {
    let order = 0
    for (const g of GALLERY) await payload.create({ collection: 'gallery-projects', data: { ...g, category: g.category as never, order: order++ } })
    result.galleryCreated = GALLERY.length
  } else {
    result.galleryCreated = 'skipped'
  }

  // 6) Testimonials
  const tests = await payload.count({ collection: 'testimonials' })
  if (tests.totalDocs === 0) {
    for (const t of TESTIMONIALS) await payload.create({ collection: 'testimonials', data: t })
    result.testimonialsCreated = TESTIMONIALS.length
  } else {
    result.testimonialsCreated = 'skipped'
  }

  // 7) Blog posts
  let postsCreated = 0
  for (const post of POSTS) {
    const found = await payload.find({ collection: 'blog-posts', where: { slug: { equals: post.slug } }, limit: 1 })
    if (found.docs.length === 0) {
      await payload.create({
        collection: 'blog-posts',
        data: {
          title: post.title, slug: post.slug, category: post.category as never, excerpt: post.excerpt,
          author: 'Peninsula Siding Company',
          publishedAt: post.status === 'published' ? new Date('2026-01-15').toISOString() : undefined,
          _status: post.status as never, body: richText(post.body) as never,
        },
      })
      postsCreated++
    }
  }
  result.postsCreated = postsCreated

  return result
}
