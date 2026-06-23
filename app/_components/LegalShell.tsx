import Link from 'next/link'
import type { ReactNode } from 'react'

type Section = { id: string; heading: string; body: ReactNode }

export default function LegalShell({
  title,
  lastUpdated,
  intro,
  sections,
}: {
  title: string
  lastUpdated: string
  intro?: ReactNode
  sections: Section[]
}) {
  return (
    <div className="legal-root">
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600&family=Outfit:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ── Header band ── */}
      <header className="legal-header">
        <div className="legal-wrap legal-nav">
          <Link href="/" className="legal-logo">
            <span style={{ color: '#c8f04b' }}>⚡</span>SiteForge <span style={{ color: '#CCFF00', fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>AI</span>
          </Link>
          <Link href="/" className="legal-back">← Back to site</Link>
        </div>
        <div className="legal-wrap legal-head-inner">
          <p className="legal-eyebrow">Legal</p>
          <h1 className="legal-title">{title}</h1>
          <span className="legal-pill">
            <span className="legal-dot" /> Last updated {lastUpdated}
          </span>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="legal-wrap legal-grid">
        {/* Table of contents */}
        <nav className="legal-toc" aria-label="On this page">
          <p className="legal-toc-label">On this page</p>
          <ol className="legal-toc-list">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>
                  <span className="legal-toc-num">{String(i + 1).padStart(2, '0')}</span>
                  <span>{s.heading}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Content */}
        <article className="legal-content">
          {intro && <div className="legal-intro">{intro}</div>}
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="legal-section">
              <h2>
                <span className="legal-sec-num">{String(i + 1).padStart(2, '0')}</span>
                {s.heading}
              </h2>
              {s.body}
            </section>
          ))}

          <div className="legal-crosslinks">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/refund">Refund Policy</Link>
          </div>
        </article>
      </main>

      <footer className="legal-foot">
        <div className="legal-wrap">© {new Date().getFullYear()} SiteForge AI · Websites for Australian cleaning businesses</div>
      </footer>

      <style>{`
        .legal-root {
          background:#070d08; min-height:100vh; color:rgba(255,255,255,0.74);
          font-family:'Outfit',sans-serif; -webkit-font-smoothing:antialiased;
          scroll-behavior:smooth;
        }
        html { scroll-behavior:smooth; }
        .legal-wrap { max-width:1080px; margin:0 auto; padding-left:clamp(20px,5vw,40px); padding-right:clamp(20px,5vw,40px); }

        /* Header */
        .legal-header {
          position:relative; overflow:hidden;
          background:
            radial-gradient(120% 140% at 80% -20%, rgba(200,240,75,0.10) 0%, transparent 55%),
            linear-gradient(180deg,#0c1a0d 0%,#070d08 100%);
          border-bottom:1px solid rgba(255,255,255,0.07);
        }
        .legal-nav { display:flex; align-items:center; justify-content:space-between; padding-top:20px; padding-bottom:20px; }
        .legal-logo { font-family:'Fraunces',serif; font-size:20px; font-weight:500; color:#fff; text-decoration:none; display:inline-flex; align-items:center; gap:6px; }
        .legal-back { font-size:13px; color:rgba(255,255,255,0.55); text-decoration:none; transition:color .2s; }
        .legal-back:hover { color:#c8f04b; }
        .legal-head-inner { padding-top:clamp(28px,5vw,52px); padding-bottom:clamp(36px,5vw,56px); }
        .legal-eyebrow { font-size:11px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:#c8f04b; margin:0 0 16px; }
        .legal-title { font-family:'Fraunces',serif; font-size:clamp(36px,6vw,60px); font-weight:400; letter-spacing:-0.035em; line-height:1.02; color:#fff; margin:0 0 22px; }
        .legal-pill { display:inline-flex; align-items:center; gap:8px; font-size:12.5px; color:rgba(255,255,255,0.55); border:1px solid rgba(255,255,255,0.14); border-radius:9999px; padding:6px 15px; }
        .legal-dot { width:6px; height:6px; border-radius:50%; background:#c8f04b; box-shadow:0 0 8px rgba(200,240,75,0.8); }

        /* Grid */
        .legal-grid { display:grid; grid-template-columns:236px 1fr; gap:clamp(40px,6vw,72px); padding-top:clamp(40px,6vw,64px); padding-bottom:96px; }

        /* TOC */
        .legal-toc { position:sticky; top:28px; align-self:start; }
        .legal-toc-label { font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.35); margin:0 0 16px; }
        .legal-toc-list { list-style:none; margin:0; padding:0; border-left:1px solid rgba(255,255,255,0.09); }
        .legal-toc-list li { margin:0; }
        .legal-toc-list a { display:flex; gap:11px; align-items:baseline; padding:7px 0 7px 18px; margin-left:-1px; border-left:1px solid transparent; font-size:13.5px; line-height:1.45; color:rgba(255,255,255,0.5); text-decoration:none; transition:color .18s, border-color .18s; }
        .legal-toc-list a:hover { color:#fff; border-left-color:#c8f04b; }
        .legal-toc-num { font-size:11px; font-weight:700; color:rgba(200,240,75,0.55); font-variant-numeric:tabular-nums; flex-shrink:0; }

        /* Content */
        .legal-content { max-width:680px; }
        .legal-intro { font-size:16.5px; line-height:1.85; color:rgba(255,255,255,0.66); margin-bottom:8px; }
        .legal-intro p { margin:0 0 18px; }
        .legal-intro a, .legal-content a { color:#c8f04b; text-decoration:none; }
        .legal-intro a:hover, .legal-content a:hover { text-decoration:underline; }

        .legal-section { scroll-margin-top:24px; padding-top:34px; margin-top:34px; border-top:1px solid rgba(255,255,255,0.07); }
        .legal-section:first-of-type { border-top:0; margin-top:14px; padding-top:0; }
        .legal-section h2 { display:flex; gap:14px; align-items:baseline; font-family:'Fraunces',serif; font-size:24px; font-weight:500; letter-spacing:-0.02em; color:#fff; margin:0 0 16px; }
        .legal-sec-num { font-family:'Outfit',sans-serif; font-size:13px; font-weight:700; color:#c8f04b; font-variant-numeric:tabular-nums; line-height:1.9; flex-shrink:0; }
        .legal-section h3 { font-size:16px; font-weight:700; color:rgba(255,255,255,0.92); margin:26px 0 8px; }
        .legal-section p { font-size:15.5px; line-height:1.82; color:rgba(255,255,255,0.72); margin:0 0 16px; }
        .legal-section ul { margin:0 0 18px; padding-left:4px; list-style:none; }
        .legal-section li { position:relative; font-size:15.5px; line-height:1.75; color:rgba(255,255,255,0.72); margin:0 0 10px; padding-left:22px; }
        .legal-section li::before { content:''; position:absolute; left:2px; top:11px; width:6px; height:6px; border-radius:50%; background:rgba(200,240,75,0.7); }
        .legal-section strong { color:rgba(255,255,255,0.94); font-weight:600; }
        .ph { color:#c8f04b; background:rgba(200,240,75,0.10); padding:1px 7px; border-radius:5px; font-size:13.5px; white-space:nowrap; }

        /* Cross links */
        .legal-crosslinks { display:flex; flex-wrap:wrap; gap:22px; margin-top:60px; padding-top:28px; border-top:1px solid rgba(255,255,255,0.08); }
        .legal-crosslinks a { font-size:13.5px; color:rgba(255,255,255,0.55); text-decoration:none; transition:color .2s; }
        .legal-crosslinks a:hover { color:#c8f04b; }

        /* Footer */
        .legal-foot { border-top:1px solid rgba(255,255,255,0.06); padding:26px 0; font-size:12.5px; color:rgba(255,255,255,0.3); text-align:center; }

        @media (max-width:900px) {
          .legal-grid { grid-template-columns:1fr; }
          .legal-toc { position:static; border:1px solid rgba(255,255,255,0.09); border-radius:14px; padding:18px 20px; background:rgba(255,255,255,0.02); }
          .legal-toc-list { border-left:0; }
          .legal-toc-list a { padding-left:0; border-left:0; }
          .legal-toc-list a:hover { border-left:0; }
        }
        @media (prefers-reduced-motion:reduce) { html, .legal-root { scroll-behavior:auto; } }
      `}</style>
    </div>
  )
}
