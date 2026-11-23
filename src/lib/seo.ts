import type { Metadata } from 'next'
import { href, internalToPublic, type Locale, type RouteKey } from './i18n'
import { absoluteUrl, site } from './site'
import { getDictionary } from '@/content'

type PageMetaInput = {
  locale: Locale
  title: string
  description: string
  /** Either a route key or an internal (French) path such as /realisations/x */
  route?: RouteKey
  internalPath?: string
  absoluteTitle?: boolean
  noindex?: boolean
}

export function pageMetadata({ locale, title, description, route, internalPath, absoluteTitle, noindex }: PageMetaInput): Metadata {
  const paths: Record<Locale, string> = route
    ? { fr: href(route, 'fr'), en: href(route, 'en') }
    : { fr: internalPath ?? '/', en: internalToPublic(internalPath ?? '/', 'en') }
  const t = getDictionary(locale)
  const fullTitle = absoluteTitle ? `${title} · ${t.meta.siteName}` : title
  return {
    title: absoluteTitle ? { absolute: fullTitle } : title,
    description,
    alternates: {
      canonical: absoluteUrl(paths[locale]),
      languages: {
        fr: absoluteUrl(paths.fr),
        en: absoluteUrl(paths.en),
        'x-default': absoluteUrl(paths.fr),
      },
    },
    openGraph: {
      type: 'website',
      siteName: t.meta.siteName,
      title: fullTitle,
      description,
      url: absoluteUrl(paths[locale]),
      locale: locale === 'fr' ? 'fr_MA' : 'en_US',
      alternateLocale: locale === 'fr' ? ['en_US'] : ['fr_MA'],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description },
    robots: noindex ? { index: false, follow: true } : undefined,
  }
}

/** Organization + ProfessionalService JSON-LD built only from verified facts. */
export function organizationJsonLd(locale: Locale) {
  const t = getDictionary(locale)
  const sameAs = Object.values(site.social).filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${site.url}/#organization`,
    name: site.name,
    url: absoluteUrl(href('home', locale)),
    logo: `${site.url}/brand/nextsolutions-horizontal-color.svg`,
    image: `${site.url}/android-chrome-512.png`,
    slogan: site.tagline,
    description: t.meta.homeDescription,
    address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: site.country },
    areaServed: ['MA', 'Worldwide'],
    knowsLanguage: ['fr', 'en'],
    ...(site.email ? { email: site.email } : {}),
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }
}

export function serviceJsonLd(locale: Locale, name: string, description: string, path: string, offerPrice?: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(path),
    provider: { '@id': `${site.url}/#organization` },
    areaServed: ['MA', 'Worldwide'],
    inLanguage: locale,
    ...(offerPrice
      ? {
          offers: {
            '@type': 'Offer',
            priceSpecification: { '@type': 'PriceSpecification', minPrice: offerPrice, priceCurrency: 'MAD' },
          },
        }
      : {}),
  }
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  }
}
