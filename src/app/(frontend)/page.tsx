import Link from 'next/link'

import { ExpertBadge } from '@/components/ExpertBadge'
import { NeneNotu } from '@/components/NeneNotu'
import { NewsletterForm } from '@/components/NewsletterForm'
import { PostCard, type PostCardData } from '@/components/PostCard'
import { QuestionCard, type QuestionCardData } from '@/components/QuestionCard'
import { getPayload } from '@/lib/payload'

export const revalidate = 60

const EXPERTISE_PREVIEW: {
  key: 'diyetisyen' | 'ebe' | 'doktor'
  title: string
  body: string
}[] = [
  {
    key: 'diyetisyen',
    title: 'Diyetisyen',
    body: 'Hamilelikte, emzirme döneminde ve ek gıdada sade, bilimsel beslenme tavsiyesi.',
  },
  {
    key: 'ebe',
    title: 'Ebe',
    body: 'Doğum öncesi hazırlık, doğum sonrası iyileşme ve yenidoğan bakımında yanında.',
  },
  {
    key: 'doktor',
    title: 'Doktor',
    body: 'Pediatri ve kadın doğum uzmanlarından, korkutmayan, yargılamayan rehberlik.',
  },
]

export default async function HomePage() {
  const payload = await getPayload()

  const [postsRes, questionsRes, productsRes] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 6,
      depth: 2,
    }),
    payload.find({
      collection: 'questions',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 4,
      depth: 2,
    }),
    payload.find({
      collection: 'products',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 1,
      depth: 2,
    }),
  ])
  const posts = postsRes.docs as unknown as (PostCardData & { id: number })[]
  const questions = questionsRes.docs as unknown as (QuestionCardData & {
    id: number
  })[]
  const featuredProduct = productsRes.docs[0] as unknown as
    | {
        slug: string
        title: string
        items?: { name: string; image?: { url?: string; alt?: string } }[]
        author?: {
          name?: string
          expertise?: 'diyetisyen' | 'ebe' | 'doktor'
        }
        category?: { name?: string }
      }
    | undefined

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-nene-mist">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(199,93,63,0.08), transparent 40%), radial-gradient(circle at 80% 60%, rgba(212,162,76,0.10), transparent 40%)',
          }}
        />
        <div className="nene-container relative py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.22em] text-nene-rust">
                nenenesor
              </p>
              <h1 className="font-serif text-5xl leading-[1.05] md:text-7xl">
                Önce nene&apos;ne sor.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-nene-ink/80 md:text-xl">
                Nene&apos;nin sezgisi, uzmanın bilgisi. Anne ve bebek için
                sıcacık, bilimi de doğru anlamış Türkçe bir rehber.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/bulten"
                  className="inline-flex items-center rounded-md bg-nene-rust px-5 py-3 text-sm font-medium text-nene-cream hover:bg-nene-rust/90 no-underline"
                >
                  Bültene Katıl
                </Link>
                <Link
                  href="/sorular/sor"
                  className="inline-flex items-center rounded-md border border-nene-ink/15 bg-nene-cream px-5 py-3 text-sm font-medium text-nene-ink hover:border-nene-ink/30 no-underline"
                >
                  Soru Sor
                </Link>
              </div>
            </div>

            <div className="md:pl-6">
              <NeneNotu>
                Bebek ağlarsa kucağına al. Şımarmaz, sevilir. Senin
                sıcaklığın, ona dünyanın güvenli olduğunu öğretir.
              </NeneNotu>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="nene-container py-16 md:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm uppercase tracking-[0.22em] text-nene-rust">
            Nasıl çalışıyor
          </p>
          <h2 className="font-serif text-3xl md:text-4xl">
            Her geleneksel tavsiye, bir uzman süzgecinden geçer.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {EXPERTISE_PREVIEW.map((item, i) => (
            <div
              key={item.key}
              className="rounded-lg border border-nene-mist bg-nene-cream p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-2xl text-nene-ink/30">
                  0{i + 1}
                </span>
                <ExpertBadge expertise={item.key} />
              </div>
              <h3 className="mt-4 font-serif text-xl text-nene-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-nene-ink/70">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST POSTS */}
      <section className="nene-container py-16 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm uppercase tracking-[0.22em] text-nene-rust">
              Son yazılar
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">
              Bu hafta nene ve uzmanlardan.
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden text-sm text-nene-ink hover:text-nene-rust no-underline md:inline"
          >
            Hepsini gör →
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-nene-mist bg-nene-mist/20 px-6 py-16 text-center">
            <p className="font-serif text-xl text-nene-ink">
              İlk yazılar yolda.
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
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="text-sm text-nene-ink hover:text-nene-rust no-underline"
          >
            Hepsini gör →
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCT GUIDE */}
      {featuredProduct ? (
        <section className="nene-container py-8 md:py-12">
          <div className="overflow-hidden rounded-2xl border border-nene-mist bg-nene-cream">
            <div className="grid md:grid-cols-[1.1fr_1fr]">
              <div className="p-8 md:p-12">
                <p className="mb-2 text-sm uppercase tracking-[0.22em] text-nene-rust">
                  Öne çıkan rehber
                </p>
                <h2 className="font-serif text-3xl leading-tight md:text-4xl">
                  {featuredProduct.title}
                </h2>
                <p className="mt-4 text-nene-ink/70">
                  {featuredProduct.items?.length ?? 0} ürün — her birinin
                  yanında &ldquo;neden bu&rdquo; yazıyor.
                </p>
                <div className="mt-5 flex items-center gap-2 text-sm text-nene-ink/70">
                  <span className="font-medium text-nene-ink">
                    {featuredProduct.author?.name}
                  </span>
                  {featuredProduct.author?.expertise ? (
                    <ExpertBadge
                      expertise={featuredProduct.author.expertise}
                    />
                  ) : null}
                </div>
                <Link
                  href={`/urunler/${featuredProduct.slug}`}
                  className="mt-7 inline-flex items-center rounded-md bg-nene-rust px-5 py-3 text-sm font-medium text-nene-cream no-underline"
                >
                  Rehberi oku
                </Link>
              </div>
              <div className="relative min-h-[260px] bg-nene-mist/50 md:min-h-0">
                {featuredProduct.items?.[0]?.image?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featuredProduct.items[0].image.url}
                    alt={
                      featuredProduct.items[0].image.alt ??
                      featuredProduct.title
                    }
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-serif text-4xl text-nene-ink/20">
                    nenenesor
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* RECENT QUESTIONS */}
      {questions.length > 0 ? (
        <section className="nene-container py-8 md:py-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm uppercase tracking-[0.22em] text-nene-rust">
                Son cevaplar
              </p>
              <h2 className="font-serif text-3xl md:text-4xl">
                Annelerden, uzmanlara.
              </h2>
            </div>
            <Link
              href="/sorular"
              className="hidden text-sm text-nene-ink hover:text-nene-rust no-underline md:inline"
            >
              Tüm sorular →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link
              href="/sorular"
              className="text-sm text-nene-ink hover:text-nene-rust no-underline"
            >
              Tüm sorular →
            </Link>
          </div>
        </section>
      ) : null}

      {/* NEWSLETTER */}
      <section className="nene-container py-16 md:py-20">
        <div className="overflow-hidden rounded-2xl border border-nene-gold/40 bg-nene-mist/40">
          <div className="grid gap-8 p-10 md:grid-cols-[1.2fr_1fr] md:p-14">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.22em] text-nene-rust">
                Bülten
              </p>
              <h2 className="font-serif text-3xl leading-tight md:text-4xl">
                Nene&apos;den haftalık mektup.
              </h2>
              <p className="mt-4 max-w-md text-nene-ink/70">
                Haftada bir kez, anne ve bebek için sıcacık seçkiler. Spam
                yok, sıkıcılık yok.
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <NewsletterForm />
              <p className="mt-3 text-xs text-nene-ink/55">
                Mailini sadece sana mektup göndermek için kullanırız.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
