'use client'

import { Fragment, useRef } from 'react'
import Image from 'next/image'
import type { Dictionary } from '@/content'
import { Button } from '@/components/ui/Button'
import { gsap, useGSAP, FULL, DESKTOP, whenNear } from '@/lib/gsap'

type V = Dictionary['home']['vision']

/** Radius of the Next Blue sphere that follows fine pointers over the headline (100px). */
const SPHERE_R = 50
const HIDDEN = 'circle(0px at 0px 0px)'

/**
 * Left column. Rendered twice: once for real, once inside the sphere layer in
 * white (inert, hidden from assistive tech). Both share the same layout and the
 * same timeline, so the letters seen through the sphere always line up.
 */
function Copy({ v, href, ghost = false }: { v: V; href: string; ghost?: boolean }) {
  const last = v.lines.length - 1
  const Title = ghost ? 'div' : 'h2'
  return (
    <div data-v-layer className="vision-copy">
      <p className="vision-label t-overline">
        <span data-v-rule className="vision-rule" aria-hidden="true" />
        <span data-v-label>02 / {v.label}</span>
      </p>
      <Title id={ghost ? undefined : 'vision-title'} data-v-title className="vision-title">
        {!ghost && <span className="sr-only">{v.lines.join(' ')}</span>}
        {v.lines.map((line, i) => (
          <span key={line} className={`vision-line ${i === last ? 'vision-climax' : ''}`} aria-hidden="true">
            {line.split(' ').map((word, j) => (
              // The space sits between the masks: inside an inline-block it would be trimmed.
              <Fragment key={j}>
                {j > 0 && ' '}
                <span className="vision-mask">
                  <span data-v-word className="vision-word">
                    {word}
                  </span>
                </span>
              </Fragment>
            ))}
          </span>
        ))}
      </Title>
      <p data-v-text className="vision-text">
        <strong>{v.intro}</strong> {v.text}
      </p>
      <div data-v-cta className="vision-cta">
        <Button href={href}>{v.cta}</Button>
      </div>
    </div>
  )
}

/* Line icons for the impact cards (24px grid, 2px stroke, Next Blue). */
const ICONS = [
  // people
  <svg key="p" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="8.5" cy="7.5" r="3.5" />
    <path d="M2.5 19.5v-.5a6 6 0 0 1 12 0v.5Z" />
    <circle cx="16.5" cy="8.5" r="2.75" />
    <path d="M16.5 14.25a4.75 4.75 0 0 1 5 4.75v.5h-4.5" />
  </svg>,
  // cart
  <svg key="c" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2.5 3.5h2.25l2.4 11h10.6l2-7.5H5.6" />
    <circle cx="9.5" cy="19" r="1.5" />
    <circle cx="16.5" cy="19" r="1.5" />
  </svg>,
  // layers
  <svg key="l" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 3.5 8.5 4.5-8.5 4.5L3.5 8Z" />
    <path d="m3.5 12.25 8.5 4.5 8.5-4.5" />
    <path d="m3.5 16.25 8.5 4.5 8.5-4.5" />
  </svg>,
]

/**
 * Right column: what the statement means for a business, without numbers.
 * A business owner (main visual), the website that works for them (laptop),
 * three impacts — more clients, more sales, better profitability — and a blue
 * growth line that rises through the composition. Positions are percentages of
 * a fixed-ratio box (container units for the cards), so it scales as one piece.
 */
