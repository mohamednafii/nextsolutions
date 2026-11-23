'use client'

import { useRouter } from 'next/navigation'
import { useState, type MouseEvent } from 'react'
import { Arrow } from '@/components/brand/Logo'
import type { ReactNode } from 'react'
import { expandToPage } from './expandTransition'
import { ViewCursor } from './ViewCursor'

type Item = {
  slug: string
  href: string
  title: string
  category: string
  meta: string
  cover: ReactNode
  services: string[]
}

/** Project grid that reorganises softly (300ms) when filtered. */
export function WorkGrid({ items, filters, allLabel, filterLabel, viewLabel }: {
  items: Item[]
  filters: { value: string; label: string }[]
  allLabel: string
  filterLabel: string
  viewLabel: string
}) {
  const [active, setActive] = useState('all')
  const router = useRouter()
  const visible = items.filter((i) => active === 'all' || i.services.includes(active))

  const onOpen = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    const media = e.currentTarget.querySelector<HTMLElement>('[data-media]')
    if (!media) return
    e.preventDefault()
    expandToPage(media, () => router.push(href))
  }

  return (
    <div>
      <ViewCursor label={viewLabel} />
      <div role="group" aria-label={filterLabel} className="flex flex-wrap gap-2">
        {[{ value: 'all', label: allLabel }, ...filters].map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={active === f.value}
            onClick={() => setActive(f.value)}
            className={`btn border px-5 transition-colors duration-[180ms] ${
              active === f.value ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-14 md:mt-14 md:grid-cols-2">
        {visible.map((item) => (
          <li key={item.slug} className="animate-[page-enter_300ms_var(--ease-ascent)_both]">
            <a href={item.href} data-cursor="view" onClick={(e) => onOpen(e, item.href)} className="group block">
              <div data-media className="frame relative aspect-[16/10] overflow-hidden bg-cloud">
                <div className="h-full w-full transition-transform duration-700 ease-ascent group-hover:scale-[1.03]">{item.cover}</div>
              </div>
              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <p className="t-h3">{item.title}</p>
                  <p className="mt-1 text-slate">{item.meta}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-right font-display font-bold text-blue">{item.category}</p>
                  <Arrow className="arrow-nudge h-3.5 w-3.5 shrink-0" />
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
