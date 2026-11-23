'use client'

import { gsap } from '@/lib/gsap'

/**
 * Per-slide choreography, played once a slide has arrived. Each builder only
 * uses fromTo / to toward the CSS default, so a killed or skipped intro always
 * leaves the finished composition. Returned paused: the carousel decides when.
 */
type Intro = (slide: HTMLElement) => gsap.core.Timeline

const all = (root: HTMLElement, sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel))
const one = (root: HTMLElement, sel: string) => root.querySelector<HTMLElement>(sel)

/** 01 — the site settles, then scrolls just enough to show its next section. */
const web: Intro = (slide) => {
  const tl = gsap.timeline({ paused: true })
  const screen = one(slide, '.xw-screen')
  const house = one(slide, '[data-xw-house]')
  tl.fromTo(one(slide, '[data-xw-device]'), { scale: 0.965 }, { scale: 1, duration: 1.2 }, 0)
    .fromTo(all(slide, '[data-xw-hero] > *'), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.09 }, 0.2)
    .fromTo(
      one(slide, '[data-xw-site]'),
      { y: 0 },
      {
        // About two thirds of the next section, never more than a fifth of the screen.
        y: () => -Math.round(Math.min((house?.offsetHeight ?? 0) * 0.7, (screen?.clientHeight ?? 0) * 0.22)),
        duration: 1.6,
        ease: 'power2.inOut',
      },
      1.35,
    )
  return tl
}

/** 02 — order in, line, the automation runs, both actions follow. */
const flow: Intro = (slide) => {
  const tl = gsap.timeline({ paused: true })
  const lineIn = all(slide, '[data-xf-line="in"]')
  const lineOut = all(slide, '[data-xf-line="out"]')
  const engine = one(slide, '[data-xf-node="engine"]')
  tl.fromTo(one(slide, '[data-xf-node="order"]'), { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, 0.1)
    .fromTo(all(slide, '[data-xf-port="in"]'), { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.35 }, 0.45)
    .fromTo(lineIn, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.45, ease: 'power1.inOut' }, 0.5)
    .fromTo(engine, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.5 }, 0.8)
    .fromTo(engine, { borderColor: '#e3e7ed' }, { borderColor: '#0054db', duration: 0.3, ease: 'none' }, 0.95)
    .fromTo(one(slide, '[data-xf-bolt]'), { backgroundColor: '#edf3fe', color: '#0054db' }, { backgroundColor: '#0054db', color: '#ffffff', duration: 0.3, ease: 'none' }, 0.95)
    .fromTo(one(slide, '[data-xf-running]'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.95)
    .to(one(slide, '[data-xf-running]'), { opacity: 0, duration: 0.2 }, 1.55)
    .fromTo(one(slide, '[data-xf-done]'), { opacity: 0 }, { opacity: 1, duration: 0.25 }, 1.6)
    .fromTo(all(slide, '[data-xf-port="out"]'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 1.1)
    .fromTo(lineOut, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: 'power1.inOut' }, 1.15)
    .fromTo(all(slide, '[data-xf-node="out"]'), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.14 }, 1.5)
    .fromTo(all(slide, '[data-xf-detail]'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.14 }, 1.8)
    .fromTo(all(slide, '[data-xf-row]'), { backgroundColor: 'rgba(31,170,89,0)' }, { backgroundColor: 'rgba(31,170,89,0.1)', duration: 0.4, ease: 'none' }, 2.1)
    .fromTo(all(slide, '[data-xf-ok]'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)', stagger: 0.12 }, 2.05)
  return tl
}

/** 03 — the dashboard is revealed, the code behind it, a module snaps in, access is protected. */
const saas: Intro = (slide) => {
  const tl = gsap.timeline({ paused: true })
  tl.fromTo(
    one(slide, '[data-xd-dash]'),
    { clipPath: 'inset(-12% -12% 100% -12% round 16px)' },
    { clipPath: 'inset(-12% -12% -12% -12% round 16px)', duration: 0.95, ease: 'power3.inOut', clearProps: 'clipPath' },
    0.05,
  )
    .fromTo(one(slide, '[data-xd-code]'), { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 0.55)
    .fromTo(
      one(slide, '[data-xd-chip]'),
      { x: 26, y: -40, rotation: 2.5, opacity: 0 },
      { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.75, ease: 'back.out(1.3)' },
      1.1,
    )
    .fromTo(one(slide, '[data-xd-log]'), { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.45 }, 1.65)
    .fromTo(one(slide, '[data-xd-secure]'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, 1.85)
    .fromTo(one(slide, '[data-xd-ok]'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' }, 2.2)
  return tl
}

export const INTROS: Record<string, Intro> = { web, flow, saas }

/** Every element an intro touches, so a motion-preference change can reset them. */
export const INTRO_TARGETS =
  '[data-xw-device],[data-xw-hero]>*,[data-xw-site],[data-xf-line],[data-xf-port],[data-xf-node],[data-xf-bolt],[data-xf-running],[data-xf-done],[data-xf-detail],[data-xf-row],[data-xf-ok],[data-xd-dash],[data-xd-code],[data-xd-chip],[data-xd-log],[data-xd-secure],[data-xd-ok]'
