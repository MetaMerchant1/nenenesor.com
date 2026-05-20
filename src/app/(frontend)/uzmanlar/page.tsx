import type { Metadata } from 'next'

import { ExpertCard, type ExpertCardData } from '@/components/ExpertCard'
import { getPayload } from '@/lib/payload'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Uzmanlar',
  description:
    "Yazılarımızı yazan ve sorulara cevap veren diyetisyen, ebe ve doktorlar.",
  alternates: { canonical: '/uzmanlar' },
}

export default async function ExpertsIndexPage() {
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'experts',
    limit: 50,
    sort: 'name',
    depth: 2,
  })
  const experts = res.docs as unknown as (ExpertCardData & { id: number })[]

  return (
    <div className="nene-container py-14">
      <header className="mb-12 max-w-2xl">
        <p className="mb-2 text-sm uppercase tracking-[0.22em] text-nene-rust">
          Uzmanlar
        </p>
        <h1 className="font-serif text-4xl leading-tight md:text-5xl">
          Bilen ellerden.
        </h1>
        <p className="mt-4 text-nene-ink/75">
          Yazıları yazan, sorulara cevap veren ekibimiz. Her uzmanın diploma
          ve uzmanlık belgesi doğrulanır.
        </p>
      </header>

      {experts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-nene-mist bg-nene-mist/20 px-6 py-16 text-center">
          <p className="font-serif text-xl text-nene-ink">
            Uzman ekibimiz yakında burada.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {experts.map((e) => (
            <ExpertCard key={e.id} expert={e} />
          ))}
        </div>
      )}
    </div>
  )
}
