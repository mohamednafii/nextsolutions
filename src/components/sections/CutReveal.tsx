'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, FULL } from '@/lib/gsap'

/** Reveals its rounded frame from the bottom up (900ms), once, when it reaches 80% of the screen. */
export function CutReveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL, () => {
        const el = ref.current!
        // The rounded frame opens upward, its corners kept round all the way.
        gsap.fromTo(
          el,
          { clipPath: 'inset(100% 0% 0% 0% round 20px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 20px)',
            duration: 0.9,
            delay,
            scrollTrigger: { trigger: el, start: 'top 80%', once: true },
            onComplete: () => {
              el.style.clipPath = ''
            },
          },
        )
        gsap.fromTo(el.firstElementChild, { scale: 1.12 }, { scale: 1, duration: 1.2, delay, scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className={`frame overflow-hidden ${className}`}>
      {children}
    </div>
  )
}
