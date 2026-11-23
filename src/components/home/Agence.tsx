'use client'

import Image from 'next/image'
import { useRef } from 'react'
import type { Dictionary } from '@/content'
import { EXPERIENCE, FOUNDERS } from '@/content/founders'
import { gsap, useGSAP, FULL, whenNear } from '@/lib/gsap'
import { ChapterLabel } from '@/components/ui/ChapterLabel'
import { SplitTitle } from '@/components/motion/SplitTitle'

type G = Dictionary['home']['agence']

/**
 * Section 06 — « Deux cofondateurs. Une même vision. »
 * Two founders, equal treatment, kept small and quiet: a compact portrait,
 * beside it the role, the name, the specialty and the degree; under both, a
 * hairline and a row of past professional experience (colour logos, same
 * optical height). The logos are each founder's own experience, not clients
 * of the agency. Side by side from 1024px, one under the other below.
 *
 * Motion (once, on entry): the title rises out of its line masks, the portraits
 * open with a vertical clip one after the other, then the text and the logos
 * arrive. Hover (fine pointers): the photo eases to 1.025, a short blue line
 * draws under the name. Reduced motion and no-JS: everything is simply there.
 */
export function Agence({ g }: { g: G }) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(FULL, () =>
        whenNear(ref.current!, () => {
          const root = ref.current!
          gsap.from(root.querySelectorAll('[data-ag-lead]'), {
            y: 18,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'ascent',
            scrollTrigger: { trigger: root.querySelector('[data-ag-lead]'), start: 'top 88%', once: true },
          })
          gsap.utils.toArray<HTMLElement>('[data-ag-founder]', root).forEach((el, i) => {
            const tl = gsap.timeline({ delay: i * 0.16, scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
            tl.fromTo(
              el.querySelector('[data-ag-photo]'),
              { clipPath: 'inset(100% 0% 0% 0% round 14px)' },
              { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1.25, ease: 'ascent', clearProps: 'clipPath' },
            )
              .from(el.querySelector('[data-ag-zoom]'), { scale: 1.06, duration: 1.6, ease: 'ascent', clearProps: 'transform' }, 0)
              .from(el.querySelectorAll('[data-ag-rise]'), { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.07, ease: 'ascent' }, 0.55)
              .from(el.querySelectorAll('[data-ag-logo]'), { y: 6, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: 'ascent' }, '-=0.35')
          })
        }),
      )
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="agence" aria-labelledby="ag-title" className="ag">
      <div className="shell">
        <header className="ag-head">
          <div>
            <ChapterLabel n="06" label={g.label} />
            <SplitTitle id="ag-title" className="t-display mt-6 md:mt-8">
              {g.title[0]}
              <br />
              {g.title[1]} <span className="text-blue">{g.accent}</span>
            </SplitTitle>
          </div>
          <p data-ag-lead className="ag-lead">
            {g.lead}
          </p>
        </header>

        <ul className="ag-grid">
          {FOUNDERS.map((f, i) => {
            const t = g.founders[i]
            return (
              <li key={f.id} data-ag-founder className="ag-founder">
                <article aria-labelledby={`ag-${f.id}`} className="ag-person">
                  <div data-ag-photo className="ag-photo">
                    {f.portrait ? (
                      <div data-ag-zoom className="ag-zoom">
                        <Image
                          src={f.portrait.src}
                          width={f.portrait.width}
                          height={f.portrait.height}
                          alt={`${g.portraitOf} ${f.name}, ${t.title.toLowerCase()}`}
                          sizes="(min-width: 1024px) 13rem, (min-width: 640px) 10rem, 8.5rem"
                          className="ag-img"
                        />
                      </div>
                    ) : (
                      <div className="ag-pending" role="img" aria-label={`${g.pending} — ${f.name}`}>
                        <span>{g.pending}</span>
                      </div>
                    )}
                  </div>

                  <div className="ag-info">
                    <p data-ag-rise className="ag-role t-overline">
                      <span>{g.role}</span>
                      <span className="ag-n tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    </p>
                    <h3 data-ag-rise id={`ag-${f.id}`} className="ag-name">
                      {f.name}
                      <span className="ag-accent" aria-hidden="true" />
                    </h3>
                    <p data-ag-rise className="ag-title">
                      {t.title}
                    </p>
                    <p data-ag-rise className="ag-degree">
                      {t.degree}
                    </p>
                  </div>

                  <div data-ag-rise className="ag-exp">
                      <p className="ag-exp-label t-overline">{g.experiences}</p>
                      <ul className="ag-logos" aria-label={`${g.experiencesOf} ${f.name}`}>
                        {f.experience.map((id) => {
                          const x = EXPERIENCE[id]
                          return (
                            <li key={id} data-ag-logo style={{ height: `${x.size}em` }} data-provisional={x.provisional || undefined}>
                              {/* eslint-disable-next-line @next/next/no-img-element -- vector marks at their own proportions; no optimisation needed */}
                              <img src={x.src} width={x.width} height={x.height} alt={x.name} loading="lazy" decoding="async" />
                            </li>
                          )
                        })}
                      </ul>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
