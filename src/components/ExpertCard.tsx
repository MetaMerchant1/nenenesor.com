import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { ExpertBadge } from './ExpertBadge'

type Expertise = 'diyetisyen' | 'ebe' | 'doktor'

export interface ExpertCardData {
  slug: string
  name: string
  title?: string
  expertise: Expertise
  photo?: { url?: string | null; alt?: string | null } | null
}

export function ExpertCard({
  expert,
  className,
}: {
  expert: ExpertCardData
  className?: string
}) {
  return (
    <Link
      href={`/uzmanlar/${expert.slug}`}
      className={cn(
        'group flex flex-col items-center rounded-lg border border-nene-mist bg-nene-cream p-6 text-center no-underline transition hover:border-nene-rust/30 hover:shadow-sm',
        className,
      )}
    >
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-nene-mist">
        {expert.photo?.url ? (
          <Image
            src={expert.photo.url}
            alt={expert.photo.alt ?? expert.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-serif text-2xl text-nene-ink/40">
            {expert.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>
        )}
      </div>
      <h3 className="mt-4 font-serif text-lg text-nene-ink group-hover:text-nene-rust">
        {expert.name}
      </h3>
      {expert.title ? (
        <p className="mt-0.5 text-xs text-nene-ink/60">{expert.title}</p>
      ) : null}
      <div className="mt-3">
        <ExpertBadge expertise={expert.expertise} />
      </div>
    </Link>
  )
}
