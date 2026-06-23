import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = process.env.RESEND_FROM  || 'SiteForge <onboarding@resend.dev>'
const ADMIN  = process.env.ADMIN_EMAIL  || 'mahboobkh777@gmail.com'

// ─── Client confirmation ───────────────────────────────────────────────────

function clientHtml(d: {
  firstName: string
  bizName:   string
  plan:      string
  email:     string
  domain:    string
  industry:  string
}) {
  const planLabel = d.plan ? (d.plan.charAt(0).toUpperCase() + d.plan.slice(1)) : 'Starter'
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your SiteForge website is being built</title></head>
<body style="margin:0;padding:0;background:#f2f4f0;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f4f0;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

  <!-- Header -->
  <tr><td style="background:#0a1a10;padding:28px 40px;text-align:center;">
    <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#ffffff;letter-spacing:-0.02em;">SiteForge</span>
    <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#c8f04b;letter-spacing:-0.02em;"> AI</span>
  </td></tr>

  <!-- Hero -->
  <tr><td style="background:#ffffff;padding:44px 40px 36px;text-align:center;">
    <div style="display:inline-block;width:60px;height:60px;border-radius:50%;background:#f0fde8;border:2px solid #c8f04b;line-height:60px;font-size:26px;margin-bottom:24px;">✓</div>
    <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:400;color:#0a1a10;line-height:1.2;">We're building your website</h1>
    <p style="margin:0;font-size:15px;color:#666666;line-height:1.75;">Hi ${d.firstName}, your <strong style="color:#0a1a10;">${d.bizName}</strong> website is being generated right now. You'll receive the live link to review it within <strong style="color:#276135;">15–30 minutes</strong>.</p>
  </td></tr>

  <!-- Divider -->
  <tr><td style="background:#ffffff;padding:0 40px;"><div style="height:1px;background:#f0f0f0;"></div></td></tr>

  <!-- Summary table -->
  <tr><td style="background:#ffffff;padding:28px 40px 36px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      ${[
        ['Business',  d.bizName],
        ['Industry',  d.industry || '—'],
        ['Plan',      planLabel],
        ['Delivery',  '15–30 minutes'],
        ['Email',     d.email],
        ['Domain',    d.domain],
      ].map(([label, value], i, arr) => `
      <tr>
        <td style="padding:11px 0;${i < arr.length-1 ? 'border-bottom:1px solid #f5f5f5;' : ''}font-size:12px;color:#999999;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">${label}</td>
        <td style="padding:11px 0;${i < arr.length-1 ? 'border-bottom:1px solid #f5f5f5;' : ''}font-size:14px;color:#0a1a10;font-weight:600;text-align:right;">${value}</td>
      </tr>`).join('')}
    </table>
  </td></tr>

  <!-- What's next -->
  <tr><td style="background:#ffffff;padding:0 40px 36px;">
    <div style="background:#f6fef0;border:1px solid #d4f5a0;border-radius:12px;padding:24px 28px;">
      <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#276135;text-transform:uppercase;letter-spacing:0.08em;">What happens next</p>
      <table cellpadding="0" cellspacing="0">
        ${[
          ['1.', 'Our AI generates your full website with your custom content and services.'],
          ['2.', 'You\'ll receive a review link — check the live site and let us know any changes.'],
          ['3.', 'We make your edits within 24 hours and your site goes live.'],
        ].map(([num, text]) => `
        <tr>
          <td style="padding:0 10px 10px 0;font-size:14px;font-weight:700;color:#c8f04b;background:#f6fef0;vertical-align:top;">${num}</td>
          <td style="padding:0 0 10px;font-size:14px;color:#444444;line-height:1.65;background:#f6fef0;">${text}</td>
        </tr>`).join('')}
      </table>
    </div>
  </td></tr>

  <!-- While you wait -->
  <tr><td style="background:#ffffff;padding:0 40px 36px;">
    <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#999999;text-transform:uppercase;letter-spacing:0.06em;">While you wait</p>
    ${[
      'Gather 3–5 high-res photos of your work or team to send us',
      'Have your ABN and trade licence numbers handy',
      'Note any specific pages or content you\'d like added',
    ].map(tip => `<p style="margin:0 0 8px;font-size:14px;color:#666666;line-height:1.65;padding-left:14px;border-left:2px solid #c8f04b;">• ${tip}</p>`).join('')}
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f9f9f9;border-top:1px solid #f0f0f0;padding:24px 40px;text-align:center;">
    <p style="margin:0 0 6px;font-size:12px;color:#aaaaaa;line-height:1.7;">Questions? Just reply to this email — we respond within 2 hours.</p>
    <p style="margin:0;font-size:11px;color:#cccccc;">SiteForge AI · Websites for Australian Cleaning Businesses</p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`
}

// ─── Admin notification ────────────────────────────────────────────────────

function adminHtml(d: Record<string, unknown>) {
  const row = (label: string, value: unknown) => {
    const v = Array.isArray(value) ? (value as unknown[]).join(', ') : String(value ?? '—')
    if (!v || v === '—') return ''
    return `<tr>
      <td style="padding:9px 12px;font-size:12px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:0.04em;white-space:nowrap;border-bottom:1px solid #f0f0f0;">${label}</td>
      <td style="padding:9px 12px;font-size:13px;color:#111;border-bottom:1px solid #f0f0f0;word-break:break-word;">${v}</td>
    </tr>`
  }

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#f2f4f0;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:660px;margin:0 auto;">
  <tr><td style="background:#0a1a10;padding:20px 28px;border-radius:12px 12px 0 0;">
    <span style="font-family:Georgia,serif;font-size:18px;color:#fff;">SiteForge</span>
    <span style="font-size:13px;color:#c8f04b;margin-left:12px;">New Intake Submitted</span>
  </td></tr>
  <tr><td style="background:#fff;border-radius:0 0 12px 12px;overflow:hidden;">
    <table width="100%" cellpadding="0" cellspacing="0">
      ${row('Business',       d.biz_name)}
      ${row('Owner',          d.owner_name)}
      ${row('Phone',          d.phone)}
      ${row('Email',          d.email)}
      ${row('City',           d.city)}
      ${row('Address',        d.address)}
      ${row('Industry',       d.industry)}
      ${row('Plan',           d.plan)}
      ${row('Services',       d.services)}
      ${row('Suburbs',        d.suburbs)}
      ${row('Years in biz',   d.years_in_biz)}
      ${row('Team size',      d.team_size)}
      ${row('USP 1',          (d.usps as string[])?.[0])}
      ${row('USP 2',          (d.usps as string[])?.[1])}
      ${row('USP 3',          (d.usps as string[])?.[2])}
      ${row('Biz story',      d.biz_story)}
      ${row('Star rating',    d.star_rating)}
      ${row('Target customer',d.target_customer)}
      ${row('Awards',         d.awards)}
      ${row('Tone',           d.tone)}
      ${row('Brand colour',   d.colour)}
      ${row('Facebook',       d.facebook_url)}
      ${row('Instagram',      d.instagram_url)}
      ${row('Logo URL',       d.logo_url)}
      ${row('GMB URL',        d.gmb_url)}
      ${row('Current site',   d.current_site)}
      ${row('Domain',         d.domain)}
    </table>
    ${(d.testimonials as {text:string;author:string;suburb:string}[])?.filter(t=>t.text).length ? `
    <div style="padding:16px 12px;background:#f9f9f9;border-top:1px solid #eee;">
      <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.06em;">Testimonials</p>
      ${(d.testimonials as {text:string;author:string;suburb:string}[]).filter(t=>t.text).map(t=>`
      <div style="margin-bottom:10px;padding:12px;background:#fff;border-radius:8px;border:1px solid #eee;">
        <p style="margin:0 0 4px;font-size:13px;color:#333;line-height:1.6;">"${t.text}"</p>
        <p style="margin:0;font-size:11px;color:#999;">— ${t.author || 'Anonymous'}${t.suburb ? `, ${t.suburb}` : ''}</p>
      </div>`).join('')}
    </div>` : ''}
  </td></tr>
  <tr><td style="padding:12px 0;text-align:center;font-size:11px;color:#aaa;">SiteForge AI · New intake notification</td></tr>
</table>
</body></html>`
}

