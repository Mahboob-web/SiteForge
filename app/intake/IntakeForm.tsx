'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7

// Services grouped by industry — only relevant services shown per trade
const SERVICES_BY_INDUSTRY: Record<string, string[]> = {
  'Plumbing':             ['General Plumbing','Emergency Plumbing','Blocked Drains','Hot Water Systems','Gas Fitting','Leak Detection','Bathroom Renovations','Pipe Relining','Stormwater Drainage','Backflow Prevention'],
  'Electrical':           ['General Electrical','Safety Inspections','Switchboard Upgrades','Lighting Installation','Power Point Installation','Solar Installation','EV Charger Installation','Security Systems','Data & Communications','Emergency Electrical'],
  'Cleaning':             ['Regular House Cleaning','End of Lease Cleaning','Deep Cleaning','Office Cleaning','Carpet Cleaning','Window Cleaning','Airbnb Turnover','NDIS Cleaning','Post-Construction','Spring Cleaning','Move In/Out','Pressure Washing'],
  'Residential Cleaning': ['Regular House Cleaning','End of Lease Cleaning','Deep Cleaning','Carpet Cleaning','Window Cleaning','Airbnb Turnover','NDIS Cleaning','Spring Cleaning','Move In/Out','Oven Cleaning'],
  'Commercial Cleaning':  ['Office Cleaning','Post-Construction','Pressure Washing','Window Cleaning','Carpet Cleaning','Strata Cleaning','Medical Facility Cleaning','Gym Cleaning','School Cleaning','Retail Cleaning'],
  'Landscaping':          ['Lawn Mowing','Garden Maintenance','Hedge Trimming','Tree Lopping','Irrigation Systems','Turf Laying','Retaining Walls','Garden Design','Mulching','Weed Control'],
  'Pest Control':         ['General Pest Control','Termite Inspection','Termite Treatment','Rodent Control','Cockroach Treatment','Ant Treatment','Spider Control','Bee & Wasp Removal','Pre-Purchase Inspection','Possum Removal'],
  'Painting':             ['Interior Painting','Exterior Painting','Commercial Painting','Roof Painting','Fence Painting','Deck Staining','Wallpaper Removal','Epoxy Flooring','Spray Painting','Colour Consulting'],
  'HVAC':                 ['Air Con Installation','Air Con Service','Air Con Repair','Ducted Systems','Split Systems','Evaporative Cooling','Ventilation','Commercial HVAC','Refrigeration','Heating Systems'],
  'Handyman':             ['General Repairs','Furniture Assembly','Door & Lock Repairs','Tiling','Plastering','Gutter Cleaning','Deck Repairs','Fence Repairs','Picture Hanging','Weatherproofing'],
  'Locksmith':            ['Emergency Lockout','Lock Installation','Lock Rekeying','Deadbolt Installation','Safe Installation','Car Lockout','Master Key Systems','Security Upgrades','Door Hardware','Access Control'],
  'Carpentry':            ['Custom Cabinetry','Deck Building','Pergola Construction','Door Installation','Window Frames','Flooring','Timber Fencing','Staircase Building','Roof Framing','Furniture Repair'],
  'Tiling':               ['Floor Tiling','Wall Tiling','Bathroom Tiling','Kitchen Splashback','Outdoor Tiling','Pool Tiling','Grout Cleaning','Tile Repairs','Waterproofing','Feature Walls'],
  'Fencing':              ['Timber Fencing','Colorbond Fencing','Pool Fencing','Glass Fencing','Brick Fencing','Retaining Walls','Gate Installation','Farm Fencing','Fence Repairs','Post Installation'],
  'Roofing':              ['Roof Restoration','Roof Replacement','Leak Repairs','Gutter Installation','Gutter Guard','Roof Inspection','Metal Roofing','Tile Roofing','Flat Roofing','Fascia & Soffit'],
  'Concreting':           ['Concrete Driveways','Concrete Paths','Decorative Concrete','Concrete Slabs','Pool Surrounds','Exposed Aggregate','Concrete Cutting','Concrete Repairs','Retaining Walls','Stencil Concrete'],
  'Other':                ['General Repairs','Handyman','Lawn Mowing','Garden Maintenance','Pest Control','Painting','Pressure Washing','Gutter Cleaning','Window Cleaning','Other Services'],
}

const ALL_SERVICES = Array.from(new Set(Object.values(SERVICES_BY_INDUSTRY).flat()))

const GUARANTEES = ['Satisfaction Guarantee','Bond-Back Guarantee','Free Re-clean Policy','Fixed Price Guarantee','Same-Day Service Guarantee']
const CERTS = ['Fully Insured','Police Checked','NDIS Registered','Licensed Contractor','White Card Certified','Working with Children Check']
const AU_CITIES = ['Sydney','Melbourne','Brisbane','Perth','Adelaide','Gold Coast','Canberra','Newcastle','Wollongong','Geelong','Hobart','Townsville','Cairns','Darwin','Toowoomba']

