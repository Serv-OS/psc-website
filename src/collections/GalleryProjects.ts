import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const GALLERY_CATEGORIES = [
  { label: 'Fiber Cement', value: 'fiber' },
  { label: 'Board & Batten', value: 'batten' },
  { label: 'Cedar', value: 'cedar' },
  { label: 'Shingle', value: 'shingle' },
] as const

/** Before/after projects → Gallery page + Home/About featured sliders. */
export const GalleryProjects: CollectionConfig = {
  slug: 'gallery-projects',
  labels: { singular: 'Gallery Project', plural: 'Gallery Projects' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'category', 'featured'],
    group: 'Content',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
        { name: 'location', type: 'text', required: true, admin: { width: '40%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          options: [...GALLERY_CATEGORIES],
          admin: { width: '50%' },
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: { width: '50%', description: 'Show in the large Home/About/Gallery feature slider.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'beforeImage', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
        { name: 'afterImage', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
