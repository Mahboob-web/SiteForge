'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7

const SERVICES = [
  'Regular House Cleaning','End of Lease Cleaning','Deep Cleaning','Office Cleaning',
  'Carpet Cleaning','Window Cleaning','Airbnb Turnover','NDIS Cleaning',
  'Post-Construction','Spring Cleaning','Move In/Out','Pressure Washing',
  'General Plumbing','Emergency Plumbing','Blocked Drains','Hot Water Systems',
  'General Electrical','Safety Inspections','Switchboard Upgrades',
  'Lawn Mowing','Garden Maintenance','Pest Control','Painting','Handyman'
]
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

  useEffect(()=>{
    const saved = localStorage.getItem(`sf-intake-${token}`)
    if(saved){try{setForm(JSON.parse(saved))}catch(_){}}
  },[token])

  useEffect(()=>{
    const t = setInterval(()=>localStorage.setItem(`sf-intake-${token}`,JSON.stringify(form)),30000)
    return ()=>clearInterval(t)
  },[form,token])

  const update = (f:string,v:unknown) => setForm(p=>({...p,[f]:v}))
  const toggleArr = (f:'services'|'guarantees'|'certs',v:string)=>{
    setForm(p=>{const a=p[f] as string[];return{...p,[f]:a.includes(v)?a.filter(x=>x!==v):[...a,v]}})
  }
  const addSuburb=(e:React.KeyboardEvent)=>{
    if(e.key==='Enter'&&suburbInput.trim()){
      e.preventDefault();const s=suburbInput.trim()
      if(!form.suburbs.includes(s))update('suburbs',[...form.suburbs,s])
      setSuburbInput('')
    }
  }

  const handleSubmit=async()=>{
    setSubmitting(true);setError('')
    try{
      const res=await fetch('/api/submit-intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,token})})
      const data=await res.json()
      if(!res.ok)throw new Error(data.error)
      localStorage.removeItem(`sf-intake-${token}`)
      setSubmitted(true)
    }catch(err){setError(String(err))}
    finally{setSubmitting(false)}
  }

  const pct=Math.round((step/7)*100)

  if(submitted)return(
    <div style={st.page}>
      <div style={st.successCard}>
        <div style={{fontSize:64}}>🚀</div>
        <h1 style={st.successTitle}>You're all set!</h1>
        <p style={st.successSub}>Your website is being generated now. You'll receive an email with your live URL within <strong>15–30 minutes</strong>.</p>
        <div style={st.successInfo}>
          <div>📧 Confirmation sent to <strong>{form.email}</strong></div>
          <div>⏱ Estimated delivery: 15–30 minutes</div>
          <div>🌐 Domain: <strong>{form.domain||`${form.biz_name.toLowerCase().replace(/\s+/g,'-')}.vercel.app`}</strong></div>
        </div>
      </div>
    </div>
  )

  return(
    <div style={st.page}>
      <div style={st.header}>
        <div style={st.logo}>⚡ SiteForge AI</div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={st.progressBar}><div style={{...st.progressFill,width:`${pct}%`}}/></div>
          <span style={st.progressLabel}>Step {step} of 7</span>
        </div>
      </div>
      <div style={st.container}>
        <div style={st.stepNav}>
          {['Business','Services','Areas','Brand','USPs','Reviews','Assets'].map((_,i)=>(
            <div key={i} style={{...st.stepDot,background:step===i+1?'#c8f04b':step>i+1?'#276135':'rgba(255,255,255,0.1)',color:step===i+1?'#0f1612':step>i+1?'white':'rgba(255,255,255,0.4)'}}>{step>i+1?'✓':i+1}</div>
          ))}
        </div>

        {/* STEP 1 */}
        {step===1&&<div style={st.card}>
          <div style={st.tag}>Step 1 of 7</div>
          <h1 style={st.title}>Tell us about your <em style={{color:'#c8f04b',fontStyle:'italic'}}>business</em></h1>
          <div style={st.grid2}><F l="Business Name *" v={form.biz_name} o={v=>update('biz_name',v)} p="Williams Cleaning Co."/><F l="Owner Name *" v={form.owner_name} o={v=>update('owner_name',v)} p="Sarah Williams"/><F l="Phone *" v={form.phone} o={v=>update('phone',v)} p="0412 345 678" t="tel"/><F l="Email *" v={form.email} o={v=>update('email',v)} p="sarah@business.com.au" t="email"/><F l="Preferred Domain" v={form.domain} o={v=>update('domain',v)} p="williamsclean.com.au"/><F l="ABN (optional)" v={form.abn} o={v=>update('abn',v)} p="12 345 678 901"/></div>
          <S l="Industry / Niche *" v={form.industry} o={v=>update('industry',v)} opts={['Residential Cleaning','Commercial Cleaning','Plumbing','Electrical','Landscaping','Pest Control','Painting','HVAC','Handyman','Other']}/>
          <S l="Years in Business *" v={form.years_in_biz} o={v=>update('years_in_biz',v)} opts={['Less than 1 year','1–2 years','3–5 years','6–10 years','10+ years']}/>
          <S l="Team Size *" v={form.team_size} o={v=>update('team_size',v)} opts={['Just me (sole trader)','2–3 people','4–8 people','9–15 people','15+ people']}/>
          <F l="Business Address *" v={form.address} o={v=>update('address',v)} p="Bondi NSW 2026"/>
        </div>}

        {/* STEP 2 */}
        {step===2&&<div style={st.card}>
          <div style={st.tag}>Step 2 of 7</div>
          <h1 style={st.title}>Your <em style={{color:'#c8f04b',fontStyle:'italic'}}>services</em></h1>
          <div style={st.checkGrid}>{SERVICES.map(s=><label key={s} style={{...st.check,...(form.services.includes(s)?st.checkOn:{})}}><input type="checkbox" checked={form.services.includes(s)} onChange={()=>toggleArr('services',s)} style={{display:'none'}}/>{form.services.includes(s)?'✓ ':''}{s}</label>)}</div>
          <div style={st.grid2}><S l="Pricing" v={form.pricing_type} o={v=>update('pricing_type',v)} opts={['fixed','quote']} lbls={['Fixed','Quote-Based']}/><F l="Starting price" v={form.price_from} o={v=>update('price_from',v)} p="From $120"/><S l="Response time" v={form.response_time} o={v=>update('response_time',v)} opts={['Same day','Within 2 hours','Next business day']}/><S l="Availability" v={form.availability} o={v=>update('availability',v)} opts={['7 days a week','Mon–Sat','Weekdays only']}/></div>
          <p style={st.lbl}>Guarantees</p>
          <div style={st.checkGrid}>{GUARANTEES.map(g=><label key={g} style={{...st.check,...(form.guarantees.includes(g)?st.checkOn:{})}}><input type="checkbox" checked={form.guarantees.includes(g)} onChange={()=>toggleArr('guarantees',g)} style={{display:'none'}}/>{form.guarantees.includes(g)?'✓ ':''}{g}</label>)}</div>
          <p style={st.lbl}>Certifications</p>
          <div style={st.checkGrid}>{CERTS.map(c=><label key={c} style={{...st.check,...(form.certs.includes(c)?st.checkOn:{})}}><input type="checkbox" checked={form.certs.includes(c)} onChange={()=>toggleArr('certs',c)} style={{display:'none'}}/>{form.certs.includes(c)?'✓ ':''}{c}</label>)}</div>
        </div>}

        {/* STEP 3 */}
        {step===3&&<div style={st.card}>
          <div style={st.tag}>Step 3 of 7</div>
          <h1 style={st.title}>Your <em style={{color:'#c8f04b',fontStyle:'italic'}}>service areas</em></h1>
          <S l="Main City *" v={form.city} o={v=>update('city',v)} opts={AU_CITIES}/>
          <div style={st.field}><label style={st.lbl}>Suburbs (type + press Enter)</label><input value={suburbInput} onChange={e=>setSuburbInput(e.target.value)} onKeyDown={addSuburb} placeholder="e.g. Bondi, Coogee..." style={st.input}/><div style={st.tags}>{form.suburbs.map(s=><span key={s} style={st.tag2}>{s}<button onClick={()=>update('suburbs',form.suburbs.filter(x=>x!==s))} style={st.x}>×</button></span>)}</div></div>
          <div style={st.field}><label style={st.lbl}>Travel range: {form.travel_range}km</label><input type="range" min={5} max={100} step={5} value={form.travel_range} onChange={e=>update('travel_range',parseInt(e.target.value))} style={{width:'100%'}}/></div>
        </div>}

        {/* STEP 4 */}
        {step===4&&<div style={st.card}>
          <div style={st.tag}>Step 4 of 7</div>
          <h1 style={st.title}>Brand & <em style={{color:'#c8f04b',fontStyle:'italic'}}>design</em></h1>
          <p style={st.lbl}>Tone of voice</p>
          <div style={{display:'flex',gap:12,marginBottom:24}}>{(['friendly','professional','premium'] as const).map(t=><button key={t} onClick={()=>update('tone',t)} style={{flex:1,padding:'16px 8px',borderRadius:12,border:'2px solid',borderColor:form.tone===t?'#c8f04b':'rgba(255,255,255,0.1)',background:form.tone===t?'rgba(200,240,75,0.1)':'rgba(255,255,255,0.03)',color:form.tone===t?'#c8f04b':'rgba(255,255,255,0.5)',cursor:'pointer',fontFamily:'Outfit,sans-serif',fontSize:14,fontWeight:600,textTransform:'capitalize'}}>{t==='friendly'?'😊':t==='professional'?'🏆':'💎'}<br/>{t}</button>)}</div>
          <F l="Brand colour" v={form.colour} o={v=>update('colour',v)} t="color"/>
          <F l="Target customer" v={form.target_customer||''} o={v=>update('target_customer',v)} p="Busy families, property owners..."/>
        </div>}

        {/* STEP 5 */}
        {step===5&&<div style={st.card}>
          <div style={st.tag}>Step 5 of 7</div>
          <h1 style={st.title}>What makes you <em style={{color:'#c8f04b',fontStyle:'italic'}}>different</em></h1>
          {[0,1,2].map(i=><F key={i} l={`USP ${i+1}`} v={form.usps[i]} o={v=>{const u=[...form.usps];u[i]=v;update('usps',u)}} p={['Same-day availability 7 days','Eco-friendly products only','Police-checked team'][i]}/>)}
          <div style={st.field}><label style={st.lbl}>Your story <span style={{opacity:0.5,fontWeight:400}}>(optional)</span></label><textarea value={form.biz_story} onChange={e=>update('biz_story',e.target.value)} placeholder="How did you start? Why do you love what you do?" rows={4} style={{...st.input,resize:'vertical' as const}}/></div>
          <div style={st.grid2}><F l="Google rating" v={form.star_rating} o={v=>update('star_rating',v)} p="4.9 (320 reviews)"/><F l="Awards" v={form.awards||''} o={v=>update('awards',v)} p="HiPages Top Rated 2023"/></div>
        </div>}

        {/* STEP 6 */}
        {step===6&&<div style={st.card}>
          <div style={st.tag}>Step 6 of 7</div>
          <h1 style={st.title}>Real customer <em style={{color:'#c8f04b',fontStyle:'italic'}}>reviews</em></h1>
          {form.testimonials.map((t,i)=><div key={i} style={{background:'rgba(255,255,255,0.03)',borderRadius:12,padding:16,marginBottom:12}}><label style={{...st.lbl,marginBottom:8}}>Testimonial {i+1}</label><textarea value={t.text} onChange={e=>{const ts=[...form.testimonials];ts[i]={...ts[i],text:e.target.value};update('testimonials',ts)}} placeholder={`"What the client said..."`} rows={3} style={{...st.input,resize:'vertical' as const,marginBottom:8}}/><div style={{display:'flex',gap:8}}><input value={t.author} onChange={e=>{const ts=[...form.testimonials];ts[i]={...ts[i],author:e.target.value};update('testimonials',ts)}} placeholder="Client name" style={{...st.input,flex:1}}/><input value={t.suburb||''} onChange={e=>{const ts=[...form.testimonials];ts[i]={...ts[i],suburb:e.target.value};update('testimonials',ts)}} placeholder="Suburb" style={{...st.input,flex:1}}/></div></div>)}
        </div>}

        {/* STEP 7 */}
        {step===7&&<div style={st.card}>
          <div style={st.tag}>Step 7 of 7</div>
          <h1 style={st.title}>Final <em style={{color:'#c8f04b',fontStyle:'italic'}}>details</em></h1>
          <p style={st.lbl}>Your plan</p>
          <div style={{display:'flex',gap:12,marginBottom:24}}>{([{v:'starter',l:'Starter',p:'$599',f:'5 pages, 14 days'},{v:'professional',l:'Professional',p:'$999',f:'20 suburb pages, 7 days'},{v:'premium',l:'Premium',p:'$1,799',f:'40 suburbs, 48hrs'}]).map(pl=><button key={pl.v} onClick={()=>update('plan',pl.v)} style={{flex:1,padding:'16px 8px',borderRadius:12,border:'2px solid',borderColor:form.plan===pl.v?'#c8f04b':'rgba(255,255,255,0.1)',background:form.plan===pl.v?'rgba(200,240,75,0.1)':'rgba(255,255,255,0.03)',color:'white',cursor:'pointer',fontFamily:'Outfit,sans-serif',textAlign:'center'}}><div style={{fontSize:12,opacity:0.5,marginBottom:4}}>{pl.l}</div><div style={{fontSize:22,fontWeight:700,color:form.plan===pl.v?'#c8f04b':'white'}}>{pl.p}</div><div style={{fontSize:11,opacity:0.5,marginTop:4}}>{pl.f}</div></button>)}</div>
          <F l="Facebook URL" v={form.facebook_url} o={v=>update('facebook_url',v)} p="https://facebook.com/yourbusiness"/>
          <F l="Instagram URL (optional)" v={form.instagram_url} o={v=>update('instagram_url',v)} p="https://instagram.com/yourbusiness"/>
          <F l="Logo URL (optional)" v={form.logo_url} o={v=>update('logo_url',v)} p="https://..."/>
          {error&&<div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,padding:12,color:'#fca5a5',fontSize:13,marginBottom:16}}>{error}</div>}
          <button onClick={handleSubmit} disabled={submitting} style={{width:'100%',padding:18,borderRadius:9999,border:'none',background:submitting?'rgba(255,255,255,0.1)':'#c8f04b',color:submitting?'rgba(255,255,255,0.5)':'#0f1612',fontSize:16,fontWeight:700,cursor:submitting?'not-allowed':'pointer',fontFamily:'Outfit,sans-serif'}}>{submitting?'⏳ Saving & generating...':'🚀 Build My Website'}</button>
          <p style={{fontSize:12,color:'rgba(255,255,255,0.3)',textAlign:'center' as const,marginTop:12}}>Your website will be live within 15–30 minutes.</p>
        </div>}

        <div style={{display:'flex',gap:12,justifyContent:'space-between',marginTop:24}}>
          {step>1&&<button onClick={()=>setStep(s=>(s-1) as Step)} style={{...st.navBtn,background:'rgba(255,255,255,0.06)',color:'rgba(255,255,255,0.6)'}}>← Back</button>}
          {step<7&&<button onClick={()=>setStep(s=>(s+1) as Step)} style={{...st.navBtn,marginLeft:'auto'}}>Continue →</button>}
        </div>
      </div>
    </div>
  )
}