// ─── Lead notification (new quote-form lead — first touch) ─────────────────

function leadHtml(d: {
  firstName: string; lastName: string; bizName: string
  phone: string; email: string; niche: string
  city: string; plan: string; message: string
}) {
  const row = (label: string, value: string) => {
    if (!value) return ''
    return `<tr>
      <td style="padding:9px 12px;font-size:12px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:0.04em;white-space:nowrap;border-bottom:1px solid #f0f0f0;">${label}</td>
      <td style="padding:9px 12px;font-size:13px;color:#111;border-bottom:1px solid #f0f0f0;word-break:break-word;">${value}</td>
    </tr>`
  }
  const fullName = [d.firstName, d.lastName].filter(Boolean).join(' ')
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:24px;background:#f2f4f0;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
  <tr><td style="background:#0a1a10;padding:20px 28px;border-radius:12px 12px 0 0;">
    <span style="font-family:Georgia,serif;font-size:18px;color:#fff;">SiteForge</span>
    <span style="font-size:13px;color:#c8f04b;margin-left:12px;">🔔 New Lead — Call Fast</span>
  </td></tr>
  <tr><td style="background:#fff;padding:24px 28px 10px;">
    <p style="margin:0 0 4px;font-size:20px;font-weight:700;color:#0a1a10;">${d.bizName}</p>
    <p style="margin:0 0 18px;font-size:14px;color:#666;">${fullName}${d.city ? ` · ${d.city}` : ''}</p>
    <table cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding-right:10px;"><a href="tel:${d.phone}" style="display:inline-block;background:#c8f04b;color:#0a1a10;text-decoration:none;font-weight:700;font-size:14px;padding:11px 22px;border-radius:9999px;">📞 Call ${d.phone}</a></td>
        <td><a href="mailto:${d.email}" style="display:inline-block;background:#f0f0f0;color:#0a1a10;text-decoration:none;font-weight:700;font-size:14px;padding:11px 22px;border-radius:9999px;">✉ Email</a></td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="background:#fff;border-radius:0 0 12px 12px;padding:10px 16px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      ${row('Service',       d.niche)}
      ${row('Plan interest', d.plan)}
      ${row('Phone',         d.phone)}
      ${row('Email',         d.email)}
      ${row('City',          d.city)}
      ${row('Message',       d.message)}
    </table>
  </td></tr>
  <tr><td style="padding:12px 0;text-align:center;font-size:11px;color:#aaa;">⚡ Speed-to-lead: the first to reply usually wins the job.</td></tr>
</table>
</body></html>`
}

// ─── Exported send functions ───────────────────────────────────────────────

export async function sendLeadNotification(data: {
  firstName: string; lastName: string; bizName: string
  phone: string; email: string; niche: string
  city: string; plan: string; message: string
}) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from:    FROM,
    to:      ADMIN,
    subject: `🔔 New lead: ${data.bizName} (${data.niche})`,
    html:    leadHtml(data),
  })
}

export async function sendClientConfirmation(data: {
  firstName: string
  bizName:   string
  plan:      string
  email:     string
  domain:    string
  industry:  string
}) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from:    FROM,
    to:      data.email,
    subject: `We're building ${data.bizName}'s website — SiteForge`,
    html:    clientHtml(data),
  })
}

export async function sendAdminNotification(data: Record<string, unknown>) {
  if (!process.env.RESEND_API_KEY) return
  const bizName = String(data.biz_name || 'Unknown')
  const plan    = String(data.plan    || 'starter')
  await resend.emails.send({
    from:    FROM,
    to:      ADMIN,
    subject: `New intake: ${bizName} — ${plan.charAt(0).toUpperCase() + plan.slice(1)}`,
    html:    adminHtml(data),
  })
}
