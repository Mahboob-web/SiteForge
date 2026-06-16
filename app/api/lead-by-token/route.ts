import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

  try {
    const db = supabaseAdmin()
    const { data, error } = await db
      .from('leads')
      .select('biz_name, first_name, owner_name: first_name, phone, email, city, niche')
      .eq('intake_token', token)
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Invalid token' }, { status: 404 })

    return NextResponse.json({ lead: data })
  } catch (err) {
    console.error('[lead-by-token]', err)
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 })
  }
}
