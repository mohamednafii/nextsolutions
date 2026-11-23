'use client'

import { useRef, useState, type CSSProperties } from 'react'
import type { Dictionary } from '@/content'
import { Button } from '@/components/ui/Button'
import { BackgroundVideo, VideoToggle, createVideoController, type VideoSource } from '@/components/media/BackgroundVideo'
import { gsap, useGSAP, FULL } from '@/lib/gsap'

/** Media paths (public/). Mobile gets a lighter 720p encode of the same film. */
export const HERO_MEDIA: { sources: VideoSource[]; poster: string } = {
  sources: [
    { src: '/videos/hero-nextsolutions-mobile.mp4', media: '(max-width: 767px)' },
    { src: '/videos/hero-nextsolutions.mp4' },
  ],
  poster: '/images/hero-poster.webp',
}

/**
 * Scene 1 — cinematic hero (moment n° 1).
 * Full-bleed film on Ink, copy left-aligned on the dark negative space, the
 * subject and the blue fabric kept open on the right.
 * Proportions follow the golden ratio (see `.hero` in globals.css): type scale,
 * gaps, the 61.8% copy column and the φ : 1 split of the free vertical space.
 * The CTA and the pause control share one baseline row, both 48px high.
 * Entrance is CSS (first paint, no hydration wait).
 * Exit (normal scroll): the copy drifts up and fades while the film moves a
 * little slower than the page. The film pauses on its own once off screen.
 */
export function Hero({ t, startHref }: { t: Dictionary; startHref: string }) {
  const ref = useRef<HTMLElement>(null)
  const [film] = useState(createVideoController)
  const h = t.home.hero
  const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL, () => {
        // Normal scroll, no pinning: as the hero leaves, its copy drifts up and fades
        // and the film moves a little slower than the page (restrained parallax).
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
          })
          .to('[data-hero-copy]', { y: -60, opacity: 0, duration: 0.6 }, 0)
          .to('[data-bg-video]', { yPercent: 18, duration: 1 }, 0)
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      data-header-dark
      aria-labelledby="hero-title"
      className="hero on-ink relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white"
    >
      <div className="shell flex flex-1 flex-col pt-[var(--header-h)]">
        {/* Free space split φ : 1 around the content (φ³ : 1 on phones, keeping the subject clear above the copy) */}
        <div aria-hidden="true" className="min-h-[2.618rem] grow-[4.236] md:grow-[1.618]" />

        <div data-hero-copy>
          <div className="@container lg:max-w-[61.8%]">
            <p data-hero-fade style={d(60)} className="hero-eyebrow font-display font-bold uppercase text-sky-soft">
              {h.overline}
            </p>
            <h1 id="hero-title" className="hero-title whitespace-nowrap">
              <span className="block overflow-hidden pb-[0.06em]">
                <span data-hero-line className="block" style={d(120)}>{h.line1}</span>
              </span>
              <span className="-mt-[0.06em] block overflow-hidden pb-[0.1em]">
                <span data-hero-line className="block text-sky-soft" style={d(210)}>{h.line2}</span>
              </span>
            </h1>
            <p data-hero-fade style={d(560)} className="hero-lead text-white/80">
              {h.lead}
            </p>
          </div>

          {/* Actions row: CTA left, film control right — one line, one height */}
          <div className="hero-actions flex items-center justify-between gap-6">
            <div data-hero-fade style={d(680)}>
              <Button href={startHref} tone="light">
                {h.cta}
              </Button>
            </div>
            <div data-hero-fade style={d(800)}>
              <VideoToggle controller={film} pauseLabel={h.videoPause} playLabel={h.videoPlay} />
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="min-h-[2.618rem] grow md:min-h-[4.236rem]" />
      </div>

      {/* Film (behind, decorative) + readability scrims */}
      <BackgroundVideo
        controller={film}
        sources={HERO_MEDIA.sources}
        poster={HERO_MEDIA.poster}
        className="absolute inset-0 -z-10"
        videoClassName="object-[64%_50%] md:object-[58%_50%]"
      >
        <div className="hero-scrim absolute inset-0" />
      </BackgroundVideo>
    </section>
  )
}
