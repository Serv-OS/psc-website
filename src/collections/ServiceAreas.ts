import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { seoField } from '../fields/seo'

/** City landing pages → /siding-[slug]. Seeded from City Body.dc.html. */
export const ServiceAreas: CollectionConfig = {
  slug: 'service-areas',
  labels: { singular: 'Service Area', plural: 'Service Areas' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  admin: {
    useAsTitle: 'city',
    defaultColumns: ['city', 'slug', 'updatedAt'],
    group: 'Content',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'city', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: { width: '50%', description: 'URL: /siding-[slug] (e.g. san-mateo).' },
        },
      ],
    },
    { name: 'h1', type: 'text', required: true, label: 'Page H1' },
    { name: 'intro', type: 'textarea', required: true },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'localPoints',
      type: 'array',
      label: 'Local know-how points',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    { name: 'closingBlurb', type: 'textarea', label: 'Closing paragraph' },
    {
      name: 'neighborhoods',
      type: 'array',
      labels: { singular: 'Neighborhood', plural: 'Neighborhoods' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    seoField,
  ],
}
