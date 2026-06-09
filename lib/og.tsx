import { ImageResponse } from "next/og";

import { siteName } from "@/lib/site-data";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

type OgImageInput = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
};

/**
 * Brand-consistent Open Graph card (royal blue + sky/cyan accents).
 * Uses inline styles only — `next/og` (Satori) does not support Tailwind classes.
 */
export function renderOgImage({ title, eyebrow, subtitle }: OgImageInput) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #0c1f4d 0%, #103a8c 55%, #0e7aa8 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.16)",
              fontSize: "30px",
              fontWeight: 800,
            }}
          >
            I
          </div>
          <div style={{ fontSize: "34px", fontWeight: 700, letterSpacing: "-0.5px" }}>
            {siteName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {eyebrow ? (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "8px 20px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.28)",
                fontSize: "24px",
                fontWeight: 600,
                color: "#cfe6ff",
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              fontSize: title.length > 48 ? "60px" : "76px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-1.5px",
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div style={{ fontSize: "30px", color: "rgba(255,255,255,0.82)", maxWidth: "960px" }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "26px",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          <span>Independent insurance guides</span>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>•</span>
          <span>insurhi.com</span>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
