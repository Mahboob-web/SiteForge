import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { deployToVercel } from '@/lib/deployer'
import type { IntakeData, GeneratedSite } from '@/types'

export const maxDuration = 300

export async function POST(req: NextRequest) {
  const db = supabaseAdmin()

  try {
    const { intakeId, siteId } = await req.json()

    // Fetch intake and generated site
    const [{ data: intake }, { data: site }] = await Promise.all([
      db.from('intake').select('*').eq('id', intakeId).single(),
      db.from('generated_sites').select('*').eq('id', siteId).single()
    ])

    if (!intake || !site) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 })
    }

    // Create pending deployment record
    const { data: deployment } = await db
      .from('deployments')
      .insert({ intake_id: intakeId, status: 'building' })
      .select()
      .single()

    // Deploy to Vercel
    console.log(`[deploy-site] Deploying for ${intake.biz_name}...`)
    const result = await deployToVercel(intake as IntakeData, site as Partial<GeneratedSite>)

    // Update deployment record
    await db.from('deployments').update({
      vercel_project_id: result.projectId,
      vercel_deployment_id: result.deploymentId,
      url: result.url,
      status: 'ready'
    }).eq('id', deployment?.id)

    // Update intake with site URL
    await db.from('intake').update({
      status: 'deployed',
      site_url: result.url
    }).eq('id', intakeId)

    // Update lead status if linked
    const { data: intakeRecord } = await db
      .from('intake')
      .select('lead_id')
      .eq('id', intakeId)
      .single()

    if (intakeRecord?.lead_id) {
      await db.from('leads').update({ status: 'deployed' }).eq('id', intakeRecord.lead_id)
    }

    console.log(`[deploy-site] Live at: ${result.url}`)

    return NextResponse.json({
      success: true,
      url: result.url,
      projectId: result.projectId,
      deploymentId: result.deploymentId
    })

  } catch (err) {
    console.error('[deploy-site] Error:', err)

    return NextResponse.json(
      { error: 'Deployment failed. Please contact support.' },
      { status: 500 }
    )
  }
}
