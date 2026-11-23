import * as z from 'zod/mini'

/**
 * Shared by the form (client) and /api/lead (server). Messages are keys into
 * form.errors. Uses zod/mini to keep the form page's JavaScript small.
 */
export const serviceValues = ['ecommerce', 'automation', 'marketing', 'transformation', 'unsure'] as const
export const budgetValues = ['lt5k', '5-15k', '15-50k', 'gt50k', 'tbd'] as const
export const timelineValues = ['asap', '1-3m', '3-6m', 'flexible'] as const

const phoneDigits = (v: string) => v.replace(/[^\d]/g, '')
const isPhone = (v: string) => /^\+?[\d\s().-]+$/.test(v) && phoneDigits(v).length >= 9 && phoneDigits(v).length <= 15
const isLink = (v: string) =>
  v === '' || /^@[\w.]{2,60}$/.test(v) || /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v)

export const leadSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(2, 'name'), z.maxLength(120, 'name')),
  whatsapp: z.string().check(z.trim(), z.refine(isPhone, 'whatsapp')),
  service: z.enum(serviceValues, 'service'),
  budget: z.enum(budgetValues, 'budget'),
  timeline: z.enum(timelineValues, 'timeline'),
  website: z._default(z.string().check(z.trim(), z.maxLength(300, 'website'), z.refine(isLink, 'website')), ''),
  message: z._default(z.string().check(z.trim(), z.maxLength(500, 'message')), ''),
  /** Honeypot: must stay empty (filled → silently dropped server-side). */
  company: z.optional(z.string().check(z.maxLength(500))),
})

export type LeadInput = z.input<typeof leadSchema>
export type Lead = z.output<typeof leadSchema>
export type LeadErrorKey = 'name' | 'whatsapp' | 'service' | 'budget' | 'timeline' | 'website' | 'message'
