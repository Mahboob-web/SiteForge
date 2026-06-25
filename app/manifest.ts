import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SiteForge AI",
    short_name: "SiteForge",
    description: "Websites for Australian cleaning businesses — live in 48 hours.",
    start_url: "/",
    display: "standalone",
    background_color: "#070d08",
    theme_color: "#070d08",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
