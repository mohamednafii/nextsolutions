'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from 'react'
import type { Dictionary } from '@/content'
import { href as route, projectHref, type Locale } from '@/lib/i18n'
import { gsap, useGSAP, ScrollTrigger, FULL, REDUCED, whenNear } from '@/lib/gsap'
import { ChapterLabel } from '@/components/ui/ChapterLabel'
import { SplitTitle } from '@/components/motion/SplitTitle'
import { getShowcase, type ShowcaseProject } from '@/content/showcase'

type R = Dictionary['home']['realisations']

/** Seconds a project stays in the centre before the next one slides in. */
const DWELL = 4.5
/** Duration of one change (s). */
const MOVE = 1.05
const pad = (n: number) => String(n).padStart(2, '0')

function resolve(h: NonNullable<ShowcaseProject['href']>, locale: Locale): string {
  if (h === 'work') return route('work', locale)
  if (h.startsWith('project:')) return projectHref(h.slice('project:'.length), locale)
  return h
}
/** A live client site opens in a new tab; our own pages stay in this one. */
const isExternal = (h: ShowcaseProject['href']) => Boolean(h && h.startsWith('https://'))

/** Signed distance of slide k from the active one, on a loop (…, -1, 0, +1, …). */
function offsetOf(k: number, i: number, n: number) {
  let d = (k - i + n) % n
  if (d > n / 2) d -= n
  return d
}

/**
 * Where a slide sits for a given offset: centre (full size), sides (small,
 * faded, cut by the screen edges), or parked out of view beyond them.
 * xPercent is relative to the slide, so the layout scales with the stage.
 */
function pose(off: number, wide: boolean) {
  const side = wide ? 74 : 62
  if (off === 0) return { xPercent: 0, scale: 1, autoAlpha: 1, zIndex: 3 }
  if (Math.abs(off) === 1) return { xPercent: off * side, scale: 0.42, autoAlpha: 0.55, zIndex: 2 }
  return { xPercent: Math.sign(off) * side * 1.5, scale: 0.3, autoAlpha: 0, zIndex: 1 }
}

/**
 * Section 04 — « Des projets concrets. Un impact réel. »
 * One project at a time, centred: the same 3D laptop and phone for every site
 * (renders generated from real captures, see content/showcase.ts). The
 * neighbours wait small and faded on the left and right, cut by the screen
 * edges; every few seconds the carousel slides to the next one (smooth
 * ≈1s move, the incoming phone lagging a little for depth).
 * Navigation: swipe / drag, the side projects, arrows, ← → keys, progress bars;
 * pause button (WCAG 2.2.2), pauses on hover, keyboard focus, off screen and in
 * a hidden tab. Centre composition: restrained pointer parallax, click opens
 * the project (no custom cursor: the system pointer is enough). Reduced motion: no rotation unless the
 * visitor presses play, instant changes.
 */
