import type { Field } from 'payload'

/**
 * Reusable SEO field group. Every public collection embeds this so the owner can
 * tune the title/description/canonical/OG image per record. Pages fall back to
 * sensible defaults (built from the record's own copy) when these are empty.
 */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: {
    description: 'Search-engine & social-share settings. Leave blank to use smart defaults.',
  },
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      admin: { description: 'Browser tab & search result title. ~50–60 characters.' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      admin: { description: 'Search result snippet. ~150–160 characters.' },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Image used when the page is shared on social media (1200×630).' },
    },
    {
      name: 'canonical',
      type: 'text',
      admin: { description: 'Override the canonical URL. Usually leave blank.' },
    },
  ],
}
