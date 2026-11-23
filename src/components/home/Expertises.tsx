'use client'

import { useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode, type TouchEvent } from 'react'
import type { Dictionary } from '@/content'
import { gsap, useGSAP, ScrollTrigger, FULL, REDUCED, whenNear } from '@/lib/gsap'
import { WebVisual, FlowVisual, SaasVisual } from './expertises/visuals'
import { INTROS, INTRO_TARGETS } from './expertises/motion'

type X = Dictionary['home']['expertises']

const VISUALS: Record<string, (x: X) => ReactNode> = {
  web: (x) => <WebVisual w={x.web} />,
  flow: (x) => <FlowVisual f={x.flow} />,
  saas: (x) => <SaasVisual s={x.saas} />,
}

/** Seconds a slide stays once its demonstration has finished, before the next one. */
const DWELL = 3

const pad = (n: number) => String(n).padStart(2, '0')
const LAYERS = '[data-eyebrow],[data-line],[data-support],[data-visual],[data-caption]'

/**
 * Section 03 — « Nos expertises ».
 * Three chapters, one on screen at a time, in a single frame: every slide sits
 * in the same grid cell (rows shared through subgrid), so the section never
 * changes height. The navigation names the three expertises; the bar under
 * the current one fills while it waits.
 *
 * Rotation: each slide plays its demonstration (motion.ts), stays DWELL
 * seconds, then the next one arrives (loops). It only runs while the section
 * is on screen and the tab visible; it pauses while a control has keyboard
 * focus, and the pause button stops it (WCAG 2.2.2). Arrows, ← → keys, swipe
 * and the three names navigate at any time and restart the wait. Never takes
 * over the scroll.
 *
 * The change of chapter animates each layer on its own (≈ 0.75 s): the
 * headline leaves upward through its line masks while the visual drifts
 * 32px against the direction of travel; the next visual arrives from the
 * other side through a widening mask and its headline rises into place.
 * Reduced motion: no automatic rotation by default, slides simply swap,
 * every visual shown complete.
 */
