import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { seoField } from '../fields/seo'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const BLOG_CATEGORIES = [
  { label: 'Cost Guide', value: 'cost-guide' },
  { label: 'Buying Guide', value: 'buying-guide' },
  { label: 'Homeowner Tips', value: 'homeowner-tips' },
  { label: 'Design', value: 'design' },
] as const

/** Blog / Resources articles → /resources and /resources/[slug]. */
export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: { singular: 'Blog Post', plural: 'Blog Posts' },
  access: {
    // Public sees published only; staff see everything.
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', '_status', 'publishedAt'],
    group: 'Content',
  },
  versions: { drafts: { autosave: false } },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Auto-generated from the title; edit if needed.' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => value || (data?.title ? slugify(String(data.title)) : value),
        ],
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [...BLOG_CATEGORIES],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) =>
            value || (siblingData?._status === 'published' ? new Date().toISOString() : value),
        ],
      },
    },
    { name: 'author', type: 'text', defaultValue: 'Peninsula Siding Company' },
    { name: 'excerpt', type: 'textarea', admin: { description: 'Short summary for cards & SEO.' } },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText', required: true },
    seoField,
  ],
}
