import {
  COMPACT_SYMBOL_TRANSFORM,
  COMPACT_VIEWBOX,
  SYMBOL_ARROW,
  SYMBOL_N,
  WORDMARK_LETTERS,
} from './wordmark-data'

/**
 * Official artwork, inlined from the brand kit SVG files (paths untouched).
 * Only the approved colour variants are exposed:
 *   color    → Ink N + Next Blue arrow   (white / Cloud backgrounds)
 *   reversed → White N + Sky arrow       (Ink backgrounds)
 */
type Variant = 'color' | 'reversed'

const palette = {
  color: { n: '#0F1418', arrow: '#0054DB' },
  reversed: { n: '#FFFFFF', arrow: '#3D7BFF' },
} as const

export function Symbol({
  variant = 'color',
  className,
  title,
}: {
  variant?: Variant
  className?: string
  title?: string
}) {
  const c = palette[variant]
  return (
    <svg
      viewBox="-1 -1 76 63"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g strokeWidth="1.2" strokeLinejoin="round">
        <path data-symbol-n fill={c.n} stroke={c.n} d={SYMBOL_N} />
        <path data-symbol-arrow fill={c.arrow} stroke={c.arrow} d={SYMBOL_ARROW} />
      </g>
    </svg>
  )
}

/** The clickable arrow (brand kit 02-Logo/SVG/arrow). Approved colours only. */
export function Arrow({
  tone = 'blue',
  className,
}: {
  tone?: 'blue' | 'ink' | 'sky' | 'white'
  className?: string
}) {
  const fill = { blue: '#0054DB', ink: '#0F1418', sky: '#3D7BFF', white: '#FFFFFF' }[tone]
  return (
    <svg viewBox="37 -1 38 38" className={className} aria-hidden="true">
      <path fill={fill} stroke={fill} strokeWidth="1.2" strokeLinejoin="round" d={SYMBOL_ARROW} />
    </svg>
  )
}

/** Compact logo (symbol + wordmark). Minimum width 96px per guidelines. */
export function LogoCompact({
  variant = 'color',
  className,
  title,
  letterAttr = false,
}: {
  variant?: Variant
  className?: string
  title?: string
  /** Adds data-letter to each glyph group so it can be revealed one by one. */
  letterAttr?: boolean
}) {
  const c = palette[variant]
  return (
    <svg
      viewBox={COMPACT_VIEWBOX}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g
        transform={COMPACT_SYMBOL_TRANSFORM}
        strokeWidth="1.2"
        strokeLinejoin="round"
        data-letter={letterAttr ? '' : undefined}
      >
        <path fill={c.n} stroke={c.n} d={SYMBOL_N} />
        <path fill={c.arrow} stroke={c.arrow} d={SYMBOL_ARROW} />
      </g>
      {WORDMARK_LETTERS.map((l, i) => (
        <path
          key={i}
          d={l.d}
          fill={l.word === 0 ? c.n : c.arrow}
          data-letter={letterAttr ? '' : undefined}
        />
      ))}
    </svg>
  )
}
