'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, useGSAP)

/** Brand curves: entrance and exit. */
CustomEase.create('ascent', '0.22, 1, 0.36, 1')
CustomEase.create('descent', '0.64, 0, 0.78, 0')
gsap.defaults({ ease: 'ascent', duration: 0.7 })

export const MOTION = {
  hover: 0.18,
  ui: 0.3,
  reveal: 0.7,
  page: 0.5,
  stagger: 0.08,
  rise: 24,
} as const

export const REDUCED = '(prefers-reduced-motion: reduce)'
export const FULL = '(prefers-reduced-motion: no-preference)'
export const DESKTOP = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
export const MOBILE = '(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)'

/**
 * Runs an animation `setup` only once `el` comes within `margin` of the
 * viewport (default: one screen below). Everything created inside is
 * recorded in a gsap.context and reverted by the returned cleanup.
 * For below-the-fold sections: their tweens read and write styles when they
 * are created, which page load should not pay for. Never use it for pins
 * (a late pin would move every trigger after it).
 */
export function whenNear(el: Element, setup: () => void | (() => void), margin = '0px 0px 100% 0px'): () => void {
  let ctx: gsap.Context | null = null
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      ctx = gsap.context(setup)
    },
    { rootMargin: margin },
  )
  io.observe(el)
  return () => {
    io.disconnect()
    ctx?.revert()
  }
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
