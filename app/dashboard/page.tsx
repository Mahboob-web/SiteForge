'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

type Lead = {
  id: string; first_name: string; last_name: string; biz_name: string;
  email: string; phone: string; niche: string; status: string;
  intake_token: string; created_at: string;
}

type IntakeRow = {
  id: string; biz_name: string; industry: string; city: string;
  owner_name: string; email: string; plan: string; status: string;
  site_url: string | null; created_at: string;
}

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; pulse?: boolean }> = {
  new:             { color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', label: 'New' },
  contacted:       { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  label: 'Contacted' },
  intake_sent:     { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', label: 'Intake Sent' },
  intake_complete: { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  label: 'Intake Done' },
  generating:      { color: '#fb923c', bg: 'rgba(251,146,60,0.08)',  label: 'Generating', pulse: true },
  deployed:        { color: '#4ade80', bg: 'rgba(74,222,128,0.08)',  label: 'Deployed', pulse: true },
  live:            { color: '#34d399', bg: 'rgba(52,211,153,0.08)',  label: 'Live', pulse: true },
  pending:         { color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', label: 'Pending' },
  complete:        { color: '#4ade80', bg: 'rgba(74,222,128,0.08)',  label: 'Complete' },
  error:           { color: '#f87171', bg: 'rgba(248,113,113,0.08)', label: 'Error' },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CountUp({ end, active, duration = 800 }: { end: number; active: boolean; duration?: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    if (end === 0) { setCount(0); return }
    const t0 = performance.now()
    let raf: number
    const tick = (now: number) => {
      const elapsed = Math.min(now - t0, duration)
      const progress = elapsed / duration
      // cubic ease-out: decelerates to a stop
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * end))
      if (elapsed < duration) raf = requestAnimationFrame(tick)
      else setCount(end)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [end, active, duration])
  return <>{count}</>
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', label: status }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 9999,
      letterSpacing: '0.12em', textTransform: 'uppercase' as const,
      color: cfg.color, background: cfg.bg,
      borderWidth: 1, borderStyle: 'solid', borderColor: `${cfg.color}30`,
      whiteSpace: 'nowrap' as const,
    }}>
      {cfg.pulse && (
        <span style={{
          width: 5, height: 5, borderRadius: '50%', background: cfg.color,
          display: 'inline-block',
          animation: `pulse ${status === 'generating' ? '0.9' : '2.5'}s ease-in-out infinite`,
        }} />
      )}
      {cfg.label}
    </span>
  )
}

function Pill({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 9999,
      letterSpacing: '0.12em', textTransform: 'uppercase' as const,
      background: accent ? 'rgba(200,240,75,0.08)' : 'rgba(255,255,255,0.05)',
      color: accent ? '#a8d42e' : 'rgba(255,255,255,0.4)',
    }}>{children}</span>
  )
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px' }}>
      <div style={{ fontSize: 36, marginBottom: 14, opacity: 0.35 }}>{icon}</div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.22)', fontWeight: 500, lineHeight: 1.7, maxWidth: '58ch', margin: '0 auto' }}>{text}</div>
    </div>
  )
}

function Skel({ w, h, mt }: { w: number | string; h: number; mt?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 6, marginTop: mt,
      background: 'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s linear infinite',
    }} />
  )
}

function Divider() {
  return <div className="db-sr-div" />
}

// ─── Scoped CSS ───────────────────────────────────────────────────────────────

