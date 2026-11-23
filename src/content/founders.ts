/**
 * The two co-founders shown in « 06 / L'agence » (homepage). Names, portraits
 * and past professional experience are not translated; the role and degree
 * live in the dictionaries (home.agence.founders, same order).
 *
 * Experience logos are PAST PROFESSIONAL EXPERIENCE of each founder, never
 * clients or endorsements of the agency: do not reuse them in the trust bar.
 */

export type ExperienceId = 'ibm' | 'telus' | 'inwi' | 'geb'

export type Experience = {
  name: string
  src: string
  /** Intrinsic size of the file (keeps the proportions). */
  width: number
  height: number
  /** Optical height in the logo row, in em of the row's font size (tuned so the marks read at the same weight). */
  size: number
  /** Placeholder asset: replace the file with the official logo before publishing. */
  provisional?: boolean
}

export const EXPERIENCE: Record<ExperienceId, Experience> = {
  ibm: { name: 'IBM', src: '/images/experience/ibm.svg', width: 1075, height: 401, size: 1.3 },
  telus: { name: 'TELUS', src: '/images/experience/telus.svg', width: 220, height: 45, size: 1.6 },
  inwi: { name: 'inwi', src: '/images/experience/inwi.svg', width: 512, height: 156, size: 1.25 },
  // PROVISOIRE: typographic stand-in, not the official GEB Analysis mark.
  // Drop the official file at the same path (or change src / width / height) and remove `provisional`.
  geb: { name: 'GEB Analysis', src: '/images/experience/geb-analysis.png', width: 901, height: 200, size: 1.2, provisional: true },
}

export type Founder = {
  id: string
  name: string
  /** null → a clearly marked placeholder is shown until the real portrait is supplied. */
  portrait: { src: string; width: number; height: number } | null
  experience: ExperienceId[]
}

export const FOUNDERS: Founder[] = [
  {
    id: 'nafii',
    name: 'Nafii Mohamed',
    portrait: { src: '/images/team/nafii-mohamed.webp', width: 1000, height: 1250 },
    experience: ['ibm', 'telus', 'geb'],
  },
  {
    id: 'mouad',
    name: 'Mouad Mourafiq',
    portrait: { src: '/images/team/mouad-mourafiq.webp', width: 1000, height: 1250 },
    experience: ['ibm', 'inwi'],
  },
]
