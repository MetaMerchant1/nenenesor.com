import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichText } from '@payloadcms/richtext-lexical/react'

import { ExpertBadge } from '@/components/ExpertBadge'
import { PostCard, type PostCardData } from '@/components/PostCard'
import { QuestionCard, type QuestionCardData } from '@/components/QuestionCard'
import { getPayload } from '@/lib/payload'
import { buildPersonJsonLd, jsonLdScript } from '@/lib/seo'

export const revalidate = 300

type Params = { slug: string }

async function loadExpert(slug: string) {
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'experts',
    where: { slug: { equals: slug } },
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
  const e = (await loadExpert(slug)) as unknown as
    | { name: string; title?: string }
    | null
  if (!e) return {}
  return {
    title: `${e.name}`,
    description: e.title ? `${e.name} — ${e.title}` : e.name,
    alternates: { canonical: `/uzmanlar/${slug}` },
  }
}

export default async function ExpertProfilePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const e = await loadExpert(slug)
  if (!e) notFound()

  const d = e as unknown as {
    id: number
    slug: string
    name: string
    title?: string
    expertise?: 'diyetisyen' | 'ebe' | 'doktor'
    photo?: { url?: string }
    bio?: object
    credentials?: object
    socialLinks?: { platform: string; url: string }[]
  }

  const payload = await getPayload()
  const [postsRes, questionsRes] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: {
        status: { equals: 'published' },
        author: { equals: d.id },
      },
      sort: '-publishedAt',
      limit: 6,
      depth: 2,
    }),
    payload.find({
      collection: 'questions',
      where: {
        status: { equals: 'published' },
        assignedExpert: { equals: d.id },
      },
      sort: '-publishedAt',
      limit: 4,
      depth: 2,
    }),
  ])
  const posts = postsRes.docs as unknown as (PostCardData & { id: number })[]
  const questions = questionsRes.docs as unknown as (QuestionCardData & {
    id: number
  })[]

  const jsonLd = buildPersonJsonLd({
    name: d.name,
    slug: d.slug,
    title: d.title,
    image: d.photo?.url,
  })

  return (
    <div className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />

      <header className="border-b border-nene-mist bg-nene-mist/20">
        <div className="nene-container max-w-3xl py-12">
          <Link
            href="/uzmanlar"
            className="text-xs uppercase tracking-[0.2em] text-nene-rust no-underline"
          >
            ← Uzmanlar
          </Link>
          <div className="mt-6 flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-nene-mist">
              {d.photo?.url ? (
                <Image
                  src={d.photo.url}
                  alt={d.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-serif text-2xl text-nene-ink/40">
                  {d.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
              )}
            </div>
            <div>
              <h1 className="font-serif text-3xl text-nene-ink md:text-4xl">
                {d.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {d.title ? (
                  <span className="text-sm text-nene-ink/70">{d.title}</span>
                ) : null}
                {d.expertise ? <ExpertBadge expertise={d.expertise} /> : null}
              </div>
              {d.socialLinks && d.socialLinks.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  {d.socialLinks.map((s) => (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noopener"
                      className="text-nene-rust no-underline hover:underline"
                    >
                      {s.platform}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {d.bio ? (
        <section className="nene-container max-w-3xl py-10">
          <h2 className="font-serif text-2xl">Hakkında</h2>
          <div className="prose-nene mt-4">
            <RichText data={d.bio as never} />
          </div>
        </section>
      ) : null}

      {d.credentials ? (
        <section className="nene-container max-w-3xl py-4">
          <h2 className="font-serif text-2xl">Diploma ve sertifikalar</h2>
          <div className="prose-nene mt-4">
            <RichText data={d.credentials as never} />
          </div>
        </section>
      ) : null}

      {posts.length > 0 ? (
        <section className="nene-container py-12">
          <h2 className="mb-6 font-serif text-2xl">Bu uzmandan son yazılar</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}

      {questions.length > 0 ? (
        <section className="nene-container py-12">
          <h2 className="mb-6 font-serif text-2xl">Cevapladığı sorular</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
