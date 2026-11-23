'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Arrow, LogoCompact } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'
import { switchLocalePath, toPublicPath, type Locale } from '@/lib/i18n'

export type HeaderLabels = {
  home: string
  mainNav: string
  menuOpen: string
  menuClose: string
  language: string
  scrollProgress: string
  services: string
  switchTo: string
  switchShort: string
  start: string
  whatsapp: string
}
type NavLink = { href: string; label: string }

type Props = {
  locale: Locale
  homeHref: string
  startHref: string
  links: NavLink[]
  services: (NavLink & { index: string })[]
  labels: HeaderLabels
  whatsappHref?: string
}

export function Header({ locale, homeHref, startHref, links, services, labels, whatsappHref }: Props) {
  const pathname = toPublicPath(usePathname() ?? '/')
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  // Over an Ink section ([data-header-dark]) the header switches to its reversed tone.
  // The homepage opens on Ink, so its first (server) render is already dark.
  const [overDark, setOverDark] = useState(() => pathname === '/' || pathname === '/en')
  const fillRef = useRef<SVGRectElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const lastY = useRef(0)
  const other: Locale = locale === 'fr' ? 'en' : 'fr'

  // Hide on scroll down, show on scroll up; white background after first scroll.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(y > 8)
      // What is actually painted under the header (chapters can overlap while one
      // rises over another): the topmost element at the probe point, header excluded.
      const probe = 36
      const under = document.elementsFromPoint(window.innerWidth / 2, probe).find((el) => !headerRef.current?.contains(el))
      setOverDark(Boolean(under?.closest('[data-header-dark]')))
      if (Math.abs(y - lastY.current) > 6) {
        setHidden(y > lastY.current && y > 160)
        lastY.current = y
      }
      // Progress arrow fills bottom → top with page scroll.
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0
      fillRef.current?.setAttribute('y', String(37 - 38 * p))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [pathname])

  // Close menus on navigation.
  const [seenPath, setSeenPath] = useState(pathname)
  if (seenPath !== pathname) {
    setSeenPath(pathname)
    setOpen(false)
    setServicesOpen(false)
  }

  // Lock scroll + Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const solid = scrolled || open
  const dark = overDark && !open

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-300 ease-ascent ${
        // No translate while the menu is open: a transformed header would become the containing block of the fixed menu panel (zero height).
        open ? '' : hidden ? '-translate-y-full' : 'translate-y-0'
      } ${solid ? (dark ? 'border-b border-ink-line bg-ink' : 'border-b border-line bg-white') : 'border-b border-transparent bg-transparent'} ${dark ? 'on-ink' : ''}`}
    >
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href={homeHref} aria-label={labels.home} className="relative z-10 block shrink-0" data-header-logo>
          <LogoCompact variant={dark ? 'reversed' : 'color'} className="h-6 w-auto md:h-7" />
        </Link>

        <nav aria-label={labels.mainNav} className="hidden items-center gap-9 whitespace-nowrap xl:flex">
          {services.length > 0 && (
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setServicesOpen(false)
            }}
          >
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-controls="nav-services"
              onClick={() => setServicesOpen((v) => !v)}
              onKeyDown={(e) => e.key === 'Escape' && setServicesOpen(false)}
              className={`flex h-[var(--header-h)] items-center gap-2 font-display text-[0.9375rem] font-semibold transition-colors duration-300 ${dark ? 'text-white' : 'text-ink'}`}
            >
              <span className="link-draw pb-0.5">{labels.services}</span>
              <svg viewBox="0 0 10 6" className={`h-1.5 w-2.5 transition-transform duration-300 ease-ascent ${servicesOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <div
              id="nav-services"
              className={`absolute left-1/2 top-full w-[420px] -translate-x-1/2 border border-line bg-white transition-[opacity,transform,visibility] duration-300 ease-ascent ${
                servicesOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
              }`}
            >
              <ul>
                {services.map((s) => (
                  <li key={s.href} className="border-b border-line last:border-b-0">
                    <Link
                      href={s.href}
                      className="group flex items-center justify-between gap-6 px-6 py-5 transition-colors duration-[180ms] hover:bg-cloud"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="t-overline text-slate">{s.index}</span>
                        <span className="font-display text-base font-semibold">{s.label}</span>
                      </span>
                      <Arrow className="arrow-nudge h-3 w-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          )}
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? 'page' : undefined}
              className={`font-display text-[0.9375rem] font-semibold transition-colors duration-300 ${dark ? 'text-white' : 'text-ink'}`}
            >
              <span className={`link-draw pb-0.5 ${isActive(l.href) ? '!bg-[length:100%_1px]' : ''}`}>{l.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Reading progress: the arrow fills with blue from bottom to top */}
          <svg viewBox="37 -1 38 38" className="hidden h-4 w-4 xl:block" role="img" aria-label={labels.scrollProgress}>
            <defs>
              <clipPath id="progress-arrow">
                <path d="M38 0h36v36L63 25V11H49z" />
              </clipPath>
            </defs>
            <g clipPath="url(#progress-arrow)">
              <rect x="37" y="-1" width="38" height="38" fill={dark ? '#2A323B' : '#E3E7ED'} />
              <rect ref={fillRef} x="37" y="37" width="38" height="38" fill="#0054DB" />
            </g>
          </svg>
          <Link
            href={switchLocalePath(pathname, other)}
            hrefLang={other}
            lang={other}
            aria-label={`${labels.switchShort} — ${labels.switchTo}`}
            className={`hidden font-display text-[0.8125rem] font-bold tracking-[0.12em] transition-colors duration-[180ms] sm:block ${dark ? 'text-ink-mute hover:text-white' : 'text-slate hover:text-ink'}`}
          >
            {labels.switchShort}
          </Link>
          <span className="hidden sm:flex">
            <Button href={startHref} tone={dark ? 'light' : 'ink'}>
              {labels.start}
            </Button>
          </span>
          <button
            type="button"
            className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center xl:hidden"
            aria-label={open ? labels.menuClose : labels.menuOpen}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span className={`absolute left-0 top-0 h-0.5 w-6 transition-[transform,background-color] ${dark ? 'bg-white' : 'bg-ink'} duration-300 ease-ascent ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
              <span className={`absolute bottom-0 left-0 h-0.5 w-6 transition-[transform,background-color] ${dark ? 'bg-white' : 'bg-ink'} duration-300 ease-ascent ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto bg-white xl:hidden"
        data-lenis-prevent
      >
        <nav aria-label={labels.mainNav} className="shell flex min-h-full flex-col pb-10 pt-6">
          {services.length > 0 && (
          <>
          <p className="t-overline mb-3 text-blue">{labels.services}</p>
          <ul className="border-t border-ink">
            {services.map((s) => (
              <li key={s.href} className="border-b border-line">
                <Link href={s.href} className="group flex items-center justify-between py-4">
                  <span className="flex items-baseline gap-4">
                    <span className="t-overline text-slate">{s.index}</span>
                    <span className="font-display text-xl font-bold tracking-[-0.02em]">{s.label}</span>
                  </span>
                  <Arrow className="h-3 w-3" />
                </Link>
              </li>
            ))}
          </ul>
          </>
          )}
          <ul className={services.length > 0 ? 'mt-8' : 'border-t border-ink pt-4'}>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block py-2.5 font-display text-[1.75rem] font-extrabold tracking-[-0.03em]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-5 pt-10">
            <Button href={startHref} className="w-full">
              {labels.start}
            </Button>
            <div className="flex items-center justify-between">
              {whatsappHref ? (
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="font-display text-sm font-bold underline underline-offset-4">
                  {labels.whatsapp}
                </a>
              ) : (
                <span />
              )}
              <Link href={switchLocalePath(pathname, other)} hrefLang={other} lang={other} className="font-display text-sm font-bold text-slate">
                {labels.switchTo}
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