function Visual({ v }: { v: V }) {
  return (
    <div data-v-visual className="vision-visual">
      <div data-par="-1" className="vv-man">
        <div data-v-in>
          <Image
            src="/images/vision/businessman.webp"
            alt=""
            width={960}
            height={1018}
            sizes="(min-width: 1024px) 30vw, 66vw"
            className="vv-shadow h-auto w-full"
          />
        </div>
      </div>
      <div data-par="1" className="vv-laptop">
        <div data-v-in>
          <Image
            src="/images/vision/site-laptop.webp"
            alt=""
            width={900}
            height={626}
            sizes="(min-width: 1024px) 24vw, 52vw"
            className="vv-shadow h-auto w-full"
          />
        </div>
      </div>

      {/* Growth line: drawn from the website up to the owner */}
      <svg className="vv-curve" viewBox="0 0 795 715" aria-hidden="true">
        <defs>
          <linearGradient id="vv-fade" x1="300" y1="445" x2="740" y2="145" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3d7bff" stopOpacity="0" />
            <stop offset="0.35" stopColor="#3d7bff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#0054db" />
          </linearGradient>
          <filter id="vv-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <path data-v-curve className="vv-curve-halo" d="M300 445 C 455 430 625 330 740 145" pathLength={1} filter="url(#vv-soft)" />
        <path data-v-curve className="vv-curve-line" d="M300 445 C 455 430 625 330 740 145" pathLength={1} stroke="url(#vv-fade)" />
        <g data-v-dot className="vv-dot">
          <circle cx="740" cy="145" r="21" className="vv-dot-halo" />
          <circle cx="740" cy="145" r="10.5" className="vv-dot-core" />
        </g>
      </svg>

      <ul className="vv-cards" aria-label={v.impactsLabel}>
        {v.impacts.map((label, i) => (
          <li key={label} data-v-card className={`vv-card vv-card-${i + 1}`}>
            {ICONS[i]}
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Rotated ellipse as a clip-path, so the sphere can stretch along its velocity. */
const ellipse = (x: number, y: number, rx: number, ry: number, a: number) => {
  const dx = Math.cos(a) * rx
  const dy = Math.sin(a) * rx
  const deg = (a * 180) / Math.PI
  const f = (n: number) => n.toFixed(1)
  return `path("M ${f(x + dx)} ${f(y + dy)} A ${f(rx)} ${f(ry)} ${f(deg)} 1 0 ${f(x - dx)} ${f(y - dy)} A ${f(rx)} ${f(ry)} ${f(deg)} 1 0 ${f(x + dx)} ${f(y + dy)} Z")`
}

/**
 * Section 02 — « Notre vision ». Two columns: the statement on the left, what it
 * means for a business on the right. Normal scroll, no pin, calm motion:
 * - headline read word by word with the scroll (opacity + light blur + a few
 *   pixels up); the paragraph and the CTA follow;
 * - the visual settles in once: owner, then laptop, the growth line draws,
 *   its end point lights, the three impacts fade up; then a light parallax
 *   (laptop and owner drift a few percent in opposite directions);
 * - fine pointers: a 100px Next Blue sphere over the headline turns letters white;
 * - as the section leaves, Cloud clears to the white of chapter 03.
 * Reduced motion: everything in place, no sphere.
 */
export function Vision({ v, workHref }: { v: V; workHref: string }) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // ── Scroll motion ──
      mm.add({ full: FULL, desktop: DESKTOP }, (c) =>
        whenNear(ref.current!, () => {
          const root = ref.current!
          const blur = c.conditions?.desktop ? 6 : 3
          const [layer, ghost] = Array.from(root.querySelectorAll<HTMLElement>('[data-v-layer]'))
          const words = Array.from(layer.querySelectorAll<HTMLElement>('[data-v-word]'))
          const twins = Array.from(ghost.querySelectorAll<HTMLElement>('[data-v-word]'))
          const both = (sel: string) => root.querySelectorAll(sel)

          // Label hairline draws as the section arrives.
          gsap
            .timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: layer, start: 'top 92%', end: 'top 62%', scrub: 0.6 } })
            .fromTo(both('[data-v-rule]'), { scaleX: 0 }, { scaleX: 1, transformOrigin: '0% 50%', duration: 1 }, 0)
            .fromTo(both('[data-v-label]'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.3)

          // Headline: word after word, overlapping so the read feels continuous.
          const read = gsap.timeline({
            defaults: { ease: 'power2.out' },
            scrollTrigger: { trigger: layer.querySelector('[data-v-title]'), start: 'top 86%', end: 'bottom 52%', scrub: 0.8 },
          })
          words.forEach((word, i) => {
            read.fromTo(
              [word, twins[i]],
              { opacity: 0.12, yPercent: 22, filter: `blur(${blur}px)` },
              { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 1 },
              i * 0.3,
            )
          })

          // Paragraph, then CTA.
          const follow = (sel: string, start: string, end: string) =>
            gsap.fromTo(
              both(sel),
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, ease: 'none', scrollTrigger: { trigger: layer.querySelector(sel), start, end, scrub: 0.6 } },
            )
          follow('[data-v-text]', 'top 92%', 'top 72%')
          follow('[data-v-cta]', 'top 95%', 'top 80%')

          // Visual: settles in once.
          const visual = root.querySelector<HTMLElement>('[data-v-visual]')!
          const curves = visual.querySelectorAll('[data-v-curve]')
          gsap
            .timeline({ defaults: { ease: 'ascent' }, scrollTrigger: { trigger: visual, start: 'top 70%', once: true } })
            .from(visual.querySelectorAll('[data-v-in]'), { opacity: 0, y: 36, duration: 1.1, stagger: 0.16 }, 0)
            .fromTo(curves, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.45)
            .from(visual.querySelector('[data-v-dot]'), { scale: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(2)' }, 1.7)
            .from(visual.querySelectorAll('[data-v-card]'), { opacity: 0, y: 16, duration: 0.8, stagger: 0.14 }, 0.75)

          // Light parallax: owner and laptop drift a few percent in opposite directions.
          visual.querySelectorAll<HTMLElement>('[data-par]').forEach((el) => {
            const dir = Number(el.dataset.par)
            gsap.fromTo(
              el,
              { yPercent: -3 * dir },
              { yPercent: 3 * dir, ease: 'none', scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: true } },
            )
          })

          // Exit: Cloud clears to white, the background of the next chapter.
          gsap.fromTo(
            root,
            { backgroundColor: '#f4f6f9' },
            { backgroundColor: '#ffffff', ease: 'none', scrollTrigger: { trigger: root, start: 'bottom bottom', end: 'bottom 45%', scrub: true } },
          )
        }),
      )

      // ── Next Blue sphere (fine pointer) ──
      mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const root = ref.current!
        const stage = root.querySelector<HTMLElement>('[data-stage]')!
        const invert = root.querySelector<HTMLElement>('[data-invert]')!
        const title = root.querySelector<HTMLElement>('[data-v-layer] [data-v-title]')!

        const draw = (x: number, y: number, r: number, k = 0, a = 0) => {
          invert.style.clipPath = r < 0.5 ? HIDDEN : ellipse(x, y, r * (1 + k), r * (1 - k * 0.6), a)
        }

        const s = { x: 0, y: 0, vx: 0, vy: 0, r: 0, vr: 0, tx: 0, ty: 0, tr: 0 }
        let raf = 0
        let last = 0
        const tick = (now: number) => {
          const dt = Math.min(0.032, (now - last) / 1000 || 0.016)
          last = now
          // Position: underdamped spring → inertia with a soft settle.
          s.vx += ((s.tx - s.x) * 180 - s.vx * 20) * dt
          s.vy += ((s.ty - s.y) * 180 - s.vy * 20) * dt
          s.x += s.vx * dt
          s.y += s.vy * dt
          // Radius: springy in, crisp out.
          s.vr += ((s.tr - s.r) * 260 - s.vr * (s.tr ? 20 : 30)) * dt
          s.r = Math.max(0, s.r + s.vr * dt)
          const speed = Math.hypot(s.vx, s.vy)
          draw(s.x, s.y, s.r, Math.min(0.16, speed / 5200), Math.atan2(s.vy, s.vx))
          const resting =
            speed < 2 && Math.abs(s.tr - s.r) < 0.3 && Math.abs(s.vr) < 2 && Math.hypot(s.tx - s.x, s.ty - s.y) < 0.3
          raf = resting ? 0 : requestAnimationFrame(tick)
        }
        const wake = () => {
          if (raf) return
          last = performance.now()
          raf = requestAnimationFrame(tick)
        }
        const aim = (e: PointerEvent) => {
          const b = stage.getBoundingClientRect()
          s.tx = e.clientX - b.left
          s.ty = e.clientY - b.top
        }
        const enter = (e: PointerEvent) => {
          aim(e)
          if (s.r < 1) {
            s.x = s.tx
            s.y = s.ty
            s.vx = s.vy = 0
          }
          s.tr = SPHERE_R
          wake()
        }
        const move = (e: PointerEvent) => {
          aim(e)
          s.tr = SPHERE_R
          wake()
        }
        const leave = () => {
          s.tr = 0
          wake()
        }
        title.addEventListener('pointerenter', enter)
        title.addEventListener('pointermove', move)
        title.addEventListener('pointerleave', leave)

        return () => {
          if (raf) cancelAnimationFrame(raf)
          title.removeEventListener('pointerenter', enter)
          title.removeEventListener('pointermove', move)
          title.removeEventListener('pointerleave', leave)
          invert.style.clipPath = HIDDEN
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} aria-labelledby="vision-title" className="vision">
      <div className="vision-grid shell">
        <div data-stage className="vision-stage">
          <Copy v={v} href={workHref} />
          {/* The same copy in white on Next Blue, seen only through the sphere */}
          <div data-invert aria-hidden="true" inert className="vision-invert" style={{ clipPath: HIDDEN }}>
            <Copy v={v} href={workHref} ghost />
          </div>
        </div>
        <Visual v={v} />
      </div>
    </section>
  )
}
