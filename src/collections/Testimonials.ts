import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

/** Customer reviews shown on the Home page (and reusable elsewhere). */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'location', 'projectType', 'rating'],
    group: 'Content',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'author', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'location', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'projectType', type: 'text', admin: { width: '50%' } },
        {
          name: 'rating',
          type: 'number',
          required: true,
          defaultValue: 5,
          min: 1,
          max: 5,
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'quote', type: 'textarea', required: true },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
