import { ImageResponse } from "next/og";
import { SITE_NAME } from "./site-config";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 68% 48%, rgba(0,224,199,0.34), transparent 28%), radial-gradient(circle at 48% 34%, rgba(184,154,255,0.22), transparent 26%), linear-gradient(135deg, #080510 0%, #0D0820 48%, #1A1235 100%)",
          color: "#F7F3FF",
          display: "flex",
          fontFamily: "Arial, Helvetica, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "76px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 18,
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                background: "#00E0C7",
                borderRadius: 999,
                boxShadow: "0 0 32px rgba(0,224,199,0.9)",
                height: 18,
                width: 18,
              }}
            />
            <span style={{ color: "#EDEAF5", fontSize: 28, fontWeight: 700 }}>
              {SITE_NAME}
            </span>
          </div>
          <div
            style={{
              color: "#F7F3FF",
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -1,
              lineHeight: 0.96,
              maxWidth: 720,
            }}
          >
            Ambient sounds for quiet breaks.
          </div>
          <div style={{ color: "#B8B5C7", fontSize: 30, lineHeight: 1.35, maxWidth: 660 }}>
            Mix sounds, breathe for a bit, set a timer, and keep notes private.
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            border: "1px solid rgba(237,234,245,0.1)",
            borderRadius: 999,
            display: "flex",
            height: 360,
            justifyContent: "center",
            position: "relative",
            width: 360,
          }}
        >
          <div
            style={{
              background:
                "radial-gradient(circle, #05020A 0%, #05020A 37%, rgba(0,224,199,0.32) 39%, rgba(255,184,122,0.24) 48%, rgba(184,154,255,0.08) 62%, transparent 70%)",
              borderRadius: 999,
              boxShadow: "0 0 90px rgba(0,224,199,0.26)",
              height: 280,
              width: 280,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
