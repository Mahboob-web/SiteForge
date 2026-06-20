import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

// ─── HTML helpers ──────────────────────────────────────────────────────────

function metaTag(html: string, name: string): string {
  return (
    html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']{1,500})["']`, 'i'))?.[1] ||
    html.match(new RegExp(`<meta[^>]+content=["']([^"']{1,500})["'][^>]+(?:name|property)=["']${name}["']`, 'i'))?.[1] ||
    ''
  )
}

function extractJsonLd(html: string): object[] {
  const results: object[] = []
  const rx = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let m: RegExpExecArray | null
  while ((m = rx.exec(html)) !== null) {
    try {
      const d = JSON.parse(m[1].trim())
      const items = Array.isArray(d) ? d : [d]
      items.forEach(i => { if (i?.['@type']) results.push(i) })
    } catch(_) {}
  }
  return results
}

function telLinks(html: string): string[] {
  const hits: string[] = []
  const rx = /href=["']tel:([^"'\s]+)/gi
  let m: RegExpExecArray | null
  while ((m = rx.exec(html)) !== null) hits.push(m[1].replace(/[^\d+]/g, '').replace(/^0061/, '0').replace(/^\+61/, '0'))
  return [...new Set(hits)].filter(p => p.length >= 8)
}

function mailLinks(html: string): string[] {
  const hits: string[] = []
  const rx = /href=["']mailto:([^"'?\s]+)/gi
  let m: RegExpExecArray | null
  while ((m = rx.exec(html)) !== null) hits.push(m[1].trim())
  return [...new Set(hits)]
}

function socialLinks(html: string): { facebook?: string; instagram?: string } {
  const fb = html.match(/href=["'](https?:\/\/(?:www\.)?facebook\.com\/(?!sharer|share|dialog)[^"'\s?#]{2,})/i)?.[1]
  const ig = html.match(/href=["'](https?:\/\/(?:www\.)?instagram\.com\/(?!p\/|reel\/)[^"'\s?#]{2,})/i)?.[1]
  return { facebook: fb, instagram: ig }
}

function logoUrl(html: string, pageUrl: string): string {
  const ogImg = metaTag(html, 'og:image')
  if (ogImg && /\.(png|jpg|jpeg|svg|webp)/i.test(ogImg)) return ogImg
  const ld = html.match(/"logo"\s*:\s*(?:\{[^}]*"url"\s*:\s*"([^"]+)"|"([^"]+)")/i)
  const ldUrl = ld?.[1] || ld?.[2]
  if (ldUrl) return ldUrl
  for (const rx of [
    /<img[^>]+(?:class|alt|id)=["'][^"']*logo[^"']*["'][^>]+src=["']([^"']+)["']/i,
    /<img[^>]+src=["']([^"']*logo[^"']*)["']/i,
  ]) {
    const src = html.match(rx)?.[1]
    if (src) {
      if (/^https?:\/\//i.test(src)) return src
      try { const b = new URL(pageUrl); return `${b.origin}${src.startsWith('/') ? src : '/' + src}` } catch(_) {}
    }
  }
  return ''
}

function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ').trim()
    .slice(0, 14000)
}

// ─── Brand color extraction ────────────────────────────────────────────────

function extractBrandColors(html: string): string[] {
  const score = new Map<string, number>()

  const add = (raw: string, weight: number) => {
    let h = raw.replace('#', '').toLowerCase().trim()
    if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2]
    if (!/^[0-9a-f]{6}$/.test(h)) return
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    if (r < 25 && g < 25 && b < 25) return
    if (r > 240 && g > 240 && b > 240) return
    if (Math.max(r, g, b) - Math.min(r, g, b) < 28) return
    const color = '#' + h
    score.set(color, (score.get(color) || 0) + weight)
  }

  const tc = metaTag(html, 'theme-color')
  if (tc) add(tc, 500)

  const cssBlocks = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join('\n')
  const varRx = /--(?:primary|brand|accent|main|cta|key|highlight|theme)(?:-color|-bg|-foreground)?[^:]*:\s*(#[0-9a-fA-F]{3,6})/gi
  let m: RegExpExecArray | null
  while ((m = varRx.exec(cssBlocks)) !== null) add(m[1], 200)

  const hexRx = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g
  while ((m = hexRx.exec(cssBlocks)) !== null) add('#' + m[1], 1)

  const inlineRx = /style=["'][^"']*?(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})\b/gi
  while ((m = inlineRx.exec(html)) !== null) add(m[1], 2)

  return [...score.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([color]) => color)
}

// ─── Phase 1: Pure HTML extraction (no Claude, always runs) ───────────────

function extractFromHtml(html: string, pageUrl: string): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]
    ?.replace(/\s*[·\-–|]\s*(Google Maps|Facebook|Instagram|Yelp|Yellow Pages)$/i, '').trim()
  const ogTitle = metaTag(html, 'og:title')?.replace(/\s*[·\-–|]\s*(Google Maps|Facebook)$/i, '').trim()
  if (title && title.length > 2) result.biz_name = title
  else if (ogTitle && ogTitle.length > 2) result.biz_name = ogTitle

  const phones = telLinks(html)
  if (phones.length) result.phone = phones[0]
  else {
    const desc = metaTag(html, 'description')
    const phoneInDesc = desc.match(/0[2-9]\s?\d{4}\s?\d{4}|04\d{2}\s?\d{3}\s?\d{3}|1[38]\d{2}\s?\d{3}\s?\d{3}/)
    if (phoneInDesc) result.phone = phoneInDesc[0]
  }

  const emails = mailLinks(html)
  if (emails.length) result.email = emails[0]

  const social = socialLinks(html)
  if (social.facebook) result.facebook_url = social.facebook
  if (social.instagram) result.instagram_url = social.instagram

  const logo = logoUrl(html, pageUrl)
  if (logo) result.logo_url = logo

  const desc = metaTag(html, 'description')
  const ogDesc = metaTag(html, 'og:description')
  if (desc) {
    const ratingMatch = desc.match(/[★☆✩]?\s*(\d+(?:\.\d+)?)\s*[★☆]?\s*(?:\((\d[\d,]+)\s*reviews?\))?/i)
    if (ratingMatch) result.star_rating = `${ratingMatch[1]}${ratingMatch[2] ? ` (${ratingMatch[2].replace(',', '')} reviews)` : ''}`
    const parts = desc.split(/[·•|]/).map(p => p.trim()).filter(p => p.length > 2)
    const addrPart = parts.find(p => /^\d+\s+\w|(?:St|Rd|Ave|Dr|Blvd|Way|Ct|Cres|Pl|Ln|Hwy)\b/i.test(p))
    if (addrPart && !result.phone) {
      const phoneInPart = addrPart.match(/0[2-9]\s?\d{4}\s?\d{4}|04\d{2}\s?\d{3}\s?\d{3}/)
      if (phoneInPart) result.phone = phoneInPart[0]
    }
    if (addrPart) result.address = addrPart
  }

  const schemas = extractJsonLd(html)
  for (const s of schemas as Record<string, unknown>[]) {
    if (!result.biz_name && s.name) result.biz_name = s.name
    if (!result.phone && s.telephone) result.phone = s.telephone
    if (!result.email && s.email) result.email = s.email
    if (!result.address && s.address) {
      const a = s.address as Record<string, string>
      result.address = [a.streetAddress, a.addressLocality, a.addressRegion].filter(Boolean).join(', ')
    }
    if (!result.city) {
      const locality = (s.address as Record<string, string>)?.addressLocality
      if (locality) result.city = locality
    }
    if (!result.star_rating && s.aggregateRating) {
      const r = s.aggregateRating as Record<string, unknown>
      result.star_rating = `${r.ratingValue}${r.reviewCount ? ` (${r.reviewCount} reviews)` : ''}`
    }
    if (!result.logo_url && s.logo) {
      const l = s.logo as Record<string, string>
      result.logo_url = l.url || (typeof s.logo === 'string' ? s.logo : '')
    }
    if (!result.facebook_url && Array.isArray(s.sameAs)) {
      const fb = (s.sameAs as string[]).find(u => /facebook\.com/i.test(u))
      const ig = (s.sameAs as string[]).find(u => /instagram\.com/i.test(u))
      if (fb) result.facebook_url = fb
      if (ig) result.instagram_url = ig
    }
  }

  if (ogDesc && ogDesc.length > 40) result.biz_story = ogDesc

  const brandColors = extractBrandColors(html)
  if (brandColors.length) {
    result.brand_color  = brandColors[0]
    result.brand_colors = brandColors
  }

  return result
}

// ─── Phase 2: Claude enrichment (only if API key is present) ──────────────

async function enrichWithClaude(
  context: string,
  finalUrl: string,
  isGmb: boolean,
  phase1: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const gmbNote = isGmb
    ? 'NOTE: This is a Google Business Profile. Meta description may contain rating · category · address · phone separated by "·".\n'
    : ''

  const prompt = `You are extracting business information for an Australian tradie/service business intake form.
${gmbNote}
URL: ${finalUrl}

--- PAGE DATA ---
${context}
--- END DATA ---

Extract business information and return ONLY valid JSON (no markdown, no extra text):

{
  "biz_name": "business trading name",
  "owner_name": "owner first and last name if explicitly mentioned",
  "phone": "Australian format: 0412 345 678 or (02) 9123 4567",
  "email": "email address",
  "address": "full street address with number",
  "city": "one of: Sydney, Melbourne, Brisbane, Perth, Adelaide, Gold Coast, Canberra, Newcastle, Wollongong, Geelong, Hobart, Townsville, Cairns, Darwin, Toowoomba",
  "years_in_biz": "one of: Less than 1 year, 1–2 years, 3–5 years, 6–10 years, 10+ years",
  "star_rating": "e.g. 4.9 (320 reviews)",
  "biz_story": "2-3 sentences from their About section",
  "services": ["specific service 1", "specific service 2"],
  "suburbs": ["suburb1", "suburb2"],
  "usps": ["differentiator 1", "differentiator 2", "differentiator 3"],
  "testimonials": [{"text":"review text","author":"name","suburb":"suburb"}],
  "facebook_url": "https://facebook.com/...",
  "instagram_url": "https://instagram.com/...",
  "logo_url": "https://...",
  "target_customer": "who their customers are",
  "awards": "certifications or awards"
}

Only include keys where you found real data. Never fabricate. Return JSON only.`

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = msg.content[0].type === 'text' ? msg.content[0].text : ''
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`Claude returned no JSON. Response: ${raw.slice(0, 200)}`)

  const claude = JSON.parse(jsonMatch[0]) as Record<string, unknown>
  // Phase 1 wins on conflict — HTML is more trustworthy for phones, emails, logo
  return { ...claude, ...phase1 }
}

// ─── Fetch helper ──────────────────────────────────────────────────────────

async function fetchHtml(url: string): Promise<{ html: string; finalUrl: string }> {
  const agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  ]
  let lastErr: unknown
  for (const ua of agents) {
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        headers: {
          'User-Agent': ua,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-AU,en;q=0.9',
        },
        signal: AbortSignal.timeout(10000),
      })
      if (/accounts\.google\.com|consent\.google\.com/i.test(res.url)) continue
      return { html: await res.text(), finalUrl: res.url }
    } catch(e) { lastErr = e }
  }
  throw lastErr
}