// Mini components
function F({l,v,o,p,t='text'}:{l:string;v:string;o:(v:string)=>void;p?:string;t?:string}){
  return<div style={st.field}><label style={st.lbl}>{l}</label><input type={t} value={v} onChange={e=>o(e.target.value)} placeholder={p} style={t==='color'?{...st.input,padding:4,height:44}:st.input}/></div>
}
function S({l,v,o,opts,lbls}:{l:string;v:string;o:(v:string)=>void;opts:string[];lbls?:string[]}){
  return<div style={st.field}><label style={st.lbl}>{l}</label><select value={v} onChange={e=>o(e.target.value)} style={st.input}><option value="">Select...</option>{opts.map((opt,i)=><option key={opt} value={opt}>{lbls?.[i]||opt}</option>)}</select></div>
}

const st:Record<string,React.CSSProperties>={
  page:{minHeight:'100vh',background:'#0a1a10',fontFamily:'Outfit,sans-serif'},
  header:{position:'sticky',top:0,zIndex:100,background:'rgba(10,26,16,0.95)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.07)',padding:'0 5%',height:64,display:'flex',alignItems:'center',justifyContent:'space-between'},
  logo:{fontFamily:'Fraunces,serif',fontSize:20,fontWeight:500,color:'white'},
  progressBar:{width:180,height:4,background:'rgba(255,255,255,0.1)',borderRadius:9999},
  progressFill:{height:'100%',background:'#c8f04b',borderRadius:9999,transition:'width 0.3s'},
  progressLabel:{fontSize:12,color:'rgba(255,255,255,0.4)',fontFamily:'monospace'},
  container:{maxWidth:680,margin:'0 auto',padding:'40px 5% 80px'},
  stepNav:{display:'flex',justifyContent:'center',gap:8,marginBottom:32},
  stepDot:{width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,transition:'all 0.2s'},
  card:{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:24,padding:32},
  tag:{fontSize:11,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#c8f04b',background:'rgba(200,240,75,0.1)',display:'inline-block',padding:'3px 12px',borderRadius:9999,marginBottom:16},
  title:{fontFamily:'Fraunces,serif',fontSize:'clamp(28px,4vw,42px)',fontWeight:500,color:'white',lineHeight:1.1,letterSpacing:'-0.025em',marginBottom:8},
  grid2:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16},
  field:{marginBottom:16},
  lbl:{display:'block',fontSize:12.5,fontWeight:600,color:'rgba(255,255,255,0.5)',letterSpacing:'0.01em',marginBottom:6},
  input:{width:'100%',padding:'12px 14px',borderRadius:10,border:'1.5px solid rgba(255,255,255,0.18)',background:'rgba(255,255,255,0.09)',color:'white',fontSize:14,fontFamily:'Outfit,sans-serif',outline:'none',boxSizing:'border-box',colorScheme:'dark'},
  checkGrid:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:8,marginBottom:24},
  check:{padding:'10px 13px',borderRadius:10,border:'1.5px solid rgba(255,255,255,0.08)',background:'rgba(255,255,255,0.03)',fontSize:13,color:'rgba(255,255,255,0.5)',cursor:'pointer',userSelect:'none'},
  checkOn:{border:'1.5px solid rgba(200,240,75,0.4)',background:'rgba(200,240,75,0.08)',color:'#c8f04b'},
  tags:{display:'flex',flexWrap:'wrap',gap:8,marginTop:10},
  tag2:{background:'rgba(200,240,75,0.12)',border:'1px solid rgba(200,240,75,0.25)',color:'#c8f04b',padding:'5px 10px',borderRadius:9999,fontSize:13,display:'flex',alignItems:'center',gap:6},
  x:{background:'none',border:'none',color:'#c8f04b',cursor:'pointer',fontSize:16,lineHeight:1,padding:0},
  navBtn:{padding:'12px 28px',borderRadius:9999,border:'none',background:'#c8f04b',color:'#0f1612',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'Outfit,sans-serif'},
  successCard:{maxWidth:520,margin:'80px auto',padding:48,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:24,textAlign:'center'},
  successTitle:{fontFamily:'Fraunces,serif',fontSize:40,fontWeight:500,color:'white',marginTop:16,marginBottom:12},
  successSub:{fontSize:16,color:'rgba(255,255,255,0.55)',lineHeight:1.7,marginBottom:32},
  successInfo:{background:'rgba(200,240,75,0.07)',border:'1px solid rgba(200,240,75,0.15)',borderRadius:16,padding:24,textAlign:'left',fontSize:14,color:'rgba(255,255,255,0.65)',display:'flex',flexDirection:'column',gap:12}
}
