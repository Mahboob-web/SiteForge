import Anthropic from '@anthropic-ai/sdk'
import type { IntakeData, GeneratedSite, ServiceCopy, SuburbPage } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─── HELPER: call Claude ──────────────────────────────────────────────────────
async function ask(prompt: string, maxTokens = 1500): Promise<string> {
  const msg = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }]
  })
  return (msg.content[0] as { type: string; text: string }).text.trim()
}

// ─── GENERATE HERO ────────────────────────────────────────────────────────────
async function generateHero(d: IntakeData) {
  const raw = await ask(`
You are an expert Australian copywriter for local trade businesses.

Business: ${d.biz_name} | Industry: ${d.industry} | City: ${d.city}
Years: ${d.years_in_biz} | USPs: ${d.usps.join(', ')}
Guarantees: ${d.guarantees.join(', ')} | Price from: ${d.price_from || 'Contact for quote'}
Tone: ${d.tone}

Write EXACTLY this format (no other text):
HEADLINE: [6-9 words, benefit-led, includes city]
SUBHEADLINE: [20-30 words, 2-3 USPs, trust signal]
CTA_PRIMARY: [3-5 words, action-led]
CTA_SECONDARY: [3-4 words]
TRUST_1: [3-6 words starting with ✓]
TRUST_2: [3-6 words starting with ✓]
TRUST_3: [3-6 words starting with ✓]
TRUST_4: [3-6 words starting with ✓]

Australian English. Confident, no filler phrases.
`, 400)

  const get = (key: string) => {
    const match = raw.match(new RegExp(`${key}:\\s*(.+)`))
    return match ? match[1].trim() : ''
  }

  return {
    headline: get('HEADLINE'),
    subheadline: get('SUBHEADLINE'),
    cta_primary: get('CTA_PRIMARY'),
    cta_secondary: get('CTA_SECONDARY'),
    trust_bar: [get('TRUST_1'), get('TRUST_2'), get('TRUST_3'), get('TRUST_4')].filter(Boolean)
  }
}

// ─── GENERATE ABOUT SUMMARY ───────────────────────────────────────────────────
async function generateAboutSummary(d: IntakeData): Promise<string> {
  return ask(`
Australian copywriter. Write a 2-paragraph homepage About block (40-55 words each).

Business: ${d.biz_name} | Owner: ${d.owner_name} | City: ${d.city}
Years: ${d.years_in_biz} | Team: ${d.team_size}
Story: ${d.biz_story || 'Local business serving the community'}
Awards: ${d.awards || 'none'}
Tone: ${d.tone}

Para 1: Origin and identity (authentic, local).
Para 2: Credibility and team.
First person "we". Australian English. Under 110 words. No bullets.
Output only the two paragraphs, nothing else.
`, 300)
}

// ─── GENERATE FULL ABOUT PAGE ─────────────────────────────────────────────────
async function generateAboutFull(d: IntakeData): Promise<string> {
  return ask(`
Expert Australian copywriter. Write a full About Us page (4 sections, 300-380 words total).

Business: ${d.biz_name} | Owner: ${d.owner_name} | City: ${d.city}
Years: ${d.years_in_biz} | Team: ${d.team_size}
Certifications: ${d.certs.join(', ')}
Story: ${d.biz_story || 'A trusted local business'}
Awards: ${d.awards || ''}
USPs: ${d.usps.join(', ')}
Tone: ${d.tone}

Sections with bold headings:
1. OUR STORY (80-100 words)
2. WHAT DRIVES US (60-80 words)
3. OUR TEAM (60-80 words)
4. OUR PROMISE (50-60 words, end with CTA)

First person "we". Australian English. No buzzwords.
`, 600)
}

