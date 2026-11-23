'use client'

import { useRef } from 'react'
import { Arrow } from '@/components/brand/Logo'
import { gsap, useGSAP, FULL } from '@/lib/gsap'

type Step = { name: string; line: string }

/**
 * The four steps. A blue line draws with the scroll; each step lights up when
 * the line reaches it; the line ends in the rising arrow.
 * Horizontal ≥ 768px (one segment per step), vertical below. All lit with reduced motion.
 */
export function MethodLine({ steps, compact }: { steps: Step[]; compact?: boolean }) {
  const ref = useRef<HTMLOListElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL, () => {
        const root = ref.current!
        const items = gsap.utils.toArray<HTMLElement>('[data-step]', root)
        const segs = gsap.utils.toArray<HTMLElement>('[data-seg]', root)
        const lineV = root.querySelector('[data-line-v]')
        const end = root.querySelector('[data-line-end]')
        const toggle = (p: number) => {
          items.forEach((el, i) => el.toggleAttribute('data-off', p < i / items.length + 0.01))
          end?.toggleAttribute('data-off', p < 0.97)
        }
        toggle(0)
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root,
            start: 'top 75%',
            end: 'bottom 55%',
            scrub: 0.5,
            onUpdate: (self) => toggle(self.progress),
          },
        })
        tl.fromTo(segs, { scaleX: 0 }, { scaleX: 1, duration: 1, stagger: 1 }, 0)
        tl.fromTo(lineV, { scaleY: 0 }, { scaleY: 1, duration: segs.length }, 0)
        return () => {
          items.forEach((el) => el.removeAttribute('data-off'))
          end?.removeAttribute('data-off')
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  const marker =
    'block h-[15px] w-[15px] shrink-0 border border-blue bg-blue transition-colors duration-300 group-data-[off]:border-line group-data-[off]:bg-white'

  return (
    <ol ref={ref} className="relative grid grid-cols-1 gap-12 pl-10 md:grid-cols-4 md:gap-0 md:pl-0">
      {/* Mobile vertical track */}
      <span className="absolute bottom-6 left-[7px] top-2 w-px bg-line md:hidden" aria-hidden="true">
        <span data-line-v className="absolute inset-0 origin-top bg-blue" />
      </span>

      {steps.map((s, i) => {
        const last = i === steps.length - 1
        return (
          <li key={s.name} data-step className="group relative md:pr-8">
            <span className={`${marker} absolute -left-10 top-2 md:hidden`} aria-hidden="true" />
            {/* Decorative numeral drawn via CSS content (not text) */}
            <span
              data-n={`0${i + 1}`}
              className={`t-num block text-line transition-colors duration-500 before:content-[attr(data-n)] group-data-[off]:text-cloud ${compact ? 'text-[clamp(3.5rem,2rem+5vw,6rem)]' : 'text-[clamp(4.5rem,2rem+8vw,10rem)]'}`}
              aria-hidden="true"
            />
            {/* Desktop segment: marker + line to the next step */}
            <span className="relative mt-6 hidden h-[15px] items-center md:flex" aria-hidden="true">
              <span className={marker} />
              <span className="relative h-px flex-1 bg-line md:-mr-8">
                <span data-seg className="absolute inset-0 origin-left bg-blue" />
              </span>
              {last && (
                <span data-line-end className="group/end absolute -right-8 bottom-[7px] translate-x-full">
                  <Arrow className="h-5 w-5 transition-[opacity,transform] duration-500 ease-ascent group-data-[off]/end:translate-y-2 group-data-[off]/end:opacity-0" />
                </span>
              )}
            </span>
            <h3 className="t-h3 mt-2 transition-colors duration-300 group-data-[off]:text-slate md:mt-6">
              <span className="sr-only">0{i + 1} — </span>
              {s.name}
            </h3>
            <p className="mt-2 max-w-[22ch] text-slate">{s.line}</p>
          </li>
        )
      })}
    </ol>
  )
}
