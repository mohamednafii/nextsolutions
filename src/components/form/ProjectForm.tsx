'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useForm, type FieldErrors } from 'react-hook-form'
import type { Dictionary } from '@/content'
import { leadSchema, type LeadErrorKey, type LeadInput } from '@/lib/lead'
import { Arrow } from '@/components/brand/Logo'

type F = Dictionary['form']
type Status = 'idle' | 'sending' | 'success' | 'error'

const fieldOrder: LeadErrorKey[] = ['name', 'whatsapp', 'service', 'budget', 'timeline', 'website', 'message']

export function ProjectForm({ f, locale, privacyHref, whatsappHref, defaultService }: {
  f: F
  locale: string
  privacyHref: string
  whatsappHref?: string
  defaultService?: string
}) {
  const [status, setStatus] = useState<Status>('idle')
  const successRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, submitCount },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      whatsapp: '',
      service: (defaultService as LeadInput['service']) ?? undefined,
      website: '',
      message: '',
      company: '',
    },
  })

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  const onSubmit = async (data: LeadInput) => {
    setStatus('sending')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Locale': locale },
        body: JSON.stringify(data),
      })
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean }
      setStatus(res.ok && json.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  // React Hook Form focuses the first invalid field; radio groups are scrolled into view.
  const onInvalid = (errs: FieldErrors<LeadInput>) => {
    const first = fieldOrder.find((k) => errs[k])
    if (first === 'service' || first === 'budget' || first === 'timeline') {
      document.getElementById(`f-${first}`)?.scrollIntoView({ block: 'center' })
    }
  }

  const err = (k: LeadErrorKey) => (errors[k] ? f.errors[k] : undefined)
  const errorKeys = fieldOrder.filter((k) => errors[k])

  if (status === 'success') {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="border-t border-ink pt-10 outline-none">
        <svg viewBox="0 0 48 48" className="h-14 w-14" aria-hidden="true">
          <rect width="48" height="48" fill="#0054DB" />
          <path d="M13 25l7 7 15-16" fill="none" stroke="#fff" strokeWidth="3" className="animate-[draw-check_600ms_var(--ease-ascent)_200ms_both] [stroke-dasharray:40]" />
        </svg>
        <h2 className="t-h1 mt-8">{f.success.title}</h2>
        <p className="t-lead mt-4 max-w-[44ch] text-slate">{f.success.text}</p>
        <button
          type="button"
          onClick={() => {
            reset()
            setStatus('idle')
          }}
          className="link-draw mt-10 pb-0.5 font-display font-bold"
        >
          {f.success.again}
        </button>
      </div>
    )
  }

  const input =
    'mt-2 block h-14 w-full rounded-btn border border-line bg-white px-4 text-base text-ink placeholder:text-mist transition-[border-color,box-shadow] duration-300 focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue aria-[invalid=true]:border-danger'
  const label = 'font-display text-[0.9375rem] font-semibold'

  const errorEl = (k: LeadErrorKey) =>
    err(k) ? (
      <p id={`e-${k}`} className="mt-2 text-[0.8125rem] font-medium text-danger">
        {err(k)}
      </p>
    ) : null

  const choice = (name: 'service' | 'budget' | 'timeline', legend: string, options: { value: string; label: string }[]) => (
    <fieldset id={`f-${name}`} aria-describedby={errors[name] ? `e-${name}` : undefined} aria-invalid={errors[name] ? true : undefined}>
      <legend className={label}>{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="relative cursor-pointer">
            <input type="radio" value={o.value} {...register(name)} className="peer sr-only" />
            <span className="flex min-h-12 items-center rounded-btn border border-line bg-white px-4 py-2.5 text-[0.9375rem] transition-colors duration-[180ms] hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue">
              {o.label}
            </span>
          </label>
        ))}
      </div>
      {errorEl(name)}
    </fieldset>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="space-y-10">
      <div
        role="alert"
        className={errorKeys.length && submitCount > 0 ? 'border-l-2 border-danger bg-cloud px-5 py-4 outline-none' : 'sr-only'}
      >
        {errorKeys.length > 0 && submitCount > 0 && (
          <>
            <p className="font-display font-bold">{f.errors.summary}</p>
            <ul className="mt-2 space-y-1 text-[0.875rem]">
              {errorKeys.map((k) => (
                <li key={k}>
                  <a href={`#f-${k}`} className="underline underline-offset-2">{f.errors[k]}</a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <label htmlFor="f-name" className={label}>{f.name}</label>
          <input
            id="f-name"
            autoComplete="name"
            placeholder={f.namePlaceholder}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'e-name' : undefined}
            className={input}
            {...register('name')}
          />
          {errorEl('name')}
        </div>
        <div>
          <label htmlFor="f-whatsapp" className={label}>{f.whatsapp}</label>
          <input
            id="f-whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={f.whatsappPlaceholder}
            aria-invalid={errors.whatsapp ? true : undefined}
            aria-describedby={errors.whatsapp ? 'e-whatsapp h-whatsapp' : 'h-whatsapp'}
            className={input}
            {...register('whatsapp')}
          />
          <p id="h-whatsapp" className="mt-2 text-[0.8125rem] text-slate">{f.whatsappHint}</p>
          {errorEl('whatsapp')}
        </div>
      </div>

      {choice('service', f.service, f.serviceOptions)}
      {choice('budget', f.budget, f.budgetOptions)}
      {choice('timeline', f.timeline, f.timelineOptions)}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <label htmlFor="f-website" className={label}>
            {f.website} <span className="font-normal text-slate">({f.optional})</span>
          </label>
          <input
            id="f-website"
            inputMode="url"
            placeholder={f.websitePlaceholder}
            aria-invalid={errors.website ? true : undefined}
            aria-describedby={errors.website ? 'e-website' : undefined}
            className={input}
            {...register('website')}
          />
          {errorEl('website')}
        </div>
        <div>
          <label htmlFor="f-message" className={label}>
            {f.message} <span className="font-normal text-slate">({f.optional})</span>
          </label>
          <input
            id="f-message"
            placeholder={f.messagePlaceholder}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? 'e-message' : undefined}
            className={input}
            {...register('message')}
          />
          {errorEl('message')}
        </div>
      </div>

      {/* Honeypot */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="f-company">Company</label>
        <input id="f-company" tabIndex={-1} autoComplete="off" {...register('company')} />
      </div>

      {status === 'error' && (
        <div role="alert" className="border-l-2 border-danger bg-cloud px-5 py-4">
          <p className="font-display font-bold">{f.failure.title}</p>
          <p className="mt-1 text-[0.9375rem] text-slate">{whatsappHref ? f.failure.textWhatsapp : f.failure.text}</p>
          {whatsappHref && (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="link-draw mt-3 inline-block pb-0.5 font-display font-bold">
              WhatsApp
            </a>
          )}
        </div>
      )}

      <div className="flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <p className="max-w-[52ch] text-[0.8125rem] text-slate">
          {f.consent}{' '}
          <Link href={privacyHref} className="underline underline-offset-2">{f.privacy}</Link>
        </p>
        <button
          type="submit"
          disabled={status === 'sending'}
          aria-busy={status === 'sending'}
          className="btn group shrink-0 items-stretch disabled:cursor-wait"
        >
          <span className="flex items-center bg-ink px-6 text-white transition-colors duration-[180ms] group-hover:bg-blue group-disabled:bg-slate">
            {status === 'sending' ? f.sending : status === 'error' ? f.failure.retry : f.submit}
          </span>
          <span className="flex aspect-square h-full items-center justify-center bg-blue">
            {status === 'sending' ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
            ) : (
              <Arrow tone="white" className="arrow-nudge h-2.5 w-2.5" />
            )}
          </span>
        </button>
      </div>
    </form>
  )
}
