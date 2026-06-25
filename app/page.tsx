'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Mock Browser (hero right) ─────────────────────────────────────
function MockBrowser() {
  return (
    <div style={{ position:'relative', width:'100%', maxWidth:480 }}>
      <div style={{ position:'absolute', inset:-60, background:'radial-gradient(ellipse, rgba(200,240,75,0.07) 0%, transparent 65%)', pointerEvents:'none' }} />
      <div style={{ position:'relative', background:'#111f12', borderRadius:20, overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 48px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.07)' }}>
        {/* Chrome bar */}
        <div style={{ background:'#1c2e1e', padding:'10px 16px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display:'flex', gap:6 }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c }} />)}
          </div>
          <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:5, padding:'4px 12px', fontSize:11, color:'rgba(255,255,255,0.35)', fontFamily:'Outfit, sans-serif' }}>
            bondcleaningsydney.com.au
          </div>
        </div>
        {/* Mini website */}
        <div style={{ background:'#0d1a0f', padding:20 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22, padding:'8px 14px', background:'rgba(255,255,255,0.03)', borderRadius:8, border:'1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize:13, fontWeight:700, color:'#c8f04b', fontFamily:'Outfit, sans-serif' }}>✨ SparkleClean</span>
            <span style={{ fontSize:10, fontWeight:700, background:'#c8f04b', color:'#0d1a0f', borderRadius:9999, padding:'4px 12px', fontFamily:'Outfit, sans-serif' }}>Get Quote</span>
          </div>
          <div style={{ padding:'0 4px 8px' }}>
            <h3 style={{ fontFamily:'Fraunces, serif', fontSize:20, fontWeight:700, color:'white', margin:'0 0 8px', lineHeight:1.2 }}>Bond Cleaning<br/>Across Sydney</h3>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.38)', margin:'0 0 16px', fontFamily:'Outfit, sans-serif' }}>Bond-back guarantee · End of lease · Carpet steam</p>
            <div style={{ display:'flex', gap:8, marginBottom:20 }}>
              <span style={{ fontSize:10, fontWeight:700, background:'#c8f04b', color:'#0d1a0f', borderRadius:9999, padding:'6px 14px', fontFamily:'Outfit, sans-serif', whiteSpace:'nowrap' as const }}>Get a Free Quote</span>
              <span style={{ fontSize:10, fontWeight:600, color:'rgba(255,255,255,0.55)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:9999, padding:'6px 14px', fontFamily:'Outfit, sans-serif', whiteSpace:'nowrap' as const }}>See Our Work</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {[{ icon:'✨', title:'Bond Clean' },{ icon:'🛏️', title:'End of Lease' },{ icon:'🧼', title:'Carpet' }].map(c => (
                <div key={c.title} style={{ background:'rgba(255,255,255,0.04)', borderRadius:8, padding:'12px 10px', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize:16, marginBottom:6 }}>{c.icon}</div>
                  <div style={{ fontSize:10, fontWeight:700, color:'white', marginBottom:3, fontFamily:'Outfit, sans-serif' }}>{c.title}</div>
                  <div style={{ fontSize:8, color:'rgba(255,255,255,0.32)', lineHeight:1.5, fontFamily:'Outfit, sans-serif' }}>Fast response across all Sydney suburbs</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Data ──────────────────────────────────────────────────────────
const STEPS = [
  { n:'01', icon:'📋', title:'Tell us about your business',   desc:"A fast intake form captures your cleaning services, niche, and suburb coverage — takes under 10 minutes." },
  { n:'02', icon:'🤖', title:'AI writes your website',         desc:"We generate polished copy, suburb landing pages, and service listings — all SEO-optimised." },
  { n:'03', icon:'⚡', title:'Review your staging site',       desc:"Approve on a private staging link or request one quick revision before we go live." },
  { n:'04', icon:'🚀', title:'Go live with style',             desc:"We deploy to Vercel, connect your domain, and submit your site to Google Search Console." },
]

const FEATURES = [
  { icon:'🎨', title:'Premium Design',       desc:'Hand-crafted template adapted to your cleaning business and brand colours.' },
  { icon:'📍', title:'Suburb Landing Pages', desc:"Unique SEO pages for every suburb you service — not copy-paste." },
  { icon:'✍️', title:'AI Copywriting',        desc:'Human-reviewed AI copy that sounds like you, not a robot.' },
  { icon:'📱', title:'Mobile First',          desc:'Looks flawless on every phone, tablet, and desktop size.' },
  { icon:'🔍', title:'Technical SEO',         desc:'Schema markup, meta tags, sitemaps, and Core Web Vitals tuned.' },
  { icon:'⚡', title:'48-Hour Delivery',      desc:'Premium package sites go from brief to live in two days flat.' },
  { icon:'📅', title:'Booking Integration',   desc:'Connect Calendly, Acuity, or your preferred booking tool.' },
  { icon:'🔒', title:'SSL + Hosting',         desc:"Enterprise-grade Vercel hosting with free SSL — always fast." },
  { icon:'✏️', title:'Ongoing Updates',      desc:'Content tweaks and new suburb pages included while you subscribe.' },
  { icon:'📊', title:'Google Analytics',      desc:'GA4 and Search Console set up and connected on launch day.' },
  { icon:'💬', title:'WhatsApp / Call CTA',   desc:'Click-to-call and WhatsApp buttons drive instant enquiries.' },
  { icon:'🌐', title:'Domain Connection',     desc:"We handle the DNS so you don't have to touch a single setting." },
]

// ⚠️ PLACEHOLDER REVIEWS — replace with REAL client testimonials before launch.
// Fake/unverified reviews breach the Australian Consumer Law (ACCC) and can carry penalties.
const TESTIMONIALS = [
  { quote:"Bond-back guarantee front and centre, quote form on every page — I get enquiries straight to my phone now instead of chasing them.", name:'Sample Client', co:'Bond Cleaning Co.', city:'Sydney',    init:'BC', rating:5 },
  { quote:"Site was live in two days and the suburb pages started showing up on Google within the first few weeks. Looks far more professional than my old one.", name:'Sample Client', co:'End of Lease Pros', city:'Melbourne', init:'EL', rating:5 },
  { quote:"I filled in one form and they handled the copy, photos, domain and hosting. Easiest marketing decision I've made for my cleaning business.", name:'Sample Client', co:'Sparkle Domestic',  city:'Brisbane',  init:'SD', rating:5 },
]

const PLANS = [
  {
    tier:'Starter', price:'99', setup:'No setup fee', delivery:'48-HOUR LAUNCH', popular:false,
    desc:'For solo cleaners who need a professional, lead-getting site with zero upfront cost.',
    features:['5-page cleaning website','Quote / booking form','Hosting, SSL & maintenance','Mobile-first design','Click-to-call & WhatsApp','Google Search Console setup'],
  },
  {
    tier:'Professional', price:'149', setup:'A$297 setup', delivery:'48-HOUR LAUNCH', popular:true,
    desc:'For growing cleaning businesses that want to rank locally and capture more bookings.',
    features:['Everything in Starter','Local SEO + Google Business setup','5 suburb landing pages','Schema markup + structured data','Monthly performance report','GA4 + Search Console'],
  },
  {
    tier:'Premium', price:'249', setup:'A$497 setup', delivery:'48-HOUR LAUNCH', popular:false,
    desc:'For cleaning businesses that want maximum suburb coverage and managed Google Ads.',
    features:['Everything in Professional','Google Ads management','Unlimited suburb pages','Booking + CRM integration','Call & lead tracking','Priority support'],
  },
]

const FAQS = [
  { q:'How long does it really take to build my website?',       a:"Once you complete your intake form, your site goes live within 48 hours. Most clients receive their private staging link within 15 minutes of our team starting." },
  { q:'How does the monthly subscription work?',                 a:"You pay a low monthly fee that covers your website, hosting, SSL, security, and ongoing updates — no large upfront build cost. Think of it like Netflix for your business website: it stays live, fast, and up to date for as long as you subscribe." },
  { q:'Can I request changes after launch?',                     a:"Yes. Content tweaks and new suburb pages are included while your subscription is active — just email us. Larger redesigns can be quoted separately." },
  { q:'Do you handle hosting and domain setup?',                 a:"Yes. Hosting, SSL, and DNS are all included and managed for you. If you don't have a domain yet, we'll help you register one for around $15–25/year." },
  { q:'Is the AI-generated content actually good quality?',      a:"Every piece of copy is reviewed by our team before you see it. The AI writes the first draft from your intake answers, and we refine it so it sounds natural, local, and specific to your cleaning business." },
  { q:'Is there a contract, and can I cancel?',                  a:"Plans run on a short minimum term to cover setup, then continue month to month. You can cancel with 30 days' notice. Because this is a managed subscription, the live site stays hosted with us while you're subscribed — we earn your loyalty through results, not lock-in tricks." },
]

// ─── Navbar ────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href:'#how',      label:'How it works', id:'how'      },
  { href:'#features', label:'Features',     id:'features' },
  { href:'#pricing',  label:'Pricing',      id:'pricing'  },
  { href:'#reviews',  label:'Reviews',      id:'reviews'  },
  { href:'#faq',      label:'FAQ',          id:'faq'      },
]

const NAV_CSS = `
@keyframes navFadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
.nav-root {
  position:fixed; top:0; left:0; right:0; z-index:200;
  display:flex; align-items:center; justify-content:space-between;
  padding:0 5%;
  animation:navFadeIn 400ms ease 150ms both;
  transition:height 300ms ease, background 300ms ease, backdrop-filter 300ms ease, border-color 300ms ease;
}
.nav-link { position:relative; text-decoration:none; font-size:13px; font-weight:500; letter-spacing:0.01em; color:rgba(255,255,255,0.58); transition:color 220ms; }
.nav-link::after { content:''; position:absolute; bottom:-4px; left:0; width:0; height:1.5px; background:#CCFF00; border-radius:9999px; transition:width 250ms cubic-bezier(.16,1,.3,1); }
.nav-link:hover,.nav-link.is-active { color:#fff; }
.nav-link:hover::after,.nav-link.is-active::after { width:100%; }
.nav-cta { background:transparent; color:#c8f04b; border:1.5px solid rgba(200,240,75,0.65); padding:8px 22px; border-radius:10px; font-size:13px; font-weight:600; letter-spacing:0.02em; text-decoration:none; transition:background 220ms, color 220ms, transform 220ms, box-shadow 220ms; display:inline-block; white-space:nowrap; }
.nav-cta:hover { background:#c8f04b; color:#080f0a; transform:translateY(-1px); box-shadow:0 8px 24px rgba(200,240,75,0.22); }
.hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:4px; background:none; border:none; }
.hamburger span { display:block; width:22px; height:2px; background:#CCFF00; border-radius:2px; transition:transform 250ms ease, opacity 250ms ease; }
.hamburger.is-open span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
.hamburger.is-open span:nth-child(2) { opacity:0; transform:scaleX(0); }
.hamburger.is-open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }
.nav-overlay { position:fixed; inset:0; z-index:299; background:rgba(0,0,0,0.6); opacity:0; pointer-events:none; transition:opacity 300ms; }
.nav-overlay.is-open { opacity:1; pointer-events:all; }
.nav-drawer { position:fixed; top:0; right:0; width:280px; height:100vh; background:#0a1a0a; z-index:300; transform:translateX(100%); transition:transform 300ms cubic-bezier(.16,1,.3,1); display:flex; flex-direction:column; padding:80px 32px 40px; box-sizing:border-box; }
.nav-drawer.is-open { transform:translateX(0); }
.nav-drawer-link { display:block; font-size:18px; font-weight:500; color:rgba(255,255,255,0.7); text-decoration:none; padding:16px 0; border-bottom:1px solid rgba(255,255,255,0.05); transition:color 200ms; }
.nav-drawer-link:hover,.nav-drawer-link.is-active { color:white; }
.nav-drawer-cta { margin-top:32px; text-align:center; box-sizing:border-box; width:100%; padding:14px 20px; border-radius:8px; }
@media(max-width:768px){.nav-desktop{display:none!important}.hamburger{display:flex!important}}
`

function Navbar() {
  const [scrolled,      setScrolled]     = useState(false)
  const [menuOpen,      setMenuOpen]     = useState(false)
  const [activeSection, setActiveSection]= useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive:true }); onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { rootMargin:'-40% 0px -55% 0px' }
    )
    NAV_LINKS.forEach(({ id }) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  const close = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NAV_CSS }} />
      <nav className="nav-root" style={{
        height:            scrolled ? 60 : 72,
        background:        scrolled ? 'rgba(8,15,10,0.9)'  : 'transparent',
        backdropFilter:    scrolled ? 'blur(14px)'          : 'none',
        borderBottomWidth: 1, borderBottomStyle:'solid' as const,
        borderBottomColor: scrolled ? 'rgba(255,255,255,0.07)' : 'transparent',
      }}>
        <a href="/" style={{ fontFamily:'Fraunces, serif', fontSize:21, fontWeight:500, color:'white', textDecoration:'none', display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ color:'#c8f04b' }}>⚡</span>SiteForge <span style={{ color:'#CCFF00', fontFamily:'Outfit, sans-serif', fontWeight:700, letterSpacing:1 }}>AI</span>
        </a>
        <div className="nav-desktop" style={{ display:'flex', gap:28 }}>
          {NAV_LINKS.map(({ href, label, id }) => (
            <a key={id} href={href} className={`nav-link${activeSection===id?' is-active':''}`}>{label}</a>
          ))}
        </div>
        <a href="#quote" className="nav-cta nav-desktop">Get a free quote</a>
        <button className={`hamburger${menuOpen?' is-open':''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
      <div className={`nav-overlay${menuOpen?' is-open':''}`} onClick={close} />
      <div className={`nav-drawer${menuOpen?' is-open':''}`}>
        <button onClick={close} aria-label="Close" style={{ position:'absolute', top:20, right:20, background:'none', border:'none', cursor:'pointer', padding:8 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        </button>
        {NAV_LINKS.map(({ href, label, id }) => (
          <a key={id} href={href} className={`nav-drawer-link${activeSection===id?' is-active':''}`} onClick={close}>{label}</a>
        ))}
        <a href="#quote" className="nav-cta nav-drawer-cta" onClick={close}>Get a free quote</a>
      </div>
    </>
  )
}

// ─── CountUp ───────────────────────────────────────────────────────
function CountUp({ target, active }: { target:number; active:boolean }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) return
    let cur = 0; const step = target / 40
    const t = setInterval(() => { cur += step; if (cur >= target) { setN(target); clearInterval(t) } else setN(Math.floor(cur)) }, 22)
    return () => clearInterval(t)
  }, [target, active])
  return <>{n}</>
}

// ─── Page CSS ──────────────────────────────────────────────────────
const PAGE_CSS = `
.sf-inner     { max-width:1100px; margin:0 auto; }
.sf-inner-sm  { max-width:700px;  margin:0 auto; }
.sf-inner-frm { max-width:600px;  margin:0 auto; }
.sf-sec       { padding:clamp(64px,9vw,110px) clamp(20px,5%,5%); }

.sf-hero-wrap {
  display:flex; align-items:center; gap:clamp(40px,5vw,80px);
  padding:clamp(100px,13vh,140px) clamp(20px,5%,5%) clamp(60px,8vh,100px);
  min-height:92vh; position:relative; overflow:hidden;
  background:linear-gradient(155deg,#050b06 0%,#0c1e0e 45%,#060e07 100%);
}
.sf-hero-left  { flex:1 1 0; min-width:0; }
.sf-hero-right { flex:0 0 auto; width:46%; max-width:480px; }

.sf-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); }
.sf-steps-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr)); gap:16px; }
.sf-feat-grid  { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
.sf-test-grid  { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.sf-price-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; align-items:start; }
.sf-form-row   { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

.quote-cta       { display:flex; align-items:center; justify-content:center; gap:6px; }
.quote-cta-arrow { display:inline-block; transition:transform 200ms ease; }
.quote-cta:not(:disabled):hover .quote-cta-arrow { transform:translateX(5px); }

.sf-footer-grid { display:grid; grid-template-columns:1.6fr 1fr 1fr 1fr; gap:clamp(24px,4vw,48px); margin-bottom:48px; }
.sf-footer-bar  { border-top:1px solid rgba(255,255,255,0.06); padding-top:24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
.sf-footer-links { display:flex; gap:20px; flex-wrap:wrap; }

@media(max-width:960px){
  .sf-hero-right { display:none; }
  .sf-hero-wrap  { min-height:auto; }
  .sf-feat-grid  { grid-template-columns:repeat(2,1fr); }
  .sf-test-grid  { grid-template-columns:1fr; }
  .sf-price-grid { grid-template-columns:1fr; }
  .sf-stats-grid { grid-template-columns:repeat(2,1fr); }
  .sf-footer-grid { grid-template-columns:1fr 1fr; }
}
@media(max-width:600px){
  .sf-form-row    { grid-template-columns:1fr; }
  .sf-feat-grid   { grid-template-columns:1fr 1fr; }
  .sf-footer-grid { grid-template-columns:1fr; }
  .sf-footer-bar  { flex-direction:column; align-items:flex-start; }
}
@media(max-width:420px){
  .sf-feat-grid  { grid-template-columns:1fr; }
}
`

// ─── Home ──────────────────────────────────────────────────────────
export default function Home() {
  const [form, setForm] = useState({ firstName:'', lastName:'', bizName:'', phone:'', email:'', niche:'', city:'', plan:'', message:'', website:'' })
  const [submitting,   setSubmitting]   = useState(false)
  const [submitted,    setSubmitted]    = useState(false)
  const [intakeToken,  setIntakeToken]  = useState('')
  const [error,        setError]        = useState('')
  const [openFaq,    setOpenFaq]    = useState<number|null>(null)
  const [statsActive,setStatsActive]= useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
    }), { threshold:0.08 })
    document.querySelectorAll('.reveal').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = statsRef.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsActive(true); io.disconnect() } }, { threshold:0.3 })
    io.observe(el); return () => io.disconnect()
  }, [])

  const up = (k: string, v: string) => setForm(p => ({ ...p, [k]:v }))

  // Relative URL — browser resolves against current origin automatically
  const intakeUrl = intakeToken ? `/intake?token=${intakeToken}` : ''

  const submit = async (e: { preventDefault():void }) => {
    e.preventDefault(); setSubmitting(true); setError('')
    try {
      const res = await fetch('/api/submit-lead', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      setIntakeToken(d.intakeToken || ''); setSubmitted(true)
    } catch (err) { setError(String(err)) }
    finally { setSubmitting(false) }
  }

  return (
    <div style={{ background:'#080f0a', color:'white', fontFamily:'Outfit, sans-serif', overflowX:'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <Navbar />

      {/* ══ HERO ══ */}
      <div className="sf-hero-wrap">
        <div style={{ position:'absolute', top:0, left:'30%', width:'min(700px,80vw)', height:'min(700px,80vw)', borderRadius:'50%', background:'radial-gradient(circle, rgba(200,240,75,0.055) 0%, transparent 65%)', pointerEvents:'none' }} />

        <div className="sf-hero-left">
          <div className="reveal" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(200,240,75,0.08)', border:'1px solid rgba(200,240,75,0.24)', padding:'7px 18px', borderRadius:9999, marginBottom:32, boxShadow:'0 0 20px rgba(200,240,75,0.08)' }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#c8f04b', display:'inline-block', flexShrink:0, animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', color:'#c8f04b' }}>AI-BUILT WEBSITES FOR AUSTRALIAN CLEANING BUSINESSES</span>
          </div>

          <h1 className="reveal reveal-delay-1" style={{ fontFamily:'Fraunces, serif', fontSize:'clamp(40px,6.5vw,84px)', fontWeight:800, lineHeight:0.97, letterSpacing:'-0.04em', margin:'0 0 28px' }}>
            Launch a<br/>premium site<br/>in <span className="gradient-text" style={{ fontStyle:'normal' }}>48 hours</span>
          </h1>

          <p className="reveal reveal-delay-2" style={{ fontSize:'clamp(16px,1.9vw,18px)', color:'rgba(255,255,255,0.52)', maxWidth:500, margin:'0 0 44px', lineHeight:1.88 }}>
            Lead-getting websites built for Australian cleaning businesses — bond, end-of-lease, commercial and more. Copy, SEO, suburb pages and hosting included, from A$99/month.
          </p>

          <div className="reveal reveal-delay-3" style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:32 }}>
            <a href="#quote" className="btn-primary" style={{ background:'#c8f04b', color:'#080f0a', padding:'14px 32px', borderRadius:9999, fontSize:15, fontWeight:700, textDecoration:'none', boxShadow:'0 8px 32px rgba(200,240,75,0.3)', display:'inline-block' }}>
              Request a free quote
            </a>
            <a href="#how" style={{ borderWidth:1, borderStyle:'solid', borderColor:'rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.7)', padding:'13px 28px', borderRadius:9999, fontSize:15, fontWeight:600, textDecoration:'none', transition:'all 0.25s cubic-bezier(.16,1,.3,1)', display:'inline-block' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'; e.currentTarget.style.color='white'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'; e.currentTarget.style.color='rgba(255,255,255,0.7)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}>
              See how it works
            </a>
          </div>

          <div className="reveal reveal-delay-4" style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
            {['$0 setup on Starter','Live in 48 hours','Australian-owned & run'].map(t => (
              <span key={t} style={{ fontSize:13, color:'rgba(255,255,255,0.48)', display:'flex', alignItems:'center', gap:7, letterSpacing:'0.005em' }}>
                <span style={{ color:'#c8f04b', fontWeight:800, fontSize:12 }}>✓</span> {t}
              </span>
            ))}
          </div>
        </div>

        <div className="sf-hero-right reveal reveal-delay-2">
          <MockBrowser />
        </div>
      </div>

      {/* ══ STATS ══ */}
      <div ref={statsRef} style={{ background:'#0c1a0d', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="sf-inner sf-stats-grid">
          {[
            { val:48,  suf:'hrs', pre:'',  label:'Launch time',      sub:'from brief to live'      },
            { val:99,  suf:'',    pre:'$', label:'From / month',     sub:'no big upfront cost'     },
            { val:7,   suf:'',    pre:'',  label:'Days a week',      sub:'support & updates'       },
            { val:100, suf:'%',   pre:'',  label:'Cleaning focus',   sub:'one niche, done right'   },
          ].map((s, i) => (
            <div key={s.label} style={{ padding:'clamp(28px,4vw,44px) clamp(20px,3vw,40px)', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', textAlign:'center' }}>
              <div style={{ fontFamily:'Fraunces, serif', fontSize:'clamp(36px,4.5vw,58px)', fontWeight:300, color:'#c8f04b', lineHeight:1, letterSpacing:'-0.035em', marginBottom:10 }}>
                {s.pre}<CountUp target={s.val} active={statsActive} />{s.suf}
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:'white', marginBottom:5, letterSpacing:'-0.01em' }}>{s.label}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', letterSpacing:'0.01em' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ HOW IT WORKS ══ */}
      <section id="how" className="sf-sec" style={{ background:'#080f0a' }}>
        <div className="sf-inner">
          <div className="reveal" style={{ textAlign:'center', marginBottom:'clamp(40px,6vw,64px)' }}>
            <span style={chip}>HOW IT WORKS</span>
            <h2 style={h2}>From enquiry to <em style={{ color:'#c8f04b', fontStyle:'italic' }}>live in 48 hours</em></h2>
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.42)', maxWidth:520, margin:'12px auto 0', lineHeight:1.75 }}>
              One simple process. Professional website quality. A launch-ready site that speaks directly to your local customers.
            </p>
          </div>
          <div className="sf-steps-grid">
            {STEPS.map((step, i) => (
              <div key={i} className={`reveal card-hover reveal-delay-${i+1}`} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:22, padding:'clamp(24px,3vw,32px)', boxShadow:'0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                  <div style={{ width:34, height:34, borderRadius:'50%', background:'rgba(200,240,75,0.1)', border:'1px solid rgba(200,240,75,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#c8f04b', flexShrink:0, boxShadow:'0 0 0 4px rgba(200,240,75,0.06)' }}>
                    {step.n}
                  </div>
                  <span style={{ fontSize:22 }}>{step.icon}</span>
                </div>
                <h3 style={{ fontSize:'clamp(15px,1.8vw,17px)', fontWeight:700, color:'white', margin:'0 0 12px', lineHeight:1.25, letterSpacing:'-0.01em' }}>{step.title}</h3>
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.48)', lineHeight:1.8, margin:0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" className="sf-sec" style={{ background:'linear-gradient(180deg,#0a1309 0%,#080f0a 100%)' }}>
        <div className="sf-inner">
          <div className="reveal" style={{ textAlign:'center', marginBottom:'clamp(40px,6vw,64px)' }}>
            <span style={chip}>WHAT&apos;S INCLUDED</span>
            <h2 style={h2}>Everything a cleaning site <em style={{ color:'#c8f04b', fontStyle:'italic' }}>actually needs</em></h2>
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.42)', maxWidth:540, margin:'12px auto 0', lineHeight:1.75 }}>
              No upsells. No hidden extras. Every package includes the full stack of tools that drive local enquiries and Google rankings.
            </p>
          </div>
          <div className="sf-feat-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className={`reveal card-hover reveal-delay-${(i%4)+1}`} style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'clamp(18px,2.5vw,24px)', boxShadow:'0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.055)' }}>
                <div style={{ width:44, height:44, borderRadius:14, background:'rgba(200,240,75,0.09)', border:'1px solid rgba(200,240,75,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:16, boxShadow:'0 4px 16px rgba(200,240,75,0.08)' }}>{f.icon}</div>
                <h3 style={{ fontSize:15, fontWeight:700, color:'white', margin:'0 0 7px', letterSpacing:'-0.01em' }}>{f.title}</h3>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.46)', lineHeight:1.75, margin:0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section id="reviews" className="sf-sec" style={{ background:'#080f0a' }}>
        <div className="sf-inner">
          <div className="reveal" style={{ textAlign:'center', marginBottom:'clamp(40px,6vw,64px)' }}>
            <span style={chip}>CLIENT RESULTS</span>
            <h2 style={h2}>What our clients <em style={{ color:'#c8f04b', fontStyle:'italic' }}>say</em></h2>
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.42)', maxWidth:520, margin:'12px auto 0', lineHeight:1.75 }}>
              Australian cleaning businesses who launched with SiteForge.
            </p>
          </div>
          <div className="sf-test-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`reveal card-hover glass-card reveal-delay-${i+1}`} style={{ position:'relative', overflow:'hidden', background:'rgba(255,255,255,0.032)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:24, padding:'clamp(28px,3.5vw,36px)', boxShadow:'0 8px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
                <span aria-hidden="true" style={{ position:'absolute', top:-16, left:20, fontFamily:'Georgia, serif', fontSize:96, lineHeight:1, color:'rgba(255,255,255,0.045)', userSelect:'none', pointerEvents:'none' }}>&ldquo;</span>
                <div style={{ display:'flex', gap:3, marginBottom:20 }}>
                  {Array.from({ length:t.rating }).map((_,j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 14 14" fill="#c8f04b">
                      <path d="M7 1l1.545 3.09L12 4.635l-2.5 2.41.59 3.41L7 8.77l-3.09 1.685L4.5 7.045 2 4.635l3.455-.545L7 1z" />
                    </svg>
                  ))}
                </div>
                <p style={{ position:'relative', fontSize:15, color:'rgba(255,255,255,0.76)', lineHeight:1.88, margin:'0 0 32px', fontStyle:'italic', letterSpacing:'0.01em' }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg,rgba(200,240,75,0.22),rgba(39,97,53,0.32))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#c8f04b', flexShrink:0, boxShadow:'0 0 0 3px rgba(200,240,75,0.1)' }}>
                    {t.init}
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'white', letterSpacing:'-0.01em' }}>{t.name}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.38)', marginTop:3 }}>{t.co} — {t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section id="pricing" className="sf-sec" style={{ background:'linear-gradient(180deg,#0a1309 0%,#080f0a 100%)' }}>
        <div className="sf-inner">
          <div className="reveal" style={{ textAlign:'center', marginBottom:'clamp(40px,6vw,64px)' }}>
            <span style={chip}>SIMPLE PRICING</span>
            <h2 style={h2}>Transparent packages, <em style={{ color:'#c8f04b', fontStyle:'italic' }}>no surprises</em></h2>
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.42)', maxWidth:520, margin:'12px auto 0', lineHeight:1.75 }}>
              Choose the package that fits your growth goals. Every plan includes hosting, SSL, domain connection, and launch support.
            </p>
          </div>
          <div className="sf-price-grid">
            {PLANS.map((plan, i) => (
              <div key={i} className={`reveal reveal-delay-${i+1}`} style={{
                position:'relative', borderRadius: plan.popular ? 26 : 22,
                background: plan.popular ? 'linear-gradient(145deg,#1e4a2a,#163520)' : 'rgba(255,255,255,0.028)',
                border: plan.popular ? '1.5px solid #c8f04b' : '1px solid rgba(255,255,255,0.09)',
                padding:'clamp(24px,3vw,32px)',
                boxShadow: plan.popular
                  ? '0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(200,240,75,0.1), inset 0 1px 0 rgba(255,255,255,0.08)'
                  : '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
                transition:'transform 0.4s cubic-bezier(.16,1,.3,1), box-shadow 0.4s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-8px)'; if (!plan.popular) e.currentTarget.style.boxShadow='0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; if (!plan.popular) e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                {plan.popular && (
                  <div style={{ position:'absolute', top:0, left:0, right:0, background:'#c8f04b', borderRadius:'24px 24px 0 0', padding:'8px', textAlign:'center', fontSize:10, fontWeight:800, color:'#080f0a', letterSpacing:'0.13em' }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ paddingTop: plan.popular ? 32 : 0 }}>
                  {/* Delivery badge */}
                  <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(200,240,75,0.08)', border:'1px solid rgba(200,240,75,0.2)', borderRadius:9999, padding:'5px 13px', marginBottom:22 }}>
                    <span style={{ fontSize:10 }}>⚡</span>
                    <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.1em', color:'#c8f04b' }}>{plan.delivery}</span>
                  </div>
                  <div style={{ fontSize:10, fontWeight:800, letterSpacing:'0.1em', color:'rgba(255,255,255,0.32)', marginBottom:10 }}>{plan.tier.toUpperCase()}</div>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:2, marginBottom:6 }}>
                    <span style={{ fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.45)', marginTop:12, lineHeight:1 }}>A$</span>
                    <span style={{ fontFamily:'Fraunces, serif', fontSize:'clamp(50px,5.5vw,68px)', fontWeight:300, color:'white', lineHeight:1, letterSpacing:'-0.04em' }}>{plan.price}</span>
                    <span style={{ fontSize:15, fontWeight:600, color:'rgba(255,255,255,0.45)', alignSelf:'flex-end', marginBottom:14, marginLeft:2 }}>/mo</span>
                  </div>
                  <div style={{ fontSize:12, fontWeight:600, color:'#c8f04b', marginBottom:14, letterSpacing:'0.01em' }}>{plan.setup}</div>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.44)', margin:'0 0 28px', lineHeight:1.7 }}>{plan.desc}</p>
                  <ul style={{ listStyle:'none', padding:0, margin:'0 0 28px' }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ fontSize:14, padding:'10px 0', display:'flex', alignItems:'center', gap:10, borderBottom:`1px solid ${plan.popular?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.06)'}`, color: plan.popular?'rgba(255,255,255,0.84)':'rgba(255,255,255,0.6)' }}>
                        <span style={{ color:'#c8f04b', fontWeight:800, fontSize:12, flexShrink:0 }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <a href="#quote" className={plan.popular ? 'btn-primary' : ''} style={{ display:'block', textAlign:'center', padding:'14px', borderRadius:9999, fontWeight:700, fontSize:15, textDecoration:'none', letterSpacing:'0.01em', transition:'all 0.25s cubic-bezier(.16,1,.3,1)', background: plan.popular?'#c8f04b':'rgba(255,255,255,0.07)', color: plan.popular?'#080f0a':'white', border: plan.popular?'none':'1px solid rgba(255,255,255,0.12)', boxShadow: plan.popular?'0 8px 32px rgba(200,240,75,0.25)':'none' }}
                    onMouseEnter={e => { if (!plan.popular) { e.currentTarget.style.background='rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.22)'; e.currentTarget.style.transform='translateY(-1px)' } }}
                    onMouseLeave={e => { if (!plan.popular) { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'; e.currentTarget.style.transform='translateY(0)' } }}>
                    Get started with {plan.tier}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section id="faq" className="sf-sec" style={{ background:'#080f0a' }}>
        <div className="sf-inner-sm">
          <div className="reveal" style={{ textAlign:'center', marginBottom:'clamp(36px,5vw,60px)' }}>
            <span style={chip}>FAQ</span>
            <h2 style={h2}>Questions cleaners <em style={{ color:'#c8f04b', fontStyle:'italic' }}>always ask</em></h2>
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.42)', maxWidth:500, margin:'12px auto 0', lineHeight:1.75 }}>
              Everything you need to know before you get started. Still have questions? Email us at{' '}
              <a href="mailto:hello@siteforge.com.au" style={{ color:'#c8f04b', textDecoration:'none' }}>hello@siteforge.com.au</a>
            </p>
          </div>
          {FAQS.map((faq, i) => (
            <div key={i} className="reveal" style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <button onClick={() => setOpenFaq(openFaq===i ? null : i)}
                style={{ width:'100%', padding:'clamp(18px,2.5vw,24px) 0', display:'flex', justifyContent:'space-between', alignItems:'center', background:'none', border:'none', color:'white', cursor:'pointer', textAlign:'left', fontFamily:'Outfit, sans-serif', fontSize:16, fontWeight:600, gap:16, transition:'color 0.2s', letterSpacing:'-0.01em' }}
                onMouseEnter={e => (e.currentTarget.style.color='#c8f04b')}
                onMouseLeave={e => (e.currentTarget.style.color='white')}>
                {faq.q}
                <span style={{ color:'#c8f04b', fontSize:22, fontWeight:300, lineHeight:1, flexShrink:0, transition:'transform 0.35s cubic-bezier(.16,1,.3,1)', transform: openFaq===i?'rotate(45deg)':'rotate(0)', display:'inline-flex', width:28, height:28, alignItems:'center', justifyContent:'center', background:'rgba(200,240,75,0.07)', borderRadius:'50%', border:'1px solid rgba(200,240,75,0.15)' }}>+</span>
              </button>
              <div style={{ maxHeight: openFaq===i ? 300 : 0, overflow:'hidden', transition:'max-height 0.45s cubic-bezier(.4,0,.2,1)', paddingBottom: openFaq===i ? 28 : 0 }}>
                <p style={{ fontSize:15, color:'rgba(255,255,255,0.52)', lineHeight:1.85, margin:0 }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="sf-sec" style={{ textAlign:'center', position:'relative', overflow:'hidden', background:'linear-gradient(135deg,#0c1e0e 0%,#163520 50%,#0c1e0e 100%)' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% -10%, rgba(200,240,75,0.09) 0%, transparent 60%)', pointerEvents:'none' }} />
        <div className="reveal" style={{ position:'relative', maxWidth:640, margin:'0 auto' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(251,146,60,0.1)', border:'1px solid rgba(251,146,60,0.28)', padding:'6px 16px', borderRadius:9999, marginBottom:28 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#fb923c', display:'inline-block', flexShrink:0, animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.09em', color:'#fb923c' }}>Limited spots available this week</span>
          </div>
          <h2 style={{ fontFamily:'Fraunces, serif', fontSize:'clamp(32px,5vw,66px)', fontWeight:500, letterSpacing:'-0.04em', lineHeight:1.05, margin:'0 0 22px' }}>
            Your competitors are <em style={{ color:'#c8f04b', fontStyle:'italic' }}>already online</em>
          </h2>
          <p style={{ fontSize:'clamp(15px,1.8vw,17px)', color:'rgba(255,255,255,0.48)', maxWidth:480, margin:'0 auto 44px', lineHeight:1.75 }}>
            Every day without a professional site is bookings going to the cleaner down the road. Launch yours in 48 hours — from A$99/month, no big upfront cost.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="#quote" className="btn-primary" style={{ display:'inline-block', background:'#c8f04b', color:'#080f0a', padding:'14px 36px', borderRadius:9999, fontSize:15, fontWeight:700, textDecoration:'none', boxShadow:'0 8px 32px rgba(200,240,75,0.28)' }}>
              Get my free quote now
            </a>
            <a href="mailto:hello@siteforge.com.au" style={{ display:'inline-block', borderWidth:1, borderStyle:'solid', borderColor:'rgba(255,255,255,0.22)', color:'rgba(255,255,255,0.7)', padding:'13px 32px', borderRadius:9999, fontSize:15, fontWeight:600, textDecoration:'none', transition:'all 0.25s cubic-bezier(.16,1,.3,1)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'; e.currentTarget.style.color='white'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.22)'; e.currentTarget.style.color='rgba(255,255,255,0.7)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}>
              Ask a question
            </a>
          </div>
        </div>
      </section>

      {/* ══ QUOTE FORM ══ */}
      <section id="quote" className="sf-sec" style={{ background:'#080f0a' }}>
        <div className="sf-inner-frm">
          {!submitted && (
            <div className="reveal" style={{ textAlign:'center', marginBottom:'clamp(32px,5vw,48px)' }}>
              <span style={chip}>GET STARTED</span>
              <h2 style={h2}>Get your <em style={{ color:'#c8f04b', fontStyle:'italic' }}>free quote</em></h2>
              <p style={{ fontSize:15, color:'rgba(255,255,255,0.42)', marginTop:10, lineHeight:1.75 }}>
                Takes under 2 minutes. We respond within 2 hours with a personalised website plan and fixed price.
              </p>
            </div>
          )}

          {submitted ? (
            <div className="glass-card" style={{ background:'rgba(200,240,75,0.04)', border:'1px solid rgba(200,240,75,0.18)', borderRadius:28, padding:'clamp(36px,5vw,56px)', textAlign:'center', boxShadow:'0 24px 64px rgba(0,0,0,0.32), inset 0 1px 0 rgba(200,240,75,0.07)' }}>
              <div style={{ fontSize:56, marginBottom:20 }}>🎉</div>
              <h3 style={{ fontFamily:'Fraunces, serif', fontSize:'clamp(26px,3vw,36px)', color:'white', margin:'0 0 14px', letterSpacing:'-0.035em', lineHeight:1.1 }}>
                Enquiry received!
              </h3>
              <p style={{ color:'rgba(255,255,255,0.5)', lineHeight:1.75, margin:'0 0 36px', fontSize:15, maxWidth:420, marginLeft:'auto', marginRight:'auto' }}>
                We&apos;ll be in touch within 2 hours. In the meantime, complete your intake form so we can get started right away.
              </p>

              {intakeUrl && (
                <>
                  {/* Prominent intake CTA */}
                  <a href={intakeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary"
                    style={{ display:'inline-flex', alignItems:'center', gap:10, background:'#c8f04b', color:'#080f0a', padding:'16px 36px', borderRadius:9999, fontSize:16, fontWeight:700, textDecoration:'none', boxShadow:'0 8px 40px rgba(200,240,75,0.35)', marginBottom:24 }}>
                    <span>Complete your intake form</span>
                    <span style={{ fontSize:18 }}>→</span>
                  </a>
                  <p style={{ fontSize:12, color:'rgba(255,255,255,0.28)', marginBottom:24 }}>Takes 10 minutes · Unlocks your build slot</p>

                  {/* Copy link row */}
                  <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'14px 18px', display:'flex', alignItems:'center', gap:12, textAlign:'left', flexWrap:'wrap' }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', margin:'0 0 4px', fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase' }}>Your intake link</p>
                      <p style={{ fontSize:12, color:'rgba(200,240,75,0.7)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{window.location.origin}{intakeUrl}</p>
                    </div>
                    <button onClick={() => navigator.clipboard.writeText(window.location.origin + intakeUrl)}
                      style={{ flexShrink:0, background:'rgba(200,240,75,0.1)', border:'1px solid rgba(200,240,75,0.2)', borderRadius:8, padding:'7px 14px', fontSize:12, fontWeight:700, color:'#c8f04b', cursor:'pointer', fontFamily:'Outfit, sans-serif', whiteSpace:'nowrap' }}>
                      Copy link
                    </button>
                  </div>
                </>
              )}

              {/* Checklist */}
              <div style={{ marginTop:32, display:'flex', gap:24, justifyContent:'center', flexWrap:'wrap' }}>
                {['Enquiry saved ✓','Quote coming in 2hrs ✓','Build slot held ✓'].map(item => (
                  <span key={item} style={{ fontSize:13, color:'rgba(255,255,255,0.38)' }}>{item}</span>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="reveal glass-card" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:24, padding:'clamp(28px,4vw,44px) clamp(24px,4vw,40px)', boxShadow:'0 32px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)' }}>
              {/* Honeypot — hidden from humans; bots fill it and get silently rejected */}
              <div aria-hidden="true" style={{ position:'absolute', left:'-9999px', top:'auto', width:1, height:1, overflow:'hidden' }}>
                <label>Website
                  <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={e => up('website', e.target.value)} />
                </label>
              </div>
              <div className="sf-form-row">
                <FI label="FIRST NAME *"    value={form.firstName} onChange={v => up('firstName',v)} ph="Sarah" />
                <FI label="LAST NAME *"     value={form.lastName}  onChange={v => up('lastName',v)}  ph="Williams" />
              </div>
              <FI label="BUSINESS NAME *"   value={form.bizName}   onChange={v => up('bizName',v)}   ph="Williams Cleaning Co." />
              <div className="sf-form-row">
                <FI label="PHONE *"         value={form.phone}     onChange={v => up('phone',v)}     ph="0412 345 678" type="tel" />
                <FI label="EMAIL *"         value={form.email}     onChange={v => up('email',v)}     ph="sarah@business.com.au" type="email" />
              </div>
              <div className="sf-form-row">
                <FS label="BUSINESS TYPE *" value={form.niche} onChange={v => up('niche',v)} placeholder="Select your service"
                  opts={['Bond / End of Lease Cleaning','Regular / Domestic Cleaning','Commercial / Office Cleaning','Carpet & Upholstery','Airbnb / Short-stay','NDIS Cleaning','Other']} />
                <FI label="CITY / REGION"   value={form.city}      onChange={v => up('city',v)}      ph="Sydney" />
              </div>
              <FS label="PACKAGE INTEREST" value={form.plan} onChange={v => up('plan',v)} placeholder="Not sure yet — help me choose"
                opts={['Not sure yet — help me choose','Starter (A$99/mo)','Professional (A$149/mo)','Premium (A$249/mo)']} />
              <div style={{ marginBottom:20 }}>
                <label style={fl}>ANYTHING ELSE?</label>
                <textarea value={form.message} onChange={e => up('message',e.target.value)}
                  placeholder="Tell us any specifics — services, design ideas, what you currently have..." rows={4}
                  style={{ ...fi, resize:'vertical' as const }} />
              </div>
              {error && <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, padding:14, color:'#fca5a5', fontSize:13, marginBottom:16 }}>{error}</div>}
              <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
                <button type="submit" disabled={submitting} className={`quote-cta${submitting?'':' btn-primary'}`}
                  style={{ flex:'0 0 auto', padding:'13px 32px', borderRadius:9999, border:'none', fontFamily:'Outfit, sans-serif', fontSize:15, fontWeight:700, cursor: submitting?'not-allowed':'pointer', transition:'all 0.2s', background: submitting?'rgba(255,255,255,0.08)':'#c8f04b', color: submitting?'rgba(255,255,255,0.35)':'#080f0a', boxShadow: submitting?'none':'0 8px 32px rgba(200,240,75,0.2)', whiteSpace:'nowrap' as const }}>
                  {submitting ? '⏳ Sending...' : <><span>Get my free quote</span><span className="quote-cta-arrow"> →</span></>}
                </button>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.3)', lineHeight:1.5 }}>
                  No obligation · We respond in under 2 hours · 7 days a week
                </span>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background:'#050c06', borderTop:'1px solid rgba(255,255,255,0.06)', padding:'clamp(48px,7vw,72px) clamp(20px,5%,5%) clamp(28px,4vw,36px)' }}>
        <div className="sf-inner">
          <div className="sf-footer-grid">
            <div>
              <a href="/" style={{ fontFamily:'Fraunces, serif', fontSize:21, fontWeight:500, color:'white', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6, marginBottom:14 }}>
                <span style={{ color:'#c8f04b' }}>⚡</span>SiteForge <span style={{ color:'#CCFF00', fontFamily:'Outfit, sans-serif', fontWeight:700 }}>AI</span>
              </a>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.28)', lineHeight:1.75, margin:'0 0 20px', maxWidth:240 }}>
                Lead-getting websites for Australian cleaning businesses — live in 48 hours, from A$99/month.
              </p>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6, border:'1px solid rgba(200,240,75,0.25)', borderRadius:6, padding:'5px 12px', fontSize:11, fontWeight:700, letterSpacing:'0.07em', color:'#c8f04b' }}>
                AU 100% AUSTRALIAN
              </span>
            </div>
            {[
              { title:'Services',      links:[['#quote','Website Design'],['#quote','Local SEO'],['#quote','Suburb Landing Pages'],['#quote','Booking Integration'],['#quote','Domain Setup']] },
              { title:'Cleaning Niches', links:[['#quote','Bond / End of Lease'],['#quote','Domestic Cleaning'],['#quote','Commercial Cleaning'],['#quote','Carpet & Upholstery'],['#quote','Airbnb Turnover'],['#quote','NDIS Cleaning']] },
              { title:'Company',       links:[['#how','How it works'],['#pricing','Pricing'],['#reviews','Reviews'],['#faq','FAQ'],['mailto:hello@siteforge.com.au','Contact us']] },
            ].map(col => (
              <div key={col.title}>
                <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.07em', color:'rgba(255,255,255,0.28)', marginBottom:18, textTransform:'uppercase' as const }}>{col.title}</p>
                {col.links.map(([href, label]) => (
                  <a key={label} href={href} style={{ display:'block', fontSize:14, color:'rgba(255,255,255,0.44)', textDecoration:'none', marginBottom:10, transition:'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color='white')}
                    onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.44)')}>{label}</a>
                ))}
              </div>
            ))}
          </div>
          <div className="sf-footer-bar">
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.2)', margin:0 }}>
              © {new Date().getFullYear()} SiteForge AI. All rights reserved.{/* TODO: add real ABN here once registered, e.g. "ABN 12 345 678 901" */}
            </p>
            <div className="sf-footer-links">
              {[['Privacy Policy','/privacy'],['Terms of Service','/terms'],['Refund Policy','/refund']].map(([label, href]) => (
                <a key={label} href={href} style={{ fontSize:12, color:'rgba(255,255,255,0.5)', textDecoration:'none', transition:'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color='#c8f04b')}
                  onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.5)')}>{label}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── Form helpers ──────────────────────────────────────────────────
function FI({ label, value, onChange, ph, type='text' }: { label:string; value:string; onChange:(v:string)=>void; ph?:string; type?:string }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={fl}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={ph} style={fi} />
    </div>
  )
}
function FS({ label, value, onChange, opts, placeholder }: { label:string; value:string; onChange:(v:string)=>void; opts:string[]; placeholder?:string }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={fl}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={fi}>
        <option value="">{placeholder ?? 'Select...'}</option>
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

// ─── Style tokens ──────────────────────────────────────────────────
const chip: React.CSSProperties = { display:'inline-block', fontSize:10, fontWeight:700, letterSpacing:'0.13em', textTransform:'uppercase', color:'#c8f04b', background:'rgba(200,240,75,0.09)', border:'1px solid rgba(200,240,75,0.2)', padding:'5px 16px', borderRadius:9999, marginBottom:20 }
const h2:   React.CSSProperties = { fontFamily:'Fraunces, serif', fontSize:'clamp(32px,4.5vw,54px)', fontWeight:500, letterSpacing:'-0.035em', lineHeight:1.06, margin:'0 0 16px', color:'white' }
const fl:   React.CSSProperties = { display:'block', fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.38)', letterSpacing:'0.1em', marginBottom:9 }
const fi:   React.CSSProperties = { width:'100%', padding:'14px 17px', borderRadius:12, border:'1px solid rgba(255,255,255,0.18)', background:'rgba(255,255,255,0.08)', color:'white', fontSize:14, fontFamily:'Outfit, sans-serif', boxSizing:'border-box', colorScheme:'dark', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.15)' }
