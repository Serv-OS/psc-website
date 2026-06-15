import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

export const LEAD_STATUSES = [
  { label: 'New', value: 'New' },
  { label: 'Contacted', value: 'Contacted' },
  { label: 'Quoted', value: 'Quoted' },
  { label: 'Won', value: 'Won' },
  { label: 'Lost', value: 'Lost' },
] as const

/**
 * Inbound leads from the instant-quote engine and the contact form. Public
 * creation happens only through POST /api/leads (validated + rate-limited +
 * honeypot, with overrideAccess); direct API create is closed.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Lead', plural: 'Leads' },
  access: {
    create: () => false, // only the server route creates leads (overrideAccess)
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'status', 'city', 'createdAt'],
    group: 'Sales',
    listSearchableFields: ['name', 'email', 'phone', 'city', 'message'],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'quote',
          options: [
            { label: 'Quote', value: 'quote' },
            { label: 'Contact', value: 'contact' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'New',
          options: [...LEAD_STATUSES],
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Customer',
      admin: { initCollapsed: false },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'phone', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'address', type: 'text', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'city', type: 'text', admin: { width: '50%' } },
            { name: 'zip', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Contact enquiry',
      admin: {
        initCollapsed: true,
        condition: (data) => data?.type === 'contact',
      },
      fields: [
        { name: 'interest', type: 'text' },
        { name: 'message', type: 'textarea' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Quote details',
      admin: {
        initCollapsed: true,
        condition: (data) => data?.type === 'quote',
      },
      fields: [
        {
          name: 'selection',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'profile', type: 'text', admin: { width: '34%' } },
                { name: 'texture', type: 'text', admin: { width: '33%' } },
                { name: 'color', type: 'text', admin: { width: '33%' } },
              ],
            },
          ],
        },
        {
          name: 'project',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'sqft', type: 'number', admin: { width: '50%' } },
                { name: 'stories', type: 'number', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          name: 'estimate',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'low', type: 'number', admin: { width: '50%' } },
                { name: 'high', type: 'number', admin: { width: '50%' } },
              ],
            },
          ],
        },
        { name: 'notes', type: 'textarea' },
      ],
    },
    {
      name: 'source',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true, description: 'Where the lead came from.' },
    },
  ],
}
