'use client'

import Image from 'next/image'
import { useRef } from 'react'
import type { Dictionary } from '@/content'
import { gsap, useGSAP, ScrollTrigger, whenNear } from '@/lib/gsap'
import { Symbol } from '@/components/brand/Logo'
import { ChapterLabel } from '@/components/ui/ChapterLabel'
import { SplitTitle } from '@/components/motion/SplitTitle'

type E = Dictionary['home']['expertise']

const SHOTS = {
  design: { src: '/images/work/site-next-solutions/hero.webp', w: 1600, h: 1000 },
  experience: { src: '/images/work/site-next-solutions/sphere.webp', w: 1600, h: 1000 },
  performance: { src: '/images/work/site-next-solutions/hero.webp', w: 1600, h: 1000 },
  conversion: { src: '/images/work/site-next-solutions/form.webp', w: 1600, h: 1000 },
  mobile: { src: '/images/work/site-next-solutions/mobile-hero.webp', w: 780, h: 1688 },
}
const ORDER = ['design', 'experience', 'performance', 'conversion'] as const
const PIN_SCREENS = 3.2 // scroll length of the pinned showcase, in viewport heights

/** Browser chrome around a real capture of our own site. */
function Chrome({ title }: { title: string }) {
  return (
    <div className="ex-chrome" aria-hidden="true">
      <span className="flex gap-1.5">
        <i className="block h-2.5 w-2.5 rounded-full bg-line" />
        <i className="block h-2.5 w-2.5 rounded-full bg-line" />
        <i className="block h-2.5 w-2.5 rounded-full bg-line" />
      </span>
      <span className="ex-tab">
        <Symbol className="h-3 w-auto" />
        <span className="truncate">{title}</span>
      </span>
      <span data-ex-load className="ex-load" />
    </div>
  )
}

/**
 * Section 04 — « Votre site web mérite mieux que l'ordinaire. »
 * Desktop: the stage is pinned for ~3 screens; a browser showing our own site
 * evolves through four ideas, the list on the left following along:
 * 01 Design — the 12-column grid and type annotations are drawn over the page;
 * 02 Expérience — the next capture wipes up, a cursor travels to the sphere;
 * 03 Performance — the browser steps back and the phone version slides in,
 *    the tab's loading line runs (no score, no invented benchmark);
 * 04 Conversion — the enquiry page wipes up, its call to action is framed
 *    and the journey Visite → Intérêt → Demande is spelled out.
 * Mobile / reduced motion: the four states are stacked, nothing is pinned.
 * Light surface since 2026-11-22: the browser floats in a rounded white frame
 * with the soft shadow of « Nos expertises ».
 */
