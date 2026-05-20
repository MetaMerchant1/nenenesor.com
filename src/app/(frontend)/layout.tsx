import './globals.css'

import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import Script from 'next/script'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/utils'

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['opsz'],
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Anne ve bebek için nene'nin sezgisini, uzmanın bilgisiyle harmanlayan Türkçe içerik platformu.",
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: SITE_NAME,
    images: ['/og-default.png'],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        {PLAUSIBLE_DOMAIN ? (
          <Script
            defer
            data-domain={PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
