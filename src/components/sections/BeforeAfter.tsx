'use client'

import { useCallback, useRef, useState, type ReactNode } from 'react'

/**
 * Before / after comparison the visitor drags (pointer, touch) or moves with
 * the keyboard (it is a real slider for assistive tech).
 */
export function BeforeAfter({ before, after, beforeLabel, afterLabel, hint }: {
  before: ReactNode
  after: ReactNode
  beforeLabel: string
  afterLabel: string
  hint: string
}) {
  const [pos, setPos] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const fromClient = useCallback((x: number) => {
    const r = ref.current!.getBoundingClientRect()
    setPos(Math.max(4, Math.min(96, ((x - r.left) / r.width) * 100)))
  }, [])

  return (
    <div>
      <div
        ref={ref}
        className="relative aspect-[4/5] cursor-ew-resize touch-pan-y select-none overflow-hidden bg-cloud sm:aspect-[16/10]"
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          fromClient(e.clientX)
        }}
        onPointerMove={(e) => dragging.current && fromClient(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <div className="absolute inset-0 p-4 pt-14 md:p-10 md:pt-20">{before}</div>
        <div className="absolute inset-0 p-4 pt-14 md:p-10 md:pt-20" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
          <div className="h-full bg-cloud">{after}</div>
        </div>
        <span className="absolute left-4 top-4 bg-white px-2 py-1 text-[11px] font-semibold text-slate md:left-10 md:top-10" aria-hidden="true">{beforeLabel}</span>
        <span className="absolute right-4 top-4 bg-ink px-2 py-1 text-[11px] font-semibold text-white md:right-10 md:top-10" aria-hidden="true">{afterLabel}</span>

        <div className="pointer-events-none absolute inset-y-0 w-px bg-blue" style={{ left: `${pos}%` }} aria-hidden="true" />
        <input
          type="range"
          min={4}
          max={96}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={hint}
          aria-valuetext={`${beforeLabel} ${Math.round(100 - pos)}% · ${afterLabel} ${Math.round(pos)}%`}
          className="peer sr-only"
        />
        <div
          className="pointer-events-none absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-blue text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-blue"
          style={{ left: `${pos}%` }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 20 10" className="h-2.5 w-5"><path d="M5 1L1 5l4 4M15 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
        </div>
      </div>
      <p className="mt-4 text-[0.8125rem] text-slate">{hint}</p>
    </div>
  )
}