const CSS = `
  .db { min-height:100vh; background:#050e08; font-family:'Outfit',sans-serif; color:#e8f0ea; }

  /* header */
  .db-hd {
    position:sticky; top:0; z-index:100;
    background:rgba(5,14,8,0.92);
    backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
    border-bottom:1px solid rgba(255,255,255,0.06);
    padding:0 40px; height:66px;
    display:flex; align-items:center; justify-content:space-between;
  }

  /* inner wrap */
  .db-w { max-width:1440px; margin:0 auto; }

  /* stats row — flex strip with vertical dividers */
  .db-sr {
    display:flex; align-items:stretch;
    background:rgba(255,255,255,0.02);
    border:1px solid rgba(255,255,255,0.06);
    border-radius:20px; margin:32px 40px 0;
    opacity:0; transform:translateY(16px);
    animation:dbFadeUp 0.4s cubic-bezier(.16,1,.3,1) 0.05s forwards;
    overflow:hidden;
  }
  /* primary stat cell */
  .db-sr-p {
    flex:0 0 auto; min-width:180px;
    padding:28px 36px 28px 32px;
    display:flex; flex-direction:column; justify-content:center;
  }
  /* secondary stat cell */
  .db-sr-s {
    flex:1; padding:28px 24px;
    display:flex; flex-direction:column; justify-content:center;
  }
  /* vertical divider */
  .db-sr-div {
    width:1px; flex-shrink:0;
    background:rgba(255,255,255,0.2);
    margin:20px 0;
  }

  /* content area */
  .db-ct { padding:24px 40px 64px; }

  /* toolbar */
  .db-tb { display:flex; align-items:center; gap:10px; margin-bottom:18px; flex-wrap:wrap; }

  /* search */
  .db-srch {
    flex:1; min-width:200px;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:12px; padding:9px 16px;
    font-size:13px; font-family:'Outfit',sans-serif;
    color:rgba(255,255,255,0.7); outline:none;
    transition:border-color .2s,box-shadow .2s;
  }
  .db-srch::placeholder { color:rgba(255,255,255,0.22); }
  .db-srch:focus {
    border-color:rgba(200,240,75,0.35);
    box-shadow:0 0 0 3px rgba(200,240,75,0.07);
  }

  /* filter select */
  .db-flt {
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:12px; padding:9px 14px;
    font-size:13px; font-family:'Outfit',sans-serif;
    color:rgba(255,255,255,0.6); outline:none; cursor:pointer;
  }

  /* table container */
  .db-tw {
    background:rgba(255,255,255,0.015);
    border:1px solid rgba(255,255,255,0.06);
    border-radius:20px; overflow:hidden;
  }
  .db-ts { overflow-x:auto; -webkit-overflow-scrolling:touch; }
  .db-t  { width:100%; border-collapse:collapse; }
  .db-th {
    padding:13px 16px; font-size:11px; font-weight:600;
    letter-spacing:0.12em; text-transform:uppercase;
    color:rgba(255,255,255,0.2);
    border-bottom:1px solid rgba(255,255,255,0.05);
    text-align:left; background:rgba(255,255,255,0.01);
    white-space:nowrap;
  }
  .db-tr { border-bottom:1px solid rgba(255,255,255,0.04); transition:background .15s; }
  .db-tr:last-child { border-bottom:none; }
  .db-tr:hover { background:rgba(255,255,255,0.022); }
  .db-td { padding:14px 16px; vertical-align:middle; }

  /* refresh button */
  .db-rfr {
    padding:7px 16px; border-radius:10px;
    border-width:1px; border-style:solid; border-color:rgba(255,255,255,0.1);
    background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.55);
    cursor:pointer; font-size:13px; font-weight:600;
    font-family:'Outfit',sans-serif; transition:all .2s;
  }
  .db-rfr:hover { background:rgba(255,255,255,0.07); color:rgba(255,255,255,0.8); }

  /* copy button */
  .db-cp {
    padding:6px 13px; border-radius:9px;
    border-width:1px; border-style:solid;
    cursor:pointer; font-size:12px; font-weight:600;
    font-family:'Outfit',sans-serif; transition:all .2s;
    white-space:nowrap;
  }

  /* generate button */
  .db-gen {
    padding:7px 16px; border-radius:9px; border:none;
    background:#c8f04b; color:#0a1a0a;
    cursor:pointer; font-size:12px; font-weight:700;
    font-family:'Outfit',sans-serif;
    transition:transform .15s, box-shadow .15s;
  }
  .db-gen:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(200,240,75,0.35); }

  /* view link */
  .db-vw {
    display:inline-flex; align-items:center; gap:4px;
    padding:6px 13px; border-radius:9px;
    border-width:1px; border-style:solid; border-color:rgba(52,211,153,0.22);
    background:rgba(52,211,153,0.07); color:#6ee7b7;
    font-size:12px; font-weight:600; font-family:'Outfit',sans-serif;
    text-decoration:none; transition:all .2s;
  }
  .db-vw:hover { background:rgba(52,211,153,0.12); }

  /* spinning icon */
  @keyframes db-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .spin { display:inline-block; animation:db-spin 1.2s linear infinite; }

  /* fade-up entrance */
  @keyframes dbFadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width:900px) {
    .db-sr { flex-wrap:wrap; margin:20px 20px 0; }
    .db-sr-p {
      flex:1 1 100%; padding:22px 20px;
      border-bottom:1px solid rgba(255,255,255,0.08);
    }
    .db-sr-div { display:none; }
    .db-sr-s { flex:1 1 40%; min-width:110px; padding:18px 16px; }
  }
  @media (max-width:768px) {
    .db-hd { padding:0 20px; }
    .db-ct { padding:20px 20px 48px; }
    .db-tw { border-radius:16px; }
    .db-t  { min-width:580px; }
    .hide-mob { display:none!important; }
  }
  @media (max-width:480px) {
    .db-sr-s { padding:14px 12px; }
    .db-tb { gap:8px; }
    .db-srch { min-width:140px; }
  }
`

