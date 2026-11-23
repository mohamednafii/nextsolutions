'use client'

import Link from 'next/link'
import { useRef } from 'react'
import type { Dictionary } from '@/content'
import { gsap, useGSAP, FULL, whenNear } from '@/lib/gsap'
import { Arrow } from '@/components/brand/Logo'
import { ChapterLabel } from '@/components/ui/ChapterLabel'

type F = Dictionary['home']['finale']

/**
 * Section 07 — « On a parlé de nous. Parlons de vous. » The final statement:
 * the conversation turns from us to the visitor. One headline at full voice,
 * one sentence, one call to action. The footer continues on the same Ink.
 *
 * Entrance: the Ink panel rises out of the light founders section slightly
 * inset, top corners rounded, and opens to full bleed as it arrives
 * (scrubbed, no pin). Then, once: the label, then each sentence rises out of its mask (the blue one a beat later),
 * the sentence and the call to action follow, and the blue circle — the
 * Notre Vision sphere, small now — opens beside the label of the button.
 *
 * « The blue response » (fine pointers): the circle leans a few pixels toward
 * an approaching pointer, the button follows the pointer by at most 5px; on
 * hover / keyboard focus the circle grows to fill the button and the arrow
 * steps up and to the right. Touch: the same fill on press. All of it returns
 * to rest on exit. Reduced motion: static, the fill is instant.
 */
export function Finale({ f, startHref }: { f: F; startHref: string }) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL, () =>
        whenNear(ref.current!, () => {
          const root = ref.current!
          // The Ink panel arrives inset with rounded top corners and opens to full bleed (scrubbed, no pin).
          gsap.fromTo(root.querySelector('[data-fs-bg]'), { clipPath: 'inset(0% 3% 0% 3% round 28px 28px 0px 0px)' }, {
            clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)',
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'top 35%', scrub: true },
          })
          const tl = gsap.timeline({ scrollTrigger: { trigger: root.querySelector('.fs-title'), start: 'top 82%', once: true } })
          tl.from('[data-fs-label]', { y: 12, autoAlpha: 0, duration: 0.7, ease: 'ascent' })
            .from('[data-fs-line]', { yPercent: 104, duration: 1.05, ease: 'ascent', stagger: 0.18 }, 0.1)
            .from('[data-fs-rise]', { y: 18, autoAlpha: 0, duration: 0.8, ease: 'ascent', stagger: 0.1 }, 0.75)
            .from('[data-fs-orb]', { scale: 0, duration: 0.9, ease: 'ascent' }, 1.05)
        }),
      )
      mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const root = ref.current!
        const cta = root.querySelector<HTMLElement>('[data-fs-cta]')!
        const orb = root.querySelector<HTMLElement>('[data-fs-orb]')!
        const q = (el: HTMLElement, p: 'x' | 'y') => gsap.quickTo(el, p, { duration: 0.7, ease: 'power3.out' })
        const [bx, by, ox, oy] = [q(cta, 'x'), q(cta, 'y'), q(orb, 'x'), q(orb, 'y')]
        const clamp = gsap.utils.clamp(-5, 5)
        const rest = () => {
          bx(0)
          by(0)
          ox(0)
          oy(0)
        }
        const move = (e: PointerEvent) => {
          // The circle: leans toward a pointer within 240px, up to 4px.
          const o = orb.getBoundingClientRect()
          const dx = e.clientX - (o.left + o.width / 2)
          const dy = e.clientY - (o.top + o.height / 2)
          const d = Math.hypot(dx, dy) || 1
          const k = Math.max(0, 1 - d / 240) * 4
          ox((dx / d) * k)
          oy((dy / d) * k)
          // The button: a light magnetic pull (max 5px) when the pointer is on or right next to it.
          const r = cta.getBoundingClientRect()
          const near = e.clientX > r.left - 32 && e.clientX < r.right + 32 && e.clientY > r.top - 32 && e.clientY < r.bottom + 32
          bx(near ? clamp((e.clientX - (r.left + r.width / 2)) * 0.05) : 0)
          by(near ? clamp((e.clientY - (r.top + r.height / 2)) * 0.12) : 0)
        }
        root.addEventListener('pointermove', move)
        root.addEventListener('pointerleave', rest)
        return () => {
          root.removeEventListener('pointermove', move)
          root.removeEventListener('pointerleave', rest)
          gsap.set([cta, orb], { x: 0, y: 0 })
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="contact" aria-labelledby="fs-title" data-header-dark className="fs on-ink">
      <div data-fs-bg className="fs-bg" aria-hidden="true" />
      <div className="shell fs-inner">
        <div data-fs-label>
          <ChapterLabel n="07" label={f.label} />
        </div>

        <div className="fs-statement">
          <h2 id="fs-title" className="fs-title">
            {f.title.map(([a, b], i) => (
              <span key={a} className={`fs-line ${i === 1 ? 'fs-line-2' : ''}`}>
                <span data-fs-line className="fs-line-in">
                  {a} <br className="fs-br" />
                  {b}
                </span>
              </span>
            ))}
          </h2>

          <div className="fs-foot">
            <p data-fs-rise className="fs-lead">
              {f.lead}
            </p>
            <div data-fs-rise className="fs-cta-wrap">
              <Link href={startHref} data-fs-cta className="fs-cta">
                <span className="fs-cta-label">{f.primary}</span>
                <span data-fs-orb className="fs-orb" aria-hidden="true">
                  <span className="fs-orb-disc" />
                  <span className="fs-orb-arrow">
                    <Arrow tone="white" className="h-full w-full" />
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
