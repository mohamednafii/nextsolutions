'use client'

import { gsap } from '@/lib/gsap'

/**
 * Choreographies of the four « Notre approche » demonstrations.
 * Each builder returns a paused timeline cut into stages: label `s{k}` where
 * stage k starts, `h{k}` where its result is complete (then a short hold).
 * The controller plays it once when visible, replays it, or jumps to a stage
 * (tweenFromTo s{k} → h{k}; reduced motion: seek h{k}).
 * Initial states are `set` at 0 and every move is a `to`, so seeking in any
 * direction is exact. The CSS default of each element is the final state.
 */
export type Story = (root: HTMLElement) => gsap.core.Timeline

const one = (root: HTMLElement, sel: string) => root.querySelector<HTMLElement>(sel)
const all = (root: HTMLElement, sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel))

/** Adds the stages one after the other, with their labels. */
function seq(tl: gsap.core.Timeline, stages: ((t: number) => number)[], hold = 1.3) {
  let t = 0.15
  stages.forEach((stage, k) => {
    tl.addLabel(`s${k}`, t)
    t += stage(t)
    tl.addLabel(`h${k}`, t)
    t += hold
  })
  return tl
}

/* 01 — brief → wireframe → designed site → working site → mobile */
const web: Story = (root) => {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut', duration: 0.8 } })
  const browser = one(root, '[data-w-browser]')
  const brief = one(root, '[data-w-brief]')
  const rows = all(root, '[data-w-row]')
  const wire = one(root, '[data-w-wire]')
  const paths = all(root, '[data-w-wire] path')
  const site = one(root, '[data-w-site]')
  const scroll = one(root, '[data-w-scroll]')
  const hs = all(root, '[data-w-h]')
  const cards = all(root, '[data-w-card]')
  const cursor = one(root, '[data-w-cursor]')
  const cta = one(root, '[data-w-cta]')
  const load = one(root, '[data-w-load]')
  const phone = one(root, '[data-w-phone]')
  const mcopy = one(root, '[data-w-m]')

  tl.set(browser, { x: 0, y: 0, xPercent: 0, yPercent: 0, scale: 1, transformOrigin: '0% 0%' }, 0)
    .set(brief, { autoAlpha: 0, y: 16, scale: 1 }, 0)
    .set(rows, { autoAlpha: 0, y: 8 }, 0)
    .set(wire, { autoAlpha: 1 }, 0)
    .set(paths, { strokeDashoffset: 1 }, 0)
    .set(site, { clipPath: 'inset(0% 100% 0% 0%)' }, 0)
    .set(scroll, { y: 0, yPercent: 0 }, 0)
    .set(cursor, { autoAlpha: 0, xPercent: 900, yPercent: 520 }, 0)
    .set(load, { scaleX: 0, autoAlpha: 1 }, 0)
    .set(phone, { autoAlpha: 0, xPercent: 26 }, 0)
    .set(mcopy, { autoAlpha: 0, y: 12 }, 0)

  return seq(tl, [
    // 01 Comprendre — the brief, line by line
    (t) => {
      tl.to(brief, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, t).to(rows, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.24, ease: 'power2.out' }, t + 0.35)
      return 1.6
    },
    // 02 Structurer — the brief becomes a wireframe
    (t) => {
      tl.to(brief, { autoAlpha: 0, scale: 0.97, duration: 0.45, ease: 'power2.in' }, t).to(paths, { strokeDashoffset: 0, duration: 0.9, stagger: 0.1, ease: 'power2.inOut' }, t + 0.25)
      return 1.75
    },
    // 03 Concevoir — the design is laid over the structure
    (t) => {
      tl.to(site, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1 }, t)
        .to(wire, { autoAlpha: 0, duration: 0.4, ease: 'none' }, t + 0.9)
        .set(hs, { yPercent: 60, autoAlpha: 0 }, t)
        .to(hs, { yPercent: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, t + 0.55)
      return 1.6
    },
    // 04 Développer — it loads, it reacts, it scrolls
    (t) => {
      tl.to(load, { scaleX: 1, duration: 0.8, ease: 'power2.out' }, t)
        .to(load, { autoAlpha: 0, duration: 0.25, ease: 'none' }, t + 0.8)
        .to(cursor, { autoAlpha: 1, duration: 0.2, ease: 'none' }, t + 0.3)
        .to(cursor, { xPercent: 0, yPercent: 0, duration: 0.8, ease: 'power2.inOut' }, t + 0.3)
        .to(cta, { backgroundColor: '#c8a46a', duration: 0.25, ease: 'none' }, t + 1.05)
        .to(cta, { scale: 0.96, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' }, t + 1.3)
        .to(cursor, { autoAlpha: 0, duration: 0.2, ease: 'none' }, t + 1.7)
        .to(scroll, { yPercent: -16, duration: 0.9 }, t + 1.75)
        .to(cards, { y: -4, duration: 0.3, stagger: 0.1, yoyo: true, repeat: 1, ease: 'power1.inOut' }, t + 2.2)
      return 3
    },
    // 05 Adapter au mobile — the browser steps back, the phone comes in
    (t) => {
      tl.to(scroll, { yPercent: 0, duration: 0.7 }, t)
        .to(cta, { backgroundColor: '#f4efe6', duration: 0.3, ease: 'none' }, t)
        .to(browser, { scale: 0.76, yPercent: 6, duration: 1.05 }, t + 0.2)
        .to(phone, { autoAlpha: 1, xPercent: 0, duration: 1, ease: 'power3.out' }, t + 0.55)
        .to(mcopy, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, t + 1.05)
      return 1.7
    },
  ])
}

/* 02 — search → result → site → request */
const seo: Story = (root) => {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut', duration: 0.8 } })
  const chars = all(root, '[data-s-char]')
  const results = all(root, '[data-s-result]')
  const hl = one(root, '[data-s-hl]')
  const title = one(root, '[data-s-title]')
  const site = one(root, '[data-s-site]')
  const scroll = one(root, '[data-s-scroll]')
  const link = one(root, '[data-s-link]')
  const values = all(root, '[data-s-value]')
  const submit = one(root, '[data-s-submit]')
  const label = one(root, '[data-s-submit-label]')
  const sent = one(root, '[data-s-sent]')
  const toast = one(root, '[data-s-toast]')
  const urlSearch = one(root, '[data-s-url-search]')
  const urlSite = one(root, '[data-s-url-site]')
  const cur1 = one(root, '[data-s-cur1]')
  const cur2 = one(root, '[data-s-cur2]')
  const cur3 = one(root, '[data-s-cur3]')

  tl.set(chars, { autoAlpha: 0 }, 0)
    .set(results, { autoAlpha: 0, y: 12 }, 0)
    .set(hl, { autoAlpha: 0 }, 0)
    .set(site, { clipPath: 'inset(100% 0% 0% 0%)' }, 0)
    .set(scroll, { y: 0, yPercent: 0 }, 0)
    .set(link, { color: 'rgba(244,239,230,0.75)' }, 0)
    .set(values, { autoAlpha: 0 }, 0)
    .set(label, { autoAlpha: 1 }, 0)
    .set(sent, { autoAlpha: 0, scale: 0.5 }, 0)
    .set(toast, { autoAlpha: 0, y: 24 }, 0)
    .set(urlSearch, { autoAlpha: 1 }, 0)
    .set(urlSite, { autoAlpha: 0 }, 0)
    .set([cur1, cur2, cur3], { autoAlpha: 0, xPercent: 700, yPercent: 480 }, 0)

  return seq(tl, [
    // Recherche — the query is typed
    (t) => {
      tl.to(chars, { autoAlpha: 1, duration: 0.01, stagger: 0.065, ease: 'none' }, t + 0.2)
      return 0.2 + chars.length * 0.065 + 0.3
    },
    // Résultat — the results, ours among them, is chosen
    (t) => {
      tl.to(results, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.14, ease: 'power3.out' }, t)
        .to(hl, { autoAlpha: 1, duration: 0.4, ease: 'none' }, t + 0.7)
        .to(cur1, { autoAlpha: 1, duration: 0.2, ease: 'none' }, t + 0.6)
        .to(cur1, { xPercent: 0, yPercent: 0, duration: 0.8, ease: 'power2.inOut' }, t + 0.6)
        .to(title, { scale: 0.98, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut', transformOrigin: '0% 50%' }, t + 1.45)
      return 1.8
    },
    // Visite — the site opens, the visitor follows an internal link to the request form
    (t) => {
      tl.to(cur1, { autoAlpha: 0, duration: 0.2, ease: 'none' }, t)
        .to(site, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, t)
        .to(urlSearch, { autoAlpha: 0, duration: 0.3, ease: 'none' }, t + 0.3)
        .to(urlSite, { autoAlpha: 1, duration: 0.3, ease: 'none' }, t + 0.45)
        .to(cur2, { autoAlpha: 1, duration: 0.2, ease: 'none' }, t + 1)
        .to(cur2, { xPercent: 0, yPercent: 0, duration: 0.75, ease: 'power2.inOut' }, t + 1)
        .to(link, { color: '#c8a46a', duration: 0.2, ease: 'none' }, t + 1.7)
        .to(cur2, { autoAlpha: 0, duration: 0.2, ease: 'none' }, t + 2)
        .to(scroll, { yPercent: -22, duration: 0.9 }, t + 2)
      return 2.9
    },
    // Demande — the form is filled and sent; the business receives it
    (t) => {
      tl.to(values, { autoAlpha: 1, duration: 0.3, stagger: 0.35, ease: 'none' }, t)
        .to(cur3, { autoAlpha: 1, duration: 0.2, ease: 'none' }, t + 0.8)
        .to(cur3, { xPercent: 0, yPercent: 0, duration: 0.7, ease: 'power2.inOut' }, t + 0.8)
        .to(submit, { scale: 0.96, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' }, t + 1.55)
        .to(label, { autoAlpha: 0, duration: 0.2, ease: 'none' }, t + 1.75)
        .to(sent, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, t + 1.8)
        .to(cur3, { autoAlpha: 0, duration: 0.2, ease: 'none' }, t + 1.9)
        .to(toast, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, t + 2.15)
      return 2.9
    },
  ])
}

/* 03 — the order runs through every step on its own */
const flow: Story = (root) => {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.35 } })
  const nodes = all(root, '[data-f-node]')
  const done = one(root, '[data-f-done]')
  const st = (n: HTMLElement, s: string) => n.querySelector<HTMLElement>(`[data-f-st="${s}"]`)

  nodes.forEach((n) => {
    tl.set(n, { opacity: 0.42 }, 0)
      .set(st(n, 'wait'), { autoAlpha: 1 }, 0)
      .set([st(n, 'run'), st(n, 'done')], { autoAlpha: 0 }, 0)
      .set(n.querySelector('[data-f-ic]'), { backgroundColor: '#ffffff', borderColor: '#e3e7ed', color: '#8a93a0' }, 0)
    const fill = n.querySelectorAll('[data-f-fill]')
    const out = n.querySelectorAll('[data-f-out]')
    if (fill.length) tl.set(fill, { height: '0%' }, 0)
    if (out.length) tl.set(out, { autoAlpha: 0, y: 8 }, 0)
  })
  tl.set(done, { autoAlpha: 0, y: 10 }, 0)

  const step = (n: HTMLElement) => (t: number) => {
    const ic = n.querySelector('[data-f-ic]')
    const out = n.querySelectorAll('[data-f-out]')
    const fill = n.querySelectorAll('[data-f-fill]')
    tl.to(n, { opacity: 1, duration: 0.3 }, t)
      .to(st(n, 'wait'), { autoAlpha: 0, duration: 0.15 }, t)
      .to(st(n, 'run'), { autoAlpha: 1, duration: 0.15 }, t + 0.1)
      .to(ic, { borderColor: '#0054db', color: '#0054db', duration: 0.25 }, t)
      .to(st(n, 'run'), { autoAlpha: 0, duration: 0.15 }, t + 0.75)
      .to(st(n, 'done'), { autoAlpha: 1, duration: 0.2 }, t + 0.8)
      .to(ic, { backgroundColor: '#0054db', color: '#ffffff', duration: 0.25 }, t + 0.8)
    let d = 1
    if (out.length) {
      tl.to(out, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' }, t + 0.9)
      d = 1.4
    }
    if (fill.length) tl.to(fill, { height: '100%', duration: 0.45, ease: 'power1.inOut' }, t + d)
    return d + (fill.length ? 0.45 : 0)
  }

  return seq(
    tl,
    [
      ...nodes.map(step),
      (t) => {
        tl.to(done, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, t)
        return 0.6
      },
    ],
    0.15,
  )
}

/* 04 — product → architecture → new module → security → delivered */
const saas: Story = (root) => {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut', duration: 0.8 } })
  const app = one(root, '[data-x-app]')
  const rows = all(root, '[data-x-row]')
  const added = one(root, '[data-x-added]')
  const invoice = one(root, '[data-x-invoice]')
  const arch = one(root, '[data-x-arch]')
  const layers = all(root, '[data-x-layer]')
  const chip = one(root, '[data-x-chip]')
  const sec = one(root, '[data-x-sec]')
  const line = one(root, '[data-x-sec-line]')
  const tags = all(root, '[data-x-sec-tag]')

  tl.set(app, { autoAlpha: 0, y: 24, scale: 1 }, 0)
    .set(rows, { autoAlpha: 0, y: 8 }, 0)
    .set(added, { autoAlpha: 0, x: -8 }, 0)
    .set(invoice, { autoAlpha: 0, y: 10 }, 0)
    .set(arch, { autoAlpha: 0 }, 0)
    .set(layers, { autoAlpha: 0, y: 18 }, 0)
    .set(chip, { autoAlpha: 0, x: 36 }, 0)
    .set(sec, { autoAlpha: 0 }, 0)
    .set(line, { clipPath: 'inset(0% 100% 0% 0% round 12px)' }, 0)
    .set(tags, { autoAlpha: 0, x: -6 }, 0)

  return seq(
    tl,
    [
      // Produit
      (t) => {
        tl.to(app, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, t).to(rows, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.1, ease: 'power2.out' }, t + 0.4)
        return 1.3
      },
      // Architecture — the layers behind the interface
      (t) => {
        tl.to(app, { autoAlpha: 0.1, scale: 0.95, duration: 0.7 }, t)
          .to(arch, { autoAlpha: 1, duration: 0.3, ease: 'none' }, t + 0.25)
          .to(layers, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.14, ease: 'power3.out' }, t + 0.3)
        return 1.5
      },
      // Nouveau module — plugged into the modules layer, nothing else moves
      (t) => {
        tl.to(chip, { autoAlpha: 1, x: 0, duration: 0.75, ease: 'back.out(1.4)' }, t)
        return 1
      },
      // Sécurité — around the API and the modules
      (t) => {
        tl.to(sec, { autoAlpha: 1, duration: 0.2, ease: 'none' }, t)
          .to(line, { clipPath: 'inset(0% 0% 0% 0% round 12px)', duration: 0.9, ease: 'power2.inOut' }, t)
          .to(tags, { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.12, ease: 'power2.out' }, t + 0.5)
        return 1.5
      },
      // Livré — back to the product, with its new module
      (t) => {
        tl.to(arch, { autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, t)
          .to(app, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, t + 0.35)
          .to(added, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power3.out' }, t + 0.8)
          .to(invoice, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' }, t + 1)
        return 1.6
      },
    ],
    1.5,
  )
}

export const STORIES = { web, seo, flow, saas }
export const STAGE_COUNT = { web: 5, seo: 4, flow: 7, saas: 5 }
