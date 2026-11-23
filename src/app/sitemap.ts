import type { MetadataRoute } from 'next'
import { href, routes, type RouteKey } from '@/lib/i18n'
import { absoluteUrl } from '@/lib/site'

/** One-page site for now: the homepage, the project form and the two legal pages (the rest is redirected). */
const PUBLISHED: RouteKey[] = ['home', 'start', 'legal', 'privacy']

export default function sitemap(): MetadataRoute.Sitemap {
  const keys = (Object.keys(routes) as RouteKey[]).filter((k) => PUBLISHED.includes(k))
  const pages = keys.map((key) => ({
    url: absoluteUrl(href(key, 'fr')),
    changeFrequency: 'monthly' as const,
    priority: key === 'home' ? 1 : key === 'legal' || key === 'privacy' ? 0.2 : 0.8,
    alternates: { languages: { fr: absoluteUrl(href(key, 'fr')), en: absoluteUrl(href(key, 'en')) } },
  }))
  return pages
}
