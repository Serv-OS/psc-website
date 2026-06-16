import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

import { anyone, authenticated } from '../access'

/** Sitewide settings: NAP, socials, promise, reviews, and quote pricing constants. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: { read: anyone, update: authenticated },
  admin: { group: 'Settings' },
  hooks: {
    // Header/footer/logo live in the shared layout — refresh every page on save
    // so edits (menus, logo, phone, announcement) appear immediately.
    afterChange: [
      () => {
        try {
          revalidatePath('/', 'layout')
        } catch {
          /* not in a request context (e.g. CLI) — ignore */
        }
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'ogDefault', type: 'upload', relationTo: 'media', label: 'Default OG image' },
            {
              name: 'promiseText',
              type: 'text',
              defaultValue: 'We beat any like-for-like quote by 10%',
            },
            {
              name: 'announcement',
              type: 'text',
              defaultValue:
                "We'll beat any like-for-like quote by 10% — Bay Area siding, no hidden costs.",
              admin: { description: 'Top announcement bar text.' },
            },
          ],
        },
        {
          label: 'Contact (NAP)',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'companyName', type: 'text', defaultValue: 'Peninsula Siding Company, Inc.', admin: { width: '50%' } },
                { name: 'phone', type: 'text', defaultValue: '650-287-4208', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'text', defaultValue: 'info@peninsulasidingcompany.com', admin: { width: '50%' } },
                { name: 'hours', type: 'text', defaultValue: 'Office open by appointment only.', admin: { width: '50%' } },
              ],
            },
            { name: 'street', type: 'text', defaultValue: '763 Polhemus Road, Suite 2' },
            {
              type: 'row',
              fields: [
                { name: 'city', type: 'text', defaultValue: 'San Mateo', admin: { width: '40%' } },
                { name: 'region', type: 'text', defaultValue: 'CA', admin: { width: '30%' } },
                { name: 'zip', type: 'text', defaultValue: '94402', admin: { width: '30%' } },
              ],
            },
          ],
        },
        {
          label: 'Socials & Reviews',
          fields: [
            { name: 'facebook', type: 'text', defaultValue: 'https://www.facebook.com/peninsulasidingcompany' },
            { name: 'instagram', type: 'text', defaultValue: 'https://www.instagram.com/peninsulasidingcompany/' },
            { name: 'yelp', type: 'text', defaultValue: 'https://www.yelp.com/biz/peninsula-siding-company-san-mateo-5' },
            { name: 'pinterest', type: 'text', defaultValue: 'https://www.pinterest.com/peninsulasidingcompany/' },
            {
              name: 'reviews',
              type: 'group',
              label: 'Review ratings',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'ratingValue', type: 'number', defaultValue: 5, admin: { width: '50%' } },
                    { name: 'reviewCount', type: 'number', defaultValue: 50, admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Menus',
          description: 'Header navigation and footer link columns. Leave empty to use the built-in defaults.',
          fields: [
            {
              name: 'headerNav',
              type: 'array',
              label: 'Header menu',
              admin: { initCollapsed: true, description: 'Top navigation items. Add sub-items to create a dropdown.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'href', type: 'text', required: true, admin: { width: '50%', description: 'e.g. /about-us' } },
                  ],
                },
                {
                  name: 'children',
                  type: 'array',
                  label: 'Dropdown sub-items',
                  admin: { initCollapsed: true },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                        { name: 'href', type: 'text', required: true, admin: { width: '50%' } },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'footerColumns',
              type: 'array',
              label: 'Footer link columns',
              admin: { initCollapsed: true, description: 'The link columns shown in the footer (the logo/contact column is built from the Contact tab).' },
              fields: [
                { name: 'heading', type: 'text', required: true },
                {
                  name: 'links',
                  type: 'array',
                  label: 'Links',
                  admin: { initCollapsed: true },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                        { name: 'href', type: 'text', required: true, admin: { width: '50%' } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Quote pricing',
          description:
            'Internal constants powering the instant-quote engine. Customers never see cost/markup — only the resulting range.',
          fields: [
            {
              name: 'pricing',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'markup', type: 'number', defaultValue: 1.6, admin: { width: '33%', description: 'Sale = cost × markup' } },
                    { name: 'rangeLow', type: 'number', defaultValue: 0.92, admin: { width: '33%', description: 'Low = sale × this' } },
                    { name: 'rangeHigh', type: 'number', defaultValue: 1.12, admin: { width: '34%', description: 'High = sale × this' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'installMatPer1000PerStory', type: 'number', defaultValue: 1067.39, admin: { width: '34%' } },
                    { name: 'permitsPerSqft', type: 'number', defaultValue: 0.96, admin: { width: '33%' } },
                    { name: 'debrisPerSqft', type: 'number', defaultValue: 2, admin: { width: '33%' } },
                  ],
                },
                {
                  name: 'profiles',
                  type: 'array',
                  label: 'Siding profiles (customer engine)',
                  admin: { initCollapsed: true },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'key', type: 'text', required: true, admin: { width: '25%' } },
                        { name: 'label', type: 'text', required: true, admin: { width: '35%' } },
                        { name: 'cost', type: 'number', required: true, admin: { width: '20%' } },
                        { name: 'install', type: 'number', required: true, admin: { width: '20%' } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
