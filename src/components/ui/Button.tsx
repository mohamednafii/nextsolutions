import Link from 'next/link'
import type { ReactNode } from 'react'
import { Arrow } from '@/components/brand/Logo'

/**
 * The brand call to action. One size everywhere (see `.btn` in globals.css:
 * 48px high, 6px radius, 15px label), so every button on the site lines up.
 * - ink / onInk / white: label block + clickable arrow on Next Blue.
 *   Hover: label → Blue, arrow moves 4px up-right (180ms).
 * - light: single white block, Ink label + inline arrow (over the hero film).
 */
type Props = {
  href: string
  children: ReactNode
  tone?: 'ink' | 'white' | 'onInk' | 'light'
  external?: boolean
  className?: string
  /** Swap the arrow for a new one entering from bottom-left (final CTA). */
  swapArrow?: boolean
}

export function Button({ href, children, tone = 'ink', external, className = '', swapArrow }: Props) {
  let cls: string
  let inner: ReactNode
  if (tone === 'light') {
    cls = `btn group gap-3 bg-white px-6 text-ink transition-colors duration-[180ms] hover:bg-cloud focus-visible:bg-cloud ${className}`
    inner = (
      <>
        {children}
        <Arrow tone="ink" className="arrow-nudge h-2.5 w-2.5 shrink-0" />
      </>
    )
  } else {
    const label = {
      ink: 'bg-ink text-white group-hover:bg-blue group-focus-visible:bg-blue',
      onInk: 'bg-white text-ink group-hover:bg-blue group-hover:text-white group-focus-visible:bg-blue group-focus-visible:text-white',
      white: 'bg-white text-ink group-hover:bg-cloud',
    }[tone]
    const box = tone === 'white' ? 'bg-sky' : 'bg-blue'
    cls = `btn group items-stretch ${swapArrow ? 'btn-swap' : ''} ${className}`
    inner = (
      <>
        <span className={`flex min-w-0 flex-1 items-center px-6 transition-colors duration-[180ms] ${label}`}>{children}</span>
        <span className={`relative flex aspect-square h-full items-center justify-center overflow-hidden ${box}`}>
          {swapArrow ? (
            <>
              <Arrow tone="white" className="arrow-out h-2.5 w-2.5" />
              <Arrow tone="white" className="arrow-in absolute h-2.5 w-2.5" />
            </>
          ) : (
            <Arrow tone="white" className="arrow-nudge h-2.5 w-2.5" />
          )}
        </span>
      </>
    )
  }
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  )
}

/** Text link that ends with the arrow. */
export function ArrowLink({
  href,
  children,
  onInk,
  external,
  className = '',
}: {
  href: string
  children: ReactNode
  onInk?: boolean
  external?: boolean
  className?: string
}) {
  const cls = `group inline-flex items-center gap-3 font-display font-bold text-[0.9375rem] ${onInk ? 'text-white' : 'text-ink'} ${className}`
  const inner = (
    <>
      <span className="link-draw pb-0.5">{children}</span>
      <Arrow tone={onInk ? 'sky' : 'blue'} className="arrow-nudge h-3 w-3 shrink-0" />
    </>
  )
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  )
}

export function Overline({ children, onInk, className = '' }: { children: ReactNode; onInk?: boolean; className?: string }) {
  return <p className={`t-overline ${onInk ? 'text-sky' : 'text-blue'} ${className}`}>{children}</p>
}
