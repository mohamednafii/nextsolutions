import Image from 'next/image'

/**
 * Client logos — confirmed ones only, supplied by the client (see the asset
 * README: the three "MOCKUP" identities are unverified and must not be shown).
 * White artwork on transparent PNG, intrinsic ratios preserved; `s` is an
 * optical scale of the bar height so wide wordmarks and compact symbols read
 * at the same weight. Wide and compact marks alternate.
 * Horma Group, CCM and Dima Style: converted to white from the client's
 * originals (2026-11-22); Horma Group replaces its symbol-only « globe ».
 */
const LOGOS = [
  { src: '/images/clients/horma-group.png', w: 877, h: 540, s: 1, alt: 'Horma Group' },
  { src: '/images/clients/al-hurra.png', w: 620, h: 510, s: 1.12, alt: 'Al Hurra' },
  { src: '/images/clients/ccm.png', w: 766, h: 309, s: 0.8, alt: 'CCM — Carrefour Commercial Marocain' },
  { src: '/images/clients/volt-gaming.png', w: 333, h: 466, s: 0.95, alt: 'Volt Gaming' },
  { src: '/images/clients/dima-style.png', w: 875, h: 305, s: 0.74, alt: 'Dima Style' },
]
/** Logos per half of the loop (the confirmed sequence repeated to span wide screens). */
const REPEAT = 5
const H = 34 // rendered logo height on desktop (CSS scales it down on phones)

/**
 * « Ils nous font confiance » — infinite logo marquee closing the first screen.
 * Two identical halves slide by exactly 50% (CSS transform, linear, no JS per
 * frame), so the loop never jumps. Duplication is only for the loop: screen
 * readers get each logo once. Pauses on hover; static with reduced motion.
 * Sits in the normal flow between the hero and « Notre vision ». No JS.
 */
export function TrustBar({ label }: { label: string }) {
  const half = (hidden: boolean) => (
    <ul className="trust-set" aria-hidden={hidden || undefined}>
      {Array.from({ length: REPEAT }, (_, r) =>
        LOGOS.map((l) => (
          <li key={`${r}-${l.src}`} className="trust-item" aria-hidden={hidden || r > 0 || undefined}>
            <Image
              src={l.src}
              alt={hidden || r > 0 ? '' : l.alt}
              width={Math.round((H * l.s * l.w) / l.h)}
              height={Math.round(H * l.s)}
              style={{ '--s': l.s } as React.CSSProperties}
              loading="eager"
              className="trust-logo"
            />
          </li>
        )),
      )}
    </ul>
  )

  return (
    <div className="trust-wrap">
      <section data-trust aria-label={label} data-header-dark className="trust">
        <div className="trust-inner shell">
          <p className="trust-label">
            <span className="trust-dot" aria-hidden="true" />
            {label}
          </p>
          <div className="trust-marquee">
            <div className="trust-track">
              {half(false)}
              {half(true)}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
