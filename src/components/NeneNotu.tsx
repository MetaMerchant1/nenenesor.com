import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface NeneNotuProps {
  children: ReactNode
  className?: string
}

export function NeneNotu({ children, className }: NeneNotuProps) {
  return (
    <aside
      className={cn(
        'my-8 rounded-r-md border-l-4 border-nene-gold bg-nene-mist/40 px-5 py-4',
        className,
      )}
    >
      <div className="font-serif italic text-lg leading-relaxed text-nene-ink">
        {children}
      </div>
      <div className="mt-3 text-xs uppercase tracking-[0.18em] text-nene-ink/60">
        — Nene&apos;den
      </div>
    </aside>
  )
}
