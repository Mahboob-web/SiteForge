// ─── LEAD (from agency parent site form) ────────────────────────────────────
export interface Lead {
  id?: string
  first_name: string
  last_name: string
  biz_name: string
  phone: string
  email: string
  niche: string
  city: string
  message?: string
  plan?: string
  status: 'new' | 'contacted' | 'intake_sent' | 'intake_complete' | 'generating' | 'deployed' | 'live'
  intake_token?: string
  created_at?: string
}

// ─── INTAKE (full client data from intake form) ───────────────────────────────
export interface IntakeData {
  id?: string
  lead_id?: string
  token: string

  // Step 1 — Business Info
  biz_name: string
  trading_name?: string
  owner_name: string
  abn?: string
  phone: string
  email: string
  domain?: string
  years_in_biz: string
  team_size: string
  biz_type?: string
  address: string
  gmb_url?: string
  current_site?: string
  industry: string

  // Step 2 — Services
  services: string[]
  other_services?: string
  pricing_type: 'fixed' | 'quote'
  price_from?: string
  price_popular?: string
  response_time?: string
  availability?: string
  guarantees: string[]
  certs: string[]

  // Step 3 — Service Areas
  suburbs: string[]
  travel_range?: number
  city: string

  // Step 4 — Brand & Design
  tone: 'friendly' | 'professional' | 'premium'
  colour?: string
  style?: string
  target_customer?: string

  // Step 5 — USPs
  usps: string[]
  biz_story?: string
  star_rating?: string
  awards?: string

  // Step 6 — Testimonials
  testimonials: Array<{ text: string; author: string; suburb?: string }>
  facebook_url?: string
  instagram_url?: string

  // Step 7 — Assets & Final
  logo_url?: string
  plan: 'starter' | 'professional' | 'premium'
  retainer?: string
  status?: 'pending' | 'generating' | 'complete' | 'deployed'
  site_url?: string
  created_at?: string
}

// ─── GENERATED SITE CONTENT ──────────────────────────────────────────────────
export interface GeneratedSite {
  id?: string
  intake_id: string
  hero_headline: string
  hero_subheadline: string
  hero_cta_primary: string
  hero_cta_secondary: string
  trust_bar: string[]
  about_summary: string
  about_full: string
  owner_bio: string
  services_copy: Record<string, ServiceCopy>
  suburb_pages: Record<string, SuburbPage>
  homepage_faq: Array<{ q: string; a: string }>
  gmb_description: string
  meta_tags: MetaTags
  schema_json: string
  status: 'pending' | 'complete' | 'error'
  created_at?: string
}

export interface ServiceCopy {
  title: string
  short_desc: string
  features: string[]
  full_page: string
  faq: Array<{ q: string; a: string }>
  meta: { title: string; description: string }
}

export interface SuburbPage {
  h1: string
  content: string
  meta: { title: string; description: string; slug: string }
}

export interface MetaTags {
  title: string
  description: string
  og_title: string
  og_description: string
}

// ─── DEPLOYMENT ──────────────────────────────────────────────────────────────
export interface Deployment {
  id?: string
  intake_id: string
  vercel_project_id?: string
  vercel_deployment_id?: string
  url?: string
  custom_domain?: string
  status: 'pending' | 'building' | 'ready' | 'error'
  created_at?: string
}
