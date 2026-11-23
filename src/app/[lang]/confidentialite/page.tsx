import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/content'
import { isLocale } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'
import { LegalBody } from '@/components/sections/LegalBody'

export async function generateMetadata({ params }: PageProps<'/[lang]/confidentialite'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const p = getDictionary(lang).privacyPage
  return pageMetadata({ locale: lang, title: p.meta.title, description: p.meta.description, route: 'privacy' })
}

export default async function PrivacyPage({ params }: PageProps<'/[lang]/confidentialite'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const p = getDictionary(lang).privacyPage
  return <LegalBody title={p.title} sections={p.sections} />
}
