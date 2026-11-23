'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, FULL } from '@/lib/gsap'

/**
 * Chapter change — « la page monte ».
 *
 * Wraps the incoming chapter. While it scrolls in (its top travels from the
 * bottom to the top of the screen):
 * - the previous chapter stays parked where it is and darkens under an Ink
 *   veil, so it reads as a layer underneath;
 * - the new page rises over it with the brand's 45° cut on its top-right
 *   corner — the arrow of the logo, "the way up" — and the cut closes exactly
 *   as the page docks.
 * Everything is written only while the transition runs: outside its range the
 * previous chapter carries no transform (a transformed ancestor would break
 * any pinned element inside it, e.g. the Vision stage).
 * Reduced motion: plain scrolling, nothing moves.
 */
export function Rise({ children, veil = 0.6 }: { children: ReactNode; veil?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL, () => {
        const page = ref.current!
        const prev = page.previousElementSibling as HTMLElement | null
        if (!prev) return

        // Veil over the previous chapter (pointer-events: none, so it never blocks it).
        const shade = document.createElement('div')
        shade.className = 'rise-veil'
        shade.setAttribute('aria-hidden', 'true')
        const staticPrev = getComputedStyle(prev).position === 'static'
        if (staticPrev) prev.style.position = 'relative'
        prev.appendChild(shade)

        let depth = 0
        let cut = 0
        let active = false
        const measure = () => {
          const vh = window.innerHeight
          // Parking is only safe when the previous chapter is at least one screen tall
          // (otherwise its top edge would come down into view).
          depth = prev.offsetHeight >= vh - 2 ? vh : 0
          cut = Math.round(Math.min(window.innerWidth * 0.22, 320))
        }
        const state = { p: 0 }
        const render = () => {
          const p = state.p
          prev.style.transform = active && depth ? `translate3d(0, ${(depth * p).toFixed(1)}px, 0)` : ''
          shade.style.opacity = (veil * p).toFixed(3)
          page.style.setProperty('--cut', `${(cut * (1 - p * p)).toFixed(1)}px`)
        }

        measure()
        gsap.to(state, {
          p: 1,
          ease: 'none',
          onUpdate: render,
          scrollTrigger: {
            trigger: page,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: () => {
              measure()
              render()
            },
            // Transform and cut only exist while the page is rising.
            onToggle: (self) => {
              active = self.isActive
              if (active) page.dataset.rising = ''
              else delete page.dataset.rising
              render()
            },
          },
        })

        return () => {
          shade.remove()
          prev.style.transform = ''
          if (staticPrev) prev.style.position = ''
          page.style.removeProperty('--cut')
          delete page.dataset.rising
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="rise relative z-[1]">
      {children}
    </div>
  )
}
