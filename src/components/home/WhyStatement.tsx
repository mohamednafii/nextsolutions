'use client'

import { useRef } from 'react'
import type { Dictionary } from '@/content'
import { gsap, useGSAP, FULL, whenNear } from '@/lib/gsap'
import { ChapterLabel } from '@/components/ui/ChapterLabel'

type W = Dictionary['home']['why']

/**
 * Section 09 — « Le design attire. La confiance transforme. La qualité fait la
 * différence. » The statement, at the section scale of « Notre vision », lights
 * up word by word as it is read (scrubbed with the scroll, reverses on the way
 * back), the last sentence landing in Next Blue; five principles in a white
 * card on the right, each arriving with its hairline.
 */
export function WhyStatement({ w }: { w: W }) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL, () =>
        whenNear(ref.current!, () => {
        const root = ref.current!
        const words = gsap.utils.toArray<HTMLElement>('[data-why-word]', root)
        // Words go from Mute (#8A93A0, 3:1 on white for large type) to Ink; the last sentence to Next Blue.
        gsap.fromTo(words, { color: '#8A93A0' }, {
          color: (i: number, el: HTMLElement) => (el.dataset.whyWord === 'last' ? '#0054DB' : '#0F1418'),
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: { trigger: root.querySelector('[data-why-statement]'), start: 'top 78%', end: 'bottom 45%', scrub: true },
        })
        gsap.utils.toArray<HTMLElement>('[data-why-item]', root).forEach((li, i) => {
          const st = { trigger: li, start: 'top 90%', once: true }
          const line = li.querySelector('[data-why-line]')
          if (line) gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.9, delay: i * 0.04, ease: 'ascent', transformOrigin: '0% 50%', scrollTrigger: st })
          gsap.from(li.querySelectorAll('[data-why-rise]'), { y: 16, opacity: 0, duration: 0.7, stagger: 0.06, delay: 0.1, ease: 'ascent', scrollTrigger: st })
        })
        }),
      )
      return () => mm.revert()
    },
    { scope: ref },
  )

  const last = w.title.length - 1
  return (
    <section ref={ref} id="difference" aria-labelledby="why-title" className="bg-white py-24 md:py-36">
      <div className="shell grid-12 items-center gap-y-14">
        <div className="col-span-4 md:col-span-12 lg:col-span-6">
          <ChapterLabel n="09" label={w.label} />
          <h2 id="why-title" data-why-statement className="why-statement t-display mt-6 md:mt-8">
            {w.title.map((line, li) => {
              const words = line.split(' ')
              return (
                <span key={line} className="block">
                  {words.map((word, wi) => (
                    <span key={wi} data-why-word={li === last ? 'last' : ''} className={li === last ? 'text-blue' : undefined}>
                      {word}
                      {wi < words.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </span>
              )
            })}
          </h2>
        </div>
        <ol className="card col-span-4 px-6 py-2 md:col-span-10 md:col-start-3 md:px-8 lg:col-span-5 lg:col-start-8">
          {w.principles.map((p, i) => (
            <li key={p.name} data-why-item className="relative py-6">
              {i > 0 && <span data-why-line className="absolute inset-x-0 top-0 block h-px bg-line" aria-hidden="true" />}
              <div className="flex items-baseline gap-5">
                <span data-why-rise className="t-overline text-blue">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 data-why-rise className="font-display text-[1.1875rem] font-bold tracking-[-0.015em]">{p.name}</h3>
                  <p data-why-rise className="mt-1.5 text-[0.9375rem] text-slate">{p.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