export function Realisations({ r, locale }: { r: R; locale: Locale }) {
  const ref = useRef<HTMLElement>(null)
  const router = useRouter()
  const items = getShowcase()
  const n = items.length
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const st = useRef({
    i: 0,
    motion: false,
    revealed: false,
    playing: true,
    inView: false,
    hover: false,
    keyboard: false,
    fill: null as gsap.core.Tween | null,
    tl: null as gsap.core.Timeline | null,
    wide: true,
    drag: null as null | { x: number; y: number; moved: boolean },
    dragged: false,
  })

  const q = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, ref.current)

  /** Places every slide for the active index, without animation. */
  function layout() {
    const s = st.current
    q('[data-rz-slide]').forEach((el, k) => gsap.set(el, pose(offsetOf(k, s.i, n), s.wide)))
    q('[data-rz-caption]').forEach((el, k) => gsap.set(el.children, { yPercent: 0, autoAlpha: k === s.i ? 1 : 0 }))
  }

  function sync() {
    const s = st.current
    const run = s.playing && s.inView && s.revealed && !s.hover && !s.keyboard && document.visibilityState === 'visible'
    if (!s.fill) return
    if (run) s.fill.play()
    else s.fill.pause()
  }

  function arm(i: number, delay: number) {
    const s = st.current
    s.fill?.kill()
    const fills = q('[data-rz-fill]')
    gsap.set(fills, { scaleX: 0 })
    if (n < 2) return
    s.fill = gsap.fromTo(fills[i], { scaleX: 0 }, { scaleX: 1, duration: DWELL, delay, ease: 'none', paused: true, onComplete: () => goTo((s.i + 1) % n, 1) })
    sync()
  }

  function goTo(to: number, dir: number) {
    const s = st.current
    if (to === s.i || n < 2) return
    const from = s.i
    s.i = to
    setActive(to)
    if (!s.motion) {
      s.tl?.kill()
      layout()
      arm(to, 0)
      return
    }
    s.tl?.progress(1).kill()
    const slides = q('[data-rz-slide]')
    const captions = q('[data-rz-caption]')
    const tl = gsap.timeline({ defaults: { duration: MOVE, ease: 'power3.inOut' } })
    slides.forEach((el, k) => {
      const before = offsetOf(k, from, n)
      const after = offsetOf(k, to, n)
      const expected = before - dir
      if (after === expected) {
        tl.to(el, pose(after, s.wide), 0)
      } else {
        // Wraps around the loop: leaves on one side, comes back in from the other.
        const outSide = Math.sign(expected) || -dir
        tl.to(el, { ...pose(outSide * 2, s.wide), duration: MOVE * 0.55, ease: 'power2.in' }, 0)
          .set(el, pose(-outSide * 2, s.wide), MOVE * 0.55)
          .to(el, { ...pose(after, s.wide), duration: MOVE * 0.45, ease: 'power2.out' }, MOVE * 0.55)
      }
    })
    // Depth: the incoming phone arrives a beat after its laptop.
    const phone = slides[to].querySelector('[data-rz-phone]')
    if (phone) tl.fromTo(phone, { xPercent: dir * 22 }, { xPercent: 0, duration: MOVE * 0.9, ease: 'power3.out' }, MOVE * 0.18)
    // Caption: the old one leaves upward through its mask, the new one rises.
    tl.to(captions[from].children, { yPercent: -110, autoAlpha: 0, duration: 0.4, ease: 'power2.in', stagger: 0.04 }, 0)
      .fromTo(captions[to].children, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out', stagger: 0.06 }, MOVE * 0.5)
    s.tl = tl
    arm(to, MOVE * 0.6)
  }

  const step = (dir: number) => goTo((st.current.i + dir + n) % n, dir)

  function toggle() {
    const s = st.current
    s.playing = !s.playing
    setPlaying(s.playing)
    if (!s.fill) arm(s.i, 0)
    sync()
  }

  useGSAP(
    () => {
      const root = ref.current!
      const s = st.current
      const mq = window.matchMedia('(min-width: 768px)')
      s.wide = mq.matches
      layout()
      const onMq = () => {
        s.wide = mq.matches
        s.tl?.progress(1).kill()
        layout()
      }
      mq.addEventListener('change', onMq)
      const onVis = () => sync()
      document.addEventListener('visibilitychange', onVis)
      const view = ScrollTrigger.create({
        trigger: root.querySelector('[data-rz-carousel]'),
        start: 'top 85%',
        end: 'bottom 15%',
        onToggle: (self) => {
          s.inView = self.isActive
          sync()
        },
      })

      const mm = gsap.matchMedia()
      mm.add(REDUCED, () => {
        s.playing = false
        setPlaying(false)
        s.revealed = true
        arm(s.i, 0)
        return () => {
          s.playing = true
          setPlaying(true)
        }
      })
      mm.add(FULL, () => {
        s.motion = true
        const stop = whenNear(root, () => {
          const stage = root.querySelector<HTMLElement>('[data-rz-stage]')!
          const center = () => root.querySelectorAll<HTMLElement>('[data-rz-slide]')[s.i]
          const c = center()
          const lap = c.querySelector('[data-rz-laptop]')
          const ph = c.querySelector('[data-rz-phone]')
          const sides = q('[data-rz-slide]').filter((el) => el !== c)
          gsap.set(lap, { yPercent: 12, scale: 0.94, rotationX: 7, transformPerspective: 1800, transformOrigin: '50% 100%', autoAlpha: 0 })
          if (ph) gsap.set(ph, { xPercent: 40, autoAlpha: 0 })
          gsap.set(sides, { autoAlpha: 0 })
          const intro = gsap
            .timeline({ paused: true, onComplete: () => { s.revealed = true; arm(s.i, 0) } })
            .to(lap, { yPercent: 0, scale: 1, rotationX: 0, autoAlpha: 1, duration: 1.3, ease: 'power3.out' }, 0)
            .to(ph, { xPercent: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' }, 0.55)
            .to(sides, { autoAlpha: (k: number, el: HTMLElement) => (Math.abs(offsetOf(Number(el.dataset.k), s.i, n)) === 1 ? 0.55 : 0), duration: 0.8, ease: 'power1.out' }, 0.9)
          ScrollTrigger.create({ trigger: stage, start: 'top 80%', once: true, onEnter: () => intro.play() })
          // Leaving: the stage drifts up a little, into the next chapter.
          gsap.to(root.querySelector('[data-rz-drift]'), { y: -40, ease: 'none', scrollTrigger: { trigger: stage, start: 'center 45%', end: 'bottom top', scrub: true } })
          return () => intro.kill()
        })
        return () => {
          stop()
          s.motion = false
          s.revealed = false
          s.fill?.kill()
          s.fill = null
          s.tl?.kill()
          gsap.set(q('[data-rz-laptop], [data-rz-phone]'), { clearProps: 'all' })
          layout()
        }
      })
      // Pointer parallax on the centre composition (desktop fine pointers).
      mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => {
        const stage = root.querySelector<HTMLElement>('[data-rz-stage]')!
        const tilts = () => {
          const c = root.querySelectorAll<HTMLElement>('[data-rz-slide]')[s.i]
          return [c.querySelector<HTMLElement>('[data-rz-tilt="laptop"]'), c.querySelector<HTMLElement>('[data-rz-tilt="phone"]')]
        }
        const move = (e: PointerEvent) => {
          const b = stage.getBoundingClientRect()
          const nx = (e.clientX - b.left) / b.width - 0.5
          const ny = (e.clientY - b.top) / b.height - 0.5
          const [l, p] = tilts()
          gsap.to(l, { x: nx * 10, y: ny * 6, rotationY: nx * 1.6, transformPerspective: 1600, duration: 0.9, ease: 'power3.out', overwrite: 'auto' })
          if (p) gsap.to(p, { x: nx * 26, y: ny * 14, rotationY: nx * 3.5, transformPerspective: 1400, duration: 0.9, ease: 'power3.out', overwrite: 'auto' })
        }
        const leave = () => gsap.to(q('[data-rz-tilt]'), { x: 0, y: 0, rotationY: 0, duration: 0.9, ease: 'power3.out', overwrite: 'auto' })
        stage.addEventListener('pointermove', move)
        stage.addEventListener('pointerleave', leave)
        return () => {
          stage.removeEventListener('pointermove', move)
          stage.removeEventListener('pointerleave', leave)
        }
      })

      return () => {
        mm.revert()
        view.kill()
        mq.removeEventListener('change', onMq)
        document.removeEventListener('visibilitychange', onVis)
        s.fill?.kill()
        s.tl?.kill()
      }
    },
    { scope: ref },
  )

  // Swipe / drag (touch, pen and mouse); vertical scrolling stays native (touch-action: pan-y).
  const onDown = (e: RPointerEvent) => {
    st.current.drag = { x: e.clientX, y: e.clientY, moved: false }
    st.current.dragged = false
  }
  const onUp = (e: RPointerEvent) => {
    const d = st.current.drag
    st.current.drag = null
    if (!d) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      st.current.dragged = true
      step(dx < 0 ? 1 : -1)
    }
  }
  const onSlide = (k: number) => {
    if (st.current.dragged) return
    if (k === st.current.i) {
      const h = items[k].href
      if (!h) return
      if (isExternal(h)) window.open(resolve(h, locale), '_blank', 'noopener,noreferrer')
      else router.push(resolve(h, locale))
    }
    else goTo(k, offsetOf(k, st.current.i, n) > 0 ? 1 : -1)
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      step(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      step(-1)
    }
  }
  const hover = (on: boolean) => (e: RPointerEvent) => {
    if (e.pointerType !== 'mouse') return
    st.current.hover = on
    sync()
  }

  if (n === 0) return null
  const cur = items[active]

  return (
    <section ref={ref} id="realisations" aria-labelledby="rz-title" className="rz">
      <div className="shell rz-head">
        <ChapterLabel n="04" label={r.label} className="rz-label" />
        <SplitTitle id="rz-title" className="t-display mt-6 md:mt-8">
          {r.title[0]}
          <br />
          <span className="text-blue">{r.title[1]}</span>
        </SplitTitle>
      </div>

      <div
        data-rz-carousel
        role="region"
        aria-roledescription="carousel"
        aria-label={r.carousel}
        className="rz-carousel"
        onKeyDown={onKey}
        onFocus={(e) => {
          st.current.keyboard = e.target.matches(':focus-visible')
          sync()
        }}
        onBlur={() => {
          st.current.keyboard = false
          sync()
        }}
      >
        <div data-rz-drift>
          <div
            data-rz-stage
            className="rz-stage"
            onPointerDown={onDown}
            onPointerUp={onUp}
            onPointerCancel={() => (st.current.drag = null)}
            onPointerEnter={hover(true)}
            onPointerLeave={hover(false)}
          >
            {items.map((p, k) => {
              const on = k === active
              return (
                <div
                  key={p.id}
                  data-rz-slide
                  data-k={k}
                  data-active={on ? '' : undefined}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${k + 1} ${r.of} ${n} — ${p.name}`}
                  aria-hidden={!on}
                  className={`rz-slide ${p.phone ? '' : 'no-phone'}`}
                  onClick={() => onSlide(k)}
                >
                  <span data-rz-laptop className="rz-dev rz-laptop">
                    <span data-rz-tilt="laptop" className="block">
                      <Image
                        src={p.laptop!.src}
                        alt=""
                        width={p.laptop!.width}
                        height={p.laptop!.height}
                        sizes="(min-width: 1280px) 760px, (min-width: 768px) 60vw, 82vw"
                        draggable={false}
                        className="rz-laptop-img"
                      />
                    </span>
                  </span>
                  {p.phone && (
                    <span data-rz-phone className="rz-dev rz-phone">
                      <span data-rz-tilt="phone" className="block">
                        <Image
                          src={p.phone.src}
                          alt=""
                          width={p.phone.width}
                          height={p.phone.height}
                          sizes="(min-width: 1280px) 170px, (min-width: 768px) 14vw, 30vw"
                          draggable={false}
                          className="rz-phone-img"
                        />
                      </span>
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Caption of the centred project: category, then the name (the accessible link) */}
        <div className="rz-captions">
          {items.map((p, k) => (
            <div key={p.id} data-rz-caption data-active={k === active ? '' : undefined} className="rz-caption" aria-hidden={k !== active}>
              <p className="rz-cat t-overline">
                {p.category[locale]}
                {p.tag && <span className="text-blue"> · {r.tags[p.tag]}</span>}
              </p>
              <h3 className="rz-name">
                {p.href ? (
                  <Link
                    href={resolve(p.href, locale)}
                    tabIndex={k === active ? 0 : -1}
                    className="rz-name-link"
                    {...(isExternal(p.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <span className="link-draw pb-1">{p.name}</span>
                    <span className="orb-btn rz-go" aria-hidden="true">
                      <svg viewBox="0 0 20 20">
                        <path d="M6 14 14 6M7.5 6H14v6.5" />
                      </svg>
                    </span>
                  </Link>
                ) : (
                  <span className="rz-name-link">{p.name}</span>
                )}
              </h3>
            </div>
          ))}
        </div>

        {n > 1 && (
          <div className="rz-nav">
            <button type="button" className="xs-arrow" aria-label={r.prev} onClick={() => step(-1)}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M16 10H4M9 5l-5 5 5 5" />
              </svg>
            </button>
            <ol className="rz-bars">
              {items.map((p, k) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className="rz-bar"
                    aria-label={`${r.show} ${pad(k + 1)} — ${p.name}`}
                    aria-current={k === active ? 'true' : undefined}
                    onClick={() => goTo(k, offsetOf(k, st.current.i, n) > 0 ? 1 : -1)}
                  >
                    <span className="rz-bar-track">
                      <span data-rz-fill className="rz-bar-fill" />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <span className="rz-count" aria-hidden="true">
              {pad(active + 1)} <span>/ {pad(n)}</span>
            </span>
            <button type="button" className="xs-arrow xs-play" aria-label={playing ? r.pause : r.play} onClick={toggle}>
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
            <button type="button" className="xs-arrow" aria-label={r.next} onClick={() => step(1)}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10h12M11 5l5 5-5 5" />
              </svg>
            </button>
          </div>
        )}
        <p className="sr-only" aria-live={playing ? 'off' : 'polite'}>
          {`${active + 1} ${r.of} ${n} — ${cur.name}`}
        </p>
      </div>

    </section>
  )
}
