import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichText } from '@payloadcms/richtext-lexical/react'

import { ExpertBadge } from '@/components/ExpertBadge'
import { QuestionCard, type QuestionCardData } from '@/components/QuestionCard'
import { getPayload } from '@/lib/payload'
import { jsonLdScript } from '@/lib/seo'
import { SITE_NAME, SITE_URL } from '@/lib/utils'

export const revalidate = 60

type Params = { slug: string }

async function loadQuestion(slug: string) {
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'questions',
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
  const q = (await loadQuestion(slug)) as unknown as
    | {
        questionTitle: string
        questionBody?: string
        seo?: { metaTitle?: string; metaDescription?: string }
      }
    | null
  if (!q) return {}
  return {
    title: q.seo?.metaTitle ?? q.questionTitle,
    description: q.seo?.metaDescription ?? q.questionBody?.slice(0, 160),
    alternates: { canonical: `/sorular/${slug}` },
  }
}

export default async function QuestionDetailPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const q = await loadQuestion(slug)
  if (!q) notFound()

  const d = q as unknown as {
    id: number
    slug: string
    questionTitle: string
    questionBody: string
    askerName?: string
    publishedAt?: string
    answer?: object
    assignedExpert?: {
      id: number
      name: string
      slug: string
      title?: string
      expertise?: 'diyetisyen' | 'ebe' | 'doktor'
      photo?: { url?: string }
    }
    category?: { id: number; name: string; slug: string }
  }

  const date = d.publishedAt
    ? format(new Date(d.publishedAt), 'd MMMM yyyy', { locale: tr })
    : null

  const payload = await getPayload()
  const relatedRes = d.category
    ? await payload.find({
        collection: 'questions',
        where: {
          status: { equals: 'published' },
          category: { equals: d.category.id },
          id: { not_equals: d.id },
        },
        sort: '-publishedAt',
        limit: 3,
        depth: 2,
      })
    : { docs: [] }
  const related = relatedRes.docs as unknown as (QuestionCardData & {
    id: number
  })[]

  const url = `${SITE_URL}/sorular/${d.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: d.questionTitle,
      text: d.questionBody,
      answerCount: 1,
      dateCreated: d.publishedAt && new Date(d.publishedAt).toISOString(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: d.questionBody,
        author: {
          '@type': 'Person',
          name: d.assignedExpert?.name,
          jobTitle: d.assignedExpert?.title,
          url: d.assignedExpert?.slug
            ? `${SITE_URL}/uzmanlar/${d.assignedExpert.slug}`
            : undefined,
        },
      },
    },
    url,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }

  return (
    <article className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />

      <div className="nene-container max-w-3xl pt-10">
        {d.category ? (
          <Link
            href="/sorular"
            className="text-xs uppercase tracking-[0.2em] text-nene-rust no-underline"
          >
            ← Sorular
          </Link>
        ) : null}

        <h1 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
          {d.questionTitle}
        </h1>

        <div className="mt-6 rounded-lg border border-nene-mist bg-nene-mist/20 p-5">
          <p className="text-nene-ink/80 whitespace-pre-line">{d.questionBody}</p>
          <p className="mt-4 text-xs text-nene-ink/55">
            — {d.askerName ?? 'İsimsiz Anne'}
            {date ? `, ${date}` : ''}
          </p>
        </div>

        {d.assignedExpert ? (
          <section className="mt-10">
            <div className="mb-4 flex items-center gap-3">
              {d.assignedExpert.photo?.url ? (
                <Image
                  src={d.assignedExpert.photo.url}
                  alt={d.assignedExpert.name}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-nene-mist text-sm font-medium text-nene-ink/70">
                  {d.assignedExpert.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/uzmanlar/${d.assignedExpert.slug}`}
                    className="font-medium text-nene-ink no-underline hover:text-nene-rust"
                  >
                    {d.assignedExpert.name}
                  </Link>
                  {d.assignedExpert.expertise ? (
                    <ExpertBadge expertise={d.assignedExpert.expertise} />
                  ) : null}
                </div>
                {d.assignedExpert.title ? (
                  <div className="text-xs text-nene-ink/55">
                    {d.assignedExpert.title}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="prose-nene">
              {d.answer ? <RichText data={d.answer as never} /> : null}
            </div>
          </section>
        ) : null}
      </div>

      {related.length > 0 ? (
        <section className="nene-container mt-16">
          <h2 className="mb-6 font-serif text-2xl">İlgili sorular</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <QuestionCard key={r.id} question={r} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
