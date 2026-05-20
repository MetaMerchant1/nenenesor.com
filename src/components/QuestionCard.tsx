import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { ExpertBadge } from './ExpertBadge'

type Expertise = 'diyetisyen' | 'ebe' | 'doktor'

export interface QuestionCardData {
  slug: string
  questionTitle: string
  questionBody?: string
  askerName?: string
  publishedAt?: string | Date | null
  category?: { name?: string; slug?: string } | null
  assignedExpert?: {
    name?: string
    expertise?: Expertise
    slug?: string
  } | null
}

export function QuestionCard({
  question,
  className,
}: {
  question: QuestionCardData
  className?: string
}) {
  const date = question.publishedAt
    ? format(new Date(question.publishedAt), 'd MMMM yyyy', { locale: tr })
    : null

  return (
    <Link
      href={`/sorular/${question.slug}`}
      className={cn(
        'group flex flex-col rounded-lg border border-nene-mist bg-nene-cream p-5 no-underline transition hover:border-nene-rust/30 hover:shadow-sm',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {question.category?.name ? (
          <span className="text-xs uppercase tracking-[0.18em] text-nene-rust">
            {question.category.name}
          </span>
        ) : null}
        {question.assignedExpert?.expertise ? (
          <ExpertBadge expertise={question.assignedExpert.expertise} />
        ) : null}
      </div>

      <h3 className="mt-3 font-serif text-lg leading-snug text-nene-ink group-hover:text-nene-rust">
        {question.questionTitle}
      </h3>

      {question.questionBody ? (
        <p className="mt-2 line-clamp-3 text-sm text-nene-ink/70">
          {question.questionBody}
        </p>
      ) : null}

      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-nene-ink/60">
        <span>
          {question.assignedExpert?.name
            ? `Cevap: ${question.assignedExpert.name}`
            : 'Bekliyor'}
        </span>
        {date ? <span>{date}</span> : null}
      </div>
    </Link>
  )
}
