import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { autoSlugFrom } from '@/lib/slug'

const revalidateOnPublish: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req,
}) => {
  if (req?.context?.skipRevalidate) return
  const d = doc as { slug?: string; status?: string }
  const prev = previousDoc as { status?: string } | undefined
  if (d.status !== 'published' && prev?.status !== 'published') return
  try {
    revalidatePath('/urunler')
    revalidatePath('/')
    if (d.slug) revalidatePath(`/urunler/${d.slug}`)
  } catch {
    /* outside-render only */
  }
}

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'category', 'status', 'publishedAt'],
    group: 'İçerik Yönetimi',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin' || user?.role === 'editor') return true
      return { status: { equals: 'published' } }
    },
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidateOnPublish],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      hooks: { beforeValidate: [autoSlugFrom('title')] },
      admin: { position: 'sidebar' },
    },
    {
      name: 'intro',
      type: 'richText',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Ürün', plural: 'Ürünler' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'reason',
          type: 'textarea',
          required: true,
          admin: { description: '"Neden bu" — kısa, gerekçeli.' },
        },
        {
          name: 'expertNote',
          type: 'textarea',
          admin: { description: 'Uzmandan kısa not (opsiyonel).' },
        },
        {
          name: 'affiliateLinks',
          type: 'array',
          minRows: 1,
          labels: { singular: 'Affiliate Link', plural: 'Affiliate Linkler' },
          fields: [
            {
              name: 'retailer',
              type: 'select',
              required: true,
              options: [
                { label: 'Hepsiburada', value: 'hepsiburada' },
                { label: 'Trendyol', value: 'trendyol' },
                { label: 'ebebek', value: 'ebebek' },
                { label: 'Amazon TR', value: 'amazon' },
              ],
            },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'experts',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Taslak', value: 'draft' },
        { label: 'Yayında', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
