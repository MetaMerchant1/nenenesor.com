import type { Metadata } from 'next'
import Link from 'next/link'

import { ExpertBadge } from '@/components/ExpertBadge'
import { NeneNotu } from '@/components/NeneNotu'

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description:
    "nenenesor.com — geleneksel bilgelik ile uzman bilgisini bir araya getiren Türkçe bir anne–bebek rehberi. Neye, nasıl, neden inanıyoruz.",
  alternates: { canonical: '/hakkimizda' },
}

export default function AboutPage() {
  return (
    <div className="nene-container max-w-3xl py-14">
      <header className="mb-10">
        <p className="mb-2 text-sm uppercase tracking-[0.22em] text-nene-rust">
          Hakkımızda
        </p>
        <h1 className="font-serif text-4xl leading-tight md:text-5xl">
          Önce nene&apos;ye sor, sonra uzmana doğrula.
        </h1>
        <p className="mt-4 text-lg text-nene-ink/75">
          nenenesor.com, Türkçe anne ve bebek dünyasında çok sık karşılaşılan
          iki uca da inanmayan bir yer: ne &ldquo;eskinin her şeyi doğruydu&rdquo; diyebiliriz,
          ne de &ldquo;eskiyi at, sadece kitaba bak.&rdquo;
        </p>
      </header>

      <div className="prose-nene">
        <h2>Editoryal premis</h2>
        <p>
          Her geleneksel tavsiye, bir uzman süzgecinden geçer. Bir nene
          tavsiyesi okuduğunda, onu yazan ya da onaylayan kişi mutlaka bir
          diyetisyen, ebe ya da doktordur. Doğru olan, &ldquo;saygı görenden&rdquo; değil,
          bugünkü bilimden yana yazılır.
        </p>
        <p>
          Ses tonumuz <strong>bilge bir nene</strong> gibi: sıcak, bilen, az
          oyuncu, asla yargılayan ya da korkutan değil. Hiçbir zaman
          &ldquo;şımarır,&rdquo; &ldquo;çocuk bilmez,&rdquo; &ldquo;saçma sapan&rdquo; gibi cümleler kurmayız.
        </p>

        <h2>Uzmanlarımız</h2>
        <p>Üç temel uzmanlık türüyle çalışıyoruz:</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-nene-mist bg-nene-cream p-5">
          <ExpertBadge expertise="diyetisyen" />
          <p className="mt-3 text-sm text-nene-ink/75">
            Anne ve bebek beslenmesi. Hamilelik, emzirme, ek gıda, çocuk
            beslenmesi.
          </p>
        </div>
        <div className="rounded-lg border border-nene-mist bg-nene-cream p-5">
          <ExpertBadge expertise="ebe" />
          <p className="mt-3 text-sm text-nene-ink/75">
            Doğum öncesi ve sonrası — doğuma hazırlık, yenidoğan bakımı,
            anne ruh sağlığı.
          </p>
        </div>
        <div className="rounded-lg border border-nene-mist bg-nene-cream p-5">
          <ExpertBadge expertise="doktor" />
          <p className="mt-3 text-sm text-nene-ink/75">
            Pediatri ve kadın doğum uzmanları. Korkutmadan, yargılamadan
            tıbbi bilgi.
          </p>
        </div>
      </div>

      <div className="prose-nene mt-12">
        <h2>Uzmanı nasıl seçiyoruz?</h2>
        <p>
          Her uzmanın <strong>diploma, lisans ya da uzmanlık belgesi</strong>{' '}
          doğrulanır. Klinik deneyimi, ses tonu ve okuyucunun &ldquo;suçluymuş&rdquo;
          gibi hissetmemesi de önemli. İyi bir uzman, doğru bilgiyi karşıdaki
          insanı küçük düşürmeden verir.
        </p>

        <h2>Gelir modelimiz — şeffaf</h2>
        <p>
          nenenesor.com&apos;da abonelik, üyelik ya da gizli ücret yok. İki
          yerden gelir elde ederiz:
        </p>
        <ul>
          <li>
            <strong>Affiliate bağlantılar:</strong> Ürün rehberlerinde,
            önerdiğimiz markaların satıcılarından (Hepsiburada, Trendyol,
            ebebek, Amazon TR) küçük bir komisyon alırız.{' '}
            <em>
              Komisyon alıyor diye bir ürünü asla önermeyiz; ancak gönülden
              önerdiğimiz ürünler için bağlantıyı affiliate yaparız.
            </em>{' '}
            Senin için fiyatı değişmez.
          </li>
          <li>
            <strong>Sponsorluk:</strong> İleride, editör bağımsızlığını koruyan
            şartlarla seçilmiş sponsorluklar olabilir. Her zaman açıkça
            etiketlenir.
          </li>
        </ul>

        <h2>KVKK ve gizlilik</h2>
        <p>
          Soru sorduğunda paylaştığın e-postayı sadece sana cevap göndermek
          için kullanırız. Bültene yazıldığında, e-postan MailerLite&apos;da
          (KVKK uyumlu) tutulur ve istediğin zaman iptal edebilirsin.
        </p>

        <h2>İletişim</h2>
        <p>
          Aklında bir şey varsa — soru, geri bildirim, &ldquo;şunu da yazsanız&rdquo; — bize{' '}
          <a href="mailto:nene@nenenesor.com">nene@nenenesor.com</a> üzerinden
          ulaşabilirsin.
        </p>
      </div>

      <NeneNotu className="mt-10">
        Eski denildi diye doğru olmaz, yeni denildi diye de. İkisine de bak,
        kendi çocuğuna senin kalbin karar verir.
      </NeneNotu>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/sorular/sor"
          className="rounded-md bg-nene-rust px-5 py-3 text-sm font-medium text-nene-cream no-underline"
        >
          Bir soru sor
        </Link>
        <Link
          href="/bulten"
          className="rounded-md border border-nene-ink/15 bg-nene-cream px-5 py-3 text-sm font-medium text-nene-ink no-underline"
        >
          Bültene katıl
        </Link>
      </div>
    </div>
  )
}
