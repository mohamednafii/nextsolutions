import type { Locale } from '@/lib/i18n'

/**
 * « Nos réalisations » (homepage chapter 04) — the projects of the centred
 * device carousel, in order. Section copy lives in the dictionaries
 * (home.realisations); this file only holds projects and their device renders.
 *
 * Every project is shown in the SAME laptop and phone (one geometry, one light):
 * generate the renders from a site's captures with
 *   python scripts/device-mockup.py <id> --desktop desktop.png [--mobile mobile.png]
 * which writes public/images/realisations/<id>-laptop.webp / -phone.webp.
 *
 * RULES
 *  - Only `published` projects with a laptop render are shown.
 *  - `href` is a real route of this site or a real external URL — never a placeholder.
 *  - Label studio work, concepts and unfinished projects as such (`tag`).
 */
type L10n = Record<Locale, string>

export type DeviceShot = { src: string; width: number; height: number }

export type ShowcaseProject = {
  id: string
  published: boolean
  name: string
  category: L10n
  /** Accurate status shown next to the category. */
  tag?: 'studio' | 'concept' | 'inProgress'
  /** `work` (Réalisations page), `project:<slug>` (case study) or an https:// URL. Omit: shown without a link. */
  href?: 'work' | `project:${string}` | `https://${string}`
  laptop: DeviceShot | null
  /** Omit when the project has no mobile version (the laptop is then centred alone). */
  phone?: DeviceShot | null
}

const laptop = (id: string): DeviceShot => ({ src: `/images/realisations/${id}-laptop.webp`, width: 1440, height: 905 })
const phone = (id: string): DeviceShot => ({ src: `/images/realisations/${id}-phone.webp`, width: 675, height: 1483 })

export const projects: ShowcaseProject[] = [
  // Client work supplied on 2026-11-22. Renders from captures of the live sites
  // (hormagroup.com, zaynaatlas.com) and of the Dima Style design (Claude Design
  // project; no public URL yet, so it links to the Réalisations page).
  {
    id: 'horma-group',
    published: true,
    name: 'Horma Group',
    category: { fr: 'Import-export · Site institutionnel', en: 'Import & export · Corporate website' },
    href: 'https://hormagroup.com',
    // v4 (2026-11-22): portfolio render of the hero, at the client's request: floating assistant badge hidden,
    // larger type, the four service points left out (kicker, headline, one-sentence explanation, calls to action;
    // the live site still shows the list). New file name = fresh image cache.
    laptop: laptop('horma-group-v4'),
    phone: phone('horma-group-v4'),
  },
  {
    id: 'zayna-atlas',
    published: true,
    name: 'Zayna Atlas',
    category: { fr: 'Cosmétique naturelle · E-commerce', en: 'Natural cosmetics · E-commerce' },
    href: 'https://zaynaatlas.com',
    laptop: laptop('zayna-atlas'),
    phone: phone('zayna-atlas'),
  },
  {
    id: 'dima-style',
    published: true,
    name: 'Dima Style',
    category: { fr: 'Mode · E-commerce', en: 'Fashion · E-commerce' },
    // No public URL yet: shown without a link.
    laptop: laptop('dima-style'),
    phone: phone('dima-style'),
  },
  {
    // Temporary content supplied by the client on 2026-11-22, replaced by the projects above.
    id: 'maison-des-amis',
    published: false,
    name: 'La Maison des Amis',
    category: { fr: 'Hôtellerie · Site web sur mesure', en: 'Hospitality · Custom website' },
    href: 'work',
    laptop: laptop('maison-des-amis'),
    phone: phone('maison-des-amis'),
  },
  {
    id: 'next-solutions',
    // Removed from the carousel at the client's request (2026-11-23).
    published: false,
    name: 'Next Solutions',
    category: { fr: 'Site web sur mesure', en: 'Custom website' },
    tag: 'studio',
    // One-page site for now: the case study page is not published, so no link.
    laptop: laptop('next-solutions'),
    phone: phone('next-solutions'),
  },
  {
    id: 'identite-next-solutions',
    // Removed from the carousel at the client's request (2026-11-22).
    published: false,
    name: 'Identité Next Solutions',
    category: { fr: 'Identité de marque', en: 'Brand identity' },
    tag: 'studio',
    href: 'project:identite-next-solutions',
    laptop: laptop('identite-next-solutions'),
  },
  // Reference slots — awaiting captures and confirmation (not shown until then).
  { id: 'sao-eleven', published: false, name: 'SAO Eleven', category: { fr: '', en: '' }, laptop: null },
  { id: 'vert-marine', published: false, name: 'Vert Marine', category: { fr: '', en: '' }, laptop: null },
  { id: 'traiteur', published: false, name: 'Traiteur', category: { fr: '', en: '' }, laptop: null },
  { id: 'awda', published: false, name: 'Awda', category: { fr: '', en: '' }, laptop: null },
]

export function getShowcase(): ShowcaseProject[] {
  return projects.filter((p) => p.published && p.laptop)
}
