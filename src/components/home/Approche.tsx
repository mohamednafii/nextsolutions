'use client'

import { useRef, useState, type ReactNode } from 'react'
import type { Dictionary } from '@/content'
import { href as route, type Locale, type RouteKey } from '@/lib/i18n'
import { gsap, useGSAP, ScrollTrigger, FULL, REDUCED, whenNear } from '@/lib/gsap'
import { ArrowLink } from '@/components/ui/Button'
import { ChapterLabel } from '@/components/ui/ChapterLabel'
import { SplitTitle } from '@/components/motion/SplitTitle'
import { WebDemo, SeoDemo, FlowDemo, SaasDemo } from './approche/demos'
import { STORIES, STAGE_COUNT } from './approche/story'

type A = Dictionary['home']['approche']
type Id = keyof typeof STORIES

const pad = (n: number) => String(n).padStart(2, '0')

const Replay = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4.5 10a5.5 5.5 0 1 0 1.7-4M4.5 3.5V7H8" />
  </svg>
)

/**
 * One chapter: business headline (left), the demonstration (centre), a compact
 * explanation that also drives the demonstration (right). The demo plays once
 * when it comes into view; it can be replayed, or opened at any stage.
 */
function Chapter({
  id,
  n,
  a,
  kicker,
  title,
  text,
  cta,
  ctaHref,
  aside,
  stages,
  demo,
  list,
}: {
  id: Id
  n: number
  a: A
  kicker: string
  title: string[]
  text: string
  cta: string
  ctaHref: string
  aside: string
  /** Stage names for the control row under the demo (omit when the aside already lists them). */
  stages?: string[]
  demo: ReactNode
  /** The right-hand list: which items match the current stage, and (optionally) the stage an item opens. */
  list: {
    items: { name: string; text: string }[]
    numbered?: boolean
    active: (i: number, stage: number) => boolean
    opens?: (i: number) => number
    onPick?: (i: number) => void
  }
}) {
  const ref = useRef<HTMLElement>(null)
  const count = STAGE_COUNT[id]
  const [stage, setStage] = useState(count - 1)
  const [motion, setMotion] = useState(false)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const motionRef = useRef(false)

  useGSAP(
    () => {
      const root = ref.current!
      const demoEl = root.querySelector<HTMLElement>('[data-ap-demo]')!
      const frame = root.querySelector<HTMLElement>('[data-ap-frame]')!
      const track = (tl: gsap.core.Timeline) => {
        const starts = Array.from({ length: count }, (_, k) => tl.labels[`s${k}`])
        tl.eventCallback('onUpdate', () => {
          const t = tl.time()
          let k = 0
          starts.forEach((s, i) => {
            if (t >= s - 0.001) k = i
          })
          setStage((prev) => (prev === k ? prev : k))
        })
      }
      const mm = gsap.matchMedia()
      mm.add(FULL, () => {
        const stop = whenNear(root, () => {
          motionRef.current = true
          setMotion(true)
          const tl = STORIES[id](demoEl)
          tl.pause(0)
          track(tl)
          tlRef.current = tl
          setStage(0)
          // The visual comes into focus, then its story plays once.
          gsap.from(frame, { y: 48, autoAlpha: 0, duration: 1.1, ease: 'ascent', scrollTrigger: { trigger: frame, start: 'top 88%', once: true } })
          gsap.from(root.querySelectorAll('[data-ap-rise]'), {
            y: 22,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.07,
            ease: 'ascent',
            scrollTrigger: { trigger: root, start: 'top 80%', once: true },
          })
          ScrollTrigger.create({ trigger: frame, start: 'top 68%', once: true, onEnter: () => tl.play() })
          return () => {
            tl.kill()
            tlRef.current = null
          }
        })
        return () => {
          stop()
          motionRef.current = false
          setMotion(false)
          setStage(count - 1)
        }
      })
      mm.add(REDUCED, () => {
        const tl = STORIES[id](demoEl)
        tl.progress(1).pause()
        track(tl)
        tlRef.current = tl
        return () => {
          tl.revert()
          tlRef.current = null
          setStage(count - 1)
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  const go = (k: number) => {
    const tl = tlRef.current
    setStage(k)
    if (!tl) return
    tl.pause()
    if (motionRef.current) tl.tweenFromTo(`s${k}`, `h${k}`, { ease: 'none' })
    else tl.seek(`h${k}`)
  }
  const replay = () => tlRef.current?.restart()

  return (
    <article ref={ref} aria-labelledby={`ap-${id}-title`} className={`apc apc-${id}`}>
      <header className="apc-copy">
        <p data-ap-rise className="apc-kicker t-overline">
          <span>{pad(n)}</span>
          {kicker}
        </p>
        <h3 data-ap-rise id={`ap-${id}-title`} className="apc-title">
          {title[0]}
          <br />
          <span className="text-blue">{title[1]}</span>
        </h3>
        <p data-ap-rise className="apc-text">
          {text}
        </p>
        <span data-ap-rise className="apc-cta">
          <ArrowLink href={ctaHref}>{cta}</ArrowLink>
        </span>
      </header>

      <div data-ap-frame className="apc-stage">
        <div role="img" aria-label={`${kicker} — ${title.join(' ')}`} className="apc-demo">
          <div aria-hidden="true" className="apc-demo-in">
            {demo}
          </div>
        </div>
        <div className="apc-controls">
          <p className="apc-now" aria-live="polite">
            <span className="tabular-nums">
              {a.stage} {stage + 1} {a.of} {count}
            </span>
            {stages && <b>{stages[Math.min(stage, stages.length - 1)]}</b>}
          </p>
          {stages && (
            <ol className="apc-chips">
              {stages.map((s, k) => (
                <li key={s}>
                  <button type="button" className="apc-chip" aria-pressed={k === stage} onClick={() => go(k)}>
                    <span className="sr-only">{s}</span>
                  </button>
                </li>
              ))}
            </ol>
          )}
          {motion && (
            <button type="button" className="orb-btn apc-replay" aria-label={a.replay} onClick={replay}>
              <Replay />
            </button>
          )}
        </div>
      </div>

      <aside className="apc-aside" aria-label={aside}>
        <p data-ap-rise className="apc-aside-title t-overline">
          {aside}
        </p>
        <List
          items={list.items}
          numbered={list.numbered}
          active={(i) => list.active(i, stage)}
          onPick={
            list.opens
              ? (i) => {
                  list.onPick?.(i)
                  const k = list.opens!(i)
                  if (k !== stage) go(k)
                }
              : undefined
          }
        />
      </aside>
    </article>
  )
}

/** A list of short items; `active` marks the ones that match the current stage. */
function List({ items, active, onPick, numbered = true }: { items: { name: string; text: string }[]; active: (i: number) => boolean; onPick?: (i: number) => void; numbered?: boolean }) {
  return (
    <ol className="apc-list">
      {items.map((it, i) => {
        const on = active(i)
        const body = (
          <>
            {numbered && <span className="apc-li-n">{pad(i + 1)}</span>}
            <span className="apc-li-body">
              <span className="apc-li-name">{it.name}</span>
              <span className="apc-li-text">{it.text}</span>
            </span>
          </>
        )
        return (
          <li key={it.name} data-ap-rise className={`apc-li ${on ? 'is-on' : ''}`}>
            {onPick ? (
              <button type="button" className="apc-li-btn" aria-pressed={on} onClick={() => onPick(i)}>
                {body}
              </button>
            ) : (
              <span className="apc-li-btn" aria-current={on ? 'step' : undefined}>
                {body}
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

/**
 * Section 05 — « Bien plus qu'un prestataire. Un partenaire de croissance. »
 * Four chapters, one fictional client (Maison Safran, a caterer) followed from
 * its first brief to its own application: a website as an investment, being
 * found, automating the repetitive, a product built to last. Each chapter
 * shows the work instead of describing it. No pin, no scroll-jacking.
 */
export function Approche({ a, locale }: { a: A; locale: Locale }) {
  // One-page site: each chapter's call to action opens the project form.
  const link = (k: RouteKey) => route(k, locale)
  // Which SEO stage each foundation is visible in (technique / on-page → the result; internal links → the visit; off-page → the result list).
  const seoStage = [1, 1, 2, 1]
  const seoAttr = ['tech', 'onpage', 'link', 'off']
  const [seoFocus, setSeoFocus] = useState<number | null>(null)

  return (
    <section id="approche" aria-labelledby="ap-title" className="ap">
      <div className="shell">
        <div className="ap-head">
          <ChapterLabel n="05" label={a.label} />
          <SplitTitle id="ap-title" className="t-display mt-6 md:mt-8">
            {a.title[0]}
            <br />
            <span className="text-blue">{a.title[1]}</span>
          </SplitTitle>
          <p className="ap-lead">{a.lead}</p>
        </div>

        <Chapter
          id="web"
          n={1}
          a={a}
          {...a.web}
          ctaHref={link('start')}
          demo={<WebDemo c={a.web} />}
          list={{ items: a.web.steps, active: (i, stage) => i === stage, opens: (i) => i }}
        />

        <div className={seoFocus === null ? '' : `ap-seo-focus-${seoAttr[seoFocus]}`}>
          <Chapter
            id="seo"
            n={2}
            a={a}
            {...a.seo}
            ctaHref={link('start')}
            stages={a.seo.stages}
            demo={<SeoDemo c={a.seo} />}
            list={{
              items: a.seo.pillars,
              numbered: false,
              active: (i) => seoFocus === i,
              opens: (i) => seoStage[i],
              onPick: (i) => setSeoFocus(seoFocus === i ? null : i),
            }}
          />
        </div>

        <Chapter
          id="flow"
          n={3}
          a={a}
          {...a.flow}
          ctaHref={link('start')}
          demo={<FlowDemo c={a.flow} />}
          list={{ items: a.flow.principles, active: (i, stage) => (i === 0 ? stage <= 1 : i === 1 ? stage >= 2 && stage <= 5 : stage >= 6) }}
        />

        <Chapter
          id="saas"
          n={4}
          a={a}
          {...a.saas}
          ctaHref={link('start')}
          stages={a.saas.stages}
          demo={<SaasDemo c={a.saas} />}
          list={{ items: a.saas.principles, active: (i, stage) => stage === i + 1, opens: (i) => i + 1 }}
        />

        <p className="ap-note">{a.note}</p>
      </div>
    </section>
  )
}
