'use client'

import { useRef } from 'react'
import { Symbol } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'
import { SplitTitle } from '@/components/motion/SplitTitle'
import { gsap, useGSAP, FULL } from '@/lib/gsap'

/**
 * Scene 10 — "Your next step starts here." Full Ink.
 * Transition — « À vous de jouer »: the lights go down (the background turns
 * from white to Ink with scroll, like a room before the show), the title
 * writes itself line by line, then the action appears. The giant official
 * symbol (White + Sky) rises 120px into place, cropped by the right edge.
 * The button is magnetic (8px).
 */
export function FinalCta({ title, button, startHref, whatsappLabel, whatsappHref, headingLevel = 2 }: {
  title: string
  button: string
  startHref: string
  whatsappLabel: string
  whatsappHref?: string
  headingLevel?: 2 | 3
}) {
  const ref = useRef<HTMLElement>(null)
  const magnet = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL, () => {
        const root = ref.current!
        gsap.fromTo(root, { backgroundColor: '#FFFFFF' }, {
          backgroundColor: '#0F1418',
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top 90%', end: 'top 35%', scrub: true },
        })
        gsap.fromTo('[data-cta-symbol]', { y: 120 }, {
          y: 0,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'top 20%', scrub: true },
        })
        gsap.from('[data-cta-actions]', {
          y: 24, opacity: 0, duration: 0.7, stagger: 0.08,
          scrollTrigger: { trigger: root, start: 'top 55%', once: true },
        })
      })
      mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const el = magnet.current!
        const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          xTo(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 8)
          yTo(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * 8)
        }
        const leave = () => { xTo(0); yTo(0) }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        return () => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  const H = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <section ref={ref} data-header-dark className="on-ink relative overflow-hidden bg-ink text-white">
      <div className="shell relative grid-12 min-h-[100svh] items-start pb-[70vw] pt-28 sm:pb-28 md:min-h-svh md:items-center md:py-36">
        <div data-cta-text className="relative z-10 col-span-4 md:col-span-8 lg:col-span-7">
          <SplitTitle as={H} className="t-display max-w-[11ch] sm:max-w-[15ch]">{title}</SplitTitle>
          <div data-cta-actions className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-6 md:mt-14">
            <div ref={magnet} className="p-2 -m-2">
              <Button href={startHref} tone="onInk" swapArrow>
                {button}
              </Button>
            </div>
            {whatsappHref && (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="link-draw pb-0.5 font-display font-bold text-ink-mute hover:text-white">
                {whatsappLabel}
              </a>
            )}
          </div>
        </div>
      </div>
      <div
        data-cta-symbol
        className="pointer-events-none absolute -right-[16%] bottom-[-8%] w-[78%] sm:-right-[10%] sm:w-[52%] md:bottom-[-10%] lg:-right-[6%] lg:w-[46%]"
        aria-hidden="true"
      >
        <Symbol variant="reversed" className="h-auto w-full" />
      </div>
    </section>
  )
}
