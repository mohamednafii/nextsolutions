'use client'

import { useEffect } from 'react'
import { SYMBOL_ARROW, SYMBOL_N } from '@/components/brand/wordmark-data'

/**
 * Scene 0 — brand intro (1.2s, first homepage visit of the session only).
 * Pure CSS, so it starts at first paint and ends on its own even before
 * hydration; the page is already rendered underneath.
 *  1) the N draws in Ink (600ms) 2) the blue arrow slides in from bottom-left
 *  (400ms) 3) the mark flies to the header logo while the overlay fades (500ms).
 * Visible only when the head script set html[data-intro="1"].
 */
export function Intro() {
  useEffect(() => {
    const root = document.documentElement
    if (root.dataset.intro !== '1') return
    try {
      sessionStorage.setItem('ns-intro', '1')
    } catch {}
    // Keep the attribute (hero delays depend on it) but mark the intro as finished.
    const id = window.setTimeout(() => (root.dataset.intro = 'done'), 1400)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div className="intro-overlay fixed inset-0 z-[100] hidden items-center justify-center bg-white" aria-hidden="true">
      <svg viewBox="-1 -1 76 63" className="intro-mark w-[88px] md:w-[120px]">
        <path className="intro-n-line" d={SYMBOL_N} pathLength={1} fill="none" stroke="#0F1418" strokeWidth="1.6" strokeLinejoin="round" />
        <path className="intro-n-fill" d={SYMBOL_N} fill="#0F1418" stroke="#0F1418" strokeWidth="1.2" strokeLinejoin="round" />
        <path className="intro-arrow" d={SYMBOL_ARROW} fill="#0054DB" stroke="#0054DB" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/** Inline script run before paint: decides whether the intro plays, and enables JS motion styles. */
export const introScript = `(function(){try{var d=document.documentElement;d.classList.add('js-motion');var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!r&&!sessionStorage.getItem('ns-intro')&&location.pathname.replace(/^\\/en/,'').replace(/\\/$/,'')===''){d.dataset.intro='1'}}catch(e){}})();`
