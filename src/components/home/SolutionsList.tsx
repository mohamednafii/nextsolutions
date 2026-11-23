'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, type ReactNode, type PointerEvent as RPointerEvent } from 'react'
import type { Dictionary, ServiceKey } from '@/content'
import { serviceRoute } from '@/content'
import { href, type Locale } from '@/lib/i18n'
import { gsap, useGSAP, FULL, whenNear } from '@/lib/gsap'
import { Button } from '@/components/ui/Button'
import { ChapterLabel } from '@/components/ui/ChapterLabel'
import { SplitTitle } from '@/components/motion/SplitTitle'
import { DemoPlayer } from '@/components/demos/DemoPlayer'
import { ServiceDemo } from '@/components/demos/ServiceDemos'

type S = Dictionary['home']['solutions']

/** Where each offer leads (existing service pages). */
const ROUTE: ServiceKey[] = ['ecommerce', 'ecommerce', 'ecommerce', 'automation', 'marketing']

/** Diagonal arrow in a round control (same family as the carousel arrows). */
function Go() {
  return (
    <span className="orb-btn" aria-hidden="true">
      <svg viewBox="0 0 20 20">
        <path d="M6 14 14 6M7.5 6H14v6.5" />
      </svg>
    </span>
  )
}

/**
 * Section 08 — « Des expériences construites autour de vos ambitions. »
 * One list, five offers, deliberately unequal: website creation leads (a Cloud
 * panel with its preview in a floating frame), then e-commerce and digital
 * experiences as rows; AI and visibility close the list "en complément" as two
 * cards. Motion: hairlines draw left to right and names rise into place.
 * Fine pointers: a contextual preview follows the cursor over offers 02–05.
 */
