import Image from 'next/image'
import localFont from 'next/font/local'
import type { Dictionary } from '@/content'

/**
 * The four demonstrations of chapter 05 « Notre approche ». Real HTML/SVG
 * interfaces so every layer can move on its own and stays sharp. Sizes are
 * container units of the demo (each one scales as a single picture). Motion
 * lives in ./story.ts; the CSS default of every element is its FINAL state, so
 * without JavaScript or with reduced motion each demo shows its result.
 * One fictional client (Maison Safran, a caterer in Casablanca) runs through
 * the four chapters; the section says so.
 */

type A = Dictionary['home']['approche']

/* The fictional client's typeface (demo sites only; not preloaded). */
const demoSerif = localFont({
  src: [
    { path: '../../../fonts/cormorant-garamond-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../../fonts/cormorant-garamond-latin-500-italic.woff2', weight: '500', style: 'italic' },
  ],
  variable: '--font-demo-serif',
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'serif'],
})

const Check = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M5.5 10.5l3 3 6-7" />
  </svg>
)
const Lock = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <rect x="5" y="9" width="10" height="7.5" rx="1.6" />
    <path d="M7.5 9V7a2.5 2.5 0 0 1 5 0v2" />
  </svg>
)
const Cursor = (props: Record<string, string>) => (
  <svg viewBox="0 0 16 22" className="ap-cursor" aria-hidden="true" {...props}>
    <path d="M1 1v17.5l4.6-4.4 3 6.9 2.9-1.3-3-6.8h6.3L1 1z" fill="#fff" stroke="#0F1418" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
)
const Dots = () => (
  <span className="ap-dots" aria-hidden="true">
    <i />
    <i />
    <i />
  </span>
)

/* ── 01 — From a brief to a mobile site ───────────────────────────────────── */

