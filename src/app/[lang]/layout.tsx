import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { notFound } from 'next/navigation'
import '../globals.css'
import { getDictionary } from '@/content'
import { href, isLocale, locales } from '@/lib/i18n'
import { site, whatsappHref } from '@/lib/site'
import { organizationJsonLd } from '@/lib/seo'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { Intro, introScript } from '@/components/layout/Intro'
import { JsonLd } from '@/components/JsonLd'

const manrope = localFont({
  src: [
    { path: '../../fonts/manrope-latin-500-normal.woff2', weight: '500' },
    { path: '../../fonts/manrope-latin-600-normal.woff2', weight: '600' },
    { path: '../../fonts/manrope-latin-700-normal.woff2', weight: '700' },
    { path: '../../fonts/manrope-latin-800-normal.woff2', weight: '800' },
  ],
  variable: '--font-manrope',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
})

const dmSans = localFont({
  src: [
    { path: '../../fonts/dm-sans-latin-400-normal.woff2', weight: '400' },
    { path: '../../fonts/dm-sans-latin-500-normal.woff2', weight: '500' },
    { path: '../../fonts/dm-sans-latin-600-normal.woff2', weight: '600' },
  ],
  variable: '--font-dm-sans',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
})

export const dynamicParams = false
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDictionary(lang)
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.homeTitle, template: t.meta.titleTemplate },
    description: t.meta.homeDescription,
    applicationName: site.name,
    formatDetection: { telephone: false },
    icons: {
      icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/icon.svg', type: 'image/svg+xml' }],
      apple: '/apple-icon.png',
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDictionary(lang)

  // One-page site for now (2026-11-22): the navigation points at the homepage sections; the service,
  // work, method and agency pages are redirected (next.config.ts). Services dropdown hidden (empty list).
  const home = href('home', lang)
  const services: { href: string; label: string; index: string }[] = []
  const links = [
    { href: `${home}#nos-expertises`, label: t.nav.expertises },
    { href: `${home}#realisations`, label: t.nav.work },
    { href: `${home}#approche`, label: t.nav.approach },
    { href: `${home}#agence`, label: t.nav.agency },
  ]

  return (
    <html lang={lang} className={`${manrope.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <JsonLd data={organizationJsonLd(lang)} />
      </head>
      <body>
        <a
          href="#main"
          className="btn fixed left-4 top-4 z-[200] -translate-y-24 bg-ink px-6 text-white focus:translate-y-0"
        >
          {t.a11y.skip}
        </a>
        <Intro />
        <SmoothScroll>
          <Header
            locale={lang}
            homeHref={href('home', lang)}
            startHref={href('start', lang)}
            links={links}
            services={services}
            whatsappHref={whatsappHref()}
            labels={{
              home: t.a11y.home,
              mainNav: t.a11y.mainNav,
              menuOpen: t.a11y.menuOpen,
              menuClose: t.a11y.menuClose,
              language: t.a11y.language,
              scrollProgress: t.a11y.scrollProgress,
              services: t.nav.services,
              switchTo: t.nav.switchTo,
              switchShort: t.nav.switchShort,
              start: t.nav.start,
              whatsapp: t.common.whatsapp,
            }}
          />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer locale={lang} t={t} />
        </SmoothScroll>
      </body>
    </html>
  )
}
