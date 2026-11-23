import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/content'
import { href, isLocale } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'
import { Hero } from '@/components/home/Hero'
import { TrustBar } from '@/components/home/TrustBar'
import { Vision } from '@/components/home/Vision'
import { Expertises } from '@/components/home/Expertises'
import { Realisations } from '@/components/home/Realisations'
import { Approche } from '@/components/home/Approche'
import { Agence } from '@/components/home/Agence'
import { Finale } from '@/components/home/Finale'

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDictionary(lang)
  return pageMetadata({ locale: lang, title: t.meta.homeTitle, description: t.meta.homeDescription, route: 'home', absoluteTitle: true })
}

/**
 * Homepage — one story in chapters:
 * 01 the film (Hero) → 02 the statement (Vision) → 03 what we do, one
 * expertise at a time (Expertises) → 04 the proof (work)
 * → 05 how we create value (approche: site, SEO, automation, product)
 * → 06 who builds it (the two co-founders) → 07 the final statement, from
 * us to you (the lights go down; the footer continues on the same Ink).
 * ExpertiseShowcase, SolutionsList and WhyStatement are kept in the codebase
 * but no longer on the homepage (client decision, 2026-11-22). Light surfaces between the two Ink bookends.
 */
export default async function Home({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDictionary(lang)
  const startHref = href('start', lang)
  // One-page site: « Voir nos réalisations » scrolls to the section.
  const workHref = `${href('home', lang)}#realisations`

  return (
    <>
      <Hero t={t} startHref={startHref} />
      {/* « Ils nous font confiance »: closes the first screen, confirmed client logos only */}
      <TrustBar label={t.home.clients.label} />
      {/* The statement (left) and what it means for a business (right): more clients, sales, profitability */}
      <Vision v={t.home.vision} workHref={workHref} />
      {/* « Nos expertises »: sites web, IA & automatisation, SaaS — three slides, one frame */}
      <Expertises x={t.home.expertises} />
      {/* « Nos réalisations »: the featured project as a product shot, then the other work */}
      <Realisations r={t.home.realisations} locale={lang} />
      {/* « Notre approche »: four chapters, each one shown rather than described */}
      <Approche a={t.home.approche} locale={lang} />
      {/* « L’agence »: the two co-founders, portraits first */}
      <Agence g={t.home.agence} />
      {/* « On a parlé de nous. Parlons de vous. »: the final statement; the footer continues on the same Ink */}
      <Finale f={t.home.finale} startHref={startHref} />
    </>
  )
}
