import Link from 'next/link'
import type { ReactNode } from 'react'

export default function LegalShell({
  title,
  lastUpdated,
  children,
}: {
  title: string
  lastUpdated: string
  children: ReactNode
}) {
  return (
    <div style={{ background: '#080f0a', minHeight: '100vh', color: 'rgba(255,255,255,0.82)', fontFamily: 'Outfit, sans-serif' }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600&family=Outfit:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '20px clamp(20px,5%,5%)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, color: 'white', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#c8f04b' }}>⚡</span>SiteForge <span style={{ color: '#CCFF00', fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>AI</span>
          </Link>
          <Link href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>← Back to home</Link>
        </div>
      </header>

      {/* Body */}
      <main style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(36px,6vw,64px) clamp(20px,5%,5%) 80px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#c8f04b', marginBottom: 14 }}>Legal</p>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.05, color: 'white', margin: '0 0 14px' }}>
          {title}
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 40px' }}>Last updated: {lastUpdated}</p>

        <div className="legal-body" style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.72)' }}>
          {children}
        </div>

        <div style={{ marginTop: 56, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.07)', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginRight: 18 }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginRight: 18 }}>Terms of Service</Link>
          <Link href="/refund" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Refund Policy</Link>
        </div>
      </main>

      <style>{`
        .legal-body h2 { font-family:'Fraunces',serif; font-size:22px; font-weight:500; color:#fff; letter-spacing:-0.02em; margin:40px 0 12px; }
        .legal-body h3 { font-size:16px; font-weight:700; color:rgba(255,255,255,0.9); margin:26px 0 8px; }
        .legal-body p  { margin:0 0 16px; }
        .legal-body ul { margin:0 0 18px; padding-left:22px; }
        .legal-body li { margin:0 0 8px; }
        .legal-body a  { color:#c8f04b; text-decoration:none; }
        .legal-body a:hover { text-decoration:underline; }
        .legal-body strong { color:rgba(255,255,255,0.92); font-weight:600; }
        .legal-body .ph { color:#c8f04b; background:rgba(200,240,75,0.08); padding:1px 6px; border-radius:4px; font-size:13px; }
      `}</style>
    </div>
  )
}
