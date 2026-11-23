import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, serviceFromSlug, serviceKeys, serviceRoute, serviceSlugs } from '@/content'
import { href, isLocale, locales } from '@/lib/i18n'
import { faqJsonLd, pageMetadata, serviceJsonLd } from '@/lib/seo'
import { whatsappHref } from '@/lib/site'
import { JsonLd } from '@/components/JsonLd'
import { Arrow } from '@/components/brand/Logo'
import { Button, ArrowLink, Overline } from '@/components/ui/Button'
import { PageHeader } from '@/components/sections/PageHeader'
import { BeforeAfter } from '@/components/sections/BeforeAfter'
import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'
import { Reveal } from '@/components/motion/Reveal'
import { DemoPlayer } from '@/components/demos/DemoPlayer'
import { ServiceDemo } from '@/components/demos/ServiceDemos'
import { AfterScene, BeforeScene } from '@/components/demos/scenes'

export const dynamicParams = false
export function generateStaticParams() {
  return locales.flatMap((lang) => serviceKeys.map((k) => ({ lang, service: serviceSlugs[k] })))
}

export async function generateMetadata({ params }: PageProps<'/[lang]/services/[service]'>): Promise<Metadata> {
  const { lang, service } = await params
  const key = serviceFromSlug(service)
  if (!isLocale(lang) || !key) return {}
  const s = getDictionary(lang).services[key]
  return pageMetadata({ locale: lang, title: s.meta.title, description: s.meta.description, route: serviceRoute[key] })
}

export default async function ServicePage({ params }: PageProps<'/[lang]/services/[service]'>) {
  const { lang, service } = await params
  const key = serviceFromSlug(service)
  if (!isLocale(lang) || !key) notFound()
  const t = getDictionary(lang)
  const s = t.services[key]
  const wa = whatsappHref()
  const others = serviceKeys.filter((k) => k !== key)
  const path = href(serviceRoute[key], lang)

  return (
    <>
      <JsonLd data={serviceJsonLd(lang, s.name, s.meta.description, path, s.price ? 1499 : undefined)} />
      <JsonLd data={faqJsonLd(s.faq)} />

      {/* Hero — the page's one notable moment: the service demo, live */}
      <PageHeader
        overline={<>{t.servicePage.overline} · {s.index}</>}
        title={s.hero.title}
        lead={s.hero.lead}
        aside={
          <DemoPlayer className="frame bg-cloud p-5 md:p-10">
            <div className="aspect-[4/3] w-full">
              <ServiceDemo service={key} locale={lang} />
            </div>
            <p className="mt-4 text-[0.75rem] text-slate">{t.common.demo}</p>
          </DemoPlayer>
        }
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
          <Button href={href('start', lang)}>{t.common.startProject}</Button>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="link-draw pb-0.5 font-display font-bold">
              {t.common.whatsapp}
            </a>
          )}
        </div>
      </PageHeader>

      {/* Problems */}
      <section aria-labelledby="problems" className="py-24 md:py-36">
        <div className="shell">
          <h2 id="problems" className="t-h1 max-w-[18ch]">{s.problems.title}</h2>
          <Reveal className="grid-12 mt-12 gap-y-12 md:mt-20">
            {s.problems.items.map((p, i) => (
              <div key={p.title} data-reveal className="col-span-4 border-t border-ink pt-6 md:col-span-4">
                <p className="t-overline text-slate">0{i + 1}</p>
                <h3 className="t-h3 mt-6">{p.title}</h3>
                <p className="mt-3 text-slate">{p.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Before / after */}
      <section aria-labelledby="before-after" className="pb-24 md:pb-36">
        <div className="shell">
          <div className="grid-12 items-end gap-y-6">
            <h2 id="before-after" className="t-h1 col-span-4 md:col-span-8">{s.beforeAfter.title}</h2>
          </div>
          <div className="mt-10 md:mt-14">
            <BeforeAfter
              before={<BeforeScene visual={s.beforeAfter.visual} locale={lang} />}
              after={<AfterScene visual={s.beforeAfter.visual} locale={lang} />}
              beforeLabel={t.home.manifesto.before}
              afterLabel={t.home.manifesto.after}
              hint={s.beforeAfter.hint}
            />
          </div>
        </div>
      </section>

      {/* Included */}
      <section aria-labelledby="included" className="bg-cloud py-24 md:py-36">
        <div className="shell grid-12 gap-y-12">
          <h2 id="included" className="t-h1 col-span-4 md:col-span-4">{s.included.title}</h2>
          <Reveal className="col-span-4 grid grid-cols-1 border-t border-ink sm:grid-cols-2 md:col-span-8">
            {s.included.items.map((it) => (
              <div key={it.title} data-reveal className="border-b border-line py-7 sm:pr-10">
                <h3 className="font-display text-lg font-bold tracking-[-0.01em]">{it.title}</h3>
                <p className="mt-2 text-slate">{it.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Price */}
      <section aria-label={t.nav.method} className="py-24 md:py-32">
        <div className="shell grid-12 items-end gap-y-8 border-b border-line pb-16">
          <div className="col-span-4 md:col-span-7">
            {s.price ? (
              <>
                <Overline>{s.price.label}</Overline>
                <p className="mt-5 font-display font-extrabold tracking-[-0.04em]">
                  <span className="text-2xl text-slate md:text-3xl">{s.price.prefix} </span>
                  <span className="text-[clamp(3.5rem,2rem+5vw,6.5rem)] leading-none">{s.price.value}</span>
                </p>
                <p className="mt-5 max-w-[48ch] text-slate">{s.price.note}</p>
              </>
            ) : (
              <>
                <Overline>{t.common.onQuote}</Overline>
                <p className="t-h1 mt-5 max-w-[16ch]">{t.servicePage.priceOnQuote}</p>
                <p className="mt-5 max-w-[48ch] text-slate">{t.servicePage.priceOnQuoteNote}</p>
              </>
            )}
          </div>
          <div className="col-span-4 md:col-span-5 md:justify-self-end">
            <ArrowLink href={href('method', lang)}>{t.servicePage.pricingLink}</ArrowLink>
          </div>
        </div>
      </section>

      <Faq title={t.common.faq} items={s.faq} />

      {/* Other services */}
      <section aria-labelledby="others" className="pb-24 md:pb-36">
        <div className="shell">
          <h2 id="others" className="t-overline text-blue">{t.servicePage.otherServices}</h2>
          <ul className="mt-6 border-t border-ink">
            {others.map((k) => (
              <li key={k} className="border-b border-line">
                <Link href={href(serviceRoute[k], lang)} className="group flex items-center justify-between gap-6 py-7 md:py-9">
                  <span className="flex items-baseline gap-5 md:gap-10">
                    <span className="t-overline text-slate">{t.services[k].index}</span>
                    <span className="t-h2 transition-colors duration-[180ms] group-hover:text-blue">{t.services[k].name}</span>
                  </span>
                  <span className="hidden max-w-[28ch] text-right text-slate md:block">{t.services[k].short}</span>
                  <Arrow className="arrow-nudge h-4 w-4 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta
        title={t.servicePage.ctaTitle}
        button={t.common.startProject}
        startHref={href('start', lang)}
        whatsappLabel={t.home.cta.whatsapp}
        whatsappHref={wa}
      />
    </>
  )
}