function MiniSite({ d }: { d: A['web']['demo'] }) {
  return (
    <div className="aw-site-in">
      <div className="aw-nav">
        <span className="aw-brand">{d.brand}</span>
        <span className="aw-links">
          {d.nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </span>
        <span data-w-navcta className="aw-pill">{d.cta}</span>
      </div>
      <div className="aw-hero">
        <div className="aw-copy">
          <span className="aw-kicker">{d.kicker}</span>
          <span className="aw-h1">
            <span data-w-h>{d.headline[0]}</span>
            <em data-w-h>{d.headline[1]}</em>
          </span>
          <span data-w-h className="aw-sub">{d.sub}</span>
          <span data-w-h data-w-cta className="aw-cta">
            {d.cta}
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 10h12M11 5l5 5-5 5" />
            </svg>
            <Cursor data-w-cursor="" />
          </span>
        </div>
        <div className="aw-photo">
          <Image src="/images/approche/plat.webp" alt="" width={628} height={572} sizes="(min-width: 1024px) 22vw, 40vw" className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="aw-cards">
        {d.cards.map((c, i) => (
          <span key={c} data-w-card className="aw-card">
            <b>0{i + 1}</b>
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}

export function WebDemo({ c }: { c: A['web'] }) {
  const d = c.demo
  return (
    <div data-ap-demo className={`aw ${demoSerif.variable}`}>
      <div data-w-browser className="aw-browser">
        <div className="ap-bar">
          <Dots />
          <span className="ap-url">
            <Lock />
            {d.url}
            <span data-w-load className="ap-load" />
          </span>
        </div>
        <div className="aw-view">
          {/* 01 — the brief */}
          <div data-w-brief className="aw-brief">
            <p className="aw-brief-title">{d.briefTitle}</p>
            <dl>
              {d.brief.map(([k, v]) => (
                <div key={k} data-w-row>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          {/* 02 — the wireframe (same layout as the site, in strokes) */}
          <svg data-w-wire className="aw-wire" viewBox="0 0 1600 1000" aria-hidden="true">
            <path pathLength={1} d="M60 40h1480v70H60z" />
            <path pathLength={1} d="M100 250h480v60H100zM100 330h560v60H100z" />
            <path pathLength={1} d="M100 430h440v24H100zM100 470h360v24H100z" />
            <path pathLength={1} d="M100 540h300v70H100z" />
            <path pathLength={1} d="M840 170h700v520H840zM840 170l700 520M1540 170L840 690" />
            <path pathLength={1} d="M60 760h470v180H60zM565 760h470v180H565zM1070 760h470v180h-470z" />
          </svg>
          {/* 03 — the designed site; 04 — working, interactive */}
          <div data-w-site className="aw-site">
            <div data-w-scroll className="aw-scroll">
              <MiniSite d={d} />
            </div>
          </div>
        </div>
      </div>
      {/* 05 — the same site on a phone */}
      <div data-w-phone className="aw-phone">
        <div className="aw-phone-screen">
          <div className="aw-m-nav">
            <span className="aw-brand">{d.brand}</span>
            <span className="aw-burger" aria-hidden="true">
              <i />
              <i />
            </span>
          </div>
          <div className="aw-m-photo">
            <Image src="/images/approche/plat.webp" alt="" width={628} height={572} sizes="20vw" className="h-full w-full object-cover" />
          </div>
          <div data-w-m className="aw-m-copy">
            <span className="aw-kicker">{d.kicker}</span>
            <span className="aw-h1">
              <span>{d.headline[0]}</span>
              <em>{d.headline[1]}</em>
            </span>
            <span className="aw-cta">{d.cta}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── 02 — From a search to a request ──────────────────────────────────────── */

export function SeoDemo({ c }: { c: A['seo'] }) {
  const d = c.demo
  return (
    <div data-ap-demo className={`as ${demoSerif.variable}`}>
      <div className="as-browser">
        <div className="ap-bar">
          <Dots />
          <span className="ap-url as-urls">
            <Lock />
            <span className="as-url-stack">
              <span data-s-url-search>{d.search.toLowerCase()}?q=traiteur+casablanca</span>
              <span data-s-url-site>{d.results[1].url.split(' ›')[0]}</span>
            </span>
          </span>
        </div>
        <div className="as-view">
          {/* 01 — the search */}
          <div data-s-serp className="as-serp">
            <div className="as-search">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="9" cy="9" r="5.5" />
                <path d="M13 13l4 4" />
              </svg>
              <span className="as-q">
                {Array.from(d.query).map((ch, i) => (
                  <span key={i} data-s-char>
                    {ch}
                  </span>
                ))}
                <span data-s-caret className="as-caret" />
              </span>
            </div>
            <ul className="as-results">
              {d.results.map((r, i) => (
                <li key={r.url} data-s-result className={`as-result ${i === 1 ? 'is-ours' : ''}`} data-seo-off={i === 0 ? '' : undefined}>
                  {i === 1 && <span data-s-hl className="as-hl" />}
                  <span className="as-site">
                    <span className="as-fav">{r.site[0]}</span>
                    <span>
                      <b>{r.site}</b>
                      <span data-seo-tech={i === 1 ? '' : undefined}>{r.url}</span>
                    </span>
                  </span>
                  <span className="as-title" data-seo-onpage={i === 1 ? '' : undefined} data-s-title={i === 1 ? '' : undefined}>
                    {r.title}
                  </span>
                  <span className="as-desc" data-seo-onpage={i === 1 ? '' : undefined}>
                    {r.desc}
                  </span>
                  {i === 1 && <Cursor data-s-cur1="" />}
                </li>
              ))}
            </ul>
          </div>
          {/* 03 — the site; 04 — the request */}
          <div data-s-site className="as-site-page">
            <div data-s-scroll className="as-scroll">
              <div className="as-nav">
                <span className="aw-brand">Maison Safran</span>
                <span className="as-links" data-seo-link="">
                  <span>Menus</span>
                  <span data-s-link className="as-link">
                    Mariages
                    <Cursor data-s-cur2="" />
                  </span>
                  <span>Entreprises</span>
                  <span>Contact</span>
                </span>
              </div>
              <div className="as-hero">
                <Image src="/images/approche/plat.webp" alt="" width={628} height={572} sizes="(min-width: 1024px) 40vw, 90vw" className="as-hero-img" />
                <span className="as-hero-copy">
                  <span className="as-hero-k">Traiteur · Casablanca</span>
                  <span className="as-hero-h">
                    Mariages &amp; <em>réceptions</em>
                  </span>
                </span>
              </div>
              <div data-s-form className="as-form">
                <span className="as-form-title">{d.form.title}</span>
                <span className="as-fields">
                  {d.form.fields.map(([k, v]) => (
                    <span key={k} className="as-field">
                      <span className="as-label">{k}</span>
                      <span className="as-input">
                        <span data-s-value>{v}</span>
                      </span>
                    </span>
                  ))}
                </span>
                <span data-s-submit className="as-submit">
                  <span data-s-submit-label>{d.form.submit}</span>
                  <span data-s-sent className="as-sent">
                    <Check />
                  </span>
                  <Cursor data-s-cur3="" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* The business owner's side: the request lands */}
      <div data-s-toast className="as-toast">
        <span className="as-toast-ic">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5 8a5 5 0 0 1 10 0c0 4 1.5 5 1.5 5h-13S5 12 5 8ZM8.5 16a1.6 1.6 0 0 0 3 0" />
          </svg>
        </span>
        <span>
          <b>{d.toast}</b>
          <span>{d.toastMeta}</span>
        </span>
      </div>
    </div>
  )
}

/* ── 03 — An order runs through the workflow by itself ────────────────────── */

const FLOW_ICONS = [
  // form / cart
  <path key="0" d="M3.5 4h2l1.8 8.5h8.2l1.5-6H6.2M8.5 16.2a1.1 1.1 0 1 0 0 .1M14.5 16.2a1.1 1.1 0 1 0 0 .1" />,
  // inbox
  <path key="1" d="M3.5 11.5 5.5 5h9l2 6.5V15a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-3.5Zm0 0h4l1 2h3l1-2h4" />,
  // bolt
  <path key="2" d="M11 3 5.5 11H10l-1 6 5.5-8H10l1-6Z" />,
  // chat
  <path key="3" d="M4 10a6 6 0 1 1 3.1 5.3L4 16l.8-3A6 6 0 0 1 4 10Z" />,
  // sheet
  <path key="4" d="M5 3.5h10v13H5zM5 7.5h10M5 11.5h10M9 7.5v9" />,
  // bell
  <path key="5" d="M5 8a5 5 0 0 1 10 0c0 4 1.5 5 1.5 5h-13S5 12 5 8ZM8.5 16a1.6 1.6 0 0 0 3 0" />,
]

export function FlowDemo({ c }: { c: A['flow'] }) {
  const d = c.demo
  return (
    <div data-ap-demo className="af">
      <div className="af-head">
        <span className="af-title">{d.title}</span>
        <span className="af-live">
          <i />
          {d.live}
        </span>
      </div>
      <ol className="af-nodes">
        {d.nodes.map((n, i) => (
          <li key={n.name} data-f-node className="af-node">
            <span className="af-rail" aria-hidden="true">
              <span data-f-ic className="af-ic">
                <svg viewBox="0 0 20 20">{FLOW_ICONS[i]}</svg>
              </span>
              {i < d.nodes.length - 1 && (
                <span className="af-seg">
                  <span data-f-fill className="af-fill">
                    <span className="af-dot" />
                  </span>
                </span>
              )}
            </span>
            <span className="af-body">
              <span className="af-row">
                <span className="af-name">{n.name}</span>
                <span className="af-status">
                  <span data-f-st="wait" className="af-st af-st-wait">{d.status.wait}</span>
                  <span data-f-st="run" className="af-st af-st-run">{d.status.run}</span>
                  <span data-f-st="done" className="af-st af-st-done">
                    <Check />
                    {d.status.done}
                  </span>
                </span>
              </span>
              <span className="af-meta">{n.meta}</span>
              {i === 3 && (
                <span data-f-out className="af-msg">
                  {d.message}
                  <span className="af-ticks">
                    <Check />
                    <Check />
                  </span>
                </span>
              )}
              {i === 4 && (
                <span data-f-out className="af-sheet">
                  {d.row.map((cell) => (
                    <span key={cell}>{cell}</span>
                  ))}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
      <div data-f-done className="af-done">
        <span className="af-done-ic">
          <Check />
        </span>
        {d.done}
      </div>
    </div>
  )
}

/* ── 04 — A product, its architecture, a new module, its security ────────── */

const NAV_ICONS = [
  <path key="0" d="M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z" />,
  <path key="1" d="M4 5.5h12v10.5H4zM4 8.5h12M7.5 3.5v3M12.5 3.5v3" />,
  <path key="2" d="M7.5 9a2.5 2.5 0 1 0 0-.1M3.5 16a4 4 0 0 1 8 0M13 6.5a2 2 0 1 1 0 4M14 13a3.5 3.5 0 0 1 3 3" />,
  <path key="3" d="M6 3.5h6l3 3v10H6zM8.5 9.5h4M8.5 12.5h4" />,
]

export function SaasDemo({ c }: { c: A['saas'] }) {
  const d = c.demo
  return (
    <div data-ap-demo className="ax">
      <div data-x-app className="ax-app">
        <aside className="ax-side">
          <span className="ax-logo">
            <i />
            {d.app}
          </span>
          <ul>
            {d.nav.map((n, i) => (
              <li key={n} className={i === 1 ? 'is-on' : ''}>
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  {NAV_ICONS[i]}
                </svg>
                {n}
              </li>
            ))}
            <li data-x-added className="ax-added">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5 3.5h10v13l-2.5-1.5L10 16.5 7.5 15 5 16.5zM8 7.5h4M8 10.5h4" />
              </svg>
              {d.added}
            </li>
          </ul>
        </aside>
        <div className="ax-main">
          <div className="ax-top">
            <span className="ax-search" />
            <span className="ax-avatar">MS</span>
          </div>
          <p className="ax-h">{d.heading}</p>
          <div className="ax-table">
            {d.rows.map((r) => (
              <div key={r[0]} data-x-row className="ax-tr">
                <b>{r[0]}</b>
                <span>{r[1]}</span>
                <span>{r[2]}</span>
                <span className={`ax-tag ${r[3].length > 9 ? 'is-wait' : ''}`}>{r[3]}</span>
              </div>
            ))}
          </div>
          <div data-x-invoice className="ax-invoice">
            <span className="ax-inv-ic">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5 3.5h10v13l-2.5-1.5L10 16.5 7.5 15 5 16.5zM8 7.5h4M8 10.5h4" />
              </svg>
            </span>
            <span>
              <b>{d.invoice[0]}</b>
              <span>{d.invoice[1]}</span>
            </span>
            <span className="ax-tag">{d.invoice[2]}</span>
          </div>
        </div>
      </div>

      <div data-x-arch className="ax-arch">
        {d.layers.map((l, i) => (
          <div key={l.name} data-x-layer className={`ax-layer ax-layer-${i}`}>
            <span className="ax-layer-name">{l.name}</span>
            <span className="ax-chips">
              {l.items.map((it) => (
                <span key={it} className="ax-chip">
                  {it}
                </span>
              ))}
              {i === 2 && (
                <span data-x-chip className="ax-chip ax-chip-new">
                  + {d.added}
                </span>
              )}
            </span>
          </div>
        ))}
        {/* Security wraps the API and the modules: who may call what, and what happened */}
        <div data-x-sec className="ax-sec">
          <span data-x-sec-line className="ax-sec-frame" />
          <span className="ax-sec-tags">
            {d.security.map((s) => (
              <span key={s} data-x-sec-tag className="ax-sec-tag">
                <Lock />
                {s}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  )
}
