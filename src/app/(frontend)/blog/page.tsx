import type { Metadata } from 'next'
import Link from 'next/link'

import { PostCard, type PostCardData } from '@/components/PostCard'
import { getPayload } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog',
  description:
    "Anne ve bebek için uzmanlardan, nene'nin sıcaklığıyla yazılmış rehberler.",
  alternates: { canonical: '/blog' },
}

const PAGE_SIZE = 10

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ sayfa?: string }>
}) {
  const { sayfa } = await searchParams
  const page = Math.max(1, Number.parseInt(sayfa ?? '1', 10) || 1)
  const payload = await getPayload()

  const [postsRes, categoriesRes] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      page,
      limit: PAGE_SIZE,
      depth: 2,
    }),
    payload.find({
      collection: 'categories',
      limit: 50,
      sort: 'name',
    }),
  ])

  const posts = postsRes.docs as unknown as (PostCardData & { id: number })[]

  return (
    <div className="nene-container py-14">
      <header className="mb-10 max-w-2xl">
        <p className="mb-2 text-sm uppercase tracking-[0.22em] text-nene-rust">
          Blog
        </p>
        <h1 className="font-serif text-4xl leading-tight md:text-5xl">
          Uzmanlardan, nene&apos;nin sesiyle.
        </h1>
        <p className="mt-3 text-nene-ink/70">
          Hamilelikten ilk yaşlara, beslenmeden anne sağlığına — sade,
          güvenilir, sıcak.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className="rounded-full border border-nene-ink bg-nene-ink px-3.5 py-1.5 text-xs font-medium text-nene-cream no-underline"
        >
          Hepsi
        </Link>
        {categoriesRes.docs.map((c) => {
          const cat = c as unknown as { slug: string; name: string }
          return (
            <Link
              key={cat.slug}
              href={`/blog/kategori/${cat.slug}`}
              className="rounded-full border border-nene-mist bg-nene-cream px-3.5 py-1.5 text-xs font-medium text-nene-ink/80 hover:border-nene-rust/40 hover:text-nene-rust no-underline"
            >
              {cat.name}
            </Link>
          )
        })}
      </div>

      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={postsRes.totalPages} />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-nene-mist bg-nene-mist/20 px-6 py-12 text-center">
      <p className="font-serif text-xl text-nene-ink">
        Henüz yayınlanmış bir yazı yok.
      </p>
      <p className="mt-2 text-sm text-nene-ink/70">
        İlk içerik çok yakında. Bültene yazıl, kaçırma.
      </p>
      <Link
        href="/bulten"
        className="mt-5 inline-block rounded-md bg-nene-rust px-4 py-2 text-sm font-medium text-nene-cream no-underline"
      >
        Bültene Katıl
      </Link>
    </div>
  )
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null
  return (
    <nav className="mt-12 flex items-center justify-center gap-3 text-sm">
      {page > 1 ? (
        <Link
          href={`/blog?sayfa=${page - 1}`}
          className="rounded-md border border-nene-mist px-3 py-1.5 text-nene-ink hover:border-nene-rust/40 no-underline"
        >
          ← Önceki
        </Link>
      ) : null}
      <span className="text-nene-ink/60">
        {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={`/blog?sayfa=${page + 1}`}
          className="rounded-md border border-nene-mist px-3 py-1.5 text-nene-ink hover:border-nene-rust/40 no-underline"
        >
          Sonraki →
        </Link>
      ) : null}
    </nav>
  )
}
