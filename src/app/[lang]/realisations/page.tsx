import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, serviceKeys } from '@/content'
import { getProjects } from '@/content/projects'
import { href, isLocale, projectHref } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'
import { whatsappHref } from '@/lib/site'
import { PageHeader } from '@/components/sections/PageHeader'
import { FinalCta } from '@/components/sections/FinalCta'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/Button'
import { WorkGrid } from '@/components/work/WorkGrid'
import { ProjectCover } from '@/components/work/ProjectCover'

export async function generateMetadata({ params }: PageProps<'/[lang]/realisations'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = getDictionary(lang)
  return pageMetadata({ locale: lang, title: t.work.meta.title, description: t.work.meta.description, route: 'work' })
}

export default async function WorkPage({ params }: PageProps<'/[lang]/realisations'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDictionary(lang)
  const projects = getProjects()
  const usedServices = serviceKeys.filter((k) => projects.some((p) => p.services.includes(k)))

  return (
    <>
      <PageHeader overline={t.nav.work} title={t.work.title} lead={t.work.lead} />

      <section className="py-20 md:py-28">
        <div className="shell">
          {projects.length > 0 ? (
            <WorkGrid
              allLabel={t.work.filterAll}
              filterLabel={t.work.filterLabel}
              viewLabel={t.common.view}
              filters={usedServices.map((k) => ({ value: k, label: t.services[k].name }))}
              items={projects.map((p) => ({
                slug: p.slug,
                href: projectHref(p.slug, lang),
                title: p.title[lang],
                category: p.category[lang],
                meta: `${p.studio ? t.home.selected.studio : p.sector[lang]} · ${p.year}`,
                services: p.services,
                cover: <ProjectCover project={p} locale={lang} sizes="(min-width:768px) 50vw, 100vw" />,
              }))}
            />
          ) : (
            <div className="grid-12 gap-y-12 border-t border-ink pt-10 md:pt-14">
              <div className="col-span-4 md:col-span-5">
                <h2 className="t-h2 max-w-[18ch]">{t.work.empty.title}</h2>
                <p className="mt-6 max-w-[46ch] text-slate">{t.work.empty.text}</p>
                <div className="mt-10">
                  <Button href={href('start', lang)}>{t.work.empty.cta}</Button>
                </div>
              </div>
              <Reveal as="ol" className="col-span-4 md:col-span-6 md:col-start-7">
                {t.work.empty.items.map((it, i) => (
                  <li key={it.title} data-reveal className="flex gap-8 border-b border-line py-8 first:pt-0">
                    <span data-n={`0${i + 1}`} className="t-num text-5xl text-line before:content-[attr(data-n)] md:text-6xl" aria-hidden="true" />
                    <div>
                      <h3 className="t-h3">{it.title}</h3>
                      <p className="mt-2 text-slate">{it.text}</p>
                    </div>
                  </li>
                ))}
              </Reveal>
            </div>
          )}
        </div>
      </section>

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
