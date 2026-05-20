import type { Metadata } from 'next'

import { QuestionForm } from '@/components/QuestionForm'
import { getPayload } from '@/lib/payload'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Soru Sor',
  description:
    "Aklındaki soruyu yaz — uzmanlarımız cevaplar. Mailini sadece sana cevap göndermek için kullanırız.",
  alternates: { canonical: '/sorular/sor' },
  robots: { index: true, follow: true },
}

export default async function AskQuestionPage() {
  const payload = await getPayload()
  const categoriesRes = await payload.find({
    collection: 'categories',
    limit: 50,
    sort: 'name',
  })
  const categories = categoriesRes.docs as unknown as {
    slug: string
    name: string
  }[]

  return (
    <div className="nene-container max-w-3xl py-14">
      <header className="mb-10">
        <p className="mb-2 text-sm uppercase tracking-[0.22em] text-nene-rust">
          Soru sor
        </p>
        <h1 className="font-serif text-4xl leading-tight md:text-5xl">
          Aklındaki soruyu yaz.
        </h1>
        <p className="mt-3 max-w-xl text-nene-ink/70">
          Uzmanlarımızdan birine yönlendiririz. Cevap hazır olunca mail
          atarız — söz.
        </p>
      </header>

      <QuestionForm categories={categories} />
    </div>
  )
}
