import type { Locale } from '@/lib/i18n'
import type { ServiceKey } from './index'

/**
 * Project / proof content. This file is the single source for case studies,
 * business metrics and testimonials, shaped so it can be swapped for a CMS
 * (Sanity) query later without touching components.
 *
 * RULES
 *  - Only real, client-approved projects with `published: true` are ever rendered.
 *  - `result` and `metrics` must be verified figures.
 *  - With zero published projects the homepage showcase hides itself and
 *    /realisations shows an honest empty state. Same for metrics/testimonials.
 */
type L10n = Record<Locale, string>

export type ProjectImage = { src: string; width: number; height: number; alt: L10n }

export type Project = {
  slug: string
  published: boolean
  /** Our own work (the agency is the client). Shown with a "Projet studio" tag. */
  studio?: boolean
  client: string
  /** Project name as shown on cards and the case study. */
  title: L10n
  /** One category, e.g. "Site web sur mesure". */
  category: L10n
  sector: L10n
  services: ServiceKey[]
  year: number
  /** Optional, five words maximum, verified. */
  result?: L10n
  /** One line. */
  summary: L10n
  /** Case study: Challenge → Strategy → Design → Development → Outcome. */
  challenge: L10n
  strategy?: L10n
  design?: L10n
  development?: L10n
  /** Legacy single "solution" block, used when the three steps above are absent. */
  solution?: L10n
  outcome: L10n
  metrics?: { value: number; prefix?: string; suffix?: string; label: L10n }[]
  /** 16:10 capture. When null a neutral branded frame is rendered instead. */
  cover: ProjectImage | null
  /** Optional portrait capture used on phones instead of the cover. */
  coverMobile?: ProjectImage
  /** Show captures as boards on a Cloud ground (for white documents). */
  board?: boolean
  /** First image is the hover reveal on cards. */
  gallery: ProjectImage[]
  url?: string
}

export type Metric = { value: number; prefix?: string; suffix?: string; label: L10n }

export type Testimonial = {
  quote: L10n
  name: string
  role: L10n
  company: string
  portrait: ProjectImage | null
}

/**
 * Layout samples — NOT real work. They exist only so the showcase, the grid and
 * the detail page can be previewed in development with
 * `SHOW_DRAFT_PROJECTS=1 npm run dev`. They are never rendered in production.
 * Replace them with real projects and set `published: true`.
 */
const drafts: Project[] = [1, 2, 3].map((n) => ({
  slug: `exemple-${n}`,
  published: false,
  client: `[Client ${n}]`,
  title: { fr: `[Projet ${n}]`, en: `[Project ${n}]` },
  category: { fr: '[Catégorie]', en: '[Category]' },
  sector: { fr: '[Secteur]', en: '[Sector]' },
  services: [(['ecommerce', 'automation', 'transformation'] as const)[n - 1]],
  year: 2026,
  result: { fr: '[Résultat chiffré vérifié]', en: '[Verified measured result]' },
  summary: { fr: '[Résumé du projet en une phrase.]', en: '[One-sentence project summary.]' },
  challenge: { fr: '[Le problème de départ du client.]', en: '[The client’s starting problem.]' },
  solution: { fr: '[La solution livrée.]', en: '[The solution delivered.]' },
  outcome: { fr: '[Le résultat mesuré et sa période.]', en: '[The measured result and its period.]' },
  cover: null,
  gallery: [],
}))

const img = (src: string, width: number, height: number, fr: string, en: string): ProjectImage => ({ src, width, height, alt: { fr, en } })

/**
 * Studio projects — real work by the agency for itself (no invented client,
 * no invented figure). Set `published: false` to hide them.
 */
