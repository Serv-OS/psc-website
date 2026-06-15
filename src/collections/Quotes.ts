import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

/** Saved staff quotes (from the Quote Builder) → power the dashboard KPIs. */
export const Quotes: CollectionConfig = {
  slug: 'quotes',
  labels: { singular: 'Quote', plural: 'Quotes' },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'salePrice', 'margin', 'status', 'createdAt'],
    group: 'Sales',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'customerName', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'Draft',
          options: ['Draft', 'Sent', 'Won', 'Lost'].map((v) => ({ label: v, value: v })),
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'customerEmail', type: 'email', admin: { width: '50%' } },
        { name: 'customerPhone', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'customerAddress', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'sqft', type: 'number', admin: { width: '25%' } },
        { name: 'stories', type: 'number', admin: { width: '25%' } },
        { name: 'demo', type: 'text', admin: { width: '25%' } },
        { name: 'markup', type: 'number', admin: { width: '25%' } },
      ],
    },
    {
      name: 'lineItems',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'product', type: 'text', admin: { width: '55%' } },
            { name: 'cost', type: 'number', admin: { width: '15%' } },
            { name: 'qty', type: 'number', admin: { width: '15%' } },
            { name: 'lineTotal', type: 'number', admin: { width: '15%' } },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'totalCost', type: 'number', admin: { width: '25%' } },
        { name: 'salePrice', type: 'number', admin: { width: '25%' } },
        { name: 'profit', type: 'number', label: 'P&L', admin: { width: '25%' } },
        { name: 'margin', type: 'number', admin: { width: '25%', description: '%' } },
      ],
    },
    {
      name: 'relatedLead',
      type: 'relationship',
      relationTo: 'leads',
      admin: { position: 'sidebar' },
    },
  ],
}
