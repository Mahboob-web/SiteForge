import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

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

  const { firstName, lastName, bizName, phone, email, niche, city, message, plan } = body

  if (!firstName || !bizName || !phone || !email || !niche) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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
