'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

/**
 * Ink disc labelled "Voir ↗" / "Explorer ↗" that replaces nothing: the system
 * cursor stays everywhere, the disc only follows it over [data-cursor="view"]
 * (project cards). A target can set its own word with data-cursor-label.
 * Fine pointers only.
 */
export function ViewCursor({ label, size = 72 }: { label: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const text = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const xTo = gsap.quickTo(el, 'x', { duration: reduce ? 0 : 0.35, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: reduce ? 0 : 0.35, ease: 'power3.out' })
    let active = false
    const onMove = (e: PointerEvent) => {
      xTo(e.clientX - size / 2)
      yTo(e.clientY - size / 2)
      const over = (e.target as Element | null)?.closest?.('[data-cursor="view"]')
      const word = (over as HTMLElement | null)?.dataset.cursorLabel ?? label
      if (over && text.current && text.current.textContent !== word) text.current.textContent = word
      if (Boolean(over) !== active) {
        active = Boolean(over)
        gsap.to(el, { scale: active ? 1 : 0, opacity: active ? 1 : 0, duration: 0.3, ease: 'ascent' })
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [size, label])
  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="pointer-events-none fixed left-0 top-0 z-[60] flex scale-0 items-center justify-center rounded-full bg-ink px-3 text-center font-display text-[13px] font-bold leading-tight text-white opacity-0"
    >
      <span ref={text}>{label}</span>&nbsp;↗
    </div>
  )
}
