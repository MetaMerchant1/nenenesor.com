import { ExternalLink } from 'lucide-react'

import { cn } from '@/lib/utils'

export type Retailer = 'hepsiburada' | 'trendyol' | 'ebebek' | 'amazon'

const RETAILER_LABELS: Record<Retailer, string> = {
  hepsiburada: 'Hepsiburada',
  trendyol: 'Trendyol',
  ebebek: 'ebebek',
  amazon: 'Amazon',
}

const RETAILER_STYLES: Record<Retailer, string> = {
  hepsiburada: 'border-[#FF6000]/40 hover:bg-[#FF6000]/10',
  trendyol: 'border-[#F27A1A]/40 hover:bg-[#F27A1A]/10',
  ebebek: 'border-nene-rust/40 hover:bg-nene-rust/10',
  amazon: 'border-[#FF9900]/50 hover:bg-[#FF9900]/10',
}

interface AffiliateButtonProps {
  retailer: Retailer
  url: string
  className?: string
}

export function AffiliateButton({
  retailer,
  url,
  className,
}: AffiliateButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      data-plausible-event-name="affiliate-click"
      data-plausible-event-retailer={retailer}
      className={cn(
        'inline-flex items-center justify-between gap-2 rounded-md border bg-nene-cream px-4 py-2.5 text-sm font-medium text-nene-ink no-underline transition',
        RETAILER_STYLES[retailer],
        className,
      )}
    >
      <span>{RETAILER_LABELS[retailer]}</span>
      <ExternalLink className="h-3.5 w-3.5 text-nene-ink/50" aria-hidden />
    </a>
  )
}
