/**
 * Business facts that must be real. Everything here comes from environment
 * variables so nothing is invented in code: when a value is missing, the UI
 * hides the element instead of showing a placeholder.
 */
const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined)

export const site = {
  name: 'nextsolutions agency',
  shortName: 'NextSolutions',
  tagline: 'Turn problems into solutions.',
  city: 'Casablanca',
  country: 'MA',
  url: (clean(process.env.NEXT_PUBLIC_SITE_URL) ?? 'http://localhost:3000').replace(/\/$/, ''),
  /** International format, digits only, e.g. 2126XXXXXXXX */
  whatsapp: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)?.replace(/\D/g, ''),
  email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  phone: clean(process.env.NEXT_PUBLIC_CONTACT_PHONE),
  social: {
    linkedin: clean(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN),
    instagram: clean(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM),
    facebook: clean(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK),
  },
} as const

export function whatsappHref(message?: string): string | undefined {
  if (!site.whatsapp) return undefined
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${site.whatsapp}${text}`
}

export function absoluteUrl(path: string) {
  return `${site.url}${path === '/' ? '' : path}`
}
