'use client'

import { useRef, type ElementType, type ReactNode } from 'react'
import { gsap, SplitText, useGSAP, FULL } from '@/lib/gsap'

/**
 * Section title that "writes itself": split into its real lines (re-split on
 * resize and once fonts load), each line rises out of its own mask, 100ms
 * apart, when the title reaches the lower part of the screen. Same gesture as
 * the hero headline, so every chapter opens the same way.
 * The split only happens when the title comes within about a screen of the
 * viewport, so page load never pays for it (each split measures the layout).
 * Screen readers get the whole title (SplitText labels the element).
 * Reduced motion: static text.
 */
export function SplitTitle({
  as: Tag = 'h2',
  id,
  className,
  children,
}: {
  as?: ElementType
  id?: string
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL, () => {
        const el = ref.current!
        let split: SplitText | null = null
        const io = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting || split) return
            io.disconnect()
            split = SplitText.create(el, {
              type: 'lines',
              mask: 'lines',
              linesClass: 'split-line',
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 110,
                  duration: 1,
                  ease: 'ascent',
                  stagger: 0.1,
                  scrollTrigger: { trigger: el, start: 'top 85%', once: true },
                }),
            })
          },
          { rootMargin: '0px 0px 100% 0px' },
        )
        io.observe(el)
        return () => {
          io.disconnect()
          split?.revert()
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  )
}
