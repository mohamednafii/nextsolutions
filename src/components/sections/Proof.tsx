'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { gsap, useGSAP, FULL } from '@/lib/gsap'

export type MetricView = { value: number; prefix?: string; suffix?: string; label: string }

/** Scene 8 — real figures only; counts 0 → value in 1.2s once; 32px blue rule draws below. */
export function Metrics({ title, items, locale }: { title: string; items: MetricView[]; locale: string }) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL, () => {
        gsap.utils.toArray<HTMLElement>('[data-count]', ref.current).forEach((el) => {
          const target = Number(el.dataset.count)
          const obj = { v: 0 }
          gsap.to(obj, {
            v: target,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            onUpdate: () => {
              el.textContent = Math.round(obj.v).toLocaleString(locale)
            },
          })
        })
        gsap.from('[data-rule]', { scaleX: 0, duration: 0.7, stagger: 0.08, scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <section ref={ref} aria-label={title} className="py-24 md:py-32">
      <div className="shell">
        <ul className="grid-12 gap-y-14">
          {items.map((m) => (
            <li key={m.label} className="col-span-4 md:col-span-4">
              <p className="t-num text-[clamp(4rem,2.5rem+4vw,6rem)] text-ink">
                {m.prefix}
                <span data-count={m.value}>{m.value.toLocaleString(locale)}</span>
                {m.suffix}
              </p>
              <span data-rule className="mt-5 block h-0.5 w-8 origin-left bg-blue" aria-hidden="true" />
              <p className="mt-4 text-lg text-slate">{m.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export type TestimonialView = {
  quote: string
  name: string
  role: string
  company: string
  portrait: { src: string; alt: string; width: number; height: number } | null
}

/** Scene 9 — words go from light grey to Ink with the scroll; portrait frame opens upward. */
export function Testimonial({ t }: { t: TestimonialView }) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL, () => {
        gsap.fromTo('[data-word]', { color: '#8A93A0' }, {
          color: '#0F1418',
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 70%', end: 'bottom 60%', scrub: true },
        })
        gsap.fromTo('[data-portrait]',
          { clipPath: 'inset(100% 0% 0% 0% round 20px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 0.8, clearProps: 'clipPath', scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true } })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <section ref={ref} className="py-24 md:py-36">
      <figure className="shell grid-12 items-center gap-y-10">
        {t.portrait && (
          <div className="col-span-4 md:col-span-4">
            <div data-portrait className="frame relative aspect-[4/5] overflow-hidden bg-cloud">
              <Image src={t.portrait.src} alt={t.portrait.alt} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
            </div>
          </div>
        )}
        <div className={`col-span-4 ${t.portrait ? 'md:col-span-7 md:col-start-6' : 'md:col-span-10'}`}>
          <blockquote className="t-h1">
            «&nbsp;{t.quote.split(' ').map((w, i) => (
              <span key={i} data-word>{w} </span>
            ))}»
          </blockquote>
          <figcaption className="mt-8 text-slate">
            <span className="font-display font-bold text-ink">{t.name}</span>, {t.role}, {t.company}
          </figcaption>
        </div>
      </figure>
    </section>
  )
}
