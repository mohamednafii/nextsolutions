import { NextResponse, type NextRequest } from 'next/server'
import { leadSchema } from '@/lib/lead'

/**
 * Receives "Démarrer un projet" submissions and forwards them server-side to
 * the configured destination (n8n webhook → Google Sheets / CRM / WhatsApp
 * notification). Secrets never reach the browser.
 *
 *   LEAD_WEBHOOK_URL     required — where the lead is POSTed (JSON)
 *   LEAD_WEBHOOK_SECRET  optional — sent as the X-Webhook-Secret header
 *
 * Success (200) is returned ONLY when the destination accepted the lead.
 * Without a configured destination the route answers 503: nothing is faked.
 */

const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>() // best-effort, per instance

function rateLimited(ip: string) {
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  list.push(now)
  hits.set(ip, list)
  return list.length > MAX_PER_WINDOW
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0])))]
    return NextResponse.json({ ok: false, error: 'validation', fields }, { status: 422 })
  }

  const { company, ...lead } = parsed.data
  // Honeypot filled → silently accept without forwarding (bots get no signal).
  if (company) return NextResponse.json({ ok: true })

  const endpoint = process.env.LEAD_WEBHOOK_URL
  if (!endpoint) {
    console.error('[lead] LEAD_WEBHOOK_URL is not configured — lead NOT delivered.')
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 })
  }

  const payload = {
    ...lead,
    locale: request.headers.get('x-locale') === 'en' ? 'en' : 'fr',
    source: 'website',
    page: request.headers.get('referer') ?? null,
    receivedAt: new Date().toISOString(),
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.LEAD_WEBHOOK_SECRET ? { 'X-Webhook-Secret': process.env.LEAD_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error(`[lead] destination responded ${res.status}`)
      return NextResponse.json({ ok: false, error: 'upstream' }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[lead] delivery failed', err)
    return NextResponse.json({ ok: false, error: 'upstream' }, { status: 502 })
  }
}
