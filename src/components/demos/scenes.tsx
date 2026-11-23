import type { ReactNode } from 'react'
import type { Locale } from '@/lib/i18n'

/**
 * Flat interface scenes (no shadows, no gradients, straight corners) that
 * demonstrate what a service does. They are illustrations of a typical flow,
 * never presented as client data.
 */

type SceneProps = { locale: Locale; className?: string }

const L = (locale: Locale, fr: string, en: string) => (locale === 'fr' ? fr : en)

export function Frame({ label, children, className = '', dark }: { label: string; children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <div className={`flex h-full w-full flex-col overflow-hidden border ${dark ? 'border-ink-line bg-ink-soft' : 'border-line bg-white'} ${className}`}>
      <div className={`flex h-7 shrink-0 items-center gap-3 border-b px-3 ${dark ? 'border-ink-line' : 'border-line'}`}>
        <span className="flex gap-1" aria-hidden="true">
          <i className={`block h-1.5 w-1.5 ${dark ? 'bg-ink-line' : 'bg-line'}`} />
          <i className={`block h-1.5 w-1.5 ${dark ? 'bg-ink-line' : 'bg-line'}`} />
          <i className={`block h-1.5 w-1.5 ${dark ? 'bg-ink-line' : 'bg-line'}`} />
        </span>
        <span className={`truncate text-[10px] font-medium ${dark ? 'text-ink-mute' : 'text-slate'}`}>{label}</span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  )
}

/* ── Orders: messy chat → confirmed orders ─────────────────── */

export function ChatMessy({ locale, className }: SceneProps) {
  const msgs = [
    [L(locale, 'Bonjour, c’est dispo ?', 'Hi, is it available?'), '09:12'],
    [L(locale, 'Prix svp', 'Price please'), '09:40'],
    [L(locale, 'Livraison à Rabat ?', 'Delivery to Rabat?'), '10:05'],
    [L(locale, 'J’ai commandé hier, rien reçu', 'Ordered yesterday, nothing yet'), '11:31'],
    [L(locale, 'Allo ?', 'Hello?'), '12:02'],
    [L(locale, 'Je prends la taille M', 'I’ll take size M'), '13:47'],
    [L(locale, 'Toujours pas de réponse…', 'Still no answer…'), '15:20'],
  ]
  return (
    <Frame label={L(locale, 'Messages · 14 non lus', 'Messages · 14 unread')} className={className}>
      <div className="flex h-full flex-col gap-1.5 overflow-hidden bg-cloud p-3">
        {msgs.map(([m, time], i) => (
          <div key={i} className={`flex max-w-[82%] items-end gap-2 border border-line bg-white px-2.5 py-1.5 ${i % 3 === 2 ? 'ml-4' : ''}`}>
            <span className="text-[11px] leading-snug text-ink">{m}</span>
            <span className="shrink-0 text-[9px] text-slate">{time}</span>
          </div>
        ))}
        <div className="mt-auto flex items-center justify-between border-t border-line pt-2 text-[10px] text-slate">
          <span>{L(locale, 'Aucune réponse envoyée', 'No reply sent')}</span>
          <span className="bg-ink px-1.5 py-0.5 font-semibold text-white">14</span>
        </div>
      </div>
    </Frame>
  )
}

