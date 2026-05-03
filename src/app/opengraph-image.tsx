import { ImageResponse } from "next/og";

export const alt = "Huamei 華美 — Premium custom luxury packaging";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#F4EFE6",
          color: "#1A1614",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: "0.5px solid #C9BFB2",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            fontSize: 22,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#6B615A",
          }}
        >
          <span style={{ width: 56, height: 1, background: "#B08A3E" }} />
          <span>Vol. I &middot; Four Factories &middot; Since 1992</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 84,
              lineHeight: 0.96,
              letterSpacing: "-0.02em",
              fontStyle: "italic",
              color: "#1A1614",
              maxWidth: 980,
            }}
          >
            A box is not a container.
          </div>
          <div
            style={{
              fontSize: 84,
              lineHeight: 0.96,
              letterSpacing: "-0.02em",
              color: "#8F6E2B",
              maxWidth: 980,
            }}
          >
            It is the first sentence.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            paddingTop: 28,
            borderTop: "1px solid #B08A3E",
          }}
        >
          <div
            style={{
              fontSize: 36,
              letterSpacing: "0.3em",
              fontWeight: 500,
              color: "#1A1614",
              paddingLeft: "0.3em",
            }}
          >
            HUAMEI
          </div>
          <div
            style={{
              fontSize: 28,
              letterSpacing: "0.22em",
              color: "#B08A3E",
            }}
          >
            華 美
          </div>
        </div>
      </div>
    ),
    size,
  );
}
