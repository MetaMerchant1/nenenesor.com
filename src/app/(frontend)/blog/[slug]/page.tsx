import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichText } from '@payloadcms/richtext-lexical/react'

import { ExpertBadge } from '@/components/ExpertBadge'
import { NeneNotu } from '@/components/NeneNotu'
import { PostCard, type PostCardData } from '@/components/PostCard'
import { getPayload } from '@/lib/payload'
import { buildArticleJsonLd, jsonLdScript } from '@/lib/seo'
import { SITE_URL } from '@/lib/utils'

export const revalidate = 60

type Params = { slug: string }

async function loadPost(slug: string) {
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await loadPost(slug)
  if (!post) return {}
  const p = post as unknown as {
    title: string
    excerpt?: string
    coverImage?: { url?: string }
    seo?: { metaTitle?: string; metaDescription?: string; ogImage?: { url?: string } }
  }
  const title = p.seo?.metaTitle ?? p.title
  const description = p.seo?.metaDescription ?? p.excerpt
  const ogImage =
    p.seo?.ogImage?.url ??
    p.coverImage?.url ??
    `${SITE_URL}/api/og?title=${encodeURIComponent(p.title)}&eyebrow=Blog`
  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${SITE_URL}/blog/${slug}`,
      images: [{ url: ogImage }],
    },
  }
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const post = await loadPost(slug)
  if (!post) notFound()

  const p = post as unknown as {
    id: number
    slug: string
    title: string
    excerpt?: string
    coverImage?: { url?: string; alt?: string }
    content: object
    neneNote?: object
    publishedAt?: string
    updatedAt?: string
    author?: {
      id: number
      name: string
      slug: string
      title?: string
      expertise?: 'diyetisyen' | 'ebe' | 'doktor'
      photo?: { url?: string }
      bio?: object
    }
    category?: { id: number; name: string; slug: string }
    tags?: { tag: string }[]
  }

  const payload = await getPayload()
  const relatedRes = p.category
    ? await payload.find({
        collection: 'posts',
        where: {
          status: { equals: 'published' },
          category: { equals: p.category.id },
          id: { not_equals: p.id },
        },
        sort: '-publishedAt',
        limit: 3,
        depth: 2,
      })
    : { docs: [] }
  const related = relatedRes.docs as unknown as (PostCardData & { id: number })[]

  const date = p.publishedAt
    ? format(new Date(p.publishedAt), 'd MMMM yyyy', { locale: tr })
    : null

  const jsonLd = buildArticleJsonLd({
    title: p.title,
    description: p.excerpt,
    slug: p.slug,
    publishedAt: p.publishedAt,
    updatedAt: p.updatedAt,
    image: p.coverImage?.url ? `${SITE_URL}${p.coverImage.url}` : undefined,
    author: {
      name: p.author?.name ?? 'nenenesor',
      slug: p.author?.slug,
      title: p.author?.title,
    },
  })

  return (
    <article className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />

      <header className="nene-container max-w-3xl pt-10">
        {p.category ? (
          <Link
            href={`/blog/kategori/${p.category.slug}`}
            className="text-xs uppercase tracking-[0.2em] text-nene-rust no-underline"
          >
            {p.category.name}
          </Link>
        ) : null}
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
          {p.title}
        </h1>
        {p.excerpt ? (
          <p className="mt-4 text-lg text-nene-ink/75">{p.excerpt}</p>
        ) : null}

        <div className="mt-6 flex items-center gap-3 text-sm text-nene-ink/70">
          {p.author?.photo?.url ? (
            <Image
              src={p.author.photo.url}
              alt={p.author.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : p.author?.name ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-nene-mist text-sm font-medium text-nene-ink/70">
              {p.author.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
          ) : null}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              {p.author ? (
                <Link
                  href={`/uzmanlar/${p.author.slug}`}
                  className="font-medium text-nene-ink no-underline hover:text-nene-rust"
                >
                  {p.author.name}
                </Link>
              ) : null}
              {p.author?.expertise ? (
                <ExpertBadge expertise={p.author.expertise} />
              ) : null}
            </div>
            {date ? <span className="text-nene-ink/50">{date}</span> : null}
          </div>
        </div>
      </header>

      {p.coverImage?.url ? (
        <div className="nene-container mt-10 max-w-4xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-nene-mist">
            <Image
              src={p.coverImage.url}
              alt={p.coverImage.alt ?? p.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <div className="nene-container mt-12 max-w-2xl">
        <div className="prose-nene">
          <RichText data={p.content as never} />
        </div>

        {p.neneNote ? (
          <NeneNotu>
            <RichText data={p.neneNote as never} />
          </NeneNotu>
        ) : null}

        {p.tags && p.tags.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span
                key={t.tag}
                className="rounded-full bg-nene-mist/60 px-3 py-1 text-xs text-nene-ink/70"
              >
                #{t.tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {related.length > 0 ? (
        <section className="nene-container mt-20">
          <h2 className="mb-6 font-serif text-2xl">İlgili yazılar</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((rel) => (
              <PostCard key={rel.id} post={rel} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
