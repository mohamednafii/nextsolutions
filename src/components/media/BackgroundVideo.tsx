'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { preload } from 'react-dom'

export type VideoSource = { src: string; media?: string }

const REDUCE = '(prefers-reduced-motion: reduce)'
// Reduced motion or Save-Data: show the poster, never download the video unless asked.
const subscribeReduce = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const getStill = () =>
  window.matchMedia(REDUCE).matches ||
  Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
// Start the film only after the page has loaded, so decoding never competes with hydration.
const subscribeLoad = (cb: () => void) => {
  window.addEventListener('load', cb)
  return () => window.removeEventListener('load', cb)
}
const getLoaded = () => document.readyState === 'complete'

/**
 * Link between a film and its pause / play control, so the control can live
 * anywhere in the layout (e.g. on the CTA row) while the film sits behind.
 */
export type VideoController = ReturnType<typeof createVideoController>
export function createVideoController() {
  let playing = false
  const subs = new Set<() => void>()
  const toggles = new Set<() => void>()
  const covers = new Set<(v: boolean) => void>()
  return {
    subscribe: (cb: () => void) => (subs.add(cb), () => void subs.delete(cb)),
    isPlaying: () => playing,
    setPlaying: (v: boolean) => {
      playing = v
      subs.forEach((f) => f())
    },
    onToggle: (cb: () => void) => (toggles.add(cb), () => void toggles.delete(cb)),
    toggle: () => toggles.forEach((f) => f()),
    /** The film is hidden behind another layer (the next section slid over it): pause it. */
    onCover: (cb: (v: boolean) => void) => (covers.add(cb), () => void covers.delete(cb)),
    cover: (v: boolean) => covers.forEach((f) => f(v)),
  }
}

/**
 * Full-bleed decorative film (aria-hidden). Overlays go in `children`.
 * - Rendered with preload="none" and started from JS after `load`, so
 *   reduced-motion and Save-Data visitors only get the poster (first frame,
 *   preloaded for LCP).
 * - Plays only while on screen; pauses off screen.
 * - Driven by a VideoToggle (WCAG 2.2.2), which also lets reduced-motion
 *   visitors opt in.
 */
export function BackgroundVideo({
  controller,
  sources,
  poster,
  className = '',
  videoClassName = '',
  children,
}: {
  controller: VideoController
  /** Ordered sources: the first whose `media` matches is used (put the mobile file first). */
  sources: VideoSource[]
  poster: string
  className?: string
  videoClassName?: string
  children?: ReactNode
}) {
  preload(poster, { as: 'image', fetchPriority: 'high' })
  const ref = useRef<HTMLVideoElement>(null)
  const still = useSyncExternalStore(subscribeReduce, getStill, () => true)
  const loaded = useSyncExternalStore(subscribeLoad, getLoaded, () => false)
  const [choice, setChoice] = useState<boolean | null>(null) // null = follow the preference
  const [inView, setInView] = useState(true)
  const [covered, setCovered] = useState(false)
  const want = choice ?? !still

  useEffect(() => controller.onToggle(() => setChoice(!controller.isPlaying())), [controller])
  useEffect(() => controller.onCover(setCovered), [controller])

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (want && inView && !covered && (loaded || choice)) {
      v.muted = true
      v.play().catch(() => {
        /* Autoplay refused (e.g. low-power mode): the poster stays and the control offers play. */
      })
    } else {
      v.pause()
    }
  }, [want, inView, covered, loaded, choice])

  return (
    <div data-bg-video className={className} aria-hidden="true">
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full object-cover ${videoClassName}`}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        tabIndex={-1}
        onPlay={() => controller.setPlaying(true)}
        onPause={() => controller.setPlaying(false)}
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} media={s.media} type="video/mp4" />
        ))}
      </video>
      {children}
    </div>
  )
}

/** Pause / play control, same height as every button (48px). */
export function VideoToggle({
  controller,
  pauseLabel,
  playLabel,
  className = '',
}: {
  controller: VideoController
  pauseLabel: string
  playLabel: string
  className?: string
}) {
  const playing = useSyncExternalStore(controller.subscribe, controller.isPlaying, () => false)
  return (
    <button
      type="button"
      onClick={controller.toggle}
      aria-label={playing ? pauseLabel : playLabel}
      className={`btn-icon border border-white/30 text-white/80 transition-colors duration-[180ms] hover:border-white hover:text-white ${className}`}
    >
      {playing ? (
        <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
          <path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
          <path d="M3 1.5l7 4.5-7 4.5z" fill="currentColor" />
        </svg>
      )}
    </button>
  )
}
