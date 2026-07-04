import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { autoSlugFrom } from '@/lib/slug'

export const Experts: CollectionConfig = {
  slug: 'experts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'expertise', 'title'],
    group: 'Yönetim',
    hidden: ({ user }) => user?.role === 'expert',
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      hooks: {
        beforeValidate: [autoSlugFrom('name')],
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'expertise',
      type: 'select',
      required: true,
      options: [
        { label: 'Diyetisyen', value: 'diyetisyen' },
        { label: 'Ebe', value: 'ebe' },
        { label: 'Doktor', value: 'doktor' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "Pediatri Uzmanı", "Klinik Diyetisyen"',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'credentials',
      type: 'richText',
      admin: {
        description: 'Diplomas, certifications, memberships',
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Website', value: 'website' },
            { label: 'YouTube', value: 'youtube' },
          ],
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
