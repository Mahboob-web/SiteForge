import type { IntakeData, GeneratedSite } from '@/types'

const VERCEL_TOKEN = process.env.VERCEL_TOKEN!
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID

// ─── BUILD HTML FILE FROM GENERATED CONTENT ───────────────────────────────────
function buildSiteHTML(intake: IntakeData, site: Partial<GeneratedSite>): string {
  const primaryColour = intake.colour || '#276135'
  const accentColour = '#c8f04b'

  const serviceCards = intake.services.slice(0, 6).map(s => {
    const copy = site.services_copy?.[s]
    return `
    <div class="service-card">
      <h3>${copy?.title || s}</h3>
      <p>${copy?.short_desc || ''}</p>
      <ul>${(copy?.features || []).map(f => `<li>${f}</li>`).join('')}</ul>
      <a href="/services/${s.toLowerCase().replace(/\s+/g, '-')}" class="btn-outline">Learn More →</a>
    </div>`
  }).join('')

  const trustBar = (site.trust_bar || []).map(t =>
    `<div class="trust-item">${t}</div>`
  ).join('')

  const faqItems = (site.homepage_faq || []).map((faq, i) => `
    <div class="faq-item">
      <button class="faq-q" onclick="toggleFAQ(${i})">${faq.q}<span>+</span></button>
      <div class="faq-a" id="faq-${i}">${faq.a}</div>
    </div>`
  ).join('')

  const testimonialCards = (intake.testimonials || []).map(t => `
    <div class="testimonial-card">
      <div class="stars">★★★★★</div>
      <p>"${t.text}"</p>
      <div class="author">— ${t.author}${t.suburb ? `, ${t.suburb}` : ''}</div>
    </div>`
  ).join('')

  const suburbTags = intake.suburbs.slice(0, 20).map(s =>
    `<a href="${site.suburb_pages?.[s]?.meta?.slug || '#'}" class="suburb-tag">${s}</a>`
  ).join('')

  const meta = (site.meta_tags || {}) as { title?: string; description?: string; og_title?: string; og_description?: string }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${meta.title || intake.biz_name}</title>
<meta name="description" content="${meta.description || ''}">
<meta property="og:title" content="${meta.og_title || meta.title || intake.biz_name}">
<meta property="og:description" content="${meta.og_description || meta.description || ''}">
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;1,9..144,300&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
${site.schema_json || ''}
<style>
  :root {
    --brand: ${primaryColour};
    --accent: ${accentColour};
    --ink: #0f1612;
    --paper: #f8fcf9;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Outfit', sans-serif; color: var(--ink); background: var(--paper); }

  /* NAV */
  nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95);
    backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0,0,0,0.08);
    padding: 0 5%; display: flex; align-items: center; justify-content: space-between; height: 68px; }
  .nav-logo { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 500; color: var(--brand); text-decoration: none; }
  .nav-links { display: flex; gap: 28px; list-style: none; }
  .nav-links a { font-size: 14px; font-weight: 500; color: var(--ink); text-decoration: none; opacity: 0.7; transition: opacity 0.2s; }
  .nav-links a:hover { opacity: 1; }
  .nav-cta { background: var(--brand); color: white; padding: 10px 22px; border-radius: 9999px;
    font-size: 14px; font-weight: 600; text-decoration: none; transition: background 0.2s; }
  .nav-cta:hover { background: var(--accent); color: var(--ink); }

  /* HERO */
  .hero { background: linear-gradient(135deg, #0a1a10 0%, #163520 100%);
    padding: 100px 5% 80px; text-align: center; }
  .hero h1 { font-family: 'Fraunces', serif; font-size: clamp(36px,5vw,68px);
    font-weight: 500; color: white; line-height: 1.08; letter-spacing: -0.03em; margin-bottom: 20px; }
  .hero p { font-size: clamp(15px,2vw,19px); color: rgba(255,255,255,0.65);
    max-width: 600px; margin: 0 auto 36px; line-height: 1.7; }
  .hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .btn-primary { background: var(--accent); color: var(--ink); padding: 15px 32px;
    border-radius: 9999px; font-size: 15px; font-weight: 700; text-decoration: none;
    display: inline-block; transition: transform 0.2s; }
  .btn-primary:hover { transform: translateY(-2px); }
  .btn-ghost { border: 2px solid rgba(255,255,255,0.3); color: white; padding: 13px 28px;
    border-radius: 9999px; font-size: 15px; font-weight: 600; text-decoration: none;
    display: inline-block; transition: all 0.2s; }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

  /* TRUST BAR */
  .trust-bar { background: var(--brand); padding: 16px 5%;
    display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; }
  .trust-item { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.9); }

  /* SECTIONS */
  section { padding: 80px 5%; }
  .section-label { font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--brand); margin-bottom: 12px; }
  h2 { font-family: 'Fraunces', serif; font-size: clamp(28px,4vw,44px);
    font-weight: 500; letter-spacing: -0.025em; margin-bottom: 16px; }
  .section-sub { font-size: 16px; color: rgba(0,0,0,0.55); max-width: 520px; line-height: 1.7; }

  /* SERVICES GRID */
  .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr));
    gap: 20px; margin-top: 48px; }
  .service-card { background: white; border: 1.5px solid rgba(0,0,0,0.08);
    border-radius: 16px; padding: 28px; transition: all 0.25s; }
  .service-card:hover { border-color: var(--brand); box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-3px); }
  .service-card h3 { font-size: 18px; font-weight: 600; margin-bottom: 10px; }
  .service-card p { font-size: 14px; color: rgba(0,0,0,0.6); margin-bottom: 14px; line-height: 1.6; }
  .service-card ul { list-style: none; margin-bottom: 20px; }
  .service-card ul li { font-size: 13px; color: rgba(0,0,0,0.6); padding: 3px 0; }
  .service-card ul li::before { content: '✓ '; color: var(--brand); font-weight: 700; }
  .btn-outline { display: inline-block; border: 1.5px solid var(--brand); color: var(--brand);
    padding: 8px 18px; border-radius: 9999px; font-size: 13px; font-weight: 600;
    text-decoration: none; transition: all 0.2s; }
  .btn-outline:hover { background: var(--brand); color: white; }

  /* ABOUT */
  .about-section { background: #f0f7f2; }
  .about-inner { max-width: 760px; }
  .about-inner p { font-size: 16px; line-height: 1.8; color: rgba(0,0,0,0.7);
    margin-bottom: 16px; }

  /* TESTIMONIALS */
  .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr));
    gap: 20px; margin-top: 48px; }
  .testimonial-card { background: white; border: 1.5px solid rgba(0,0,0,0.08);
    border-radius: 16px; padding: 24px; }
  .stars { color: #f5a623; font-size: 18px; margin-bottom: 12px; }
  .testimonial-card p { font-size: 15px; color: rgba(0,0,0,0.7); line-height: 1.7;
    margin-bottom: 12px; font-style: italic; }
  .author { font-size: 13px; font-weight: 600; color: var(--brand); }

  /* SUBURBS */
  .suburbs-section { background: linear-gradient(135deg, #0a1a10, #163520); }
  .suburbs-section h2 { color: white; }
  .suburbs-section .section-label { color: var(--accent); }
  .suburbs-section .section-sub { color: rgba(255,255,255,0.5); }
  .suburb-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 32px; }
  .suburb-tag { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.7); padding: 7px 16px; border-radius: 9999px;
    font-size: 13px; text-decoration: none; transition: all 0.2s; }
  .suburb-tag:hover { background: var(--accent); color: var(--ink);
    border-color: var(--accent); }

  /* FAQ */
  .faq-list { max-width: 720px; margin-top: 48px; }
  .faq-item { border-bottom: 1px solid rgba(0,0,0,0.08); }
  .faq-q { width: 100%; background: none; border: none; padding: 20px 0;
    font-size: 16px; font-weight: 600; cursor: pointer; text-align: left;
    display: flex; justify-content: space-between; align-items: center; }
  .faq-q span { font-size: 22px; color: var(--brand); transition: transform 0.2s; }
  .faq-a { display: none; padding: 0 0 20px; font-size: 15px;
    color: rgba(0,0,0,0.65); line-height: 1.7; }
  .faq-a.open { display: block; }

  /* CONTACT / CTA */
  .cta-section { background: var(--brand); text-align: center; }
  .cta-section h2 { color: white; }
  .cta-section p { color: rgba(255,255,255,0.7); max-width: 480px; margin: 0 auto 32px; font-size: 16px; }
  .cta-phone { font-family: 'Fraunces', serif; font-size: 36px; color: var(--accent);
    text-decoration: none; display: block; margin-bottom: 24px; }

  /* FOOTER */
  footer { background: #0a1a10; padding: 40px 5%; text-align: center; }
  footer p { font-size: 13px; color: rgba(255,255,255,0.35); }

  @media (max-width: 768px) {
    .nav-links { display: none; }
    .trust-bar { gap: 12px; }
  }
</style>
</head>
<body>

<nav>
  <a href="/" class="nav-logo">${intake.biz_name}</a>
  <ul class="nav-links">
    <li><a href="#services">Services</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#reviews">Reviews</a></li>
    <li><a href="#areas">Areas</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
  <a href="tel:${intake.phone}" class="nav-cta">📞 Call Now</a>
</nav>

<section class="hero">
  <h1>${site.hero_headline || intake.biz_name}</h1>
  <p>${site.hero_subheadline || ''}</p>
  <div class="hero-btns">
    <a href="#contact" class="btn-primary">${site.hero_cta_primary || 'Get a Free Quote'}</a>
    <a href="#services" class="btn-ghost">${site.hero_cta_secondary || 'Our Services'}</a>
  </div>
</section>

<div class="trust-bar">
  ${trustBar}
</div>

<section id="services">
  <div class="section-label">What We Offer</div>
  <h2>Our ${intake.industry} Services</h2>
  <p class="section-sub">Professional, reliable service across ${intake.city} and surrounding suburbs.</p>
  <div class="services-grid">
    ${serviceCards}
  </div>
</section>

<section class="about-section" id="about">
  <div class="about-inner">
    <div class="section-label">About Us</div>
    <h2>Why ${intake.city} Chooses ${intake.biz_name}</h2>
    ${(site.about_summary || '').split('\n\n').map(p => `<p>${p}</p>`).join('')}
  </div>
</section>

${intake.testimonials?.length ? `
<section id="reviews">
  <div class="section-label">Customer Reviews</div>
  <h2>What Our Clients Say</h2>
  <p class="section-sub">Trusted by hundreds of ${intake.city} residents and businesses.</p>
  <div class="testimonials-grid">
    ${testimonialCards}
  </div>
</section>` : ''}

<section class="suburbs-section" id="areas">
  <div class="section-label">Service Areas</div>
  <h2>Serving ${intake.city} & Surrounds</h2>
  <p class="section-sub">We cover ${intake.suburbs.length} suburbs across the ${intake.city} region.</p>
  <div class="suburb-tags">
    ${suburbTags}
  </div>
</section>

<section>
  <div class="section-label">Common Questions</div>
  <h2>Frequently Asked Questions</h2>
  <div class="faq-list">
    ${faqItems}
  </div>
</section>

<section class="cta-section" id="contact">
  <div class="section-label" style="color:rgba(255,255,255,0.5)">Get Started Today</div>
  <h2>Ready for a Quote?</h2>
  <p>Call us now or send a message — we respond within ${intake.response_time || 'the same day'}.</p>
  <a href="tel:${intake.phone}" class="cta-phone">${intake.phone}</a>
  <a href="mailto:${intake.email}" class="btn-primary">Send Us a Message</a>
</section>

<footer>
  <p>© ${new Date().getFullYear()} ${intake.biz_name}. All rights reserved. | ${intake.address} | ${intake.phone}</p>
</footer>

<script>
function toggleFAQ(i) {
  const el = document.getElementById('faq-' + i);
  const btn = el.previousElementSibling;
  const isOpen = el.classList.toggle('open');
  btn.querySelector('span').style.transform = isOpen ? 'rotate(45deg)' : '';
}
</script>
</body>
</html>`
}

// ─── DEPLOY TO VERCEL ─────────────────────────────────────────────────────────
export async function deployToVercel(
  intake: IntakeData,
  site: Partial<GeneratedSite>
): Promise<{ url: string; projectId: string; deploymentId: string }> {

  const projectName = `sf-${intake.biz_name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)}`

  const indexHtml = buildSiteHTML(intake, site)

  const headers: Record<string, string> = {
    Authorization: `Bearer ${VERCEL_TOKEN}`,
    'Content-Type': 'application/json'
  }

  const teamParam = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''

  // ── Step 1: Create Vercel project ──────────────────────────────────────────
  const projectRes = await fetch(`https://api.vercel.com/v9/projects${teamParam}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: projectName,
      framework: null, // static HTML
      publicSource: false
    })
  })

  const project = await projectRes.json()
  const projectId = project.id

  if (!projectId) {
    // Project might already exist — try to get it
    const existingRes = await fetch(
      `https://api.vercel.com/v9/projects/${projectName}${teamParam}`,
      { headers }
    )
    const existing = await existingRes.json()
    if (!existing.id) throw new Error(`Failed to create/find Vercel project: ${JSON.stringify(project)}`)
  }

  // ── Step 2: Deploy files ───────────────────────────────────────────────────
  const deployRes = await fetch(`https://api.vercel.com/v13/deployments${teamParam}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: projectName,
      files: [
        {
          file: 'index.html',
          data: indexHtml,
          encoding: 'utf-8'
        }
      ],
      projectSettings: {
        framework: null,
        outputDirectory: ''
      },
      target: 'production'
    })
  })

  const deployment = await deployRes.json()

  if (!deployment.id) {
    throw new Error(`Vercel deployment failed: ${JSON.stringify(deployment)}`)
  }

  // ── Step 3: Poll until ready ───────────────────────────────────────────────
  let deploymentUrl = ''
  let attempts = 0
  const maxAttempts = 30

  while (attempts < maxAttempts) {
    await new Promise(r => setTimeout(r, 3000)) // wait 3s

    const statusRes = await fetch(
      `https://api.vercel.com/v13/deployments/${deployment.id}${teamParam}`,
      { headers }
    )
    const status = await statusRes.json()

    if (status.readyState === 'READY') {
      deploymentUrl = `https://${status.url}`
      break
    }

    if (status.readyState === 'ERROR') {
      throw new Error(`Vercel deployment errored: ${status.errorMessage}`)
    }

    attempts++
  }

  if (!deploymentUrl) {
    // Return the URL even if not confirmed ready
    deploymentUrl = `https://${projectName}.vercel.app`
  }

  return {
    url: deploymentUrl,
    projectId: projectId || projectName,
    deploymentId: deployment.id
  }
}
