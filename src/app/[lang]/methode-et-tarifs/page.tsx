import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/content'
import { href, isLocale } from '@/lib/i18n'
import { faqJsonLd, pageMetadata } from '@/lib/seo'
import { whatsappHref } from '@/lib/site'
import { JsonLd } from '@/components/JsonLd'
import { PageHeader } from '@/components/sections/PageHeader'
import { MethodLine } from '@/components/home/MethodLine'
import { PricingTable } from '@/components/sections/PricingTable'
import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'
import { Reveal } from '@/components/motion/Reveal'

export async function generateMetadata({ params }: PageProps<'/[lang]/methode-et-tarifs'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const m = getDictionary(lang).methodPage
  return pageMetadata({ locale: lang, title: m.meta.title, description: m.meta.description, route: 'method' })
}

export default async function MethodPage({ params }: PageProps<'/[lang]/methode-et-tarifs'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDictionary(lang)
  const m = t.methodPage

  return (
    <>
      <JsonLd data={faqJsonLd(m.faq)} />
      <PageHeader overline={t.nav.method} title={m.title} lead={m.lead} />

      {/* Notable moment: the four-step line drawing with the scroll */}
      <section className="py-20 md:py-32">
        <div className="shell">
          <MethodLine steps={m.steps} compact />
        </div>
      </section>

      <section aria-label={m.title} className="pb-24 md:pb-36">
        <Reveal className="shell">
          {m.steps.map((s, i) => (
            <article key={s.name} data-reveal className="grid-12 gap-y-4 border-t border-line py-10 md:py-14">
              <p className="t-overline col-span-4 text-slate md:col-span-2">0{i + 1}</p>
              <h2 className="t-h2 col-span-4 md:col-span-4">{s.name}</h2>
              <div className="col-span-4 md:col-span-6">
                <p className="text-lg">{s.text}</p>
                <p className="mt-5 flex items-center gap-3 text-[0.9375rem] text-slate">
                  <span className="h-0.5 w-8 bg-blue" aria-hidden="true" />
                  <span><span className="font-semibold text-ink">{m.deliverableLabel} :</span> {s.deliverable}</span>
                </p>
              </div>
            </article>
          ))}
        </Reveal>
      </section>

      <section aria-labelledby="pricing" className="bg-cloud py-24 md:py-36">
        <div className="shell">
          <div className="grid-12 gap-y-6">
            <h2 id="pricing" className="t-display col-span-4 md:col-span-6">{m.pricing.title}</h2>
            <p className="t-lead col-span-4 self-end text-slate md:col-span-5 md:col-start-8">{m.pricing.lead}</p>
          </div>
          <div className="mt-12 md:mt-20">
            <PricingTable plans={m.pricing.plans} startHref={href('start', lang)} />
          </div>
        </div>
      </section>

      <Faq title={t.common.faq} items={m.faq} />

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
