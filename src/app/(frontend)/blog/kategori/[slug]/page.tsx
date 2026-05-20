import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PostCard, type PostCardData } from '@/components/PostCard'
import { getPayload } from '@/lib/payload'

export const revalidate = 60

type Params = { slug: string }

async function loadCategory(slug: string) {
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return res.docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const cat = (await loadCategory(slug)) as unknown as
    | { name: string; description?: string }
    | null
  if (!cat) return {}
  return {
    title: `${cat.name} — Blog`,
    description: cat.description ?? `${cat.name} kategorisindeki yazılar.`,
    alternates: { canonical: `/blog/kategori/${slug}` },
  }
}

const PAGE_SIZE = 10

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>
  searchParams: Promise<{ sayfa?: string }>
}) {
  const { slug } = await params
  const { sayfa } = await searchParams
  const page = Math.max(1, Number.parseInt(sayfa ?? '1', 10) || 1)

  const cat = (await loadCategory(slug)) as unknown as
    | { id: number; name: string; description?: string; slug: string }
    | null
  if (!cat) notFound()

  const payload = await getPayload()
  const [postsRes, categoriesRes] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: {
        status: { equals: 'published' },
        category: { equals: cat.id },
      },
      sort: '-publishedAt',
      page,
      limit: PAGE_SIZE,
      depth: 2,
    }),
    payload.find({ collection: 'categories', limit: 50, sort: 'name' }),
  ])

  const posts = postsRes.docs as unknown as (PostCardData & { id: number })[]

  return (
    <div className="nene-container py-14">
      <header className="mb-10 max-w-2xl">
        <Link
          href="/blog"
          className="text-xs uppercase tracking-[0.2em] text-nene-rust no-underline"
        >
          ← Blog
        </Link>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
          {cat.name}
        </h1>
        {cat.description ? (
          <p className="mt-3 text-nene-ink/70">{cat.description}</p>
        ) : null}
      </header>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className="rounded-full border border-nene-mist bg-nene-cream px-3.5 py-1.5 text-xs font-medium text-nene-ink/80 hover:border-nene-rust/40 hover:text-nene-rust no-underline"
        >
          Hepsi
        </Link>
        {categoriesRes.docs.map((c) => {
          const item = c as unknown as { slug: string; name: string }
          const active = item.slug === cat.slug
          return (
            <Link
              key={item.slug}
              href={`/blog/kategori/${item.slug}`}
              className={
                active
                  ? 'rounded-full border border-nene-ink bg-nene-ink px-3.5 py-1.5 text-xs font-medium text-nene-cream no-underline'
                  : 'rounded-full border border-nene-mist bg-nene-cream px-3.5 py-1.5 text-xs font-medium text-nene-ink/80 hover:border-nene-rust/40 hover:text-nene-rust no-underline'
              }
            >
              {item.name}
            </Link>
          )
        })}
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-nene-mist bg-nene-mist/20 px-6 py-12 text-center">
          <p className="font-serif text-xl text-nene-ink">
            Bu kategoride henüz yayın yok.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
