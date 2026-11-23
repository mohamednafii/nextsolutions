import Link from 'next/link'
import type { Dictionary } from '@/content'
import { href, type Locale } from '@/lib/i18n'
import { site, whatsappHref } from '@/lib/site'
import { LogoCompact } from '@/components/brand/Logo'
import { BackToTop } from './BackToTop'

/** Minimal line icons for the social accounts (shown only when configured). */
const SOCIAL_ICON: Record<string, React.ReactNode> = {
  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8 10.5V16.5M8 7.6V7.7M11.5 16.5V10.5M11.5 13.2C11.5 11.6 12.6 10.4 14 10.4S16.5 11.5 16.5 13V16.5" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <path d="M16.9 7.1V7.2" />
    </>
  ),
  facebook: <path d="M13.5 20.5V12.8H16L16.4 9.8H13.5V8.1C13.5 7.2 13.8 6.6 15 6.6H16.5V4C16.2 3.9 15.3 3.8 14.3 3.8 12.1 3.8 10.5 5.1 10.5 7.6V9.8H8V12.8H10.5V20.5" />,
}
const SOCIAL_NAME: Record<string, string> = { linkedin: 'LinkedIn', instagram: 'Instagram', facebook: 'Facebook' }

/**
 * Site footer (every page), on Ink. On the homepage it continues the final
 * statement without a seam. Deliberately quiet (client: one brand mark, no
 * oversized wordmark): a hairline; the official logo once, small, with the
 * brand line; the navigation in two short columns; the contact points that
 * are actually configured (location always; WhatsApp, e-mail, phone and social
 * accounts only when set in lib/site.ts — nothing invented); then a compact
 * bottom line: ©, legal pages, back to top.
 */
export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const wa = whatsappHref()
  const socials = Object.entries(site.social).filter((e): e is [string, string] => Boolean(e[1]))
  const year = new Date().getFullYear()
  const home = href('home', locale)
  const nav = [
    [
      { href: home, label: t.footer.home },
      { href: `${home}#nos-expertises`, label: t.footer.expertises },
      { href: `${home}#realisations`, label: t.footer.work },
    ],
    [
      { href: `${home}#approche`, label: t.footer.approach },
      { href: `${home}#agence`, label: t.footer.agency },
      { href: href('start', locale), label: t.footer.contact },
    ],
  ]
  const contacts = [
    wa && { href: wa, label: 'WhatsApp', external: true },
    site.email && { href: `mailto:${site.email}`, label: site.email, external: false },
    site.phone && { href: `tel:${site.phone.replace(/\s/g, '')}`, label: site.phone, external: false },
  ].filter((c): c is { href: string; label: string; external: boolean } => Boolean(c))

  return (
    <footer data-header-dark className="ft on-ink">
      <div className="shell">
        <div className="ft-top">
          <div className="ft-brand">
            <LogoCompact variant="reversed" title={site.name} className="h-6 w-auto md:h-7" />
            <p className="ft-tagline">{t.footer.tagline}</p>
          </div>

          <nav aria-label={t.a11y.footerNav} className="ft-col ft-nav">
            <p className="ft-title t-overline">{t.footer.explore}</p>
            <div className="ft-nav-cols">
              {nav.map((col, i) => (
                <ul key={i}>
                  {col.map((n) => (
                    <li key={n.label}>
                      <Link href={n.href} className="ft-link ft-link-strong">
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </nav>

          <div className="ft-col">
            <p className="ft-title t-overline">{t.footer.contactTitle}</p>
            <ul className="ft-contact">
              <li className="text-white">{t.footer.location}</li>
              {contacts.map((c) => (
                <li key={c.label}>
                  <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="ft-link">
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
            {socials.length > 0 && (
              <ul className="ft-social" aria-label={t.footer.social}>
                {socials.map(([name, url]) => (
                  <li key={name}>
                    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_NAME[name] ?? name} className="ft-social-link">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        {SOCIAL_ICON[name]}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="ft-bottom">
          <p>
            © {year} {t.footer.copyright}
          </p>
          <ul className="ft-legal">
            <li>
              <Link href={href('legal', locale)} className="ft-link">
                {t.footer.legal}
              </Link>
            </li>
            <li>
              <Link href={href('privacy', locale)} className="ft-link">
                {t.footer.privacy}
              </Link>
            </li>
          </ul>
          <BackToTop label={t.footer.top} />
        </div>
      </div>
    </footer>
  )
}
