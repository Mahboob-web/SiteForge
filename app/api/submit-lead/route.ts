import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, bizName, phone, email, niche, city, message, plan } = body

    // Basic validation
    if (!firstName || !bizName || !phone || !email || !niche) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = supabaseAdmin()

    // Insert lead into Supabase
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

    if (error) throw error

    // Return intake form URL with unique token
    const intakeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/intake?token=${lead.intake_token}`

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      intakeUrl,
      message: `Thank you ${firstName}! Check your email for next steps.`
    })

  } catch (err) {
    console.error('[submit-lead]', err)
    return NextResponse.json(
      { error: 'Failed to save enquiry. Please try again.' },
      { status: 500 }
    )
  }
}
