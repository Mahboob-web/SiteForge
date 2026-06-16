import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendClientConfirmation, sendAdminNotification } from '@/lib/email'
import type { IntakeData } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body: IntakeData = await req.json()
    const db = supabaseAdmin()

    // Validate token
    if (!body.token) {
      return NextResponse.json({ error: 'Missing intake token' }, { status: 400 })
    }

    // Find lead by intake_token
    const { data: lead } = await db
      .from('leads')
      .select('id')
      .eq('intake_token', body.token)
      .maybeSingle()

    // Insert intake data
    const { data: intake, error } = await db
      .from('intake')
      .upsert({
        lead_id: lead?.id || null,
        token: body.token,
        biz_name: body.biz_name,
        trading_name: body.trading_name,
        owner_name: body.owner_name,
        abn: body.abn,
        phone: body.phone,
        email: body.email,
        domain: body.domain,
        years_in_biz: body.years_in_biz,
        team_size: body.team_size,
        biz_type: body.biz_type,
        address: body.address,
        gmb_url: body.gmb_url,
        current_site: body.current_site,
        industry: body.industry,
        services: body.services,
        other_services: body.other_services,
        pricing_type: body.pricing_type,
        price_from: body.price_from,
        price_popular: body.price_popular,
        response_time: body.response_time,
        availability: body.availability,
        guarantees: body.guarantees,
        certs: body.certs,
        suburbs: body.suburbs,
        travel_range: body.travel_range,
        city: body.city,
        tone: body.tone,
        colour: body.colour,
        style: body.style,
        target_customer: body.target_customer,
        usps: body.usps,
        biz_story: body.biz_story,
        star_rating: body.star_rating,
        awards: body.awards,
        testimonials: body.testimonials,
        facebook_url: body.facebook_url,
        instagram_url: body.instagram_url,
        logo_url: body.logo_url,
        plan: body.plan,
        retainer: body.retainer,
        status: 'pending'
      }, { onConflict: 'token' })
      .select()
      .single()

    if (error) throw error

    // Update lead status
    if (lead?.id) {
      await db
        .from('leads')
        .update({ status: 'intake_complete' })
        .eq('id', lead.id)
    }

    // Send emails (fire and forget — failures don't break the response)
    const domainSlug = body.domain || `${(body.biz_name || 'your-site').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.vercel.app`
    sendClientConfirmation({
      firstName: body.owner_name?.split(' ')[0] || body.biz_name || 'there',
      bizName:   body.biz_name   || 'Your Business',
      plan:      body.plan       || 'starter',
      email:     body.email      || '',
      domain:    domainSlug,
      industry:  body.industry   || '',
    }).catch(err => console.error('[email] client confirmation failed:', err))

    sendAdminNotification(body as unknown as Record<string, unknown>)
      .catch(err => console.error('[email] admin notification failed:', err))

    // Trigger generation (fire and forget — no await)
    const rawUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const appUrl = /^https?:\/\//.test(rawUrl) ? rawUrl : `https://${rawUrl}`
    fetch(`${appUrl}/api/generate-site`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intakeId: intake.id })
    }).catch(err => console.error('[generate-site trigger]', err))

    return NextResponse.json({
      success: true,
      intakeId: intake.id,
      message: 'Details saved! Your website is being generated now. Check back in 15 minutes.'
    })

  } catch (err) {
    console.error('[submit-intake]', err)
    return NextResponse.json(
      { error: 'Failed to save intake data. Please try again.' },
      { status: 500 }
    )
  }
}