export function OrdersConfirmed({ locale, className }: SceneProps) {
  const rows = ['#1043', '#1042', '#1041', '#1040', '#1039', '#1038']
  return (
    <Frame label={L(locale, 'Commandes · confirmation automatique', 'Orders · automatic confirmation')} className={className}>
      <div className="flex h-full flex-col p-3">
        <div className="mb-2 grid grid-cols-[1fr_auto] text-[9px] font-semibold uppercase tracking-[0.12em] text-slate">
          <span>{L(locale, 'Commande', 'Order')}</span>
          <span>{L(locale, 'Statut', 'Status')}</span>
        </div>
        <ul className="flex-1 divide-y divide-line border-y border-line">
          {rows.map((r, i) => (
            <li key={r} className="grid grid-cols-[1fr_auto] items-center py-2">
              <span className="text-[11px] text-ink">
                <b className="font-semibold">{r}</b>
                <span className="text-slate"> · {L(locale, 'WhatsApp envoyé', 'WhatsApp sent')}</span>
              </span>
              <span className={`px-1.5 py-0.5 text-[10px] font-semibold ${i === 0 ? 'bg-blue text-white' : 'bg-cloud text-ink'}`}>
                {L(locale, 'Confirmée ✓', 'Confirmed ✓')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  )
}

/* ── Process: crossed-out spreadsheet → dashboard ──────────── */

export function SheetMessy({ locale, className }: SceneProps) {
  const cols = ['A', 'B', 'C', 'D']
  const data = [
    [L(locale, 'Client', 'Client'), L(locale, 'Montant', 'Amount'), L(locale, 'Statut', 'Status'), L(locale, 'Relance', 'Follow-up')],
    ['K. B.', '450', '??', L(locale, 'oui ?', 'yes?')],
    ['S. A.', '1 200', L(locale, 'payé', 'paid'), ''],
    ['—', '#REF!', '', L(locale, 'à voir', 'check')],
    ['Y. M.', '780', L(locale, 'livré?', 'deliv?'), ''],
    ['K. B.', '450', L(locale, 'doublon', 'dupe'), ''],
    ['', '', '', ''],
  ]
  return (
    <Frame label={L(locale, 'commandes_FINAL_v3 (2).xlsx', 'orders_FINAL_v3 (2).xlsx')} className={className}>
      <div className="h-full overflow-hidden bg-white">
        <div className="grid grid-cols-[18px_repeat(4,1fr)] border-b border-line bg-cloud text-[9px] text-slate">
          <span />
          {cols.map((c) => (
            <span key={c} className="border-l border-line px-1.5 py-0.5">{c}</span>
          ))}
        </div>
        {data.map((row, r) => (
          <div key={r} className="grid grid-cols-[18px_repeat(4,1fr)] border-b border-line text-[10px]">
            <span className="bg-cloud px-1 py-1.5 text-[9px] text-slate">{r + 1}</span>
            {row.map((cell, c) => (
              <span
                key={c}
                className={`truncate border-l border-line px-1.5 py-1.5 ${r === 0 ? 'font-semibold' : ''} ${
                  (r === 5 && c < 2) || (r === 3 && c === 1) ? 'text-slate line-through' : 'text-ink'
                } ${r === 3 ? 'bg-line/60' : ''}`}
              >
                {cell}
              </span>
            ))}
          </div>
        ))}
        <p className="px-2 pt-2 text-[10px] text-slate">{L(locale, '3 versions du fichier circulent', '3 versions of this file in circulation')}</p>
      </div>
    </Frame>
  )
}

export function Dashboard({ locale, className, animate }: SceneProps & { animate?: boolean }) {
  const bars = [32, 44, 40, 56, 62, 74, 88]
  return (
    <Frame label={L(locale, 'Tableau de bord · à jour', 'Dashboard · up to date')} className={className}>
      <div className="flex h-full flex-col gap-3 p-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            [L(locale, 'Commandes', 'Orders'), '128'],
            [L(locale, 'Confirmées', 'Confirmed'), '121'],
            [L(locale, 'À relancer', 'To follow up'), '7'],
          ].map(([k, v], i) => (
            <div key={k} className={`border px-2 py-1.5 ${i === 1 ? 'border-blue' : 'border-line'}`}>
              <p className="text-[9px] text-slate">{k}</p>
              <p className="font-display text-base font-extrabold tracking-[-0.03em] text-ink">{v}</p>
            </div>
          ))}
        </div>
        <div className="flex min-h-0 flex-1 items-end gap-1.5 border-b border-line">
          {bars.map((h, i) => (
            <span
              key={i}
              data-anim={animate ? '' : undefined}
              className={`block flex-1 origin-bottom ${i === bars.length - 1 ? 'bg-blue' : i > 3 ? 'bg-ink' : 'bg-mist'} ${animate ? 'animate-[bar-rise_5s_var(--ease-ascent)_infinite]' : ''}`}
              style={{ height: `${h}%`, animationDelay: animate ? `${i * 80}ms` : undefined }}
            />
          ))}
        </div>
      </div>
    </Frame>
  )
}

/* ── Store: sleeping page → store that sells ───────────────── */

export function PageAsleep({ locale, className }: SceneProps) {
  return (
    <Frame label={L(locale, "www.votre-entreprise.ma", "www.your-business.com")} className={className}>
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-white p-4 text-center">
        <span className="h-6 w-20 bg-line" />
        <p className="font-display text-sm font-semibold text-slate">{L(locale, 'Bienvenue sur notre site', 'Welcome to our website')}</p>
        <p className="text-[10px] text-slate">{L(locale, 'Site en construction · dernière mise à jour 2019', 'Under construction · last updated 2019')}</p>
        <div className="mt-2 grid w-full max-w-[200px] grid-cols-3 gap-1.5">
          <span className="aspect-square bg-cloud" />
          <span className="aspect-square bg-cloud" />
          <span className="aspect-square bg-cloud" />
        </div>
        <p className="text-[10px] text-slate underline">{L(locale, 'Contactez-nous', 'Contact us')}</p>
      </div>
    </Frame>
  )
}

export function Storefront({ locale, className }: SceneProps) {
  const items = [
    [L(locale, 'Cabas cuir', 'Leather tote'), '690 DH'],
    [L(locale, 'Pochette', 'Pouch'), '290 DH'],
    [L(locale, 'Sac bandoulière', 'Crossbody'), '540 DH'],
  ]
  return (
    <Frame label={L(locale, 'votre-boutique.ma', 'your-store.ma')} className={className}>
      <div className="flex h-full flex-col bg-white">
        <div className="flex items-center justify-between border-b border-line px-3 py-2">
          <span className="font-display text-[11px] font-extrabold tracking-[-0.02em]">Atelier</span>
          <span className="flex gap-3 text-[9px] text-slate">
            <span>{L(locale, 'Boutique', 'Shop')}</span>
            <span>{L(locale, 'Panier (1)', 'Cart (1)')}</span>
          </span>
        </div>
        <div className="flex items-end justify-between gap-3 bg-cloud px-3 py-3">
          <p className="font-display text-sm font-extrabold leading-tight tracking-[-0.02em] text-ink">
            {L(locale, 'Fait main, livré demain.', 'Handmade, delivered tomorrow.')}
          </p>
          <span className="shrink-0 bg-ink px-2 py-1 text-[9px] font-semibold text-white">{L(locale, 'Commander', 'Order')}</span>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-2 p-3">
          {items.map(([n, p], i) => (
            <div key={n} className="flex flex-col">
              <span className={`block flex-1 ${i === 0 ? 'bg-ink' : 'bg-cloud'}`} />
              <span className="mt-1.5 truncate text-[10px] font-semibold text-ink">{n}</span>
              <span className="text-[10px] text-slate">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  )
}

/* ── Campaign: random posts → measured campaign ────────────── */

export function CampaignBefore({ locale, className }: SceneProps) {
  return (
    <Frame label={L(locale, 'Publications · sans suivi', 'Posts · no tracking')} className={className}>
      <div className="grid h-full grid-cols-3 gap-1.5 bg-cloud p-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={`flex items-end p-1 ${['bg-line', 'bg-mist', 'bg-white'][i % 3]}`}>
            <span className="text-[8px] text-slate">{['Promo !!', '-20%', 'Nouveau', '?', 'Bonjour', 'Offre', '…', 'Promo', 'Story'][i]}</span>
          </div>
        ))}
        <p className="col-span-3 text-[10px] text-slate">{L(locale, 'Résultats : inconnus', 'Results: unknown')}</p>
      </div>
    </Frame>
  )
}

export function CampaignAfter({ locale, className, animate }: SceneProps & { animate?: boolean }) {
  return (
    <Frame label={L(locale, 'Campagne · suivi des conversions', 'Campaign · conversion tracking')} className={className}>
      <div className="flex h-full flex-col gap-3 p-3">
        <div className="flex gap-3 border border-line p-2">
          <span className="aspect-square w-12 shrink-0 bg-ink" />
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-blue">{L(locale, 'Objectif : contacts', 'Goal: leads')}</p>
            <p className="font-display text-[12px] font-bold leading-tight text-ink">{L(locale, 'Audience ciblée · Casablanca', 'Targeted audience · Casablanca')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            [L(locale, 'Contacts qualifiés', 'Qualified leads'), 'up'],
            [L(locale, 'Coût par contact', 'Cost per lead'), 'down'],
          ].map(([k, dir]) => (
            <div key={k} className="border border-line p-2">
              <p className="text-[9px] text-slate">{k}</p>
              <div className="mt-2 flex h-8 items-end gap-1">
                {[3, 4, 5, 6, 7].map((h, i) => (
                  <span
                    key={i}
                    data-anim={animate ? '' : undefined}
                    className={`block flex-1 origin-bottom ${i === 4 ? 'bg-blue' : 'bg-mist'} ${animate ? 'animate-[bar-rise_5s_var(--ease-ascent)_infinite]' : ''}`}
                    style={{ height: `${(dir === 'up' ? h : 10 - h) * 10}%`, animationDelay: animate ? `${i * 80}ms` : undefined }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-auto text-[10px] text-slate">{L(locale, 'Pixel actif · événements mesurés', 'Pixel active · events measured')}</p>
      </div>
    </Frame>
  )
}

export type VisualKey = 'orders' | 'process' | 'store' | 'campaign'

export function BeforeScene({ visual, locale, className }: SceneProps & { visual: VisualKey | string }) {
  switch (visual) {
    case 'orders': return <ChatMessy locale={locale} className={className} />
    case 'process': return <SheetMessy locale={locale} className={className} />
    case 'campaign': return <CampaignBefore locale={locale} className={className} />
    default: return <PageAsleep locale={locale} className={className} />
  }
}

export function AfterScene({ visual, locale, className }: SceneProps & { visual: VisualKey | string }) {
  switch (visual) {
    case 'orders': return <OrdersConfirmed locale={locale} className={className} />
    case 'process': return <Dashboard locale={locale} className={className} />
    case 'campaign': return <CampaignAfter locale={locale} className={className} />
    default: return <Storefront locale={locale} className={className} />
  }
}
