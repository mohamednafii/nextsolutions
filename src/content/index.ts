import type { Locale, RouteKey } from '@/lib/i18n'
import { fr, type Dictionary } from './fr'
import { en } from './en'

const dictionaries: Record<Locale, Dictionary> = { fr, en }

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale]
export type { Dictionary }

export const serviceKeys = ['ecommerce', 'automation', 'marketing', 'transformation'] as const
export type ServiceKey = (typeof serviceKeys)[number]

/** Internal (French) slug used on disk for each service route. */
export const serviceSlugs: Record<ServiceKey, string> = {
  ecommerce: 'creation-site-web-ecommerce',
  automation: 'ia-automatisation-whatsapp',
  marketing: 'marketing-digital',
  transformation: 'transformation-digitale',
}

export const serviceFromSlug = (slug: string): ServiceKey | undefined =>
  serviceKeys.find((k) => serviceSlugs[k] === slug)

export const serviceRoute: Record<ServiceKey, RouteKey> = {
  ecommerce: 'ecommerce',
  automation: 'automation',
  marketing: 'marketing',
  transformation: 'transformation',
}
