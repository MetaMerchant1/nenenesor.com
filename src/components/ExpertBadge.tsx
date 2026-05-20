import { cn } from '@/lib/utils'

type Expertise = 'diyetisyen' | 'ebe' | 'doktor'

const LABELS: Record<Expertise, string> = {
  diyetisyen: 'Diyetisyen',
  ebe: 'Ebe',
  doktor: 'Doktor',
}

const STYLES: Record<Expertise, string> = {
  diyetisyen: 'bg-nene-sage/15 text-nene-sage border-nene-sage/30',
  ebe: 'bg-nene-rust/15 text-nene-rust border-nene-rust/30',
  doktor: 'bg-nene-gold/20 text-nene-ink border-nene-gold/40',
}

interface ExpertBadgeProps {
  expertise: Expertise
  className?: string
}

export function ExpertBadge({ expertise, className }: ExpertBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        STYLES[expertise],
        className,
      )}
    >
      {LABELS[expertise]}
    </span>
  )
}
