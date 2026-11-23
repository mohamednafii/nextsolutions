import type { ServiceKey } from '@/content'
import type { Locale } from '@/lib/i18n'
import { CampaignAfter, Dashboard, Frame } from './scenes'

/**
 * Service micro-demonstrations (spec scene 5):
 *  1) page blocks assemble into a store  2) a WhatsApp bubble gets "Confirmed ✓"
 *  3) an ad card whose numbers rise      4) dashboard bars rising
 * Pure CSS loops; paused unless a parent DemoPlayer marks them as playing.
 */
const L = (locale: Locale, fr: string, en: string) => (locale === 'fr' ? fr : en)
const loop = 'animate-[assemble_6s_var(--ease-ascent)_infinite_both]'

function SitesDemo({ locale }: { locale: Locale }) {
  const d = (ms: number) => ({ animationDelay: `${ms}ms` })
  return (
    <Frame label={L(locale, 'votre-boutique.ma', 'your-store.ma')}>
      <div className="flex h-full flex-col gap-2 p-3">
        <div data-anim className={`flex items-center justify-between border border-line px-2 py-1.5 ${loop}`} style={d(0)}>
          <span className="h-2 w-12 bg-ink" />
          <span className="flex gap-1.5"><i className="block h-1.5 w-6 bg-line" /><i className="block h-1.5 w-6 bg-line" /><i className="block h-1.5 w-8 bg-blue" /></span>
        </div>
        <div data-anim className={`flex flex-1 items-end justify-between bg-cloud p-3 ${loop}`} style={d(220)}>
          <span className="space-y-1.5">
            <i className="block h-2.5 w-28 bg-ink" />
            <i className="block h-2.5 w-20 bg-ink" />
          </span>
          <span className="bg-ink px-2 py-1 text-[10px] font-semibold text-white">{L(locale, 'Commander', 'Order')}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} data-anim className={loop} style={d(440 + i * 120)}>
              <span className={`block aspect-square ${i === 0 ? 'bg-ink' : 'bg-cloud'}`} />
              <i className="mt-1.5 block h-1.5 w-3/4 bg-line" />
              <i className="mt-1 block h-1.5 w-1/3 bg-mist" />
            </div>
          ))}
        </div>
      </div>
    </Frame>
  )
}

function AutomationDemo({ locale }: { locale: Locale }) {
  return (
    <Frame label={L(locale, 'WhatsApp · commande #1043', 'WhatsApp · order #1043')}>
      <div className="flex h-full flex-col justify-end gap-2 bg-cloud p-3">
        <p data-anim className={`max-w-[78%] border border-line bg-white px-2.5 py-2 text-[11px] leading-snug text-ink ${loop}`}>
          {L(locale, 'Bonjour, je confirme ma commande pour demain.', 'Hello, I confirm my order for tomorrow.')}
        </p>
        <div data-anim className={`ml-auto max-w-[82%] bg-ink px-2.5 py-2 text-[11px] leading-snug text-white ${loop}`} style={{ animationDelay: '500ms' }}>
          {L(locale, 'Merci ! Commande #1043 confirmée, livraison demain.', 'Thank you! Order #1043 confirmed, delivery tomorrow.')}
          <span
            data-anim
            className={`mt-2 flex w-max items-center gap-1 bg-blue px-1.5 py-0.5 text-[10px] font-semibold ${loop}`}
            style={{ animationDelay: '1100ms' }}
          >
            {L(locale, 'Confirmée ✓', 'Confirmed ✓')}
          </span>
        </div>
        <p className="text-right text-[9px] text-slate">{L(locale, 'Envoyé automatiquement', 'Sent automatically')}</p>
      </div>
    </Frame>
  )
}

export function ServiceDemo({ service, locale }: { service: ServiceKey; locale: Locale }) {
  switch (service) {
    case 'ecommerce': return <SitesDemo locale={locale} />
    case 'automation': return <AutomationDemo locale={locale} />
    case 'marketing': return <CampaignAfter locale={locale} animate />
    case 'transformation': return <Dashboard locale={locale} animate />
  }
}
