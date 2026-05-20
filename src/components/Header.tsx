import Link from 'next/link'

const NAV = [
  { href: '/blog', label: 'Blog' },
  { href: '/sorular', label: 'Sorular' },
  { href: '/urunler', label: 'Ürünler' },
  { href: '/uzmanlar', label: 'Uzmanlar' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
]

export function Header() {
  return (
    <header className="border-b border-nene-mist bg-nene-cream/80 backdrop-blur sticky top-0 z-40">
      <div className="nene-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2 text-nene-ink no-underline">
          <span className="font-serif text-2xl tracking-tight">nenenesor</span>
          <span className="hidden text-sm text-nene-ink/60 md:inline">
            Önce nene&apos;ne sor.
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-nene-ink hover:text-nene-rust no-underline"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/sorular/sor"
            className="rounded-md bg-nene-rust px-4 py-2 text-sm font-medium text-nene-cream hover:bg-nene-rust/90 no-underline"
          >
            Soru Sor
          </Link>
        </nav>

        <Link
          href="/sorular/sor"
          className="rounded-md bg-nene-rust px-3 py-2 text-sm font-medium text-nene-cream hover:bg-nene-rust/90 no-underline md:hidden"
        >
          Soru Sor
        </Link>
      </div>
    </header>
  )
}
