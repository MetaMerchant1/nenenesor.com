'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="nene-container max-w-2xl py-24 text-center">
      <p className="mb-2 text-sm uppercase tracking-[0.22em] text-nene-rust">
        Bir aksaklık oldu
      </p>
      <h1 className="font-serif text-4xl leading-tight md:text-5xl">
        Şimdilik bu sayfa nazlanıyor.
      </h1>
      <p className="mt-5 text-lg text-nene-ink/75">
        Bir dakika bekleyip tekrar dene. Devam ederse haberin olsun, bakarız.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => reset()}
          className="rounded-md bg-nene-rust px-5 py-3 text-sm font-medium text-nene-cream"
        >
          Tekrar dene
        </button>
        <Link
          href="/"
          className="rounded-md border border-nene-ink/15 bg-nene-cream px-5 py-3 text-sm font-medium text-nene-ink no-underline"
        >
          Anasayfa
        </Link>
      </div>
    </div>
  )
}
