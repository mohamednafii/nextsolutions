'use client'

import type Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * Lenis (lerp 0.1) driven by GSAP's ticker so scroll and ScrollTrigger stay in
 * sync. Loaded on demand for fine-pointer devices with motion allowed only;
 * touch devices and reduced motion keep native scrolling and never download it.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()
  const first = useRef(true)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    let cancelled = false
    let tick: ((time: number) => void) | null = null

    const start = async () => {
      if (!mq.matches || lenisRef.current) return
      const { default: LenisCtor } = await import('lenis')
      if (cancelled || !mq.matches) return
      const lenis = new LenisCtor({ autoRaf: false, lerp: 0.1, anchors: { offset: -96 } })
      lenis.on('scroll', ScrollTrigger.update)
      tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      lenisRef.current = lenis
    }
    const stop = () => {
      if (tick) gsap.ticker.remove(tick)
      lenisRef.current?.destroy()
      lenisRef.current = null
    }
    const onChange = () => (mq.matches ? start() : stop())

    start()
    mq.addEventListener('change', onChange)
    return () => {
      cancelled = true
      mq.removeEventListener('change', onChange)
      stop()
    }
  }, [])

  // "Back to top" (footer): ride the smooth-scroll engine when it runs.
  useEffect(() => {
    const top = () => {
      if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 1.6 })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('ns:scroll-top', top)
    return () => window.removeEventListener('ns:scroll-top', top)
  }, [])

  // Client navigation: jump to top and re-measure scroll triggers.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    lenisRef.current?.scrollTo(0, { immediate: true, force: true })
    // Re-measure, then honour a #hash in the new URL (e.g. the footer's "Services" → /#solutions).
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh()
      const hash = decodeURIComponent(window.location.hash.slice(1))
      const target = hash ? document.getElementById(hash) : null
      if (!target) return
      const y = target.getBoundingClientRect().top + window.scrollY
      if (lenisRef.current) {
        lenisRef.current.resize() // the new page is longer: refresh the scroll limit first
        lenisRef.current.scrollTo(y, { immediate: true, force: true })
      }
      else window.scrollTo(0, y)
    }, 120)
    return () => window.clearTimeout(id)
  }, [pathname])

  return <>{children}</>
}
