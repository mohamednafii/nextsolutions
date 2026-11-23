'use client'

import { useRef } from 'react'
import { gsap, useGSAP, FULL } from '@/lib/gsap'

/** Words pass from light grey to Ink one by one with the scroll (Agency manifesto). */
export function ScrollWords({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL, () => {
        gsap.fromTo(
          '[data-w]',
          { color: '#8A93A0' },
          {
            color: '#0F1418',
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: ref.current, start: 'top 75%', end: 'bottom 45%', scrub: true },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <p ref={ref} className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} data-w>
          {w}{' '}
        </span>
      ))}
    </p>
  )
}
