import type { CollectionConfig } from 'payload'

import { authenticated, adminOnly, adminFieldOnly } from '../access'

/** Staff accounts. Owner = admin; sales/marketing = editor. */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Staff Member', plural: 'Staff' },
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
  },
  access: {
    read: authenticated,
    create: adminOnly,
    update: ({ req: { user }, id }) => user?.role === 'admin' || user?.id === id,
    delete: adminOnly,
    admin: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin (owner)', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: { update: adminFieldOnly },
      admin: { description: 'Admins manage staff & settings. Editors manage content.' },
    },
  ],
}