export function Expertises({ x }: { x: X }) {
  const root = useRef<HTMLElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const st = useRef({
    i: 0,
    busy: false,
    motion: false,
    revealed: false,
    playing: true,
    inView: false,
    keyboard: false,
    intro: null as gsap.core.Timeline | null,
    tl: null as gsap.core.Timeline | null,
    fill: null as gsap.core.Tween | null,
  })
  const total = x.slides.length

  const slideEls = () => Array.from(root.current?.querySelectorAll<HTMLElement>('[data-slide]') ?? [])
  const fillEls = () => Array.from(root.current?.querySelectorAll<HTMLElement>('[data-fill]') ?? [])
  const layers = (s: HTMLElement) => ({
    eyebrow: s.querySelector('[data-eyebrow]'),
    lines: s.querySelectorAll('[data-line]'),
    support: s.querySelector('[data-support]'),
    visual: s.querySelector('[data-visual]'),
    caption: s.querySelector('[data-caption]'),
  })

  /** The arriving chapter, `at` seconds into `tl`. dir: 1 = forward, -1 = back. */
  const enter = (tl: gsap.core.Timeline, s: HTMLElement, dir: number, at: number) => {
    const l = layers(s)
    const from = dir > 0 ? 'inset(-12% -12% -12% 22%)' : 'inset(-12% 22% -12% -12%)'
    tl.fromTo(l.visual, { opacity: 0, x: 36 * dir, clipPath: from }, { opacity: 1, x: 0, clipPath: 'inset(-12% -12% -12% -12%)', duration: 0.56, clearProps: 'clipPath' }, at)
      .fromTo(l.eyebrow, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, at)
      .fromTo(l.lines, { yPercent: 112 }, { yPercent: 0, duration: 0.5, stagger: 0.06 }, at + 0.04)
      .fromTo(l.support, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, at + 0.12)
      .fromTo(l.caption, { opacity: 0 }, { opacity: 1, duration: 0.4 }, at + 0.2)
  }
  /** The leaving chapter. */
  const leave = (tl: gsap.core.Timeline, s: HTMLElement, dir: number) => {
    const l = layers(s)
    tl.to(l.lines, { yPercent: -112, duration: 0.32, stagger: 0.035, ease: 'descent' }, 0)
      .to([l.eyebrow, l.support, l.caption], { opacity: 0, y: -8, duration: 0.26, ease: 'power2.in' }, 0)
      .to(l.visual, { opacity: 0, x: -32 * dir, duration: 0.34, ease: 'power2.in' }, 0)
  }
  const introFor = (i: number, s: HTMLElement) => INTROS[x.slides[i].id]?.(s) ?? null

  /* ── Rotation ── */
  /** Runs or holds the current wait, from the live conditions. */
  const sync = () => {
    const s = st.current
    const run = s.playing && s.inView && s.revealed && !s.keyboard && document.visibilityState === 'visible'
    if (!s.fill) return
    if (run) s.fill.resume()
    else s.fill.pause()
  }
  /** Starts the wait for slide i: the bar fills over DWELL, after `delay` (its demonstration). */
  function arm(i: number, delay: number) {
    const s = st.current
    s.fill?.kill()
    const fills = fillEls()
    gsap.set(fills, { scaleX: 0 })
    s.fill = gsap.fromTo(
      fills[i],
      { scaleX: 0 },
      { scaleX: 1, duration: DWELL, delay, ease: 'none', paused: true, onComplete: () => goTo((s.i + 1) % total, 1) },
    )
    sync()
  }

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      const s = st.current
      ScrollTrigger.create({
        trigger: el.querySelector('.xs-slides'),
        start: 'top 85%',
        end: 'bottom 15%',
        onToggle: (self) => {
          s.inView = self.isActive
          sync()
        },
      })
      const onVisibility = () => sync()
      document.addEventListener('visibilitychange', onVisibility)

      const mm = gsap.matchMedia()
      mm.add(REDUCED, () => {
        // Nothing moves on its own; the visitor can still start the rotation.
        s.playing = false
        setPlaying(false)
        s.revealed = true
        arm(s.i, 0)
        return () => {
          s.fill?.kill()
          s.fill = null
          s.revealed = false
          s.playing = true
          setPlaying(true)
        }
      })
      mm.add(FULL, () => {
        s.motion = true
        // White while its top edge is on screen (no seam with Notre vision), then Cloud, which carries on
        // into Réalisations (same #F4F6F9 ground), so the exit needs no transition of its own.
        gsap.fromTo(el, { backgroundColor: '#ffffff' }, { backgroundColor: '#f4f6f9', ease: 'none', scrollTrigger: { trigger: el, start: 'top 60%', end: 'top 10%', scrub: true } })

        const stop = whenNear(el, () => {
          if (s.revealed) return
          const slide = slideEls()[s.i]
          const l = layers(slide)
          gsap.set(l.lines, { yPercent: 112 })
          gsap.set([l.eyebrow, l.support, l.visual, l.caption], { opacity: 0 })
          const intro = introFor(s.i, slide)
          s.intro = intro
          ScrollTrigger.create({
            trigger: el.querySelector('.xs-slides'),
            start: 'top 72%',
            once: true,
            onEnter: () => {
              if (s.revealed) return
              s.revealed = true
              const tl = gsap.timeline()
              enter(tl, slide, 1, 0)
              if (intro) tl.add(() => void intro.play(), 0.3)
              arm(s.i, 0.3 + (intro?.duration() ?? 0))
            },
          })
        })
        return () => {
          stop()
          s.motion = false
          s.busy = false
          s.revealed = false
          s.intro?.kill()
          s.tl?.kill()
          s.fill?.kill()
          s.intro = s.tl = s.fill = null
          gsap.set(el.querySelectorAll(`${LAYERS},${INTRO_TARGETS},[data-slide],[data-fill]`), { clearProps: 'all' })
        }
      })
      return () => {
        document.removeEventListener('visibilitychange', onVisibility)
        s.fill?.kill()
        s.fill = null
        mm.revert()
      }
    },
    { scope: root },
  )

  /** Event handler (never runs during render); its timelines are killed by the cleanups above. */
  function goTo(to: number, dir: 1 | -1) {
    const s = st.current
    if (s.busy || to === s.i) return
    const from = s.i
    s.i = to
    setActive(to)
    if (!s.motion) {
      arm(to, 0)
      return
    }
    const [cur, next] = [slideEls()[from], slideEls()[to]]
    s.busy = true
    s.revealed = true
    s.intro?.kill()
    const intro = introFor(to, next)
    s.intro = intro
    gsap.set(cur, { visibility: 'visible' })
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(cur, { clearProps: 'visibility' })
        s.busy = false
      },
    })
    leave(tl, cur, dir)
    enter(tl, next, dir, 0.2)
    if (intro) tl.add(() => void intro.play(), 0.32)
    s.tl = tl
    arm(to, 0.32 + (intro?.duration() ?? 0.4))
  }
  const step = (dir: 1 | -1) => goTo((st.current.i + dir + total) % total, dir)

  const toggle = () => {
    const s = st.current
    s.playing = !s.playing
    setPlaying(s.playing)
    if (s.playing && !s.fill) arm(s.i, 0)
    sync()
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      step(e.key === 'ArrowRight' ? 1 : -1)
    }
  }
  // Keyboard focus inside the carousel holds the rotation (a mouse click does not).
  const onFocus = (e: FocusEvent) => {
    st.current.keyboard = (e.target as HTMLElement).matches(':focus-visible')
    sync()
  }
  const onBlur = (e: FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      st.current.keyboard = false
      sync()
    }
  }
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: TouchEvent) => {
    const start = touch.current
    touch.current = null
    if (!start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1)
  }

  const current = x.slides[active]
  return (
    <section ref={root} id="nos-expertises" aria-labelledby="xs-title" className="xs">
      <div className="shell xs-inner">
        {/* The section name stays for assistive technologies; on screen, the slides speak for themselves. */}
        <h2 id="xs-title" className="sr-only">
          {x.label}
        </h2>

        <div
          className="xs-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label={x.carousel}
          onKeyDown={onKey}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <div id="xs-slides" className="xs-slides" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {x.slides.map((s, i) => (
              <div
                key={s.id}
                data-slide
                data-active={i === active ? '' : undefined}
                className="xs-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} ${x.of} ${total}`}
                aria-hidden={i !== active}
                inert={i !== active}
              >
                <div className="xs-copy">
                  <p className="t-overline xs-eyebrow" data-eyebrow>
                    {s.eyebrow}
                  </p>
                  <h3 className="xs-title">
                    {s.lines.map((line) => (
                      <span key={line} className="xs-line">
                        <span data-line>{line}</span>
                      </span>
                    ))}
                  </h3>
                  <p className="xs-support" data-support>
                    {s.support.map((phrase) => (
                      <span key={phrase}>{phrase}</span>
                    ))}
                  </p>
                </div>
                <div className="xs-visual" data-visual role="img" aria-label={s.visual}>
                  <div className="xs-visual-in" aria-hidden="true">
                    {VISUALS[s.id]?.(x)}
                  </div>
                </div>
                <p className="t-caption xs-caption" data-caption>
                  {s.caption}
                </p>
              </div>
            ))}
          </div>

          <div className="xs-nav">
            <ol className="xs-segs">
              {x.slides.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="xs-seg"
                    aria-controls="xs-slides"
                    aria-current={i === active ? 'true' : undefined}
                    onClick={() => goTo(i, i > st.current.i ? 1 : -1)}
                  >
                    <span className="xs-seg-label">
                      <b>{pad(i + 1)}</b> {s.short}
                    </span>
                    <span className="xs-seg-bar" aria-hidden="true">
                      <span className="xs-seg-fill" data-fill />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="xs-controls">
              <button type="button" className="xs-arrow" aria-label={x.prev} aria-controls="xs-slides" onClick={() => step(-1)}>
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M16 10H4M9 5l-5 5 5 5" />
                </svg>
              </button>
              <button type="button" className="xs-arrow xs-play" aria-label={playing ? x.pause : x.play} onClick={toggle}>
                {playing ? (
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M7.5 5v10M12.5 5v10" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M7 4.8v10.4L15.5 10z" className="xs-fill-icon" />
                  </svg>
                )}
              </button>
              <button type="button" className="xs-arrow" aria-label={x.next} aria-controls="xs-slides" onClick={() => step(1)}>
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M4 10h12M11 5l5 5-5 5" />
                </svg>
              </button>
            </div>
          </div>
          <p className="sr-only" aria-live={playing ? 'off' : 'polite'}>
            {`${active + 1} ${x.of} ${total} — ${current.eyebrow}`}
          </p>
        </div>
      </div>
    </section>
  )
}
