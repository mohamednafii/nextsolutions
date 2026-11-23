'use client'

import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Arrow } from '@/components/brand/Logo'
import { fr } from '@/content/fr'
import { en } from '@/content/en'

export default function NotFound() {
  const pathname = usePathname() ?? ''
  const isEn = pathname === '/en' || pathname.startsWith('/en/')
  const t = isEn ? en : fr
  return (
    <section className="pb-24 pt-[calc(var(--header-h)+80px)] md:pb-36 md:pt-[calc(var(--header-h)+140px)]">
      <div className="shell grid-12 items-end gap-y-10">
        <div className="col-span-4 md:col-span-7">
          <p data-n="404" className="t-num text-[clamp(6rem,3rem+12vw,14rem)] text-line before:content-[attr(data-n)]" aria-hidden="true" />
          <h1 className="t-h1 mt-6">{t.notFound.title}</h1>
          <p className="t-lead mt-5 max-w-[40ch] text-slate">{t.notFound.text}</p>
          <div className="mt-10">
            <Button href={isEn ? '/en' : '/'}>{t.notFound.home}</Button>
          </div>
        </div>
        <div className="col-span-4 hidden justify-self-end md:col-span-5 md:block">
          <Arrow className="h-40 w-40" />
        </div>
      </div>
    </section>
  )
}