// ─── Main Component ───────────────────────────────────────────────────────────

const LEADS_HEADERS  = ['Business', 'Contact', 'Industry', 'Status', 'Intake Link', 'Date']
const SITES_HEADERS  = ['Business', 'Owner', 'Plan', 'Status', 'Site URL', 'Actions', 'Date']

export default function Dashboard() {
  const [leads,        setLeads]        = useState<Lead[]>([])
  const [intakes,      setIntakes]      = useState<IntakeRow[]>([])
  const [tab,          setTab]          = useState<'leads' | 'sites'>('leads')
  const [loading,      setLoading]      = useState(true)
  const [copyMsg,      setCopyMsg]      = useState('')
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [lastUpdated,  setLastUpdated]  = useState<Date | null>(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLElement>(null)

  // Fire CountUp when stats row enters the viewport
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const fetchData = useCallback(async () => {
    const [leadsRes, intakesRes] = await Promise.all([
      supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('intake')
        .select('id,biz_name,industry,city,owner_name,email,plan,status,site_url,created_at')
        .order('created_at', { ascending: false }).limit(50),
    ])
    if (leadsRes.data)   setLeads(leadsRes.data)
    if (intakesRes.data) setIntakes(intakesRes.data)
    setLoading(false)
    setLastUpdated(new Date())
  }, [])

  useEffect(() => {
    fetchData()
    const iv = setInterval(fetchData, 30_000)
    return () => clearInterval(iv)
  }, [fetchData])

  const copyIntakeLink = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/intake?token=${token}`)
    setCopyMsg(token)
    setTimeout(() => setCopyMsg(''), 2000)
  }

  const triggerGeneration = async (id: string) => {
    await fetch('/api/generate-site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intakeId: id }),
    })
    fetchData()
  }

  // Filtered rows
  const q = search.toLowerCase()
  const filteredLeads = leads.filter(l =>
    (statusFilter === 'all' || l.status === statusFilter) &&
    (!q || l.biz_name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q))
  )
  const filteredIntakes = intakes.filter(i =>
    (statusFilter === 'all' || i.status === statusFilter) &&
    (!q || i.biz_name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q))
  )

  // Stats
  const secondaryStats = [
    { label: 'Total Leads',     value: leads.length,   color: '#60a5fa' },
    { label: 'Intake Complete', value: leads.filter(l => ['intake_complete','generating','deployed','live'].includes(l.status)).length, color: '#fbbf24' },
    { label: 'Sites Deployed',  value: intakes.filter(i => i.status === 'deployed' || !!i.site_url).length, color: '#4ade80' },
    { label: 'In Progress',     value: intakes.filter(i => i.status === 'generating').length, color: '#fb923c' },
  ]

  const uniqueStatuses = tab === 'leads'
    ? Array.from(new Set(leads.map(l => l.status)))
    : Array.from(new Set(intakes.map(i => i.status)))

  const headers    = tab === 'leads' ? LEADS_HEADERS : SITES_HEADERS
  const colCount   = headers.length
  const filtered   = tab === 'leads' ? filteredLeads : filteredIntakes
  const totalCount = tab === 'leads' ? leads.length   : intakes.length

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="db">

        {/* ── HEADER ────────────────────────────────── */}
        <header className="db-hd">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 21, fontWeight: 500,
              color: 'white', letterSpacing: '-0.02em',
            }}>
              ⚡ SiteForge
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'rgba(200,240,75,0.1)', color: '#c8f04b',
              padding: '3px 9px', borderRadius: 6, fontFamily: 'Outfit, sans-serif',
            }}>Admin</span>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {lastUpdated && (
              <span className="hide-mob" style={{
                fontSize: 12, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace',
              }}>
                {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            {/* Live indicator */}
            <div title="Auto-refreshing" style={{
              width: 8, height: 8, borderRadius: '50%', background: '#4ade80',
              boxShadow: '0 0 8px #4ade8088',
              animation: 'pulse 2.5s ease-in-out infinite',
            }} />
            <button className="db-rfr" onClick={fetchData}>↻ Refresh</button>
          </div>
        </header>

        <div className="db-w">

          {/* ── STATS ─────────────────────────────── */}
          <section ref={statsRef} className="db-sr" aria-label="Overview statistics">

            {/* PRIMARY — 48 hrs brand promise */}
            <div className="db-sr-p">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 6 }}>
                <span style={{
                  fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 72,
                  color: '#c8f04b', lineHeight: 1, letterSpacing: '-0.03em',
                }}>
                  <CountUp end={48} active={statsVisible} duration={800} />
                </span>
                <span style={{
                  fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 28,
                  color: 'rgba(200,240,75,0.55)', lineHeight: 1,
                }}>hrs</span>
              </div>
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
                textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7,
              }}>Avg. Delivery</div>
            </div>

            <Divider />

            {/* SECONDARY stats */}
            {secondaryStats.map((s, i) => (
              <React.Fragment key={s.label}>
                <div className="db-sr-s">
                  <div style={{
                    fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 48,
                    color: s.color, lineHeight: 1, marginBottom: 6, letterSpacing: '-0.02em',
                  }}>
                    {loading
                      ? <Skel w={44} h={38} />
                      : <CountUp end={s.value} active={statsVisible} duration={800} />
                    }
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
                    textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7,
                  }}>{s.label}</div>
                </div>
                {i < secondaryStats.length - 1 && <Divider />}
              </React.Fragment>
            ))}

          </section>

          {/* ── CONTENT ───────────────────────────── */}
          <main className="db-ct">

            {/* Toolbar */}
            <div className="db-tb" role="toolbar" aria-label="Table controls">

              {/* Tab switcher */}
              <div style={{
                display: 'flex', gap: 4, padding: 4,
                background: 'rgba(255,255,255,0.03)',
                borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.06)',
                borderRadius: 13,
              }} role="tablist">
                {(['leads', 'sites'] as const).map(t => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => { setTab(t); setStatusFilter('all'); setSearch('') }}
                    style={{
                      padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600,
                      fontFamily: 'Outfit, sans-serif', cursor: 'pointer', border: 'none',
                      transition: 'all 0.2s',
                      background: tab === t ? 'rgba(200,240,75,0.12)' : 'transparent',
                      color: tab === t ? '#c8f04b' : 'rgba(255,255,255,0.38)',
                      boxShadow: tab === t ? 'inset 0 0 0 1px rgba(200,240,75,0.2)' : 'none',
                    }}>
                    {t === 'leads' ? `📥 Leads (${leads.length})` : `🌐 Sites (${intakes.length})`}
                  </button>
                ))}
              </div>

              {/* Search */}
              <input
                type="search"
                placeholder="Search business or email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="db-srch"
                aria-label="Search records"
              />

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="db-flt"
                aria-label="Filter by status"
              >
                <option value="all">All statuses</option>
                {uniqueStatuses.map(s => (
                  <option key={s} value={s} style={{ background: '#0c1a0f' }}>
                    {STATUS_CONFIG[s]?.label ?? s}
                  </option>
                ))}
              </select>

              <span style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>
                {filtered.length}{filtered.length !== totalCount && ` of ${totalCount}`} records
              </span>
            </div>

            {/* Table */}
            <div className="db-tw" role="region" aria-label={tab === 'leads' ? 'Leads table' : 'Sites table'}>
              <div className="db-ts">
                <table className="db-t" role="table">
                  <thead>
                    <tr role="row">
                      {headers.map(h => (
                        <th key={h} className="db-th" scope="col">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i} className="db-tr" role="row">
                          {Array.from({ length: colCount }).map((_, j) => (
                            <td key={j} className="db-td">
                              <Skel w={j === 0 ? 130 : j === colCount - 1 ? 50 : 80} h={13} />
                              {j === 0 && <Skel w={90} h={11} mt={5} />}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : tab === 'leads' ? (
                      filteredLeads.length === 0 ? (
                        <tr role="row">
                          <td colSpan={colCount} role="cell">
                            <EmptyState icon="📭" text={q ? 'No leads match your search' : 'No leads yet — submit the homepage form to get started'} />
                          </td>
                        </tr>
                      ) : filteredLeads.map(lead => (
                        <tr key={lead.id} className="db-tr" role="row">
                          <td className="db-td" role="cell">
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f4f1', marginBottom: 2 }}>
                              {lead.biz_name}
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>
                              {lead.first_name} {lead.last_name}
                            </div>
                          </td>
                          <td className="db-td" role="cell">
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{lead.email}</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>{lead.phone}</div>
                          </td>
                          <td className="db-td" role="cell">
                            <Pill>{lead.niche}</Pill>
                          </td>
                          <td className="db-td" role="cell">
                            <StatusBadge status={lead.status} />
                          </td>
                          <td className="db-td" role="cell">
                            <button
                              className="db-cp"
                              onClick={() => copyIntakeLink(lead.intake_token)}
                              style={{
                                borderColor: copyMsg === lead.intake_token
                                  ? 'rgba(74,222,128,0.35)' : 'rgba(255,255,255,0.1)',
                                background: copyMsg === lead.intake_token
                                  ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.03)',
                                color: copyMsg === lead.intake_token
                                  ? '#4ade80' : 'rgba(255,255,255,0.45)',
                              }}>
                              {copyMsg === lead.intake_token ? '✓ Copied!' : '⎘ Copy Link'}
                            </button>
                          </td>
                          <td className="db-td" role="cell">
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>
                              {new Date(lead.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' })}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      filteredIntakes.length === 0 ? (
                        <tr role="row">
                          <td colSpan={colCount} role="cell">
                            <EmptyState icon="🌐" text={q ? 'No sites match your search' : 'No sites yet — complete an intake form to generate one'} />
                          </td>
                        </tr>
                      ) : filteredIntakes.map(intake => (
                        <tr key={intake.id} className="db-tr" role="row">
                          <td className="db-td" role="cell">
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f4f1', marginBottom: 2 }}>
                              {intake.biz_name}
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>
                              {intake.industry} · {intake.city}
                            </div>
                          </td>
                          <td className="db-td" role="cell">
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{intake.owner_name}</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>{intake.email}</div>
                          </td>
                          <td className="db-td" role="cell">
                            <Pill accent>{intake.plan || 'Standard'}</Pill>
                          </td>
                          <td className="db-td" role="cell">
                            <StatusBadge status={intake.status} />
                          </td>
                          <td className="db-td" role="cell">
                            {intake.site_url ? (
                              <a href={intake.site_url} target="_blank" rel="noreferrer" style={{
                                fontSize: 12, color: '#c8f04b', textDecoration: 'none',
                                fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4,
                              }}>
                                🔗 {intake.site_url.replace('https://', '').slice(0, 26)}…
                              </a>
                            ) : (
                              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 14 }}>—</span>
                            )}
                          </td>
                          <td className="db-td" role="cell">
                            {intake.status === 'pending' && (
                              <button className="db-gen" onClick={() => triggerGeneration(intake.id)}>
                                🚀 Generate
                              </button>
                            )}
                            {intake.status === 'generating' && (
                              <span style={{
                                fontSize: 12, color: '#fb923c',
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                              }}>
                                <span className="spin">⚙️</span> Building…
                              </span>
                            )}
                            {intake.site_url && intake.status !== 'generating' && (
                              <a href={intake.site_url} target="_blank" rel="noreferrer" className="db-vw">
                                👁 View
                              </a>
                            )}
                          </td>
                          <td className="db-td" role="cell">
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>
                              {new Date(intake.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' })}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer bar */}
            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.14)' }}>
              Auto-refreshes every 30 s
              {lastUpdated && ` · Last updated ${lastUpdated.toLocaleTimeString()}`}
            </p>
          </main>
        </div>
      </div>
    </>
  )
}
