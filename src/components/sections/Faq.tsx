import { Reveal } from '@/components/motion/Reveal'

/** Native <details> accordion: accessible, works without JS, indexable. */
export function Faq({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  return (
    <section aria-labelledby="faq-title" className="py-20 md:py-28">
      <div className="shell grid-12 gap-y-10">
        <h2 id="faq-title" className="t-h2 col-span-4 md:col-span-4">{title}</h2>
        <Reveal className="col-span-4 border-t border-ink md:col-span-8">
          {items.map((item) => (
            <details key={item.q} data-reveal className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-lg font-semibold tracking-[-0.01em] md:text-xl [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="relative h-3.5 w-3.5 shrink-0" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-px w-full bg-ink" />
                  <span className="absolute left-1/2 top-0 h-full w-px bg-ink transition-transform duration-300 ease-ascent group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-[62ch] pb-7 text-slate">{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
