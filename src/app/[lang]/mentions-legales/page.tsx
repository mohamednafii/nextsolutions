import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/content'
import { isLocale } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'
import { LegalBody } from '@/components/sections/LegalBody'

export async function generateMetadata({ params }: PageProps<'/[lang]/mentions-legales'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const l = getDictionary(lang).legalPage
  return pageMetadata({ locale: lang, title: l.meta.title, description: l.meta.description, route: 'legal' })
}

export default async function LegalPage({ params }: PageProps<'/[lang]/mentions-legales'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const l = getDictionary(lang).legalPage
  // Registered company details come from env so nothing is invented.
  const rows = [
    [l.entity, process.env.NEXT_PUBLIC_LEGAL_ENTITY],
    [l.registration, process.env.NEXT_PUBLIC_LEGAL_REGISTRATION],
    [l.address, process.env.NEXT_PUBLIC_LEGAL_ADDRESS],
    [l.contact, site.email],
  ].filter((r): r is [string, string] => Boolean(r[1]))

  return (
    <LegalBody title={l.title} sections={l.sections}>
      {rows.length > 0 && (
        <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 border-t border-ink pt-8">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="font-display font-semibold">{k}</dt>
              <dd className="text-slate">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </LegalBody>
  )
}
