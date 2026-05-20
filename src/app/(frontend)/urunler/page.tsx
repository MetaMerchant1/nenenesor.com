import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { AffiliateDisclosure } from '@/components/AffiliateDisclosure'
import { ExpertBadge } from '@/components/ExpertBadge'
import { getPayload } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Ürünler',
  description:
    "Nene'nin onaylı listeleri — anne ve bebek için uzman süzgecinden geçmiş ürün rehberleri.",
  alternates: { canonical: '/urunler' },
}

type Expertise = 'diyetisyen' | 'ebe' | 'doktor'

type ProductGuide = {
  id: number
  slug: string
  title: string
  items?: { name: string; image?: { url?: string; alt?: string } }[]
  category?: { name?: string; slug?: string } | null
  author?: { name?: string; expertise?: Expertise } | null
  publishedAt?: string | null
}

export default async function ProductsIndexPage() {
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'products',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
    depth: 2,
  })
  const guides = res.docs as unknown as ProductGuide[]

  return (
    <div className="nene-container py-14">
      <header className="mb-10 max-w-2xl">
        <p className="mb-2 text-sm uppercase tracking-[0.22em] text-nene-rust">
          Ürünler
        </p>
        <h1 className="font-serif text-4xl leading-tight md:text-5xl">
          Nene&apos;nin sandığından, uzman süzgecinden.
        </h1>
        <p className="mt-3 text-nene-ink/70">
          Her listede &ldquo;neden bu&rdquo; yazar — gerekçesi olmayan tavsiye
          yok.
        </p>
      </header>

      <AffiliateDisclosure className="mb-10" />

      {guides.length === 0 ? (
        <div className="rounded-lg border border-dashed border-nene-mist bg-nene-mist/20 px-6 py-16 text-center">
          <p className="font-serif text-xl text-nene-ink">
            İlk rehberler hazırlanıyor.
          </p>
          <p className="mt-2 text-sm text-nene-ink/70">
            Bültene yazıl, yayınlanır yayınlanmaz haberin olsun.
          </p>
          <Link
            href="/bulten"
            className="mt-5 inline-block rounded-md bg-nene-rust px-4 py-2 text-sm font-medium text-nene-cream no-underline"
          >
            Bültene Katıl
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <ProductGuideCard key={g.id} guide={g} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProductGuideCard({ guide }: { guide: ProductGuide }) {
  const date = guide.publishedAt
    ? format(new Date(guide.publishedAt), 'd MMMM yyyy', { locale: tr })
    : null
  const cover = guide.items?.[0]?.image
  const itemCount = guide.items?.length ?? 0

  return (
    <Link
      href={`/urunler/${guide.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-nene-mist bg-nene-cream no-underline transition hover:border-nene-rust/30 hover:shadow-sm"
    >
      <div className="relative aspect-[16/10] w-full bg-nene-mist/60">
        {cover?.url ? (
          <Image
            src={cover.url}
            alt={cover.alt ?? guide.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-serif text-3xl text-nene-ink/20">
            nenenesor
          </div>
        )}
        {guide.category?.name ? (
          <span className="absolute left-3 top-3 rounded-full bg-nene-cream/95 px-2.5 py-1 text-xs font-medium text-nene-ink shadow-sm">
            {guide.category.name}
          </span>
        ) : null}
        {itemCount > 0 ? (
          <span className="absolute right-3 top-3 rounded-full bg-nene-ink/85 px-2.5 py-1 text-xs font-medium text-nene-cream">
            {itemCount} ürün
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-serif text-xl leading-snug text-nene-ink group-hover:text-nene-rust">
          {guide.title}
        </h3>
        <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-nene-ink/60">
          <span className="font-medium text-nene-ink">
            {guide.author?.name}
          </span>
          {guide.author?.expertise ? (
            <ExpertBadge expertise={guide.author.expertise} />
          ) : null}
          {date ? <span className="ml-auto text-nene-ink/50">{date}</span> : null}
        </div>
      </div>
    </Link>
  )
}
