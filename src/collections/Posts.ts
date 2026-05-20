import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { autoSlugFrom } from '@/lib/slug'

const revalidateOnPublish: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req,
}) => {
  if (req?.context?.skipRevalidate) return
  const d = doc as { slug?: string; status?: string; category?: unknown }
  const prev = previousDoc as { status?: string } | undefined
  if (d.status !== 'published' && prev?.status !== 'published') return
  try {
    revalidatePath('/blog')
    revalidatePath('/')
    if (d.slug) revalidatePath(`/blog/${d.slug}`)
    const cat = d.category
    const catSlug =
      cat && typeof cat === 'object' && 'slug' in cat
        ? (cat as { slug?: string }).slug
        : undefined
    if (catSlug) revalidatePath(`/blog/kategori/${catSlug}`)
  } catch {
    /* revalidate only works outside render contexts; ignore here */
  }
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'category', 'status', 'publishedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin' || user?.role === 'editor') return true
      return { status: { equals: 'published' } }
    },
    create: ({ req: { user } }) =>
      user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) =>
      user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) => user?.role === 'admin',
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
      name: 'excerpt',
      type: 'textarea',
      maxLength: 200,
      admin: {
        description: 'Listelerde görünür. En fazla 200 karakter.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text', required: true }],
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
      name: 'neneNote',
      type: 'richText',
      admin: {
        description: 'Kısa, geleneksel bir perspektif. NeneNotu callout olarak render edilir.',
      },
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
