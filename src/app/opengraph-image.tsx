import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Pulse — AI News Signal Dashboard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0a0a0a",
          color: "#fafafa",
          padding: 80,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#bef264",
              color: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            P
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Pulse
          </div>
          <div
            style={{
              fontSize: 18,
              fontFamily: "monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#a1a1aa",
              border: "1px solid #27272a",
              borderRadius: 999,
              padding: "6px 14px",
              marginLeft: 12,
            }}
          >
            AI Intelligence
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            marginTop: 40,
          }}
        >
          <div
            style={{
              fontSize: 84,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 1000,
            }}
          >
            The signal layer for AI news.
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#a1a1aa",
              marginTop: 28,
              lineHeight: 1.3,
              maxWidth: 1000,
            }}
          >
            Hacker News · Reddit · TechCrunch · The Verge · ArXiv — deduplicated, ranked, refreshed every 5 minutes.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            fontFamily: "monospace",
            color: "#71717a",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <div>pulse · ai news intelligence</div>
          <div style={{ color: "#bef264" }}>● live</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
