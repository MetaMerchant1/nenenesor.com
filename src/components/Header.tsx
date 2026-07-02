'use client'

import { LogIn, LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

const NAV = [
  { href: '/blog', label: 'Blog' },
  { href: '/sorular', label: 'Sorular' },
  { href: '/urunler', label: 'Ürünler' },
  { href: '/uzmanlar', label: 'Uzmanlar' },
  { href: '/gebelik-hesaplama', label: 'Gebelik Hesaplama' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
]

const MOBILE_MENU_ID = 'mobile-nav-menu'

type AuthUser = { name: string; role: 'admin' | 'editor' | 'expert' }

export function Header({ user }: { user: AuthUser | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/users/logout', { method: 'POST' })
    router.refresh()
  }

  const close = useCallback(() => setIsOpen(false), [])

  /** Close menu on route change */
  useEffect(() => {
    close()
  }, [pathname, close])

  /** Close menu on Escape key */
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  /** Prevent body scroll when mobile menu is open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <header className="border-b border-nene-mist bg-nene-cream/80 backdrop-blur sticky top-0 z-40">
      <div className="nene-container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-baseline gap-2 text-nene-ink no-underline"
        >
          <span className="font-serif text-2xl tracking-tight">nenenesor</span>
          <span className="hidden text-sm text-nene-ink/60 md:inline">
            Önce nene&apos;ne sor.
          </span>
        </Link>

        {/* Desktop nav */}
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

          <div className="h-5 w-px bg-nene-mist" aria-hidden="true" />

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="text-sm text-nene-ink/70 hover:text-nene-ink no-underline"
                title={user.role}
              >
                {user.name}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-nene-ink/60 hover:text-nene-rust"
                aria-label="Çıkış yap"
              >
                <LogOut size={15} />
                Çıkış
              </button>
            </div>
          ) : (
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 text-sm text-nene-ink/70 hover:text-nene-ink no-underline"
            >
              <LogIn size={15} />
              Giriş
            </Link>
          )}
        </nav>

        {/* Mobile: hamburger toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-nene-ink hover:bg-nene-mist/60 md:hidden"
          aria-expanded={isOpen}
          aria-controls={MOBILE_MENU_ID}
          aria-label={isOpen ? 'Menüyü kapat' : 'Menüyü aç'}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 top-16 z-30 bg-nene-ink/20 transition-opacity duration-200 md:hidden ${
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Mobile menu panel */}
      <div
        ref={menuRef}
        id={MOBILE_MENU_ID}
        role="navigation"
        aria-label="Mobil navigasyon"
        className={`absolute left-0 right-0 top-16 z-40 border-b border-nene-mist bg-nene-cream shadow-lg transition-all duration-250 ease-out md:hidden ${
          isOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-2 pointer-events-none opacity-0'
        }`}
      >
        <div className="nene-container flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={`rounded-md px-4 py-3 text-base no-underline transition-colors ${
                pathname === item.href
                  ? 'bg-nene-rust/10 font-medium text-nene-rust'
                  : 'text-nene-ink hover:bg-nene-mist/50'
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="mx-4 my-2 border-t border-nene-mist" />

          <Link
            href="/sorular/sor"
            onClick={close}
            className="mx-4 mb-2 rounded-md bg-nene-rust px-4 py-3 text-center text-sm font-medium text-nene-cream no-underline hover:bg-nene-rust/90"
          >
            Soru Sor
          </Link>

          {user ? (
            <>
              <Link
                href="/admin"
                onClick={close}
                className="mx-4 rounded-md px-4 py-3 text-sm text-nene-ink/70 no-underline hover:bg-nene-mist/50"
              >
                {user.name} ({user.role})
              </Link>
              <button
                type="button"
                onClick={() => { close(); handleLogout() }}
                className="mx-4 mb-2 flex items-center gap-2 rounded-md px-4 py-3 text-sm text-nene-rust hover:bg-nene-mist/50"
              >
                <LogOut size={15} />
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link
              href="/admin/login"
              onClick={close}
              className="mx-4 mb-2 flex items-center gap-2 rounded-md px-4 py-3 text-sm text-nene-ink/70 no-underline hover:bg-nene-mist/50"
            >
              <LogIn size={15} />
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
