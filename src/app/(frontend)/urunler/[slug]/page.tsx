import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichText } from '@payloadcms/richtext-lexical/react'

import { AffiliateButton, type Retailer } from '@/components/AffiliateButton'
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure'
import { ExpertBadge } from '@/components/ExpertBadge'
import { getPayload } from '@/lib/payload'
import { jsonLdScript } from '@/lib/seo'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

export const revalidate = 60

type Params = { slug: string }

type Expertise = 'diyetisyen' | 'ebe' | 'doktor'

type ProductItem = {
  name: string
  image?: { url?: string; alt?: string }
  reason: string
  expertNote?: string
  affiliateLinks?: { retailer: Retailer; url: string }[]
}

type ProductGuide = {
  id: number
  slug: string
  title: string
  intro: object
  items: ProductItem[]
  category?: { name?: string; slug?: string }
  author?: {
    name?: string
    slug?: string
    title?: string
    expertise?: Expertise
    photo?: { url?: string }
  }
  publishedAt?: string
  updatedAt?: string
  seo?: { metaTitle?: string; metaDescription?: string; ogImage?: { url?: string } }
}

async function loadGuide(slug: string) {
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
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
  const g = (await loadGuide(slug)) as unknown as ProductGuide | null
  if (!g) return {}
  const title = g.seo?.metaTitle ?? g.title
  const description = g.seo?.metaDescription
  const ogImage =
    g.seo?.ogImage?.url ??
    g.items?.[0]?.image?.url ??
    `${SITE_URL}/api/og?title=${encodeURIComponent(g.title)}&eyebrow=Ürünler`
  return {
    title,
    description,
    alternates: { canonical: `/urunler/${slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${SITE_URL}/urunler/${slug}`,
      images: [{ url: ogImage }],
    },
  }
}

export default async function ProductGuidePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const g = (await loadGuide(slug)) as unknown as ProductGuide | null
  if (!g) notFound()

  const date = g.publishedAt
    ? format(new Date(g.publishedAt), 'd MMMM yyyy', { locale: tr })
    : null

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: g.title,
    url: `${SITE_URL}/urunler/${g.slug}`,
    numberOfItems: g.items?.length ?? 0,
    itemListElement: (g.items ?? []).map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        description: item.reason,
        image: item.image?.url ? `${SITE_URL}${item.image.url}` : undefined,
      },
    })),
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }

  return (
    <article className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(itemListJsonLd) }}
      />

      <header className="nene-container max-w-3xl pt-10">
        <Link
          href="/urunler"
          className="text-xs uppercase tracking-[0.2em] text-nene-rust no-underline"
        >
          ← Ürünler
        </Link>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
          {g.title}
        </h1>

        <div className="mt-6 flex items-center gap-3 text-sm text-nene-ink/70">
          {g.author?.photo?.url ? (
            <Image
              src={g.author.photo.url}
              alt={g.author.name ?? ''}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : g.author?.name ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-nene-mist text-sm font-medium text-nene-ink/70">
              {g.author.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
          ) : null}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              {g.author?.slug ? (
                <Link
                  href={`/uzmanlar/${g.author.slug}`}
                  className="font-medium text-nene-ink no-underline hover:text-nene-rust"
                >
                  {g.author.name}
                </Link>
              ) : g.author?.name ? (
                <span className="font-medium text-nene-ink">
                  {g.author.name}
                </span>
              ) : null}
              {g.author?.expertise ? (
                <ExpertBadge expertise={g.author.expertise} />
              ) : null}
            </div>
            {date ? <span className="text-nene-ink/50">{date}</span> : null}
          </div>
        </div>

        <div className="mt-6">
          <AffiliateDisclosure />
        </div>
      </header>

      <div className="nene-container mt-10 max-w-3xl">
        <div className="prose-nene">
          <RichText data={g.intro as never} />
        </div>
      </div>

      <div className="nene-container mt-12 max-w-3xl space-y-10">
        {(g.items ?? []).map((item, idx) => (
          <ProductItemCard key={`${item.name}-${idx}`} item={item} index={idx} />
        ))}
      </div>

      <footer className="nene-container mt-20 max-w-3xl">
        <AffiliateDisclosure />
        <p className="mt-6 text-sm text-nene-ink/60">
          Bu rehberde önerilen her ürün, uzmanımız tarafından bizzat
          değerlendirildi. Komisyon olsun ya da olmasın, &ldquo;içeride değil&rdquo; dediği bir
          şey listede olmaz.
        </p>
      </footer>
    </article>
  )
}

function ProductItemCard({
  item,
  index,
}: {
  item: ProductItem
  index: number
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[180px_1fr]">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-nene-mist/60 md:w-[180px]">
        {item.image?.url ? (
          <Image
            src={item.image.url}
            alt={item.image.alt ?? item.name}
            fill
            sizes="(max-width: 768px) 100vw, 180px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-serif text-2xl text-nene-ink/20">
            #{index + 1}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-2xl text-nene-ink/30">
            0{index + 1}
          </span>
          <h2 className="font-serif text-2xl text-nene-ink">{item.name}</h2>
        </div>

        <p className="mt-4 text-nene-ink/80 whitespace-pre-line">
          {item.reason}
        </p>

        {item.expertNote ? (
          <div className="mt-4 rounded-md border-l-2 border-nene-sage bg-nene-sage/5 px-4 py-3 text-sm text-nene-ink/85">
            <span className="block font-serif italic">
              &ldquo;{item.expertNote}&rdquo;
            </span>
          </div>
        ) : null}

        {item.affiliateLinks && item.affiliateLinks.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {item.affiliateLinks.map((l) => (
              <AffiliateButton
                key={`${l.retailer}-${l.url}`}
                retailer={l.retailer}
                url={l.url}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
