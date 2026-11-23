/**
 * Locale + route map. French is the primary language and is served without a
 * prefix (/agence). English lives under /en with translated slugs (/en/agency).
 * Files on disk always use the French slugs under app/[lang]/; the proxy maps
 * public URLs onto them.
 */
export const locales = ['fr', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'fr'

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value)

export const routes = {
  home: { fr: '/', en: '/' },
  ecommerce: { fr: '/services/creation-site-web-ecommerce', en: '/services/website-ecommerce-development' },
  automation: { fr: '/services/ia-automatisation-whatsapp', en: '/services/ai-whatsapp-automation' },
  marketing: { fr: '/services/marketing-digital', en: '/services/digital-marketing' },
  transformation: { fr: '/services/transformation-digitale', en: '/services/digital-transformation' },
  work: { fr: '/realisations', en: '/work' },
  method: { fr: '/methode-et-tarifs', en: '/method-and-pricing' },
  agency: { fr: '/agence', en: '/agency' },
  start: { fr: '/demarrer-un-projet', en: '/start-a-project' },
  legal: { fr: '/mentions-legales', en: '/legal-notice' },
  privacy: { fr: '/confidentialite', en: '/privacy' },
} as const satisfies Record<string, Record<Locale, string>>

export type RouteKey = keyof typeof routes

/** Public URL for a route in a locale. */
export function href(key: RouteKey, locale: Locale, suffix = ''): string {
  const path = routes[key][locale] + suffix
  if (locale === defaultLocale) return path
  return path === '/' ? '/en' : `/en${path}`
}

/** Public URL for a project detail page. */
export function projectHref(slug: string, locale: Locale) {
  return href('work', locale, `/${slug}`)
}

/**
 * Translate a public English path (without /en) into the internal French path.
 * Longest prefix wins so /work/x maps through /work.
 */
export function englishToInternal(path: string): string {
  const entries = Object.values(routes)
    .filter((r) => r.en !== '/')
    .sort((a, b) => b.en.length - a.en.length)
  for (const r of entries) {
    if (path === r.en || path.startsWith(r.en + '/')) return r.fr + path.slice(r.en.length)
  }
  return path
}

/** Translate an internal French path into the public path of another locale. */
export function internalToPublic(path: string, locale: Locale): string {
  if (locale === 'fr') return path
  if (path === '/' || path === '') return '/en'
  const entries = Object.values(routes)
    .filter((r) => r.fr !== '/')
    .sort((a, b) => b.fr.length - a.fr.length)
  for (const r of entries) {
    if (path === r.fr || path.startsWith(r.fr + '/')) return '/en' + r.en + path.slice(r.fr.length)
  }
  return '/en' + path
}

/** Given a public pathname, return the equivalent public pathname in `target`. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const isEn = pathname === '/en' || pathname.startsWith('/en/')
  const bare = isEn ? pathname.slice(3) || '/' : pathname
  const internal = isEn ? englishToInternal(bare) : bare
  return internalToPublic(internal, target)
}

/**
 * usePathname() can return the internal rewritten path during prerender
 * (/fr/agence, /en/agence). Convert any form into the public URL.
 */
export function toPublicPath(pathname: string): string {
  if (pathname === '/fr' || pathname.startsWith('/fr/')) return pathname.slice(3) || '/'
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const rest = pathname.slice(3) || '/'
    return englishToInternal(rest) === rest ? internalToPublic(rest, 'en') : pathname
  }
  return pathname
}
