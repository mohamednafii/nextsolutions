'use client'

import { useRef, type ReactNode, type ElementType } from 'react'
import { gsap, useGSAP, FULL, MOTION } from '@/lib/gsap'

/**
 * Calm reveal for regular content: children marked with [data-reveal] rise
 * 24px and fade in once, when 20% visible, 80ms apart (max 4 per sequence).
 * Content is in the DOM from the server; only its opacity is animated.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  className,
  delay = 0,
}: {
  children: ReactNode
  as?: ElementType
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const root = ref.current
      if (!root) return
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', root)
      const targets = items.length ? items : [root]
      const mm = gsap.matchMedia()
      mm.add(FULL, () => {
        gsap.set(targets, { opacity: 0, y: (_, el: HTMLElement) => (el.dataset.reveal === 'fade' ? 0 : MOTION.rise) })
        // Batch so that sequences never exceed 4 staggered items.
        gsap.utils.toArray<HTMLElement>(targets).forEach((el, i) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: MOTION.reveal,
            delay: delay + (i % 4) * MOTION.stagger,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