export function ExpertiseShowcase({ e }: { e: E }) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference) and (min-height: 620px)', () => {
        const root = ref.current!
        const stage = root.querySelector<HTMLElement>('[data-ex-stage]')!
        const q = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel, stage)
        const screens = q('[data-ex-screen]')
        const overlays = q('[data-ex-overlay]')
        const steps = q('[data-ex-step]')
        const browser = stage.querySelector('[data-ex-browser]')
        const phone = stage.querySelector('[data-ex-phone]')
        const load = stage.querySelector('[data-ex-load]')
        root.dataset.pinned = '1'

        let active = -1
        const setActive = (i: number) => {
          if (i === active) return
          active = i
          steps.forEach((el, k) => el.toggleAttribute('data-active', k === i))
        }
        setActive(0)

        const notes = (i: number) => overlays[i].querySelectorAll('[data-ex-note]')

        // The pin is created at load (it changes the page length, so every trigger after
        // it depends on it); the choreography is only built when the stage comes near.
        const pinLength = () => `+=${Math.round(window.innerHeight * PIN_SCREENS)}`
        ScrollTrigger.create({ trigger: stage, start: 'top top', end: pinLength, pin: true, invalidateOnRefresh: true })
        const stopNear = whenNear(stage, () => {
        gsap.set(screens.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' })
        gsap.set(overlays.slice(1), { autoAlpha: 0 })
        gsap.set(phone, { xPercent: 40, autoAlpha: 0 })
        const tl = gsap.timeline({
          defaults: { ease: 'ascent', duration: 0.3 },
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: pinLength,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.min(3, Math.floor(self.progress * 4.0001))),
          },
        })
        // 01 Design: columns rise, annotations appear
        tl.fromTo(overlays[0].querySelectorAll('.ex-col'), { scaleY: 0 }, { scaleY: 1, stagger: 0.02, duration: 0.35, transformOrigin: '50% 0%' }, 0.05)
          .fromTo(notes(0), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.08 }, 0.25)
        // 02 Expérience
        const wipe = (i: number, at: number) =>
          tl.to(overlays[i - 1], { autoAlpha: 0, duration: 0.2 }, at)
            .to(screens[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.35 }, at)
            .to(overlays[i], { autoAlpha: 1, duration: 0.2 }, at + 0.25)
        wipe(1, 0.9)
        tl.fromTo(overlays[1].querySelector('[data-ex-cursor]'), { left: '22%', top: '74%' }, { left: '61%', top: '38%', duration: 0.5, ease: 'power2.inOut' }, 1.2)
          .fromTo(notes(1), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.1 }, 1.4)
        // 03 Performance: the browser steps back, the phone version arrives
        wipe(2, 1.9)
        tl.to(browser, { scale: 0.78, duration: 0.4 }, 2.05)
          .to(phone, { xPercent: 0, autoAlpha: 1, duration: 0.4 }, 2.15)
          .fromTo(load, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, 2.1)
          .to(load, { autoAlpha: 0, duration: 0.1 }, 2.42)
          .fromTo(notes(2), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.08 }, 2.35)
        // 04 Conversion
        tl.to(phone, { xPercent: 40, autoAlpha: 0, duration: 0.3 }, 2.9)
          .to(browser, { scale: 1, duration: 0.35 }, 2.92)
        wipe(3, 2.95)
        tl.fromTo(overlays[3].querySelector('[data-ex-focus]'), { scale: 1.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3 }, 3.25)
          .fromTo(notes(3), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, stagger: 0.12 }, 3.35)
          .to({}, { duration: 0.3 }, 3.7)
        })

        const onLoad = () => ScrollTrigger.refresh()
        window.addEventListener('load', onLoad, { once: true })
        return () => {
          stopNear()
          window.removeEventListener('load', onLoad)
          delete root.dataset.pinned
          steps.forEach((el) => el.removeAttribute('data-active'))
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  const shot = (k: keyof typeof SHOTS, sizes: string, alt = '') => (
    <Image src={SHOTS[k].src} alt={alt} width={SHOTS[k].w} height={SHOTS[k].h} sizes={sizes} className="h-full w-full object-cover object-top" />
  )

  return (
    <section ref={ref} id="expertise" aria-labelledby="expertise-title" className="expertise bg-white text-ink">
      <div className="shell grid-12 gap-y-8 pb-12 pt-24 md:pb-16 md:pt-36">
        <div className="col-span-4 md:col-span-12 lg:col-span-8">
          <ChapterLabel n="07" label={e.label} />
          <SplitTitle id="expertise-title" className="t-display mt-6 md:mt-8">
            {e.title[0]}
            <br />
            <span className="text-blue">{e.title[1]}</span>
          </SplitTitle>
        </div>
        <p className="t-lead col-span-4 max-w-[40ch] self-end text-slate md:col-span-8 lg:col-span-4">{e.lead}</p>
      </div>

      {/* Desktop: pinned stage */}
      <div data-ex-stage className="ex-stage">
        <div className="shell grid-12 h-full items-center gap-x-6">
          <ol className="col-span-4 self-center" aria-label={e.label}>
            {e.steps.map((st, i) => (
              <li key={st.name} data-ex-step className="ex-step">
                <span className="t-overline text-blue">{String(i + 1).padStart(2, '0')}</span>
                <span className="ex-step-name">{st.name}</span>
                <span className="ex-step-text"><span>{st.text}</span></span>
              </li>
            ))}
          </ol>
          <div className="relative col-span-8" aria-hidden="true">
            <div data-ex-browser className="ex-browser">
              <Chrome title={e.browserTitle} />
              <div className="ex-viewport">
                {ORDER.map((k) => (
                  <div key={k} data-ex-screen className="absolute inset-0">
                    {shot(k, '(min-width: 1024px) 60vw, 1px')}
                  </div>
                ))}
                {/* 01 Design */}
                <div data-ex-overlay className="absolute inset-0">
                  <div className="ex-grid">{Array.from({ length: 12 }, (_, i) => <span key={i} className="ex-col" />)}</div>
                  <span data-ex-note className="ex-note" style={{ left: '4%', top: '14%' }}>{e.steps[0].notes[0]}</span>
                  <span data-ex-note className="ex-note" style={{ left: '4%', top: '41%' }}>{e.steps[0].notes[1]}</span>
                  <span data-ex-note className="ex-note" style={{ left: '46%', top: '70%' }}>{e.steps[0].notes[2]}</span>
                </div>
                {/* 02 Expérience */}
                <div data-ex-overlay className="absolute inset-0">
                  <svg data-ex-cursor className="ex-cursor" viewBox="0 0 16 22">
                    <path d="M1 1v17.5l4.6-4.4 3 6.9 2.9-1.3-3-6.8h6.3L1 1z" fill="#fff" stroke="#0F1418" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                  <span data-ex-note className="ex-note" style={{ left: '68%', top: '22%' }}>{e.steps[1].notes[0]}</span>
                  <span data-ex-note className="ex-note" style={{ left: '6%', top: '82%' }}>{e.steps[1].notes[1]}</span>
                </div>
                {/* 03 Performance */}
                <div data-ex-overlay className="absolute inset-0">
                  <div className="absolute bottom-[6%] left-[4%] flex flex-wrap gap-2">
                    {e.steps[2].notes.map((n) => <span key={n} data-ex-note className="ex-note static">{n}</span>)}
                  </div>
                </div>
                {/* 04 Conversion */}
                <div data-ex-overlay className="absolute inset-0">
                  <span data-ex-focus className="ex-focus" />
                  <div className="absolute bottom-[6%] left-[4%] flex items-center gap-2">
                    {e.steps[3].notes.map((n, i) => (
                      <span key={n} className="flex items-center gap-2">
                        {i > 0 && <span data-ex-note className="text-blue">→</span>}
                        <span data-ex-note className={`ex-note static ${i === 2 ? 'ex-note-strong' : ''}`}>{n}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div data-ex-phone className="ex-phone">
              <div className="ex-phone-screen">{shot('mobile', '220px')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet / reduced motion: the four states, stacked */}
      <ol className="ex-stack shell pb-24 md:pb-32">
        {e.steps.map((st, i) => (
          <li key={st.name} className="border-t border-line py-10 md:py-14">
            <div className="grid-12 gap-y-6">
              <div className="col-span-4 md:col-span-5">
                <span className="t-overline text-blue">{String(i + 1).padStart(2, '0')}</span>
                <p className="t-h2 mt-3">{st.name}</p>
                <p className="mt-3 max-w-[40ch] text-slate">{st.text}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={st.name}>
                  {st.notes.map((n) => <li key={n} className="ex-note static">{n}</li>)}
                </ul>
              </div>
              <div className="col-span-4 md:col-span-7" aria-hidden="true">
                {ORDER[i] === 'performance' ? (
                  <div className="frame flex justify-center bg-cloud py-8">
                    <div className="ex-phone static-phone"><div className="ex-phone-screen">{shot('mobile', '200px')}</div></div>
                  </div>
                ) : (
                  <div className="ex-browser">
                    <Chrome title={e.browserTitle} />
                    <div className="ex-viewport">{shot(ORDER[i], '(min-width: 768px) 55vw, 92vw')}</div>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
