import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { seoField } from '../fields/seo'
import { ALL_CITIES } from '../lib/cities'

/** Core marketing pages (one doc each). */
const MARKETING_PAGES = [
  { label: 'Home', value: 'home' },
  { label: 'About Us', value: 'about-us' },
  { label: 'Services', value: 'services' },
  { label: 'Design Inspirations', value: 'design-inspirations' },
  { label: 'Quality Pricing', value: 'quality-pricing' },
  { label: 'Gallery', value: 'gallery' },
  { label: 'Benefits', value: 'benefits' },
  { label: 'Contact Us', value: 'contact-us' },
  { label: 'Resources (Blog hub)', value: 'resources' },
]

/** Location pages — derived from the city list so every city is editable in the
 * builder, and new cities appear automatically when added to lib/cities.ts. */
const LOCATION_PAGES = ALL_CITIES.map((c) => ({ label: `Location · ${c.name}`, value: `siding-${c.slug}` }))

/** The full set of editable pages shown in the visual builder's page switcher. */
export const PAGE_SLUGS: { label: string; value: string }[] = [...MARKETING_PAGES, ...LOCATION_PAGES]

/**
 * Editable copy + image slots for each marketing page. The page components carry
 * the full layout and seeded default copy; this collection lets the owner tune
 * the hero copy, swap any photo (via named image slots), and control SEO — all
 * without code. Components look up images by `key` and fall back to the design's
 * placeholder when a slot is empty.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
        {
          name: 'slug',
          type: 'select',
          required: true,
          unique: true,
          options: [...PAGE_SLUGS],
          admin: { width: '40%', description: 'Which route this content drives.' },
        },
      ],
    },
    {
      name: 'layout',
      type: 'json',
      label: 'Visual layout (page builder)',
      admin: {
        description: 'Managed by the visual page builder. Edit at /builder — avoid hand-editing here.',
      },
    },
    {
      name: 'hero',
      type: 'group',
      label: 'Hero (legacy — being replaced by the visual builder)',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'images',
      type: 'array',
      label: 'Image slots',
      labels: { singular: 'Image slot', plural: 'Image slots' },
      admin: {
        description:
          'Named photo slots used across the page (e.g. "story", "materialSample"). Swap any image here without touching code.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'key', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'image', type: 'upload', relationTo: 'media', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
    seoField,
  ],
}
