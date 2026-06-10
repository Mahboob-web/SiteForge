import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateFullSite } from '@/lib/generator'
import type { IntakeData } from '@/types'

// Max duration for Vercel (Pro = 300s, Hobby = 60s)
export const maxDuration = 300

export async function POST(req: NextRequest) {
  const db = supabaseAdmin()

  try {
    const { intakeId } = await req.json()

    if (!intakeId) {
      return NextResponse.json({ error: 'Missing intakeId' }, { status: 400 })
    }

    // Fetch intake data
    const { data: intake, error: fetchError } = await db
      .from('intake')
      .select('*')
      .eq('id', intakeId)
      .single()

    if (fetchError || !intake) {
      return NextResponse.json({ error: 'Intake not found' }, { status: 404 })
    }

    // Mark as generating
    await db.from('intake').update({ status: 'generating' }).eq('id', intakeId)

    // Create a pending generated_sites record
    const { data: siteRecord, error: insertError } = await db
      .from('generated_sites')
      .insert({ intake_id: intakeId, status: 'pending' })
      .select()
      .single()

    if (insertError) throw insertError

    // Run AI generation
    console.log(`[generate-site] Starting for intake ${intakeId}`)
    const generated = await generateFullSite(intake as IntakeData)

    // Save generated content
    const { error: updateError } = await db
      .from('generated_sites')
      .update({
        ...generated,
        status: 'complete'
      })
      .eq('id', siteRecord.id)

    if (updateError) throw updateError

    // Trigger deployment
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    fetch(`${appUrl}/api/deploy-site`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intakeId, siteId: siteRecord.id })
    }).catch(err => console.error('[deploy-site trigger]', err))

    return NextResponse.json({
      success: true,
      siteId: siteRecord.id,
      message: 'Content generated successfully. Deploying now...'
    })

  } catch (err) {
    console.error('[generate-site] Error:', err)

    // Mark as error in DB
    try {
      await db
        .from('generated_sites')
        .update({
          status: 'error',
          error_message: String(err)
        })
        .eq('intake_id', req.body ? (await req.json().catch(() => ({}))).intakeId : '')
    } catch (_) {}

    return NextResponse.json(
      { error: 'Generation failed. Please contact support.' },
      { status: 500 }
    )
  }
}