const studio: Project[] = [
  {
    slug: 'site-next-solutions',
    published: true,
    studio: true,
    client: 'Next Solutions',
    title: { fr: 'Le site Next Solutions', en: 'The Next Solutions website' },
    category: { fr: 'Site web sur mesure', en: 'Custom website' },
    sector: { fr: 'Agence digitale', en: 'Digital agency' },
    services: ['ecommerce'],
    year: 2026,
    summary: {
      fr: 'Un site éditorial et cinématique, pensé pour transformer une visite en demande de projet.',
      en: 'An editorial, cinematic website designed to turn a visit into a project enquiry.',
    },
    challenge: {
      fr: 'Présenter une jeune agence sans références publiées : le site lui-même devait prouver notre niveau, sans promesse ni chiffre inventé.',
      en: 'Introduce a young agency with no published references: the website itself had to prove our level, with no promises and no invented figures.',
    },
    strategy: {
      fr: 'Un récit en chapitres — de l’émotion du film à la vision, puis aux preuves et à la méthode — avec un seul objectif : la demande de projet.',
      en: 'A story told in chapters — from the emotion of the film to the vision, then proof and method — with one goal: the project enquiry.',
    },
    design: {
      fr: 'Une direction éditoriale fidèle à la charte : Ink et Next Blue, typographie Manrope, grille stricte, proportions au nombre d’or et l’angle à 45° de la marque.',
      en: 'An editorial direction true to the brand: Ink and Next Blue, Manrope type, a strict grid, golden-ratio proportions and the brand’s 45° cut.',
    },
    development: {
      fr: 'Next.js, contenus bilingues français et anglais, animations liées au défilement, vidéo optimisée et chargée à la demande, et une version sans animation pour qui la préfère.',
      en: 'Next.js, bilingual French and English content, scroll-linked animation, an optimised video loaded on demand, and a motion-free version for those who prefer it.',
    },
    outcome: {
      fr: 'Un site rapide et accessible : en audit Lighthouse local, 100 en accessibilité, bonnes pratiques et SEO. Les résultats commerciaux seront publiés avec le recul nécessaire.',
      en: 'A fast, accessible website: in a local Lighthouse audit, 100 for accessibility, best practices and SEO. Business results will be published once there is enough hindsight.',
    },
    coverMobile: img('/images/work/site-next-solutions/mobile-hero.webp', 780, 1688, 'Page d’accueil du site Next Solutions sur mobile', 'Next Solutions homepage on mobile'),
    cover: img('/images/work/site-next-solutions/hero.webp', 1600, 1000, 'Page d’accueil du site Next Solutions : vidéo du tissu bleu et titre « Vos problèmes. Nos solutions. »', 'Next Solutions homepage: blue-fabric film and the headline “Vos problèmes. Nos solutions.”'),
    gallery: [
      img('/images/work/site-next-solutions/sphere.webp', 1600, 1000, 'Section « Notre vision » avec la sphère bleue interactive', '“Notre vision” section with the interactive blue sphere'),
      img('/images/work/site-next-solutions/vision.webp', 1600, 1000, 'Composition éditoriale de la section « Notre vision »', 'Editorial composition of the “Notre vision” section'),
      img('/images/work/site-next-solutions/form.webp', 1600, 1000, 'Formulaire « Démarrer un projet »', '“Start a project” form'),
      img('/images/work/site-next-solutions/mobile-hero.webp', 780, 1688, 'Page d’accueil sur mobile', 'Homepage on mobile'),
      img('/images/work/site-next-solutions/mobile-vision.webp', 780, 1688, 'Section « Notre vision » sur mobile', '“Notre vision” section on mobile'),
    ],
  },
  {
    slug: 'identite-next-solutions',
    published: true,
    studio: true,
    client: 'Next Solutions',
    title: { fr: 'L’identité Next Solutions', en: 'The Next Solutions identity' },
    category: { fr: 'Identité de marque', en: 'Brand identity' },
    sector: { fr: 'Agence digitale', en: 'Digital agency' },
    services: ['marketing'],
    year: 2026,
    summary: {
      fr: 'Un système de marque complet : un symbole, deux couleurs, une direction.',
      en: 'A complete brand system: one symbol, two colours, one direction.',
    },
    challenge: {
      fr: 'Donner à une agence naissante une identité reconnaissable, sérieuse et simple à décliner partout.',
      en: 'Give a new agency an identity that is recognisable, serious and easy to apply everywhere.',
    },
    strategy: {
      fr: 'Une idée unique — « Turn problems into solutions » — portée par une flèche qui monte : le chemin vers la solution.',
      en: 'A single idea — “Turn problems into solutions” — carried by a rising arrow: the way to the solution.',
    },
    design: {
      fr: 'Le symbole N et sa flèche, la palette Ink, Next Blue et Sky, les typographies Manrope et DM Sans, et l’angle à 45° comme signature graphique.',
      en: 'The N symbol and its arrow, the Ink, Next Blue and Sky palette, Manrope and DM Sans, and the 45° cut as the graphic signature.',
    },
    development: {
      fr: 'Une charte de 15 pages, les logos dans tous leurs formats, les icônes, et des modèles pour les documents et les réseaux sociaux.',
      en: 'A 15-page guideline, the logos in every format, icons, and templates for documents and social media.',
    },
    outcome: {
      fr: 'Une identité appliquée avec cohérence : site web, documents, réseaux sociaux et campagne vidéo.',
      en: 'An identity applied consistently: website, documents, social media and video campaign.',
    },
    board: true,
    cover: img('/images/work/identite-next-solutions/cover.webp', 1600, 1000, 'Couverture de la charte de marque Next Solutions', 'Cover of the Next Solutions brand guidelines'),
    gallery: [
      img('/images/work/identite-next-solutions/logos.webp', 1600, 1000, 'Système de logos Next Solutions', 'Next Solutions logo system'),
      img('/images/work/identite-next-solutions/direction.webp', 1600, 1000, 'Direction créative de la marque', 'Brand creative direction'),
      img('/images/work/identite-next-solutions/palette.webp', 1600, 1000, 'Palette de couleurs', 'Colour palette'),
      img('/images/work/identite-next-solutions/arrow.webp', 1600, 1000, 'Langage graphique : la flèche', 'Graphic language: the arrow'),
      img('/images/work/identite-next-solutions/digital.webp', 1600, 1000, 'Présence digitale de la marque', 'The brand’s digital presence'),
    ],
  },
]

const all: Project[] = [...studio, ...drafts]

const showDrafts = process.env.NODE_ENV !== 'production' && process.env.SHOW_DRAFT_PROJECTS === '1'

export function getProjects(): Project[] {
  return all.filter((p) => p.published || showDrafts)
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug)
}

/** Scene 8 — rendered only when non-empty. Real, approved numbers only. */
export const metrics: Metric[] = []

/** Scene 9 — rendered only when non-empty. Real, approved quotes only. */
export const testimonials: Testimonial[] = []