// ─── GENERATE SERVICE PAGE ────────────────────────────────────────────────────
async function generateServicePage(d: IntakeData, serviceName: string): Promise<ServiceCopy> {
  const content = await ask(`
Australian SEO copywriter. Write a complete service page (350-420 words).

Service: ${serviceName}
Business: ${d.biz_name} | City: ${d.city}
Suburbs: ${d.suburbs.slice(0, 5).join(', ')}
Price: ${d.price_from || 'Contact for quote'}
Guarantees: ${d.guarantees.join(', ')}
Certs: ${d.certs.join(', ')}
Tone: ${d.tone}

Format EXACTLY:
TITLE: [service card title, 3-5 words]
SHORT_DESC: [1 sentence, 15-20 words, outcome-focused]
FEATURE_1: [3-6 words]
FEATURE_2: [3-6 words]
FEATURE_3: [3-6 words]
---FULLPAGE---
[Full page content with H1, intro para, What's Included section, Our Process section, Why Choose Us section, CTA paragraph. Use natural SEO keywords: "${serviceName} ${d.city}". Australian English.]
---FAQ---
Q1: [question]
A1: [40-60 word answer]
Q2: [question]
A2: [40-60 word answer]
Q3: [question]
A3: [40-60 word answer]
Q4: [question]
A4: [40-60 word answer]
Q5: [question]
A5: [40-60 word answer]
META_TITLE: [50-60 chars]
META_DESC: [145-158 chars]
`, 1500)

  const getLine = (key: string) => {
    const m = content.match(new RegExp(`${key}:\\s*(.+)`))
    return m ? m[1].trim() : ''
  }

  const fullPageMatch = content.match(/---FULLPAGE---\n([\s\S]*?)---FAQ---/)
  const faqSection = content.split('---FAQ---')[1] || ''

  // Parse FAQ
  const faq: Array<{ q: string; a: string }> = []
  for (let i = 1; i <= 5; i++) {
    const q = getLine(`Q${i}`)
    const a = getLine(`A${i}`)
    if (q && a) faq.push({ q, a })
  }

  return {
    title: getLine('TITLE'),
    short_desc: getLine('SHORT_DESC'),
    features: [getLine('FEATURE_1'), getLine('FEATURE_2'), getLine('FEATURE_3')].filter(Boolean),
    full_page: fullPageMatch ? fullPageMatch[1].trim() : content,
    faq,
    meta: {
      title: getLine('META_TITLE'),
      description: getLine('META_DESC')
    }
  }
}

// ─── GENERATE SUBURB PAGE ─────────────────────────────────────────────────────
async function generateSuburbPage(d: IntakeData, suburbName: string): Promise<SuburbPage> {
  const content = await ask(`
Australian local SEO copywriter. Write a suburb landing page (220-270 words).

Suburb: ${suburbName}
Business: ${d.biz_name} | Industry: ${d.industry}
City: ${d.city} | Phone: ${d.phone}
Price: ${d.price_from || 'contact for quote'}
Guarantees: ${d.guarantees.join(', ')}

Format EXACTLY:
H1: [headline with suburb and service, 6-9 words]
---CONTENT---
[Full page: intro para mentioning ${suburbName} (50-65 words), Services section with 4-6 bullets, Local Area para (50-65 words), Closing CTA with phone]
META_TITLE: [50-60 chars, includes "${suburbName}"]
META_DESC: [145-158 chars, includes "${suburbName}"]
SLUG: /${d.industry.toLowerCase().replace(/\s+/g, '-')}-${suburbName.toLowerCase().replace(/\s+/g, '-')}
`, 800)

  const getLine = (key: string) => {
    const m = content.match(new RegExp(`${key}:\\s*(.+)`))
    return m ? m[1].trim() : ''
  }

  const contentMatch = content.match(/---CONTENT---\n([\s\S]*?)META_TITLE:/)

  return {
    h1: getLine('H1'),
    content: contentMatch ? contentMatch[1].trim() : '',
    meta: {
      title: getLine('META_TITLE'),
      description: getLine('META_DESC'),
      slug: getLine('SLUG') || `/${d.industry.toLowerCase().replace(/\s+/g, '-')}-${suburbName.toLowerCase().replace(/\s+/g, '-')}`
    }
  }
}

// ─── GENERATE HOMEPAGE FAQ ────────────────────────────────────────────────────
async function generateFAQ(d: IntakeData): Promise<Array<{ q: string; a: string }>> {
  const raw = await ask(`
Write 10 FAQ Q&As for a local business homepage.

Business: ${d.biz_name} | Industry: ${d.industry} | City: ${d.city}
Price: ${d.price_from || 'contact for quote'} | Guarantees: ${d.guarantees.join(', ')}
Certs: ${d.certs.join(', ')} | Response: ${d.response_time || 'same day'}
Availability: ${d.availability || '7 days'}

Format EXACTLY:
Q1: [question]
A1: [30-60 word answer, Australian English]
Q2: [question]
A2: [answer]
[...continue to Q10/A10]

Cover: pricing, booking, guarantee, insurance, services, equipment, same-person policy, payment, timing, service area.
Include ${d.city} naturally in at least 4 answers.
`, 1000)

  const faqs: Array<{ q: string; a: string }> = []
  for (let i = 1; i <= 10; i++) {
    const qMatch = raw.match(new RegExp(`Q${i}:\\s*(.+)`))
    const aMatch = raw.match(new RegExp(`A${i}:\\s*(.+)`))
    if (qMatch && aMatch) {
      faqs.push({ q: qMatch[1].trim(), a: aMatch[1].trim() })
    }
  }
  return faqs
}

