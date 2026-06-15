import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone, authenticated } from '../access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * The "swap any image" library. EVERY image on the site is a record here,
 * referenced by a page/collection — never hardcoded. In dev, files are written
 * to <root>/media; in production the Vercel Blob plugin (see payload.config)
 * transparently stores them in object storage instead.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: { group: 'Content' },
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768 },
      { name: 'feature', width: 1280 },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the image for SEO & screen readers (required).' },
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Optional photo credit / source note.' },
    },
  ],
}
