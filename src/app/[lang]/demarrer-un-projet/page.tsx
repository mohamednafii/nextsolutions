import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/content'
import { href, isLocale } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'
import { whatsappHref } from '@/lib/site'
import { ProjectForm } from '@/components/form/ProjectForm'

export async function generateMetadata({ params }: PageProps<'/[lang]/demarrer-un-projet'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const s = getDictionary(lang).startPage
  return pageMetadata({ locale: lang, title: s.meta.title, description: s.meta.description, route: 'start' })
}

/** Fast, distraction-free: no hero animation, no imagery. */
export default async function StartPage({ params }: PageProps<'/[lang]/demarrer-un-projet'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = getDictionary(lang)
  const s = t.startPage
  const wa = whatsappHref()

  return (
    <section className="pb-24 pt-[calc(var(--header-h)+56px)] md:pb-36 md:pt-[calc(var(--header-h)+88px)]">
      <div className="shell grid-12 gap-y-14">
        <div className="col-span-4 md:col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+40px)]">
            <h1 className="t-h1">{s.title}</h1>
            <p className="t-lead mt-6 max-w-[40ch] text-slate">{s.lead}</p>

            <h2 className="t-overline mt-12 text-blue">{s.nextTitle}</h2>
            <ol className="mt-5 border-t border-ink">
              {s.nextSteps.map((step, i) => (
                <li key={step} className="flex gap-5 border-b border-line py-4">
                  <span className="font-display text-sm font-bold text-slate">0{i + 1}</span>
                  <span className="text-[0.9375rem]">{step}</span>
                </li>
              ))}
            </ol>

            {wa && (
              <p className="mt-10 text-[0.9375rem] text-slate">
                {s.preferWhatsapp}{' '}
                <a href={wa} target="_blank" rel="noopener noreferrer" className="link-draw pb-0.5 font-display font-bold text-ink">
                  WhatsApp
                </a>
              </p>
            )}
          </div>
        </div>
        <div className="col-span-4 md:col-span-12 lg:col-span-7 lg:col-start-6">
          <ProjectForm f={t.form} locale={lang} privacyHref={href('privacy', lang)} whatsappHref={wa} />
        </div>
      </div>
    </section>
  )
}
