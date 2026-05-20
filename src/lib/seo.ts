import { SITE_NAME, SITE_URL } from './utils'

interface ArticleAuthor {
  name: string
  slug?: string
  title?: string
}

export function buildArticleJsonLd(args: {
  title: string
  description?: string
  slug: string
  publishedAt?: string | Date | null
  updatedAt?: string | Date | null
  author: ArticleAuthor
  image?: string
}) {
  const url = `${SITE_URL}/blog/${args.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: args.title,
    description: args.description,
    image: args.image ? [args.image] : undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    datePublished:
      args.publishedAt && new Date(args.publishedAt).toISOString(),
    dateModified: args.updatedAt
      ? new Date(args.updatedAt).toISOString()
      : args.publishedAt
        ? new Date(args.publishedAt).toISOString()
        : undefined,
    author: {
      '@type': 'Person',
      name: args.author.name,
      url: args.author.slug ? `${SITE_URL}/uzmanlar/${args.author.slug}` : undefined,
      jobTitle: args.author.title,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

export function buildPersonJsonLd(args: {
  name: string
  slug: string
  title?: string
  image?: string
  bioText?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: args.name,
    jobTitle: args.title,
    image: args.image,
    description: args.bioText,
    url: `${SITE_URL}/uzmanlar/${args.slug}`,
  }
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
