import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(120% 120% at 70% -10%, rgba(200,240,75,0.10) 0%, transparent 55%), linear-gradient(180deg,#0c1a0d 0%,#070d08 100%)",
        color: "#fff",
        fontFamily: "Outfit, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c8f04b", margin: "0 0 18px" }}>
        Error 404
      </p>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(40px,8vw,72px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1, margin: "0 0 16px" }}>
        Page not found
      </h1>
      <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 420, lineHeight: 1.7, margin: "0 0 32px" }}>
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          background: "#c8f04b",
          color: "#0a1a10",
          fontWeight: 700,
          fontSize: 15,
          textDecoration: "none",
          padding: "13px 28px",
          borderRadius: 9999,
        }}
      >
        Back to home
      </Link>
    </div>
  );
}