export default function IntakeForm() {
  const params = useSearchParams()
  const token = params.get('token') || ''
  const [step, setStep] = useState<Step>(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [suburbInput, setSuburbInput] = useState('')
  const [leadLoaded, setLeadLoaded] = useState(false)
  const [extracting, setExtracting] = useState<'gmb'|'site'|null>(null)
  const [extractedFields, setExtractedFields] = useState<string[]>([])
  const [form, setForm] = useState({
    biz_name:'',trading_name:'',owner_name:'',abn:'',phone:'',email:'',domain:'',
    years_in_biz:'',team_size:'',biz_type:'',address:'',gmb_url:'',current_site:'',industry:'',
    services:[] as string[],other_services:'',pricing_type:'quote' as 'fixed'|'quote',
    price_from:'',price_popular:'',response_time:'',availability:'',
    guarantees:[] as string[],certs:[] as string[],
    suburbs:[] as string[],travel_range:30,city:'',
    tone:'professional' as 'friendly'|'professional'|'premium',colour:'#276135',style:'',target_customer:'',
    usps:['','',''] as string[],biz_story:'',star_rating:'',awards:'',
    testimonials:[{text:'',author:'',suburb:''},{text:'',author:'',suburb:''},{text:'',author:'',suburb:''}],
    facebook_url:'',instagram_url:'',logo_url:'',
    plan:'professional' as 'starter'|'professional'|'premium',retainer:''
  })

  // Load saved draft from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`sf-intake-${token}`)
    if (saved) { try { setForm(JSON.parse(saved)) } catch(_) {} }
  }, [token])

  // Pre-fill from lead data (biz_name, phone, email, city, industry)
  useEffect(() => {
    if (!token || leadLoaded) return
    fetch(`/api/lead-by-token?token=${token}`)
      .then(r => r.json())
      .then(({ lead }) => {
        if (!lead) return
        setForm(prev => ({
          ...prev,
          biz_name:  prev.biz_name  || lead.biz_name  || '',
          owner_name: prev.owner_name || lead.first_name || '',
          phone:     prev.phone     || lead.phone     || '',
          email:     prev.email     || lead.email     || '',
          city:      prev.city      || lead.city      || '',
          industry:  prev.industry  || lead.niche     || '',
        }))
        setLeadLoaded(true)
      })
      .catch(() => setLeadLoaded(true))
  }, [token, leadLoaded])

  // Auto-save draft every 30s
  useEffect(() => {
    const t = setInterval(() => localStorage.setItem(`sf-intake-${token}`, JSON.stringify(form)), 30000)
    return () => clearInterval(t)
  }, [form, token])

  const update = (f: string, v: unknown) => setForm(p => ({ ...p, [f]: v }))
  const toggleArr = (f: 'services'|'guarantees'|'certs', v: string) => {
    setForm(p => { const a = p[f] as string[]; return { ...p, [f]: a.includes(v) ? a.filter(x => x !== v) : [...a, v] } })
  }
  const addSuburb = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && suburbInput.trim()) {
      e.preventDefault(); const s = suburbInput.trim()
      if (!form.suburbs.includes(s)) update('suburbs', [...form.suburbs, s])
      setSuburbInput('')
    }
  }

  const extractFromUrl = async (urlField: 'gmb_url' | 'current_site', kind: 'gmb' | 'site') => {
    const url = form[urlField]
    if (!url.trim()) return
    setExtracting(kind)
    setExtractedFields([])
    setError('')
    try {
      const res = await fetch('/api/extract-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const e = data.extracted as Record<string, unknown>
      const filled: string[] = []

      // Simple string fields — only set if not already filled
      const str = (field: string, label: string, value: unknown) => {
        if (typeof value !== 'string' || !value.trim()) return
        update(field, value.trim())
        filled.push(label)
      }

      str('biz_name',        'Business name',    e.biz_name)
      str('owner_name',      'Owner name',       e.owner_name)
      str('phone',           'Phone',             e.phone)
      str('email',           'Email',             e.email)
      str('address',         'Address',           e.address)
      str('city',            'City',              e.city)
      str('years_in_biz',    'Years in business', e.years_in_biz)
      str('star_rating',     'Google rating',     e.star_rating)
      str('biz_story',       'Business story',    e.biz_story)
      str('facebook_url',    'Facebook URL',      e.facebook_url)
      str('instagram_url',   'Instagram URL',     e.instagram_url)
      str('logo_url',        'Logo URL',          e.logo_url)
      str('target_customer', 'Target customer',   e.target_customer)
      str('awards',          'Awards',            e.awards)

      // Brand colour — auto-fill from website/logo CSS colors
      if (typeof e.brand_color === 'string' && /^#[0-9a-fA-F]{6}$/.test(e.brand_color)) {
        update('colour', e.brand_color)
        filled.push(`Brand colour (${e.brand_color})`)
      }

      // Services — match against trade-specific list
      if (Array.isArray(e.services) && (e.services as string[]).length) {
        const valid = SERVICES_BY_INDUSTRY[form.industry] ?? ALL_SERVICES
        const matched = (e.services as string[]).filter(s =>
          valid.some(v => v.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(v.toLowerCase()))
        )
        if (matched.length) { update('services', matched); filled.push('Services') }
      }

      // Suburbs / service areas
      if (Array.isArray(e.suburbs) && (e.suburbs as string[]).length) {
        const incoming = (e.suburbs as string[]).filter(s => typeof s === 'string' && s.trim())
        if (incoming.length) {
          update('suburbs', [...new Set([...form.suburbs, ...incoming])])
          filled.push('Service areas')
        }
      }

      // USPs — fill slots that are empty
      if (Array.isArray(e.usps) && (e.usps as string[]).length) {
        const newUsps = [...form.usps]
        let added = 0
        ;(e.usps as string[]).forEach(usp => {
          if (typeof usp !== 'string' || !usp.trim()) return
          const emptySlot = newUsps.findIndex(u => !u.trim())
          if (emptySlot !== -1) { newUsps[emptySlot] = usp.trim(); added++ }
        })
        if (added) { update('usps', newUsps); filled.push('USPs') }
      }

      // Testimonials — fill slots that are empty
      if (Array.isArray(e.testimonials) && (e.testimonials as unknown[]).length) {
        const newTests = form.testimonials.map(t => ({ ...t }))
        let added = 0
        ;(e.testimonials as { text?: string; author?: string; suburb?: string }[]).forEach(t => {
          if (!t?.text?.trim()) return
          const emptySlot = newTests.findIndex(x => !x.text.trim())
          if (emptySlot !== -1) {
            newTests[emptySlot] = { text: t.text?.trim() || '', author: t.author?.trim() || '', suburb: t.suburb?.trim() || '' }
            added++
          }
        })
        if (added) { update('testimonials', newTests); filled.push('Testimonials') }
      }

      setExtractedFields(filled)
    } catch (err) {
      setError(String(err))
    } finally {
      setExtracting(null)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true); setError('')
    try {
      const res = await fetch('/api/submit-intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, token }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      localStorage.removeItem(`sf-intake-${token}`)
      setSubmitted(true)
    } catch(err) { setError(String(err)) }
    finally { setSubmitting(false) }
  }

  // Services to show: filtered by industry, fallback to all if no match
  const visibleServices = SERVICES_BY_INDUSTRY[form.industry] ?? ALL_SERVICES

  const pct = Math.round((step / 7) * 100)

  if (submitted) {
    const domainSlug = (form.domain || `${(form.biz_name || 'your-site').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.vercel.app`)
    const planLabel = form.plan ? (form.plan.charAt(0).toUpperCase() + form.plan.slice(1)) : 'Starter'
    return (
      <div style={{ minHeight:'100vh', background:'#0a1a10', fontFamily:'Outfit,sans-serif' }}>
        <style>{`@keyframes sf-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes sf-pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

        {/* Header */}
        <div style={{ position:'sticky', top:0, zIndex:100, background:'rgba(10,26,16,0.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'0 5%', height:64, display:'flex', alignItems:'center' }}>
          <span style={{ fontFamily:'Fraunces,serif', fontSize:20, fontWeight:500, color:'white' }}>SiteForge</span>
        </div>

        <div style={{ maxWidth:580, margin:'0 auto', padding:'56px 5% 80px' }}>

          {/* Hero */}
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:76, height:76, borderRadius:'50%', background:'rgba(200,240,75,0.08)', border:'1.5px solid rgba(200,240,75,0.25)', marginBottom:28 }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 16l7 7 13-13" stroke="#c8f04b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(30px,5vw,46px)', fontWeight:500, color:'white', lineHeight:1.1, letterSpacing:'-0.025em', margin:'0 0 14px' }}>
              {form.biz_name
                ? <>Building <em style={{ color:'#c8f04b', fontStyle:'italic' }}>{form.biz_name}</em>&apos;s website</>
                : <>Your website is <em style={{ color:'#c8f04b', fontStyle:'italic' }}>launching</em></>}
            </h1>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.45)', lineHeight:1.75, margin:0, maxWidth:420, marginInline:'auto' }}>
              Our AI is generating your site right now. You&apos;ll receive a link to review it in your inbox shortly.
            </p>
          </div>

          {/* Progress timeline */}
          <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'28px 28px 24px', marginBottom:16 }}>
            {([
              { label:'Details received', sub:'All your information is saved and queued', done:true,   active:false },
              { label:'AI building your website', sub:'Crafting copy, layout, images & SEO pages', done:false, active:true  },
              { label:'Live URL delivered to inbox', sub:`Confirmation headed to ${form.email}`, done:false, active:false },
            ] as { label:string; sub:string; done:boolean; active:boolean }[]).map((s, i, arr) => (
              <div key={i} style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                  <div style={{
                    width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700,
                    background: s.done ? 'rgba(200,240,75,0.18)' : s.active ? 'rgba(200,240,75,0.08)' : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${s.done ? 'rgba(200,240,75,0.5)' : s.active ? 'rgba(200,240,75,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: s.active ? '0 0 0 4px rgba(200,240,75,0.06)' : 'none',
                  }}>
                    {s.done
                      ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3.5 3.5 5.5-5.5" stroke="#c8f04b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : s.active
                        ? <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:'#c8f04b', animation:'sf-pulse 1.6s ease-in-out infinite' }}/>
                        : <span style={{ color:'rgba(255,255,255,0.2)', fontSize:12 }}>{i + 1}</span>}
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ width:1.5, height:32, background: s.done ? 'rgba(200,240,75,0.2)' : 'rgba(255,255,255,0.06)', margin:'6px 0' }}/>
                  )}
                </div>
                <div style={{ paddingBottom: i < arr.length - 1 ? 28 : 0, paddingTop:7 }}>
                  <div style={{ fontSize:14, fontWeight:600, color: s.done || s.active ? 'white' : 'rgba(255,255,255,0.28)', marginBottom:3, lineHeight:1.3 }}>{s.label}</div>
                  <div style={{ fontSize:12.5, color: s.done || s.active ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.18)', lineHeight:1.5 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Details grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
            {([
              { label:'Plan',     value: planLabel },
              { label:'Delivery', value: '15–30 minutes' },
              { label:'Email',    value: form.email },
              { label:'Domain',   value: domainSlug },
            ] as { label:string; value:string }[]).map(({ label, value }) => (
              <div key={label} style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'14px 16px' }}>
                <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'0.07em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:5 }}>{label}</div>
                <div style={{ fontSize:13, color:'white', fontWeight:500, wordBreak:'break-all', lineHeight:1.4 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* While you wait */}
          <div style={{ background:'rgba(200,240,75,0.04)', border:'1px solid rgba(200,240,75,0.12)', borderRadius:20, padding:'22px 24px' }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#c8f04b', letterSpacing:'0.08em', textTransform:'uppercase', margin:'0 0 14px' }}>While you wait</p>
            {[
              'Gather 3–5 high-res photos of your work or team to send us',
              'Have your ABN and trade licence numbers handy for the content',
              'Note any extra pages or content you\'d like added after review',
              'Check your spam folder — confirmation is on its way now',
            ].map((tip, i, arr) => (
              <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom: i < arr.length - 1 ? 9 : 0 }}>
                <div style={{ width:4, height:4, borderRadius:'50%', background:'rgba(200,240,75,0.6)', marginTop:7, flexShrink:0 }}/>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>{tip}</span>
              </div>
            ))}
          </div>

          <p style={{ textAlign:'center', fontSize:12.5, color:'rgba(255,255,255,0.2)', marginTop:28, lineHeight:1.7 }}>
            Questions? Reply to your confirmation email — we respond within 2 hours.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={st.page}>
      <div style={st.header}>
        <div style={st.logo}>⚡ SiteForge AI</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={st.progressBar}><div style={{ ...st.progressFill, width: `${pct}%` }} /></div>
          <span style={st.progressLabel}>Step {step} of 7</span>
        </div>
      </div>
      <div style={st.container}>
        <div style={st.stepNav}>
          {['Business','Services','Areas','Brand','USPs','Reviews','Assets'].map((_, i) => (
            <div key={i} style={{ ...st.stepDot, background: step === i+1 ? '#c8f04b' : step > i+1 ? '#276135' : 'rgba(255,255,255,0.1)', color: step === i+1 ? '#0f1612' : step > i+1 ? 'white' : 'rgba(255,255,255,0.4)' }}>{step > i+1 ? '✓' : i+1}</div>
          ))}
        </div>

        {/* STEP 1 — Business info (industry pre-filled from lead, not asked again) */}
        {step === 1 && <div style={st.card}>
          <div style={st.tag}>Step 1 of 7</div>
          <h1 style={st.title}>Tell us about your <em style={{ color: '#c8f04b', fontStyle: 'italic' }}>business</em></h1>

          {/* Industry badge — pre-filled, read-only */}
          {form.industry && (
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Trade</span>
              <span style={{ background: 'rgba(200,240,75,0.1)', border: '1px solid rgba(200,240,75,0.3)', color: '#c8f04b', borderRadius: 9999, padding: '5px 14px', fontSize: 13, fontWeight: 700 }}>{form.industry}</span>
            </div>
          )}

          {/* Auto-fill from URLs */}
          <div style={{ background: 'rgba(200,240,75,0.04)', border: '1px solid rgba(200,240,75,0.15)', borderRadius: 14, padding: '18px 20px', marginBottom: 24 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#c8f04b', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 14px' }}>⚡ Auto-fill from your online presence</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 16px', lineHeight: 1.6 }}>Paste your Google Business or website URL and we&apos;ll fill in as much as possible automatically.</p>

            {/* GMB URL */}
            <div style={{ marginBottom: 12 }}>
              <label style={st.lbl}>Google Business Profile URL</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={form.gmb_url} onChange={e => update('gmb_url', e.target.value)} placeholder="https://g.co/kgs/... or maps.google.com/..." style={{ ...st.input, flex: 1 }} />
                <button onClick={() => extractFromUrl('gmb_url', 'gmb')} disabled={!form.gmb_url.trim() || extracting !== null}
                  style={{ flexShrink: 0, padding: '0 18px', borderRadius: 10, border: 'none', background: form.gmb_url.trim() && extracting === null ? '#c8f04b' : 'rgba(255,255,255,0.08)', color: form.gmb_url.trim() && extracting === null ? '#0f1612' : 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: 13, cursor: form.gmb_url.trim() && extracting === null ? 'pointer' : 'not-allowed', fontFamily: 'Outfit,sans-serif', whiteSpace: 'nowrap' }}>
                  {extracting === 'gmb' ? '⏳ Extracting...' : 'Auto-fill →'}
                </button>
              </div>
            </div>

            {/* Website URL */}
            <div style={{ marginBottom: 0 }}>
              <label style={st.lbl}>Current Website URL</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={form.current_site} onChange={e => update('current_site', e.target.value)} placeholder="https://yourbusiness.com.au" style={{ ...st.input, flex: 1 }} />
                <button onClick={() => extractFromUrl('current_site', 'site')} disabled={!form.current_site.trim() || extracting !== null}
                  style={{ flexShrink: 0, padding: '0 18px', borderRadius: 10, border: 'none', background: form.current_site.trim() && extracting === null ? '#c8f04b' : 'rgba(255,255,255,0.08)', color: form.current_site.trim() && extracting === null ? '#0f1612' : 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: 13, cursor: form.current_site.trim() && extracting === null ? 'pointer' : 'not-allowed', fontFamily: 'Outfit,sans-serif', whiteSpace: 'nowrap' }}>
                  {extracting === 'site' ? '⏳ Extracting...' : 'Auto-fill →'}
                </button>
              </div>
            </div>

            {/* Success summary */}
            {extractedFields.length > 0 && (
              <div style={{ marginTop: 14, background: 'rgba(200,240,75,0.08)', border: '1px solid rgba(200,240,75,0.2)', borderRadius: 10, padding: '10px 14px' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#c8f04b' }}>✓ Auto-filled: </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{extractedFields.join(', ')}</span>
              </div>
            )}
          </div>

          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: 12, color: '#fca5a5', fontSize: 13, marginBottom: 16 }}>{error}<button onClick={() => setError('')} style={{ marginLeft: 12, background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button></div>}

          <div style={st.grid2}>
            <F l="Business Name *"  v={form.biz_name}    o={v => update('biz_name', v)}    p="Williams Cleaning Co." />
            <F l="Owner Name *"     v={form.owner_name}  o={v => update('owner_name', v)}  p="Sarah Williams" />
            <F l="Phone *"          v={form.phone}        o={v => update('phone', v)}        p="0412 345 678" t="tel" />
            <F l="Email *"          v={form.email}        o={v => update('email', v)}        p="sarah@business.com.au" t="email" />
            <F l="Preferred Domain" v={form.domain}       o={v => update('domain', v)}       p="williamsclean.com.au" />
            <F l="ABN (optional)"   v={form.abn}          o={v => update('abn', v)}          p="12 345 678 901" />
          </div>
          <S l="Years in Business *" v={form.years_in_biz} o={v => update('years_in_biz', v)} opts={['Less than 1 year','1–2 years','3–5 years','6–10 years','10+ years']} />
          <S l="Team Size *"         v={form.team_size}     o={v => update('team_size', v)}     opts={['Just me (sole trader)','2–3 people','4–8 people','9–15 people','15+ people']} />
          <F l="Business Address *"  v={form.address}       o={v => update('address', v)}       p="Bondi NSW 2026" />
        </div>}

        {/* STEP 2 — Services filtered to their trade */}
        {step === 2 && <div style={st.card}>
          <div style={st.tag}>Step 2 of 7</div>
          <h1 style={st.title}>Your <em style={{ color: '#c8f04b', fontStyle: 'italic' }}>services</em></h1>
          <div style={st.checkGrid}>
            {visibleServices.map(s => (
              <label key={s} style={{ ...st.check, ...(form.services.includes(s) ? st.checkOn : {}) }}>
                <input type="checkbox" checked={form.services.includes(s)} onChange={() => toggleArr('services', s)} style={{ display: 'none' }} />
                {form.services.includes(s) ? '✓ ' : ''}{s}
              </label>
            ))}
          </div>
          <div style={st.grid2}>
            <S l="Pricing"        v={form.pricing_type}  o={v => update('pricing_type', v)}  opts={['fixed','quote']}                                                        lbls={['Fixed','Quote-Based']} />
            <F l="Starting price" v={form.price_from}    o={v => update('price_from', v)}    p="From $120" />
            <S l="Response time"  v={form.response_time} o={v => update('response_time', v)} opts={['Same day','Within 2 hours','Next business day']} />
            <S l="Availability"   v={form.availability}  o={v => update('availability', v)}  opts={['7 days a week','Mon–Sat','Weekdays only']} />
          </div>
          <p style={st.lbl}>Guarantees</p>
          <div style={st.checkGrid}>
            {GUARANTEES.map(g => (
              <label key={g} style={{ ...st.check, ...(form.guarantees.includes(g) ? st.checkOn : {}) }}>
                <input type="checkbox" checked={form.guarantees.includes(g)} onChange={() => toggleArr('guarantees', g)} style={{ display: 'none' }} />
                {form.guarantees.includes(g) ? '✓ ' : ''}{g}
              </label>
            ))}
          </div>
          <p style={st.lbl}>Certifications</p>
          <div style={st.checkGrid}>
            {CERTS.map(c => (
              <label key={c} style={{ ...st.check, ...(form.certs.includes(c) ? st.checkOn : {}) }}>
                <input type="checkbox" checked={form.certs.includes(c)} onChange={() => toggleArr('certs', c)} style={{ display: 'none' }} />
                {form.certs.includes(c) ? '✓ ' : ''}{c}
              </label>
            ))}
          </div>
        </div>}

        {/* STEP 3 */}
        {step === 3 && <div style={st.card}>
          <div style={st.tag}>Step 3 of 7</div>
          <h1 style={st.title}>Your <em style={{ color: '#c8f04b', fontStyle: 'italic' }}>service areas</em></h1>
          <S l="Main City *" v={form.city} o={v => update('city', v)} opts={AU_CITIES} />
          <div style={st.field}>
            <label style={st.lbl}>Suburbs (type + press Enter)</label>
            <input value={suburbInput} onChange={e => setSuburbInput(e.target.value)} onKeyDown={addSuburb} placeholder="e.g. Bondi, Coogee..." style={st.input} />
            <div style={st.tags}>{form.suburbs.map(s => <span key={s} style={st.tag2}>{s}<button onClick={() => update('suburbs', form.suburbs.filter(x => x !== s))} style={st.x}>×</button></span>)}</div>
          </div>
          <div style={st.field}>
            <label style={st.lbl}>Travel range: {form.travel_range}km</label>
            <input type="range" min={5} max={100} step={5} value={form.travel_range} onChange={e => update('travel_range', parseInt(e.target.value))} style={{ width: '100%' }} />
          </div>
        </div>}

        {/* STEP 4 */}
        {step === 4 && <div style={st.card}>
          <div style={st.tag}>Step 4 of 7</div>
          <h1 style={st.title}>Brand & <em style={{ color: '#c8f04b', fontStyle: 'italic' }}>design</em></h1>
          <p style={st.lbl}>Tone of voice</p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            {(['friendly','professional','premium'] as const).map(t => (
              <button key={t} onClick={() => update('tone', t)} style={{ flex: 1, padding: '16px 8px', borderRadius: 12, border: '2px solid', borderColor: form.tone === t ? '#c8f04b' : 'rgba(255,255,255,0.1)', background: form.tone === t ? 'rgba(200,240,75,0.1)' : 'rgba(255,255,255,0.03)', color: form.tone === t ? '#c8f04b' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Outfit,sans-serif', fontSize: 14, fontWeight: 600, textTransform: 'capitalize' }}>
                {t === 'friendly' ? '😊' : t === 'professional' ? '🏆' : '💎'}<br />{t}
              </button>
            ))}
          </div>
          <F l="Brand colour"    v={form.colour}          o={v => update('colour', v)}          t="color" />
          <F l="Target customer" v={form.target_customer} o={v => update('target_customer', v)} p="Busy families, property owners..." />
        </div>}

        {/* STEP 5 */}
        {step === 5 && <div style={st.card}>
          <div style={st.tag}>Step 5 of 7</div>
          <h1 style={st.title}>What makes you <em style={{ color: '#c8f04b', fontStyle: 'italic' }}>different</em></h1>
          {[0, 1, 2].map(i => (
            <F key={i} l={`USP ${i+1}`} v={form.usps[i]} o={v => { const u = [...form.usps]; u[i] = v; update('usps', u) }} p={['Same-day availability 7 days','Eco-friendly products only','Police-checked team'][i]} />
          ))}
          <div style={st.field}>
            <label style={st.lbl}>Your story <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span></label>
            <textarea value={form.biz_story} onChange={e => update('biz_story', e.target.value)} placeholder="How did you start? Why do you love what you do?" rows={4} style={{ ...st.input, resize: 'vertical' as const }} />
          </div>
          <div style={st.grid2}>
            <F l="Google rating" v={form.star_rating}  o={v => update('star_rating', v)}  p="4.9 (320 reviews)" />
            <F l="Awards"        v={form.awards || ''}  o={v => update('awards', v)}        p="HiPages Top Rated 2023" />
          </div>
        </div>}

        {/* STEP 6 */}
        {step === 6 && <div style={st.card}>
          <div style={st.tag}>Step 6 of 7</div>
          <h1 style={st.title}>Real customer <em style={{ color: '#c8f04b', fontStyle: 'italic' }}>reviews</em></h1>
          {form.testimonials.map((t, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <label style={{ ...st.lbl, marginBottom: 8 }}>Testimonial {i+1}</label>
              <textarea value={t.text} onChange={e => { const ts = [...form.testimonials]; ts[i] = { ...ts[i], text: e.target.value }; update('testimonials', ts) }} placeholder={`"What the client said..."`} rows={3} style={{ ...st.input, resize: 'vertical' as const, marginBottom: 8 }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={t.author} onChange={e => { const ts = [...form.testimonials]; ts[i] = { ...ts[i], author: e.target.value }; update('testimonials', ts) }} placeholder="Client name" style={{ ...st.input, flex: 1 }} />
                <input value={t.suburb || ''} onChange={e => { const ts = [...form.testimonials]; ts[i] = { ...ts[i], suburb: e.target.value }; update('testimonials', ts) }} placeholder="Suburb" style={{ ...st.input, flex: 1 }} />
              </div>
            </div>
          ))}
        </div>}

        {/* STEP 7 */}
        {step === 7 && <div style={st.card}>
          <div style={st.tag}>Step 7 of 7</div>
          <h1 style={st.title}>Final <em style={{ color: '#c8f04b', fontStyle: 'italic' }}>details</em></h1>
          <p style={st.lbl}>Your plan</p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            {([{ v:'starter', l:'Starter', p:'$99/mo', f:'No setup, 48hrs' }, { v:'professional', l:'Professional', p:'$149/mo', f:'$297 setup, Local SEO' }, { v:'premium', l:'Premium', p:'$249/mo', f:'$497 setup, Google Ads' }]).map(pl => (
              <button key={pl.v} onClick={() => update('plan', pl.v)} style={{ flex: 1, padding: '16px 8px', borderRadius: 12, border: '2px solid', borderColor: form.plan === pl.v ? '#c8f04b' : 'rgba(255,255,255,0.1)', background: form.plan === pl.v ? 'rgba(200,240,75,0.1)' : 'rgba(255,255,255,0.03)', color: 'white', cursor: 'pointer', fontFamily: 'Outfit,sans-serif', textAlign: 'center' }}>
                <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 4 }}>{pl.l}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: form.plan === pl.v ? '#c8f04b' : 'white' }}>{pl.p}</div>
                <div style={{ fontSize: 11, opacity: 0.5, marginTop: 4 }}>{pl.f}</div>
              </button>
            ))}
          </div>
          <F l="Facebook URL"              v={form.facebook_url}  o={v => update('facebook_url', v)}  p="https://facebook.com/yourbusiness" />
          <F l="Instagram URL (optional)"  v={form.instagram_url} o={v => update('instagram_url', v)} p="https://instagram.com/yourbusiness" />
          <F l="Logo URL (optional)"       v={form.logo_url}      o={v => update('logo_url', v)}      p="https://..." />
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: 12, color: '#fca5a5', fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <button onClick={handleSubmit} disabled={submitting} style={{ width: '100%', padding: 18, borderRadius: 9999, border: 'none', background: submitting ? 'rgba(255,255,255,0.1)' : '#c8f04b', color: submitting ? 'rgba(255,255,255,0.5)' : '#0f1612', fontSize: 16, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'Outfit,sans-serif' }}>
            {submitting ? '⏳ Saving & generating...' : '🚀 Build My Website'}
          </button>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center' as const, marginTop: 12 }}>Your website will be live within 15–30 minutes.</p>
        </div>}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', marginTop: 24 }}>
          {step > 1 && <button onClick={() => setStep(s => (s-1) as Step)} style={{ ...st.navBtn, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>← Back</button>}
          {step < 7 && <button onClick={() => setStep(s => (s+1) as Step)} style={{ ...st.navBtn, marginLeft: 'auto' }}>Continue →</button>}
        </div>
      </div>
    </div>
  )
}

// Mini components
function F({ l, v, o, p, t='text' }: { l:string; v:string; o:(v:string)=>void; p?:string; t?:string }) {
  return <div style={st.field}><label style={st.lbl}>{l}</label><input type={t} value={v} onChange={e => o(e.target.value)} placeholder={p} style={t === 'color' ? { ...st.input, padding: 4, height: 44 } : st.input} /></div>
}
function S({ l, v, o, opts, lbls }: { l:string; v:string; o:(v:string)=>void; opts:string[]; lbls?:string[] }) {
  return <div style={st.field}><label style={st.lbl}>{l}</label><select value={v} onChange={e => o(e.target.value)} style={st.input}><option value="">Select...</option>{opts.map((opt, i) => <option key={opt} value={opt}>{lbls?.[i] || opt}</option>)}</select></div>
}

const st: Record<string, React.CSSProperties> = {
  page:         { minHeight:'100vh', background:'#0a1a10', fontFamily:'Outfit,sans-serif' },
  header:       { position:'sticky', top:0, zIndex:100, background:'rgba(10,26,16,0.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'0 5%', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' },
  logo:         { fontFamily:'Fraunces,serif', fontSize:20, fontWeight:500, color:'white' },
  progressBar:  { width:180, height:4, background:'rgba(255,255,255,0.1)', borderRadius:9999 },
  progressFill: { height:'100%', background:'#c8f04b', borderRadius:9999, transition:'width 0.3s' },
  progressLabel:{ fontSize:12, color:'rgba(255,255,255,0.4)', fontFamily:'monospace' },
  container:    { maxWidth:680, margin:'0 auto', padding:'40px 5% 80px' },
  stepNav:      { display:'flex', justifyContent:'center', gap:8, marginBottom:32 },
  stepDot:      { width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, transition:'all 0.2s' },
  card:         { background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, padding:32 },
  tag:          { fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#c8f04b', background:'rgba(200,240,75,0.1)', display:'inline-block', padding:'3px 12px', borderRadius:9999, marginBottom:16 },
  title:        { fontFamily:'Fraunces,serif', fontSize:'clamp(28px,4vw,42px)', fontWeight:500, color:'white', lineHeight:1.1, letterSpacing:'-0.025em', marginBottom:8 },
  grid2:        { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 },
  field:        { marginBottom:16 },
  lbl:          { display:'block', fontSize:12.5, fontWeight:600, color:'rgba(255,255,255,0.5)', letterSpacing:'0.01em', marginBottom:6 },
  input:        { width:'100%', padding:'12px 14px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.18)', background:'rgba(255,255,255,0.09)', color:'white', fontSize:14, fontFamily:'Outfit,sans-serif', outline:'none', boxSizing:'border-box', colorScheme:'dark' },
  checkGrid:    { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:8, marginBottom:24 },
  check:        { padding:'10px 13px', borderRadius:10, border:'1.5px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)', fontSize:13, color:'rgba(255,255,255,0.5)', cursor:'pointer', userSelect:'none' },
  checkOn:      { border:'1.5px solid rgba(200,240,75,0.4)', background:'rgba(200,240,75,0.08)', color:'#c8f04b' },
  tags:         { display:'flex', flexWrap:'wrap', gap:8, marginTop:10 },
  tag2:         { background:'rgba(200,240,75,0.12)', border:'1px solid rgba(200,240,75,0.25)', color:'#c8f04b', padding:'5px 10px', borderRadius:9999, fontSize:13, display:'flex', alignItems:'center', gap:6 },
  x:            { background:'none', border:'none', color:'#c8f04b', cursor:'pointer', fontSize:16, lineHeight:1, padding:0 },
  navBtn:       { padding:'12px 28px', borderRadius:9999, border:'none', background:'#c8f04b', color:'#0f1612', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'Outfit,sans-serif' },
  successCard:  { maxWidth:520, margin:'80px auto', padding:48, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, textAlign:'center' },
  successTitle: { fontFamily:'Fraunces,serif', fontSize:40, fontWeight:500, color:'white', marginTop:16, marginBottom:12 },
  successSub:   { fontSize:16, color:'rgba(255,255,255,0.55)', lineHeight:1.7, marginBottom:32 },
  successInfo:  { background:'rgba(200,240,75,0.07)', border:'1px solid rgba(200,240,75,0.15)', borderRadius:16, padding:24, textAlign:'left', fontSize:14, color:'rgba(255,255,255,0.65)', display:'flex', flexDirection:'column', gap:12 },
}