// ─── GENERATE GMB DESCRIPTION ────────────────────────────────────────────────
async function generateGMBDescription(d: IntakeData): Promise<string> {
  return ask(`
Write a Google Business Profile description. STRICT MAX: 750 characters.

Business: ${d.biz_name} | Industry: ${d.industry} | City: ${d.city}
Suburbs: ${d.suburbs.slice(0, 6).join(', ')}
Services: ${d.services.slice(0, 5).join(', ')}
Years: ${d.years_in_biz} | Certs: ${d.certs.join(', ')} | Phone: ${d.phone}

Rules: No bullet points, no URLs, no ALL CAPS, no hashtags, no emojis.
Australian English. Plain flowing prose. Must be under 750 characters.
Output only the description text. Nothing else.
`, 300)
}

// ─── GENERATE META TAGS ──────────────────────────────────────────────────────
async function generateMetaTags(d: IntakeData) {
  const raw = await ask(`
Write homepage meta tags for a local business website.

Business: ${d.biz_name} | Industry: ${d.industry} | City: ${d.city}
USPs: ${d.usps.slice(0, 3).join(', ')} | Price: ${d.price_from || ''}

Format EXACTLY:
TITLE: [50-60 chars]
META_DESC: [145-158 chars, includes industry+city, CTA]
OG_TITLE: [60-90 chars, benefit-led]
OG_DESC: [150-200 chars, conversational]

Output only these 4 lines.
`, 300)

  const getLine = (key: string) => {
    const m = raw.match(new RegExp(`${key}:\\s*(.+)`))
    return m ? m[1].trim() : ''
  }

  return {
    title: getLine('TITLE'),
    description: getLine('META_DESC'),
    og_title: getLine('OG_TITLE'),
    og_description: getLine('OG_DESC')
  }
}

// ─── GENERATE SCHEMA JSON-LD ─────────────────────────────────────────────────
async function generateSchema(d: IntakeData): Promise<string> {
  // Build deterministically for speed — no Claude needed
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: d.biz_name,
    telephone: d.phone,
    email: d.email,
    url: d.domain ? `https://${d.domain}` : '',
    address: {
      '@type': 'PostalAddress',
      addressLocality: d.city,
      addressRegion: d.address?.match(/\b[A-Z]{2,3}\b/)?.[0] || 'NSW',
      addressCountry: 'AU'
    },
    priceRange: d.price_from ? '$' : '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: d.availability === '7 days a week'
        ? ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
        : ['Monday','Tuesday','Wednesday','Thursday','Friday'],
      opens: '07:00',
      closes: '19:00'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${d.industry} Services`,
      itemListElement: d.services.map(s => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s }
      }))
    },
    areaServed: d.suburbs.map(s => ({ '@type': 'City', name: s }))
  }

  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`
}

// ─── MAIN: GENERATE FULL SITE ─────────────────────────────────────────────────
export async function generateFullSite(intake: IntakeData): Promise<Partial<GeneratedSite>> {
  console.log(`[AI] Starting generation for ${intake.biz_name}...`)

  // Run hero + about + meta in parallel (fast)
  const [hero, aboutSummary, aboutFull, metaTags, gmbDesc, faq, schema] = await Promise.all([
    generateHero(intake),
    generateAboutSummary(intake),
    generateAboutFull(intake),
    generateMetaTags(intake),
    generateGMBDescription(intake),
    generateFAQ(intake),
    generateSchema(intake)
  ])

  console.log('[AI] Core content done. Generating service pages...')

  // Generate service pages (sequential to avoid rate limits)
  const servicesCopy: Record<string, ServiceCopy> = {}
  for (const service of intake.services.slice(0, 6)) {
    servicesCopy[service] = await generateServicePage(intake, service)
    console.log(`[AI] Service page done: ${service}`)
  }

  console.log('[AI] Generating suburb pages...')

  // Generate suburb pages (sequential)
  const suburbPages: Record<string, SuburbPage> = {}
  for (const suburb of intake.suburbs.slice(0, 10)) {
    suburbPages[suburb] = await generateSuburbPage(intake, suburb)
    console.log(`[AI] Suburb page done: ${suburb}`)
  }

  console.log('[AI] Generation complete!')

  return {
    hero_headline: hero.headline,
    hero_subheadline: hero.subheadline,
    hero_cta_primary: hero.cta_primary,
    hero_cta_secondary: hero.cta_secondary,
    trust_bar: hero.trust_bar,
    about_summary: aboutSummary,
    about_full: aboutFull,
    owner_bio: '',
    services_copy: servicesCopy,
    suburb_pages: suburbPages,
    homepage_faq: faq,
    gmb_description: gmbDesc,
    meta_tags: metaTags,
    schema_json: schema,
    status: 'complete'
  }
}
