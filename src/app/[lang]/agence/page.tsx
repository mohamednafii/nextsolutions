import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/content'
import { href, isLocale } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'
import { whatsappHref } from '@/lib/site'
import { Symbol } from '@/components/brand/Logo'
import { PageHeader } from '@/components/sections/PageHeader'
import { FinalCta } from '@/components/sections/FinalCta'
import { CutReveal } from '@/components/sections/CutReveal'
import { ScrollWords } from '@/components/motion/ScrollWords'
import { Reveal } from '@/components/motion/Reveal'

export async function generateMetadata({ params }: PageProps<'/[lang]/agence'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const a = getDictionary(lang).agencyPage
  return pageMetadata({ locale: lang, title: a.meta.title, description: a.meta.description, route: 'agency' })
}

export default async function AgencyPage({ params }: PageProps<'/[lang]/agence'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDictionary(lang)
  const a = t.agencyPage

  return (
    <>
      <PageHeader overline={a.overline} title={a.title} />

      {/* Manifesto — words turn from grey to Ink with the scroll */}
      <section className="py-20 md:py-32">
        <div className="shell grid-12">
          <ScrollWords text={a.manifesto} className="t-h1 col-span-4 md:col-span-11" />
        </div>
      </section>

      {/* Founders — the page's notable moment */}
      <section aria-labelledby="founders" className="pb-24 md:pb-36">
        <div className="shell">
          <h2 id="founders" className="t-overline text-blue">{a.foundersTitle}</h2>
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-14 md:mt-12 md:grid-cols-2">
            {a.founders.map((f, i) => (
              <figure key={f.name} className={i === 1 ? 'md:mt-32' : ''}>
                <CutReveal className="relative aspect-[4/5] bg-cloud" delay={i * 0.12}>
                  <Image
                    src={f.image}
                    alt={f.name}
                    fill
                    sizes="(min-width:768px) 45vw, 100vw"
                    className="object-cover object-top"
                    priority={i === 0}
                  />
                </CutReveal>
                <figcaption className="mt-5 flex items-baseline justify-between border-t border-ink pt-5">
                  <span className="t-h3">{f.name}</span>
                  <span className="text-slate">{f.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* The symbol, explained */}
      <section className="on-ink bg-ink text-white">
        <div className="shell grid-12 items-center gap-y-12 py-24 md:py-36">
          <div className="col-span-4 md:col-span-4">
            <Symbol variant="reversed" className="w-28 md:w-36" title={t.meta.siteName} />
          </div>
          <div className="col-span-4 md:col-span-7 md:col-start-6">
            <h2 className="t-display">{a.symbol.title}</h2>
            <p className="t-lead mt-8 max-w-[48ch] text-ink-mute">{a.symbol.text}</p>
          </div>
        </div>
      </section>

      {/* Positioning */}
      <section className="py-24 md:py-36">
        <Reveal className="shell grid-12 gap-y-14">
          {a.pillars.map((p, i) => (
            <div key={p.title} data-reveal className={`col-span-4 border-t pt-6 md:col-span-4 ${i === 2 ? 'border-blue' : 'border-ink'}`}>
              <h2 className="t-h3">{p.title}</h2>
              <ul className="mt-6 space-y-2.5 text-slate">
                {p.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </div>
          ))}
        </Reveal>
        <div className="shell mt-20 md:mt-28">
          <p className="t-h2 max-w-[28ch]">{a.basedIn}</p>
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
