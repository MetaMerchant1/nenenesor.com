import type { Metadata } from 'next'

import { NeneNotu } from '@/components/NeneNotu'
import { NewsletterForm } from '@/components/NewsletterForm'

export const metadata: Metadata = {
  title: 'Bülten',
  description:
    "Nene'den haftalık mektup. Anne ve bebek için seçkiler, soru–cevap ve uzmanlardan kısa notlar. Spam yok, sıkıcılık yok.",
  alternates: { canonical: '/bulten' },
}

export default function NewsletterPage() {
  return (
    <div className="nene-container max-w-3xl py-14">
      <header className="mb-10">
        <p className="mb-2 text-sm uppercase tracking-[0.22em] text-nene-rust">
          Bülten
        </p>
        <h1 className="font-serif text-4xl leading-tight md:text-5xl">
          Nene&apos;den haftalık mektup.
        </h1>
        <p className="mt-4 text-lg text-nene-ink/75">
          Haftada bir kez, kahvenin yanına oturup okuyacağın türden:
          uzmanlardan yeni yazılar, annelerden cevaplanan sorular, küçük bir
          nene notu.
        </p>
      </header>

      <div className="rounded-2xl border border-nene-gold/40 bg-nene-mist/30 p-8 md:p-10">
        <NewsletterForm variant="block" withName />
        <p className="mt-4 text-xs text-nene-ink/55">
          Mailini sadece sana mektup göndermek için kullanırız. Üçüncü
          kişilerle paylaşmayız. İstediğin zaman tek tıkla iptal edebilirsin.
        </p>
      </div>

      <section className="mt-14">
        <h2 className="font-serif text-2xl">Geçen haftanın mektubundan</h2>
        <div className="mt-4 rounded-lg border border-nene-mist bg-nene-cream p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-nene-rust">
            Sayı #12
          </p>
          <p className="mt-2 font-serif text-xl">
            &ldquo;Bebek ağladığında kucağa al — şımarmaz, sevilir.&rdquo;
          </p>
          <ul className="mt-4 space-y-2 text-sm text-nene-ink/75">
            <li>
              📚 <strong>Bu hafta yazıldı:</strong> Emzirme döneminde annenin
              tabağında ne olmalı?
            </li>
            <li>
              💬 <strong>Cevaplanan soru:</strong> 4 aylık bebeğim gece sürekli
              uyanıyor, normal mi?
            </li>
            <li>
              🛒 <strong>Nene&apos;nin onayı:</strong> Yenidoğan için hijyenik
              ped seçimi.
            </li>
            <li>
              ✉️ <strong>Nene&apos;den not:</strong> &ldquo;Su iç. Yorgunsan
              uyu. Misafir bekleyebilir.&rdquo;
            </li>
          </ul>
        </div>
      </section>

      <NeneNotu className="mt-10">
        Mektup gelir, açar, bir nefes alır okursun. Belki bir cümle aklında
        kalır, belki kalmaz. İkisi de iyi.
      </NeneNotu>
    </div>
  )
}
