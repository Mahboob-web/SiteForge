import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SiteForge AI — Websites for Australian Cleaning Businesses",
  description: "AI-built websites that get cleaning businesses booked. Live in 48 hours, from A$99/month — no big upfront cost.",
  openGraph: {
    title: "SiteForge AI — Websites for Australian Cleaning Businesses",
    description: "AI-built websites that get cleaning businesses booked. Live in 48 hours, from A$99/month.",
    type: "website",
    locale: "en_AU",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;1,9..144,300&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
