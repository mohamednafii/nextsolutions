'use client'

import { gsap } from '@/lib/gsap'

/**
 * Project → project page transition: the card image grows into the top of the
 * project page (where the detail hero sits at the same size), then the route
 * changes underneath and the clone fades away.
 */
export function expandToPage(source: HTMLElement, navigate: () => void) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return navigate()
  const r = source.getBoundingClientRect()
  const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 84
  const clone = source.cloneNode(true) as HTMLElement
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${r.left}px`,
    top: `${r.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    zIndex: '70',
    margin: '0',
    overflow: 'hidden',
    clipPath: 'none',
  })
  clone.setAttribute('aria-hidden', 'true')
  document.body.appendChild(clone)
  gsap.to(clone, {
    left: 0,
    top: headerH,
    width: window.innerWidth,
    height: Math.min(window.innerHeight * 0.72, (window.innerWidth * 10) / 16),
    duration: 0.6,
    ease: 'ascent',
    onComplete: () => {
      try {
        sessionStorage.setItem('ns-expand', '1')
      } catch {}
      navigate()
      gsap.to(clone, { opacity: 0, duration: 0.5, delay: 0.35, onComplete: () => clone.remove() })
    },
  })
}
