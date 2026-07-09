import { ImageResponse } from "next/og";

export const alt = "Mobix — Platform Aplikasi Android Komunitas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #01875f 0%, #00a373 50%, #00c488 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "24px",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            M
          </div>
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "white",
              margin: 0,
              letterSpacing: "-2px",
            }}
          >
            Mobix
          </h1>
        </div>
        <p
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.9)",
            margin: 0,
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
          }}
        >
          Platform Distribusi Aplikasi Mobile Berbasis Komunitas
        </p>
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.8)",
              padding: "8px 20px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            Upload & Download APK
          </span>
          <span
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.8)",
              padding: "8px 20px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            Komunitas Indonesia
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
