import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "sinapse.club — Comunidade de AI em Portugues";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          padding: "60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient accent bar top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
          }}
        />

        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            zIndex: 1,
          }}
        >
          {/* Brand name */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#fafafa",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            sinapse.club
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "28px",
              fontWeight: 400,
              color: "#a1a1aa",
              textAlign: "center",
              maxWidth: "800px",
              lineHeight: 1.4,
            }}
          >
            AI sem barreira. Comunidade sem fronteira.
          </div>

          {/* Separator */}
          <div
            style={{
              width: "80px",
              height: "2px",
              background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
              marginTop: "8px",
            }}
          />

          {/* Description */}
          <div
            style={{
              fontSize: "18px",
              color: "#71717a",
              textAlign: "center",
              maxWidth: "600px",
              lineHeight: 1.5,
            }}
          >
            Conteudo curado, traduzido e discutido por profissionais de AI em portugues.
          </div>
        </div>

        {/* Gradient accent bar bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #06B6D4, #7C3AED)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