// ─── Route handler ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let url: string
  try {
    const body = await req.json()
    url = (body.url ?? '').trim()
    if (!url) throw new Error('empty')
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`
    new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  // ── Fetch the page ────────────────────────────────────────────────────────
  let html = ''
  let finalUrl = url
  try {
    const r = await fetchHtml(url)
    html = r.html
    finalUrl = r.finalUrl
  } catch (err) {
    return NextResponse.json({
      error: `Could not reach that URL — is it publicly accessible? (${String(err).slice(0, 100)})`,
    }, { status: 422 })
  }

  const isGmb = /google\.com\/maps|maps\.app\.goo\.gl|g\.co\/(kgs|maps)|g\.page/i.test(finalUrl + url)

  // ── Phase 1: always extract from HTML ────────────────────────────────────
  const phase1 = extractFromHtml(html, finalUrl)

  // ── Phase 2: Claude enrichment (only if key present and page has content) ─
  const pageText = visibleText(html)
  const hasContent = pageText.length > 150
  const hasClaudeKey = !!process.env.ANTHROPIC_API_KEY

  if (hasContent && hasClaudeKey) {
    const context = [
      `Page title: ${html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || ''}`,
      metaTag(html, 'description')    && `Meta description: ${metaTag(html, 'description')}`,
      metaTag(html, 'og:title')       && `OG title: ${metaTag(html, 'og:title')}`,
      metaTag(html, 'og:description') && `OG description: ${metaTag(html, 'og:description')}`,
      telLinks(html).length  && `Tel links: ${telLinks(html).join(', ')}`,
      mailLinks(html).length && `Email links: ${mailLinks(html).join(', ')}`,
      socialLinks(html).facebook  && `Facebook: ${socialLinks(html).facebook}`,
      socialLinks(html).instagram && `Instagram: ${socialLinks(html).instagram}`,
      extractJsonLd(html).length  && `Schema.org: ${JSON.stringify(extractJsonLd(html)).slice(0, 2000)}`,
      `Page text:\n${pageText}`,
    ].filter(Boolean).join('\n\n')

    try {
      const merged = await enrichWithClaude(context, finalUrl, isGmb, phase1)
      const count = Object.values(merged).filter(v => v !== '' && v !== null && v !== undefined && (!Array.isArray(v) || v.length > 0)).length
      if (count > 0) return NextResponse.json({ extracted: merged })
    } catch (err) {
      console.error('[extract-site] Claude failed, falling back to Phase 1:', err)
    }
  }

  // ── Return Phase 1 only (Claude skipped or failed) ───────────────────────
  const count = Object.keys(phase1).length
  if (count === 0) {
    return NextResponse.json({
      error: isGmb
        ? 'Google Business pages block automated access. Paste your business website URL instead — it will extract much more.'
        : 'No data could be extracted from that page. Make sure it is publicly accessible.',
    }, { status: 422 })
  }

  return NextResponse.json({ extracted: phase1 })
}
