import type { Metadata } from 'next'
import Link from 'next/link'

import { GebelikHesaplayici } from '@/components/GebelikHesaplayici'
import { NeneNotu } from '@/components/NeneNotu'

export const metadata: Metadata = {
  title: 'Gebelik Hesaplama — Doğum Tarihi ve Hafta Hesaplama',
  description:
    'Son adet tarihine göre tahmini doğum tarihini, kaçıncı haftada olduğunu ve trimesterini hemen hesapla. Ücretsiz, kayıt gerektirmez.',
  alternates: { canonical: '/gebelik-hesaplama' },
}

export default function GebelikHesaplamaPage() {
  return (
    <div className="nene-container max-w-3xl py-14">
      <header className="mb-10">
        <p className="mb-2 text-sm uppercase tracking-[0.22em] text-nene-rust">
          Gebelik Hesaplama
        </p>
        <h1 className="font-serif text-4xl leading-tight md:text-5xl">
          Son adet tarihine göre gebelik hesaplama.
        </h1>
        <p className="mt-4 text-lg text-nene-ink/75">
          Son adet tarihini gir; tahmini doğum tarihini, kaçıncı hafta ve
          günde olduğunu, hangi trimesterde olduğunu hemen görelim.
        </p>
      </header>

      <GebelikHesaplayici />

      <NeneNotu className="mt-10" label="— Nene'den bir hatırlatma">
        Bu hesaplama, son adet tarihine göre yapılan bir tahmindir — kesin bir
        teşhis ya da randevu günü değil. Her gebelik kendi ritmini tutar;
        gerçek doğum tarihi bu tahminin birkaç hafta öncesinde ya da
        sonrasında olabilir, bu tamamen normaldir. Gebelik takibini mutlaka
        doktorun ya da ebenle yapmaya devam et; ultrason ölçümleri bu
        hesaplamadan çok daha doğru bir tarih verecektir.
      </NeneNotu>

      <div className="prose-nene mt-10">
        <p>
          Hamilelik dönemiyle ilgili yazılarımıza{' '}
          <Link href="/blog/kategori/hamilelik">buradan</Link> göz atabilirsin.
        </p>
      </div>
    </div>
  )
}
