'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { gsap, useGSAP, FULL } from '@/lib/gsap'

type Plan = { name: string; price: string; prefix: string; unit: string; for: string; text: string; cta: string; featured: boolean }

/** Pricing table that appears column by column. Only verified prices; the rest is "on quote". */
export function PricingTable({ plans, startHref }: { plans: Plan[]; startHref: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL, () => {
        gsap.from('[data-col]', {
          opacity: 0,
          y: 24,
          duration: 0.7,
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className="grid grid-cols-1 gap-3 md:gap-4 xl:grid-cols-3">
      {plans.map((p) => (
        <div
          key={p.name}
          data-col
          className={`flex flex-col p-7 md:p-9 ${p.featured ? 'on-ink frame bg-ink text-white' : 'card'}`}
        >
          <p className={`t-overline ${p.featured ? 'text-sky' : 'text-blue'}`}>{p.name}</p>
          <p className={`mt-3 font-display text-lg font-semibold ${p.featured ? 'text-white' : 'text-ink'}`}>{p.for}</p>
          <p className="mt-10 font-display font-extrabold tracking-[-0.04em]">
            {p.prefix && <span className={`mr-2 text-xl ${p.featured ? 'text-ink-mute' : 'text-slate'}`}>{p.prefix}</span>}
            <span className="text-[clamp(2.25rem,1.6rem+2vw,3.25rem)] leading-none">{p.price}</span>
          </p>
          <p className={`mt-6 flex-1 ${p.featured ? 'text-ink-mute' : 'text-slate'}`}>{p.text}</p>
          <div className="mt-10">
            <Button href={startHref} tone={p.featured ? 'onInk' : 'ink'} className="w-full sm:w-auto xl:w-full">{p.cta}</Button>
          </div>
        </div>
      ))}
    </div>
  )
}
