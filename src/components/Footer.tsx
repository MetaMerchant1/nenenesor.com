import Link from 'next/link'

const COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: 'İçerik',
    links: [
      { href: '/blog', label: 'Blog' },
      { href: '/sorular', label: 'Sorular' },
      { href: '/urunler', label: 'Ürünler' },
    ],
  },
  {
    title: 'Topluluk',
    links: [
      { href: '/uzmanlar', label: 'Uzmanlar' },
      { href: '/bulten', label: 'Bülten' },
      { href: '/sorular/sor', label: 'Soru Sor' },
    ],
  },
  {
    title: 'Kurumsal',
    links: [
      { href: '/hakkimizda', label: 'Hakkımızda' },
      { href: '/kvkk', label: 'KVKK' },
      { href: '/gizlilik', label: 'Gizlilik' },
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-24 border-t border-nene-mist bg-nene-mist/30">
      <div className="nene-container py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="font-serif text-2xl text-nene-ink">nenenesor</div>
            <p className="mt-3 max-w-xs text-sm text-nene-ink/70">
              Nene&apos;nin sezgisi, uzmanın bilgisi. Bir araya geldiğinde
              anne ve bebekler kazanır.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <div className="font-serif text-base text-nene-ink">{col.title}</div>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-nene-ink/80 hover:text-nene-rust no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-nene-mist pt-6 text-xs text-nene-ink/60 md:flex-row md:items-center">
          <div>© {year} nenenesor. Tüm hakları saklıdır.</div>
          <div className="italic">Önce nene&apos;ne sor.</div>
        </div>
      </div>
    </footer>
  )
}
