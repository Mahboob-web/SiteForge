export default function LiveDemos() {
  const demos = [
    {
      tag: "Client website",
      title: "A real cleaning site we built",
      desc: "Instant price estimator, online booking with date & time, before/after slider, and a bond-back guarantee — built to turn visitors into booked jobs.",
      href: "https://bondbright-demo-website.vercel.app/",
      cta: "Open live site",
      login: null,
      icon: <path d="M3 9l9-6 9 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10" />,
    },
    {
      tag: "Client dashboard",
      title: "Where clients track their leads",
      desc: "Every enquiry from their site lands here live — leads inbox, bookings, reviews and pipeline. This is the value behind the monthly fee.",
      href: "https://bondbright-dashboard.vercel.app/",
      cta: "Open dashboard",
      login: "demo@bright.com",
      icon: <path d="M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-4H3z" />,
    },
    {
      tag: "Agency console",
      title: "How we run every account",
      desc: "Monitor all clients in one place — total MRR, leads delivered, plan mix, and automatic churn-risk alerts so no client slips away.",
      href: "https://siteforge-dashboard-beige.vercel.app/",
      cta: "Open console",
      login: "admin@siteforge.com",
      icon: <path d="M3 3v18h18M7 14l4-4 3 3 5-6" />,
    },
  ];

  const css = `
    .sfd{position:relative;padding:clamp(64px,9vw,120px) 0;
      background:radial-gradient(55% 55% at 85% 0%,rgba(185,245,66,.06),transparent),
      radial-gradient(50% 50% at 5% 100%,rgba(185,245,66,.05),transparent),#080B08;
      color:#fff;overflow:hidden;font-family:inherit}
    .sfd-wrap{max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,40px)}
    .sfd-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;
      letter-spacing:.14em;text-transform:uppercase;color:#B9F542;margin-bottom:18px;
      background:rgba(185,245,66,.1);border:1px solid rgba(185,245,66,.22);
      padding:7px 14px;border-radius:9999px}
    .sfd-eyebrow .live{width:7px;height:7px;border-radius:50%;background:#B9F542;
      box-shadow:0 0 0 0 rgba(185,245,66,.6);animation:sfdpulse 2s infinite}
    @keyframes sfdpulse{0%{box-shadow:0 0 0 0 rgba(185,245,66,.6)}70%{box-shadow:0 0 0 9px rgba(185,245,66,0)}100%{box-shadow:0 0 0 0 rgba(185,245,66,0)}}
    .sfd h2{font-family:'Fraunces',Georgia,serif;font-size:clamp(30px,4.6vw,52px);font-weight:600;
      line-height:1.06;letter-spacing:-.02em;max-width:720px;margin:0;color:#fff}
    .sfd h2 em{font-style:italic;color:#B9F542}
    .sfd-sub{color:#9BA89B;font-size:clamp(15px,1.7vw,18px);margin:18px 0 0;max-width:560px}
    .sfd-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px}
    .sfd-card{display:flex;flex-direction:column;background:rgba(255,255,255,.03);
      border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:26px;
      transition:transform .3s cubic-bezier(.16,1,.3,1),border-color .3s,background .3s;text-decoration:none}
    .sfd-card:hover{transform:translateY(-6px);background:rgba(185,245,66,.05);border-color:rgba(185,245,66,.4)}
    .sfd-ic{width:48px;height:48px;border-radius:13px;display:grid;place-items:center;
      margin-bottom:20px;background:rgba(185,245,66,.12)}
    .sfd-tag{font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#B9F542}
    .sfd-card h3{font-size:19px;font-weight:700;color:#fff;margin:9px 0 10px;line-height:1.25}
    .sfd-card p{font-size:14px;color:#9BA89B;line-height:1.6;flex:1;margin:0}
    .sfd-login{display:inline-flex;align-items:center;gap:7px;margin-top:16px;font-size:12px;
      color:#C7D2C7;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
      padding:7px 11px;border-radius:8px;font-family:'JetBrains Mono',ui-monospace,monospace}
    .sfd-cta{display:inline-flex;align-items:center;gap:7px;margin-top:20px;font-weight:700;
      font-size:14px;color:#B9F542}
    .sfd-cta svg{transition:transform .25s}
    .sfd-card:hover .sfd-cta svg{transform:translateX(4px)}
    @media(max-width:880px){.sfd-grid{grid-template-columns:1fr;gap:16px}}
  `;

  return (
    <section className="sfd">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="sfd-wrap">
        <span className="sfd-eyebrow">
          <span className="live" />
          Live demos
        </span>
        <h2>
          Don&apos;t take our word for it — <em>click around</em> a site we built.
        </h2>
        <p className="sfd-sub">
          Three live, fully working examples: a client&apos;s website, the dashboard they
          log into, and the console we use to run the whole operation.
        </p>

        <div className="sfd-grid">
          {demos.map((d) => (
            <a
              key={d.href}
              href={d.href}
              target="_blank"
              rel="noopener noreferrer"
              className="sfd-card"
            >
              <span className="sfd-ic">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#B9F542"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {d.icon}
                </svg>
              </span>
              <span className="sfd-tag">{d.tag}</span>
              <h3>{d.title}</h3>
              <p>{d.desc}</p>
              {d.login ? (
                <span className="sfd-login">🔑 {d.login} · demo</span>
              ) : null}
              <span className="sfd-cta">
                {d.cta}
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}