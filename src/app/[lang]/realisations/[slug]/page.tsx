import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, serviceRoute } from '@/content'
import { getProject, getProjects } from '@/content/projects'
import { href, isLocale, locales, projectHref } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'
import { whatsappHref } from '@/lib/site'
import { Arrow } from '@/components/brand/Logo'
import { ArrowLink } from '@/components/ui/Button'
import { FinalCta } from '@/components/sections/FinalCta'
import { Metrics } from '@/components/sections/Proof'
import { Reveal } from '@/components/motion/Reveal'
import { ProjectCover } from '@/components/work/ProjectCover'

export const dynamicParams = false
export function generateStaticParams() {
  return locales.flatMap((lang) => getProjects().map((p) => ({ lang, slug: p.slug })))
}

export async function generateMetadata({ params }: PageProps<'/[lang]/realisations/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params
  const p = getProject(slug)
  if (!isLocale(lang) || !p) return {}
  return pageMetadata({
    locale: lang,
    title: `${p.title[lang]} · ${p.category[lang]}`,
    description: p.summary[lang],
    internalPath: `/realisations/${p.slug}`,
    noindex: !p.published,
  })
}

export default async function ProjectPage({ params }: PageProps<'/[lang]/realisations/[slug]'>) {
  const { lang, slug } = await params
  const p = getProject(slug)
  if (!isLocale(lang) || !p) notFound()
  const t = getDictionary(lang)
  const d = t.work.detail
  const all = getProjects()
  const next = all[(all.findIndex((x) => x.slug === p.slug) + 1) % all.length]
  const stages = (
    [
      [d.challenge, p.challenge[lang]],
      [d.strategy, p.strategy?.[lang]],
      [d.design, p.design?.[lang]],
      [d.development, p.development?.[lang]],
      [d.solution, p.strategy || p.design || p.development ? undefined : p.solution?.[lang]],
      [d.outcome, p.outcome[lang]],
    ] as const
  ).filter((s): s is readonly [string, string] => Boolean(s[1]))

  return (
    <>
      {/* The capture arrives enlarged from the card (see expandTransition) */}
      <section className="pt-[var(--header-h)]">
        <div className="relative aspect-[16/10] max-h-[72svh] w-full overflow-hidden bg-cloud">
          <ProjectCover project={p} locale={lang} sizes="100vw" priority />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="shell grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-7">
            <p className="t-overline text-blue">
              {t.nav.work}
              {p.studio && <span className="text-slate"> · {t.home.selected.studio}</span>}
            </p>
            <h1 className="t-display mt-6">{p.title[lang]}</h1>
            <p className="t-h2 mt-6 text-blue">{p.result?.[lang] ?? p.category[lang]}</p>
            <p className="t-lead mt-8 max-w-[52ch] text-slate">{p.summary[lang]}</p>
          </div>
          <dl className="col-span-4 grid grid-cols-2 gap-x-6 gap-y-8 self-end border-t border-ink pt-6 md:col-span-8 lg:col-span-4 lg:col-start-9">
            <div><dt className="t-overline text-slate">{d.client}</dt><dd className="mt-2 font-display font-semibold">{p.client}</dd></div>
            <div><dt className="t-overline text-slate">{d.year}</dt><dd className="mt-2 font-display font-semibold">{p.year}</dd></div>
            <div><dt className="t-overline text-slate">{d.sector}</dt><dd className="mt-2 font-display font-semibold">{p.sector[lang]}</dd></div>
            <div>
              <dt className="t-overline text-slate">{d.services}</dt>
              <dd className="mt-2 space-y-1 font-display font-semibold">
                {p.services.map((s) => (
                  <Link key={s} href={href(serviceRoute[s], lang)} className="link-draw block w-fit max-w-full pb-0.5">{t.services[s].name}</Link>
                ))}
              </dd>
            </div>
            {p.url && (
              <div className="col-span-2">
                <ArrowLink href={p.url} external>{d.visit}</ArrowLink>
              </div>
            )}
          </dl>
        </div>
      </section>

      {/* Case study: Challenge → Strategy → Design → Development → Outcome */}
      <section className="pb-20 md:pb-28">
        <Reveal as="ol" className="shell">
          {stages.map(([title, body], i) => (
            <li key={title} data-reveal className="grid-12 gap-y-4 border-t border-line py-8 md:py-10">
              <span className="t-overline col-span-4 text-blue md:col-span-1">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="t-h2 col-span-4 md:col-span-4">{title}</h2>
              <p className="col-span-4 max-w-[60ch] text-[1.0625rem] text-slate md:col-span-6 md:col-start-7">{body}</p>
            </li>
          ))}
        </Reveal>
      </section>

      {p.metrics && p.metrics.length > 0 && (
        <Metrics title={d.outcome} locale={lang} items={p.metrics.map((m) => ({ ...m, label: m.label[lang] }))} />
      )}

      {p.gallery.length > 0 && (
        <section className="pb-24 md:pb-32">
          <Reveal className="shell grid grid-cols-1 gap-6 md:grid-cols-2">
            {p.gallery.map((img, i) => (
              <div key={img.src} data-reveal className={`frame relative overflow-hidden bg-cloud ${i % 3 === 0 && img.width > img.height ? 'md:col-span-2' : ''} ${img.width < img.height ? 'mx-auto w-full max-w-[420px]' : ''}`}>
                <Image src={img.src} alt={img.alt[lang]} width={img.width} height={img.height} sizes="(min-width:768px) 50vw, 100vw" className="h-auto w-full" />
              </div>
            ))}
          </Reveal>
        </section>
      )}

      {next && next.slug !== p.slug && (
        <section className="pb-24">
          <div className="shell">
            <Link href={projectHref(next.slug, lang)} className="group flex items-center justify-between gap-6 border-y border-ink py-10">
              <span>
                <span className="t-overline text-slate">{d.next}</span>
                <span className="t-h1 mt-3 block transition-colors duration-[180ms] group-hover:text-blue">{next.title[lang]}</span>
              </span>
              <Arrow className="arrow-nudge h-6 w-6" />
            </Link>
          </div>
        </section>
      )}

      <FinalCta
        title={t.home.cta.title}
        button={t.common.startProject}
        startHref={href('start', lang)}
        whatsappLabel={t.home.cta.whatsapp}
        whatsappHref={whatsappHref()}
      />
    </>
  )
}
