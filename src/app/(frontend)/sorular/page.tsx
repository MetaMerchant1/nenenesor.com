import type { Metadata } from 'next'
import Link from 'next/link'

import { QuestionCard, type QuestionCardData } from '@/components/QuestionCard'
import { getPayload } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Sorular',
  description:
    'Annelerin merak ettiği sorulara nene ve uzmanlardan cevaplar.',
  alternates: { canonical: '/sorular' },
}

const PAGE_SIZE = 12

export default async function QuestionsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ sayfa?: string }>
}) {
  const { sayfa } = await searchParams
  const page = Math.max(1, Number.parseInt(sayfa ?? '1', 10) || 1)
  const payload = await getPayload()

  const [qRes, categoriesRes] = await Promise.all([
    payload.find({
      collection: 'questions',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      page,
      limit: PAGE_SIZE,
      depth: 2,
    }),
    payload.find({ collection: 'categories', limit: 50, sort: 'name' }),
  ])

  const questions = qRes.docs as unknown as (QuestionCardData & { id: number })[]

  return (
    <div className="nene-container py-14">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm uppercase tracking-[0.22em] text-nene-rust">
            Sorular
          </p>
          <h1 className="font-serif text-4xl leading-tight md:text-5xl">
            Annelerden, uzmanlara.
          </h1>
          <p className="mt-3 text-nene-ink/70">
            Sen de sor — uzmanımız cevaplar, mail göndeririz.
          </p>
        </div>
        <Link
          href="/sorular/sor"
          className="rounded-md bg-nene-rust px-5 py-3 text-sm font-medium text-nene-cream no-underline"
        >
          Soru Sor
        </Link>
      </header>

      <div className="mb-8 flex flex-wrap gap-2">
        <span className="rounded-full border border-nene-mist bg-nene-cream px-3.5 py-1.5 text-xs font-medium text-nene-ink/80">
          Hepsi
        </span>
        {categoriesRes.docs.map((c) => {
          const cat = c as unknown as { slug: string; name: string }
          return (
            <span
              key={cat.slug}
              className="rounded-full border border-nene-mist bg-nene-cream px-3.5 py-1.5 text-xs text-nene-ink/55"
            >
              {cat.name}
            </span>
          )
        })}
      </div>

      {questions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-nene-mist bg-nene-mist/20 px-6 py-16 text-center">
          <p className="font-serif text-xl text-nene-ink">
            Henüz cevaplanmış soru yok. İlk soruyu sen sor.
          </p>
          <Link
            href="/sorular/sor"
            className="mt-5 inline-block rounded-md bg-nene-rust px-5 py-3 text-sm font-medium text-nene-cream no-underline"
          >
            Soru Sor
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}

      {qRes.totalPages > 1 ? (
        <nav className="mt-12 flex items-center justify-center gap-3 text-sm">
          {page > 1 ? (
            <Link
              href={`/sorular?sayfa=${page - 1}`}
              className="rounded-md border border-nene-mist px-3 py-1.5 text-nene-ink hover:border-nene-rust/40 no-underline"
            >
              ← Önceki
            </Link>
          ) : null}
          <span className="text-nene-ink/60">
            {page} / {qRes.totalPages}
          </span>
          {page < qRes.totalPages ? (
            <Link
              href={`/sorular?sayfa=${page + 1}`}
              className="rounded-md border border-nene-mist px-3 py-1.5 text-nene-ink hover:border-nene-rust/40 no-underline"
            >
              Sonraki →
            </Link>
          ) : null}
        </nav>
      ) : null}

      {/* Mobile sticky CTA */}
      <Link
        href="/sorular/sor"
        className="fixed bottom-4 right-4 z-30 rounded-full bg-nene-rust px-5 py-3 text-sm font-medium text-nene-cream shadow-lg shadow-nene-rust/30 no-underline md:hidden"
      >
        + Soru Sor
      </Link>
    </div>
  )
}
