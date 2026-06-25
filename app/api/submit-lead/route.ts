import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import { sendLeadNotification } from '@/lib/email'

// ── Best-effort in-memory rate limiter (per serverless instance) ──
const RATE_LIMIT = 5            // max submissions
const RATE_WINDOW_MS = 10 * 60 * 1000  // per 10 minutes
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE_LIMIT
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) return NextResponse.json({ error: 'Missing NEXT_PUBLIC_SUPABASE_URL' }, { status: 500 })
  if (!serviceKey)  return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 })

  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // 1) Honeypot — bots fill the hidden "website" field; humans never see it.
  //    Pretend success so the bot doesn't retry, but save nothing.
  if (body.website && body.website.trim() !== '') {
    return NextResponse.json({ success: true, message: 'Thank you! We\u2019ll be in touch.' })
  }

  // 2) Rate limit by IP
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim()
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  const { firstName, lastName, bizName, phone, email, niche, city, message, plan } = body

  if (!firstName || !bizName || !phone || !email || !niche) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // 3) Basic validation
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  // 4) Length caps — block oversized/spammy payloads
  const tooLong =
    firstName.length > 80 || bizName.length > 120 || phone.length > 40 ||
    email.length > 120 || (message || '').length > 2000
  if (tooLong) {
    return NextResponse.json({ error: 'Input too long.' }, { status: 400 })
  }

  try {
    const db = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Generate token here so we always have it — don't rely on DB returning it
    const intakeToken = randomUUID()

    const { error } = await db
      .from('leads')
      .insert({
        first_name:   firstName,
        last_name:    lastName || '',
        biz_name:     bizName,
        phone,
        email,
        niche,
        city:         city    || '',
        message:      message || '',
        plan:         plan    || '',
        status:       'new',
        intake_token: intakeToken,
      })

    if (error) {
      console.error('[submit-lead] Supabase insert error:', error)
      return NextResponse.json(
        { error: `Database error (${error.code}): ${error.message}` },
        { status: 500 }
      )
    }

    // Fire instant admin notification — never let an email failure break lead capture
    try {
      await sendLeadNotification({
        firstName,
        lastName: lastName || '',
        bizName,
        phone,
        email,
        niche,
        city:    city    || '',
        plan:    plan    || '',
        message: message || '',
      })
    } catch (notifyErr) {
      console.error('[submit-lead] notification failed (lead still saved):', notifyErr)
    }

    return NextResponse.json({
      success:     true,
      intakeToken,
      message:     `Thank you ${firstName}! We'll be in touch within 2 hours.`,
    })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[submit-lead] Unexpected error:', msg)
    return NextResponse.json({ error: `Unexpected error: ${msg}` }, { status: 500 })
  }
}
