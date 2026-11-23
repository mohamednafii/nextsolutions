'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/** Plays the [data-anim] loops inside only while the demo is on screen. */
export function DemoPlayer({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-playing', e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`demo ${className}`}>
      {children}
    </div>
  )
}
