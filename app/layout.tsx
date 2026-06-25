import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Change this to your custom domain once connected (e.g. https://siteforge.com.au)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://site-forge-liard.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SiteForge AI — Websites for Australian Cleaning Businesses",
    template: "%s | SiteForge AI",
  },
  description:
    "AI-built websites that get cleaning businesses booked. Live in 48 hours, from A$99/month — no big upfront cost.",
  keywords: [
    "cleaning business website",
    "bond cleaning website",
    "website for cleaners Australia",
    "website as a service",
    "Australian cleaning marketing",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "SiteForge AI — Websites for Australian Cleaning Businesses",
    description:
      "AI-built websites that get cleaning businesses booked. Live in 48 hours, from A$99/month.",
    url: SITE_URL,
    siteName: "SiteForge AI",
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "SiteForge AI — Websites for Australian Cleaning Businesses",
    description:
      "AI-built websites that get cleaning businesses booked. Live in 48 hours, from A$99/month.",
  },
  robots: { index: true, follow: true },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "SiteForge AI",
  description:
    "AI-built websites for Australian cleaning businesses, provided as a monthly subscription (Website-as-a-Service).",
  url: SITE_URL,
  email: "hello@siteforge.com.au",
  areaServed: { "@type": "Country", name: "Australia" },
  serviceType: "Website design and hosting for cleaning businesses",
  priceRange: "A$99–A$249/month",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;1,9..144,300&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
