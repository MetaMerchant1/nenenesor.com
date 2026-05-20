import type { MetadataRoute } from 'next'

import { getPayload } from '@/lib/payload'
import { SITE_URL } from '@/lib/utils'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload()

  const [posts, categories, questions, experts] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    }),
    payload.find({ collection: 'categories', limit: 100, depth: 0 }),
    payload.find({
      collection: 'questions',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    }),
    payload.find({ collection: 'experts', limit: 200, depth: 0 }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/sorular`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/sorular/sor`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/uzmanlar`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/hakkimizda`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/bulten`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/urunler`, changeFrequency: 'weekly', priority: 0.6 },
  ]

  const postEntries: MetadataRoute.Sitemap = (
    posts.docs as unknown as { slug: string; updatedAt?: string }[]
  ).map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryEntries: MetadataRoute.Sitemap = (
    categories.docs as unknown as { slug: string }[]
  ).map((c) => ({
    url: `${SITE_URL}/blog/kategori/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const questionEntries: MetadataRoute.Sitemap = (
    questions.docs as unknown as { slug: string; updatedAt?: string }[]
  ).map((q) => ({
    url: `${SITE_URL}/sorular/${q.slug}`,
    lastModified: q.updatedAt ? new Date(q.updatedAt) : undefined,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const expertEntries: MetadataRoute.Sitemap = (
    experts.docs as unknown as { slug: string }[]
  ).map((e) => ({
    url: `${SITE_URL}/uzmanlar/${e.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    ...staticRoutes,
    ...postEntries,
    ...categoryEntries,
    ...questionEntries,
    ...expertEntries,
  ]
}
