import Image from 'next/image'
import localFont from 'next/font/local'
import type { Dictionary } from '@/content'

/**
 * The three demonstrations of chapter 03 « Nos expertises ».
 * Real HTML/SVG interfaces (not flattened mockups) so every layer can move on
 * its own and stays sharp at any size. All sizes are container units: each
 * composition scales as one picture. Motion lives in ./motion.ts; the CSS
 * default of every element is its final state (reduced motion = the result).
 */

type X = Dictionary['home']['expertises']

/* The fictional client's own typeface (only this demo site uses it; not preloaded). */
const riadSerif = localFont({
  src: [
    { path: '../../../fonts/cormorant-garamond-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../../fonts/cormorant-garamond-latin-500-italic.woff2', weight: '500', style: 'italic' },
  ],
  variable: '--font-riad',
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'serif'],
})

const Arrow = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10h12M11 5l5 5-5 5" />
  </svg>
)
const Check = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M5.5 10.5l3 3 6-7" />
  </svg>
)

/* ── 01 Sites web — a custom site, not a template ─────────────────────────── */

export function WebVisual({ w }: { w: X['web'] }) {
  return (
    <div className={`xw ${riadSerif.variable}`}>
      <div className="xw-device" data-xw-device>
        <div className="xw-bar">
          <span className="xw-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="xw-url">{w.brand.join(' ')}</span>
        </div>
        <div className="xw-screen">
          <div className="xw-nav">
            <span className="xw-logo">
              {w.brand[0]}
              <br />
              {w.brand[1]}
            </span>
            <span className="xw-links">
              {w.nav.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
            <span className="xw-book">{w.book}</span>
            <span className="xw-burger">
              <i />
              <i />
            </span>
          </div>
          <div className="xw-site" data-xw-site>
            <div className="xw-hero">
              <Image
                src="/images/expertises/riad-courtyard.webp"
                width={860}
                height={552}
                alt=""
                sizes="(min-width: 1024px) 560px, 60vw"
                className="xw-photo"
              />
              <div className="xw-hero-copy" data-xw-hero>
                <p className="xw-kicker">{w.kicker}</p>
                <p className="xw-h1">
                  {w.hero[0]}
                  <br />
                  <em>{w.hero[1]}</em>
                </p>
                <span className="xw-cta">
                  {w.cta}
                  <Arrow />
                </span>
              </div>
            </div>
            <div className="xw-house" data-xw-house>
              <div>
                <p className="xw-kicker">{w.overline}</p>
                <p className="xw-h2">
                  {w.heading[0]}
                  <br />
                  {w.heading[1]}
                </p>
              </div>
              <ul className="xw-list">
                {w.items.map((it) => (
                  <li key={it}>
                    {it}
                    <Arrow />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── 02 IA & automatisation — one real workflow ──────────────────────────── */

/*
 * Node boxes in the coordinates of the two compositions (desktop frame
 * 1088×500, mobile frame 350×440); the connectors below are drawn in the same
 * coordinates, so lines always meet the cards exactly.
 */
const FLOW_DESK = { w: 1088, h: 500 }
const FLOW_MOB = { w: 350, h: 440 }
const FLOW_PATHS = {
  desk: ['M322 274 H430', 'M636 274 C 687 274 687 166 738 166', 'M636 274 C 687 274 687 382 738 382'],
  mob: ['M175 140 V182', 'M175 274 C 175 298 91 298 91 322', 'M175 274 C 175 298 259 298 259 322'],
}
const FLOW_PORTS = {
  desk: [[322, 274], [430, 274], [636, 274], [738, 166], [738, 382]],
  mob: [[175, 140], [175, 182], [175, 274], [91, 322], [259, 322]],
}

function FlowLines({ kind }: { kind: 'desk' | 'mob' }) {
  const box = kind === 'desk' ? FLOW_DESK : FLOW_MOB
  return (
    <svg className={`xf-lines xf-${kind}`} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true">
      {FLOW_PATHS[kind].map((d, i) => (
        <path key={d} d={d} pathLength={1} data-xf-line={i === 0 ? 'in' : 'out'} />
      ))}
      {FLOW_PORTS[kind].map(([cx, cy], i) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={4.5} data-xf-port={i < 2 ? 'in' : 'out'} />
      ))}
    </svg>
  )
}

const Cart = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 4h2.2l2.3 10.2h10.1L20 7.5H6.4" />
    <circle cx="9" cy="19" r="1.4" />
    <circle cx="16.5" cy="19" r="1.4" />
  </svg>
)
const Bolt = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13.2 3 5.8 13.2h5.4L10.4 21l7.6-10.4h-5.5z" />
  </svg>
)
const Chat = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3.5a8.4 8.4 0 0 0-7.3 12.6L3.6 20.4l4.4-1.1A8.4 8.4 0 1 0 12 3.5z" />
    <path d="M9.2 9.3c.2 1.9 1.7 3.9 4 4.9l1.2-1.1 1.6.8" />
  </svg>
)
const Sheet = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z" />
    <path d="M14 3v5h5M8.5 11.5h7v6h-7zM8.5 14.5h7M12 11.5v6" />
  </svg>
)

export function FlowVisual({ f }: { f: X['flow'] }) {
  return (
    <div className="xf">
      <div className="xf-bar">
        <span className="xf-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="xf-name">{f.window}</span>
        <span className="xf-live">
          <i />
          {f.status}
        </span>
      </div>
      <FlowLines kind="desk" />
      <FlowLines kind="mob" />

      <div className="xf-node xf-order" data-xf-node="order">
        <span className="xf-ic xf-ic-blue">
          <Cart />
        </span>
        <span>
          <span className="xf-title">{f.order.title}</span>
          <span className="xf-meta">{f.order.meta}</span>
        </span>
      </div>

      <div className="xf-node xf-engine" data-xf-node="engine">
        <span className="xf-bolt" data-xf-bolt>
          <Bolt />
        </span>
        <span className="xf-title">{f.engine.title}</span>
        <span className="xf-status">
          <span className="xf-running" data-xf-running>
            <i />
            {f.engine.running}
          </span>
          <span className="xf-done" data-xf-done>
            <Check />
            {f.engine.done}
          </span>
        </span>
      </div>

      <div className="xf-node xf-out xf-wa" data-xf-node="out">
        <span className="xf-head">
          <span className="xf-ic xf-ic-green">
            <Chat />
          </span>
          <span className="xf-title">{f.whatsapp.title}</span>
          <span className="xf-ok" data-xf-ok>
            <Check />
          </span>
        </span>
        <span className="xf-bubble" data-xf-detail>
          {f.whatsapp.message}
          <span className="xf-time">
            {f.whatsapp.time}
            <svg viewBox="0 0 24 14" aria-hidden="true">
              <path d="M1.5 7.5l4 4 8-9M9.5 11.5l8-9" />
            </svg>
          </span>
        </span>
      </div>

      <div className="xf-node xf-out xf-gs" data-xf-node="out">
        <span className="xf-head">
          <span className="xf-ic xf-ic-sheet">
            <Sheet />
          </span>
          <span className="xf-title">{f.sheets.title}</span>
          <span className="xf-ok" data-xf-ok>
            <Check />
          </span>
        </span>
        <span className="xf-table" data-xf-detail>
          <span className="xf-th">{f.sheets.cols[0]}</span>
          <span className="xf-th">{f.sheets.cols[1]}</span>
          <span className="xf-td" data-xf-row>
            {f.sheets.row[0]}
          </span>
          <span className="xf-td xf-td-ok" data-xf-row>
            <i />
            {f.sheets.row[1]}
          </span>
        </span>
      </div>
    </div>
  )
}

/* ── 03 SaaS sur mesure — a product that grows by modules ────────────────── */

const ICON_PATHS: Record<string, string> = {
  grid: 'M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z',
  folder: 'M3.5 6.5A1.5 1.5 0 0 1 5 5h4.2l2 2.2H19a1.5 1.5 0 0 1 1.5 1.5v9.3A1.5 1.5 0 0 1 19 19.5H5a1.5 1.5 0 0 1-1.5-1.5z',
  user: 'M12 12a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6zM4.5 20a7.5 7.5 0 0 1 15 0',
  layers: 'M12 3.5 3.5 8 12 12.5 20.5 8zM3.5 12 12 16.5 20.5 12M3.5 16 12 20.5 20.5 16',
  gear: 'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7',
  chart: 'M5 19.5V11M10 19.5V5M15 19.5v-6M20 19.5V8.5',
  bell: 'M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5zM10 20.5h4',
  file: 'M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5zM14 3v4.5h4.5',
  card: 'M3.5 6.5A1.5 1.5 0 0 1 5 5h14a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5zM3.5 9.5h17M7 15h4',
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20',
  shield: 'M12 3 5 5.8v5.4c0 4.4 3 8 7 9.8 4-1.8 7-5.4 7-9.8V5.8z',
}
const Ico = ({ name }: { name: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={ICON_PATHS[name]} />
  </svg>
)
const SIDE_ICONS = ['grid', 'folder', 'user', 'layers', 'gear']
const MODULE_ICONS = ['user', 'folder', 'chart', 'bell', 'file']

/** A real, valid module definition: one feature, one boundary, one access rule. */
function Code() {
  const k = (s: string) => <span className="xd-k">{s}</span>
  const s = (t: string) => <span className="xd-s">{t}</span>
  const fn = (t: string) => <span className="xd-f">{t}</span>
  return (
    <code>
      <span>
        {k('export default')} {fn('defineModule')}({'{'}
      </span>
      <span>
        {'  '}name: {s("'billing'")},
      </span>
      <span>{'  '}routes: [invoices, payments],</span>
      <span>
        {'  '}guard: {fn('requireRole')}({s("'admin'")}),
      </span>
      <span>{'})'}</span>
    </code>
  )
}

export function SaasVisual({ s }: { s: X['saas'] }) {
  return (
    <div className="xd">
      <div className="xd-code" data-xd-code>
        <div className="xd-code-bar">
          <span className="xf-dots">
            <i />
            <i />
            <i />
          </span>
          modules/billing/index.ts
        </div>
        <pre>
          <Code />
        </pre>
      </div>

      <div className="xd-dash" data-xd-dash>
        <div className="xd-top">
          <span className="xd-brand">
            <i />
            {s.app}
          </span>
          <span className="xd-search">
            <Ico name="search" />
            {s.search}
          </span>
          <span className="xd-avatar">
            <Ico name="user" />
          </span>
        </div>
        <div className="xd-body">
          <span className="xd-side">
            {s.nav.map((n, i) => (
              <span key={n} className={i === 3 ? 'is-on' : undefined}>
                <Ico name={SIDE_ICONS[i]} />
                {n}
              </span>
            ))}
          </span>
          <span className="xd-main">
            <span className="xd-h">{s.title}</span>
            <span className="xd-sub">{s.sub}</span>
            <span className="xd-grid">
              {s.modules.map((m, i) => (
                <span key={m} className="xd-mod">
                  <span className="xd-mod-ic">
                    <Ico name={MODULE_ICONS[i]} />
                  </span>
                  <span className="xd-mod-name">{m}</span>
                  <span className="xd-mod-state">
                    <i />
                    {s.active}
                  </span>
                </span>
              ))}
              <span className="xd-slot">
                <span className="xd-mod xd-mod-new" data-xd-chip>
                  <span className="xd-mod-ic">
                    <Ico name="card" />
                  </span>
                  <span className="xd-mod-name">{s.added}</span>
                  <span className="xd-mod-state xd-tag">{s.isNew}</span>
                </span>
              </span>
            </span>
            <span className="xd-log">
              <span className="xd-log-title">{s.activity}</span>
              {s.log.map(([t, time], i) => (
                <span key={t} className="xd-log-row" data-xd-log={i === 0 ? '' : undefined}>
                  <i className={i === 0 ? 'is-new' : undefined} />
                  {t}
                  <span>{time}</span>
                </span>
              ))}
            </span>
          </span>
        </div>
      </div>

      <div className="xd-secure" data-xd-secure>
        <span className="xd-secure-ic">
          <Ico name="shield" />
        </span>
        <span className="xd-secure-txt">
          <b>{s.secure.title}</b>
          {s.secure.text}
        </span>
        <span className="xf-ok" data-xd-ok>
          <Check />
        </span>
      </div>
    </div>
  )
}
