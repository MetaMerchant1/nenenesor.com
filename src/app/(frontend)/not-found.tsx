import Link from 'next/link'

import { NeneNotu } from '@/components/NeneNotu'

export default function NotFound() {
  return (
    <div className="nene-container max-w-2xl py-24 text-center">
      <p className="mb-2 text-sm uppercase tracking-[0.22em] text-nene-rust">
        404
      </p>
      <h1 className="font-serif text-4xl leading-tight md:text-5xl">
        Bu sayfa nene&apos;nin sandığında bile yok.
      </h1>
      <p className="mt-5 text-lg text-nene-ink/75">
        Belki link eskidi, belki yazılırken bir harf kaydı. Anasayfaya
        dönelim mi?
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-nene-rust px-5 py-3 text-sm font-medium text-nene-cream no-underline"
        >
          Anasayfa
        </Link>
        <Link
          href="/blog"
          className="rounded-md border border-nene-ink/15 bg-nene-cream px-5 py-3 text-sm font-medium text-nene-ink no-underline"
        >
          Bloğa bak
        </Link>
      </div>

      <NeneNotu className="mt-12 text-left">
        Bazen yolunu kaybedersin de güzel bir şeye varırsın. Anasayfada bekliyoruz.
      </NeneNotu>
    </div>
  )
}
