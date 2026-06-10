import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  // Validate required env vars are present
  const missingEnv = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_APP_URL',
  ].filter(k => !process.env[k])

  if (missingEnv.length > 0) {
    console.error('[submit-lead] Missing env vars:', missingEnv)
    return NextResponse.json(
      { error: `Server misconfiguration: missing ${missingEnv.join(', ')}` },
      { status: 500 }
    )
  }

  try {
    const body = await req.json()
    const { firstName, lastName, bizName, phone, email, niche, city, message, plan } = body

    if (!firstName || !bizName || !phone || !email || !niche) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = supabaseAdmin()

    const { data: lead, error } = await db
      .from('leads')
      .insert({
        first_name: firstName,
        last_name: lastName || '',
        biz_name: bizName,
        phone,
        email,
        niche,
        city: city || '',
        message: message || '',
        plan: plan || '',
        status: 'new'
      })
      .select()
      .single()

    if (error) {
      console.error('[submit-lead] Supabase error:', error)
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!.replace(/\/$/, '')
    const intakeUrl = `${appUrl}/intake?token=${lead.intake_token}`

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      intakeUrl,
      message: `Thank you ${firstName}! Check your email for next steps.`
    })

  } catch (err) {
    console.error('[submit-lead] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Failed to save enquiry. Please try again.' },
      { status: 500 }
    )
  }
}
