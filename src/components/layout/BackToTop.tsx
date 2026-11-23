'use client'

import { Arrow } from '@/components/brand/Logo'

/**
 * Back to the top: a smooth ride through the smooth-scroll engine when it runs
 * (see SmoothScroll), a native smooth scroll otherwise, an instant jump with
 * reduced motion. Focus then moves to the main landmark for keyboard users.
 */
export function BackToTop({ label }: { label: string }) {
  const go = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) window.scrollTo(0, 0)
    else window.dispatchEvent(new CustomEvent('ns:scroll-top'))
    document.getElementById('main')?.focus({ preventScroll: true })
  }
  return (
    <button
      type="button"
      onClick={go}
      className="ft-top-btn group"
    >
      <span className="link-draw pb-0.5">{label}</span>
      <Arrow tone="sky" className="h-2.5 w-2.5 -rotate-45 transition-transform duration-300 ease-ascent group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5" />
    </button>
  )
}
