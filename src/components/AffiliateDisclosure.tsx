import { Info } from 'lucide-react'

import { cn } from '@/lib/utils'

export function AffiliateDisclosure({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-md border border-nene-gold/40 bg-nene-mist/40 px-4 py-3 text-xs text-nene-ink/80',
        className,
      )}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-nene-gold" aria-hidden />
      <p>
        Bu sayfadaki ürün bağlantılarından alışveriş yaparsan, küçük bir
        komisyon kazanırız. <strong className="font-medium">Senin için fiyatı değişmez.</strong>
      </p>
    </div>
  )
}
