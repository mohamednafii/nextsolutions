import type { CSSProperties, ReactNode } from 'react'

/**
 * Calm internal-page header: overline, large title rising from its mask,
 * lead fading in. Same CSS keyframes as the hero (no hydration wait, honours
 * reduced motion). Server component.
 */
export function PageHeader({ overline, title, lead, children, aside }: {
  overline?: ReactNode
  title: string
  lead?: string
  children?: ReactNode
  aside?: ReactNode
}) {
  const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties
  return (
    <section className="pt-[calc(var(--header-h)+56px)] md:pt-[calc(var(--header-h)+96px)]">
      <div className="shell grid-12 items-end gap-y-10">
        <div className={`col-span-4 ${aside ? 'md:col-span-12 lg:col-span-6' : 'md:col-span-10'}`}>
          {overline && <div data-hero-fade style={d(-400)} className="t-overline text-blue">{overline}</div>}
          <h1 className="t-display mt-6 overflow-hidden pb-[0.08em] md:mt-8">
            <span data-hero-line className="block">{title}</span>
          </h1>
          {lead && <p data-hero-fade style={d(-200)} className="t-lead mt-6 max-w-[52ch] text-slate md:mt-8">{lead}</p>}
          {children && <div data-hero-fade style={d(-120)} className="mt-8 md:mt-10">{children}</div>}
        </div>
        {aside && <div data-hero-fade style={d(-60)} className="col-span-4 md:col-span-12 lg:col-span-6">{aside}</div>}
      </div>
    </section>
  )
}