export function SolutionsList({ s, locale, startHref }: { s: S; locale: Locale; startHref: string }) {
  const ref = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  // Previews are only mounted once their offer has been hovered (nothing to hydrate at load).
  const [seen, setSeen] = useState<number[]>([])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL, () =>
        whenNear(ref.current!, () => {
        const root = ref.current!
        gsap.utils.toArray<HTMLElement>('[data-sol-row]', root).forEach((row) => {
          const st = { trigger: row, start: 'top 88%', once: true }
          const line = row.querySelector('[data-sol-line]')
          if (line) gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'ascent', transformOrigin: '0% 50%', scrollTrigger: st })
          gsap.from(row.querySelectorAll('[data-sol-rise]'), { y: 24, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'ascent', scrollTrigger: st })
        })
        }),
      )
      mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const el = preview.current!
        const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' })
        const move = (e: PointerEvent) => {
          xTo(e.clientX + 28)
          yTo(e.clientY - 110)
        }
        window.addEventListener('pointermove', move, { passive: true })
        return () => window.removeEventListener('pointermove', move)
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  const it = s.items
  const num = (i: number) => String(i + 1).padStart(2, '0')
  const link = (i: number) => href(serviceRoute[ROUTE[i]], locale)
  const previews: (ReactNode | null)[] = [
    null,
    <DemoPlayer key="e" className="h-full w-full"><ServiceDemo service="ecommerce" locale={locale} /></DemoPlayer>,
    <Image key="x" src="/images/work/site-next-solutions/sphere.webp" alt="" width={1600} height={1000} sizes="320px" className="h-full w-full object-cover" />,
    <DemoPlayer key="a" className="h-full w-full"><ServiceDemo service="automation" locale={locale} /></DemoPlayer>,
    <DemoPlayer key="m" className="h-full w-full"><ServiceDemo service="marketing" locale={locale} /></DemoPlayer>,
  ]
  const hoverable = (i: number) => ({
    onPointerEnter: (e: RPointerEvent) => {
      if (e.pointerType !== 'mouse') return
      setHover(i)
      setSeen((v) => (v.includes(i) ? v : [...v, i]))
    },
    onPointerLeave: () => setHover(null),
    onFocus: () => setHover(null),
  })

  return (
    <section ref={ref} id="solutions" aria-labelledby="solutions-title" className="solutions relative bg-cloud py-24 md:py-36">
      <div className="shell">
        <div className="grid-12 items-end gap-y-8">
          <div className="col-span-4 md:col-span-12 lg:col-span-8">
            <ChapterLabel n="08" label={s.label} />
            <SplitTitle id="solutions-title" className="t-display mt-6 md:mt-8">
              {s.title[0]}
              <br />
              <span className="text-blue">{s.title[1]}</span>
            </SplitTitle>
          </div>
        </div>

        <ol className="mt-14 md:mt-20">
          {/* 01 — the central offer */}
          <li data-sol-row className="sol-row">
            <Link href={link(0)} className="sol-lead group grid-12 items-center gap-y-10 p-6 sm:p-8 md:p-12 lg:p-14">
              <span className="col-span-4 md:col-span-10 lg:col-span-5">
                <span data-sol-rise className="t-overline block text-blue" aria-hidden="true">{num(0)}</span>
                <span data-sol-rise className="sol-name sol-name-1 mt-4 block">
                  <span className="link-draw pb-1">{it[0].name}</span>
                </span>
                <span data-sol-rise className="t-lead mt-5 block max-w-[34ch] text-slate">{it[0].text}</span>
                <span data-sol-rise className="mt-8 block">
                  <Go />
                </span>
              </span>
              <span data-sol-rise className="sol-figure col-span-4 md:col-span-10 lg:col-span-6 lg:col-start-7" aria-hidden="true">
                <span className="frame block aspect-[16/10]">
                  <Image src="/images/work/site-next-solutions/hero.webp" alt="" width={1600} height={1000} sizes="(min-width: 1024px) 42vw, 90vw" className="sol-figure-img h-full w-full object-cover" />
                </span>
              </span>
            </Link>
          </li>

          {/* 02 — 03 */}
          {[1, 2].map((i) => (
            <li key={i} data-sol-row className={`sol-row ${i === 1 ? 'mt-6 md:mt-10' : ''}`}>
              <span data-sol-line className="sol-line" aria-hidden="true" />
              <Link href={link(i)} {...hoverable(i)} className="group grid-12 items-center gap-y-3 py-8 md:py-10">
                <span data-sol-rise className="t-overline col-span-4 text-blue md:col-span-1" aria-hidden="true">{num(i)}</span>
                <span data-sol-rise className={`sol-name col-span-4 md:col-span-6 ${i === 1 ? 'sol-name-2' : 'sol-name-3'}`}>
                  <span className="link-draw pb-1">{it[i].name}</span>
                </span>
                <span data-sol-rise className="col-span-4 max-w-[38ch] text-slate md:col-span-4 md:col-start-8">{it[i].text}</span>
                <span className="hidden justify-end md:col-span-1 md:flex">
                  <Go />
                </span>
              </Link>
            </li>
          ))}
        </ol>

        {/* 04 — 05: complementary expertise */}
        <div data-sol-row className="sol-row">
          <span data-sol-line className="sol-line" aria-hidden="true" />
          <p data-sol-rise className="t-overline pt-10 text-slate md:pt-12">{s.more}</p>
          <ul className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6">
            {[3, 4].map((i) => (
              <li key={i} data-sol-rise className="flex">
                <Link href={link(i)} {...hoverable(i)} className="card sol-more group flex w-full items-start justify-between gap-6 p-6 md:p-8">
                  <span>
                    <span className="t-overline block text-blue" aria-hidden="true">{num(i)}</span>
                    <span className="sol-name sol-name-4 mt-3 block">
                      <span className="link-draw pb-0.5">{it[i].name}</span>
                    </span>
                    <span className="mt-2 block max-w-[40ch] text-slate">{it[i].text}</span>
                  </span>
                  <Go />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 md:mt-20">
          <Button href={startHref}>{s.cta}</Button>
        </div>
      </div>

      {/* Contextual preview that follows the cursor (decorative) */}
      <div ref={preview} className={`sol-preview ${hover !== null && previews[hover] ? 'is-on' : ''}`} aria-hidden="true">
        {previews.map((p, i) => (
          <div key={i} className={`sol-preview-slot ${hover === i ? 'is-current' : ''}`}>{seen.includes(i) ? p : null}</div>
        ))}
      </div>
    </section>
  )
}
