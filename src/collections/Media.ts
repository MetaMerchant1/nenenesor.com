import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req: { user } }) =>
      user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) =>
      user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) =>
      user?.role === 'admin' || user?.role === 'editor',
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1600,
        height: undefined,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for accessibility and SEO.',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
