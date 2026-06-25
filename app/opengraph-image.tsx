import { ImageResponse } from "next/og";

export const alt = "SiteForge AI — Websites for Australian Cleaning Businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0c1a0d 0%, #070d08 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 34, color: "#fff", fontWeight: 700 }}>
          <span style={{ color: "#c8f04b", marginRight: 12 }}>⚡</span>
          SiteForge <span style={{ color: "#CCFF00", marginLeft: 8 }}>AI</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, color: "#c8f04b", marginBottom: 22 }}>
            WEBSITES FOR AUSTRALIAN CLEANING BUSINESSES
          </div>
          <div style={{ fontSize: 64, color: "#fff", lineHeight: 1.05, fontWeight: 600, maxWidth: 900 }}>
            Get booked online. Live in 48 hours.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", fontSize: 30, color: "rgba(255,255,255,0.7)" }}>
          From{" "}
          <span style={{ color: "#c8f04b", fontWeight: 700, margin: "0 10px" }}>A$99/month</span> · no big upfront cost
        </div>
      </div>
    ),
    { ...size }
  );
}
