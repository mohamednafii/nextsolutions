import type { ReactNode } from 'react'

export function LegalBody({ title, sections, children }: {
  title: string
  sections: { title: string; body: string }[]
  children?: ReactNode
}) {
  return (
    <section className="pb-24 pt-[calc(var(--header-h)+56px)] md:pb-36 md:pt-[calc(var(--header-h)+96px)]">
      <div className="shell grid-12 gap-y-12">
        <h1 className="t-h1 col-span-4 md:col-span-4">{title}</h1>
        <div className="col-span-4 md:col-span-7 md:col-start-6">
          {children}
          {sections.map((s) => (
            <div key={s.title} className="border-t border-line py-8">
              <h2 className="t-h3">{s.title}</h2>
              <p className="mt-3 max-w-[64ch] text-slate">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
