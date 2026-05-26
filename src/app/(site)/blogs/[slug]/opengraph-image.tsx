import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getBlogPost } from "@/lib/blogs";

// Image metadata
export const alt = "Huamei 華美 — Premium custom luxury packaging";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Per task constraint: don't pre-render all 81+ images at build. Force
// on-demand generation at request time. Cache Components is NOT enabled in
// this project (see next.config.ts), so the classic dynamic flag applies.
export const dynamic = "force-dynamic";

// Bound the title that gets rendered into the image. Blog titles in this
// project can be 1–2 sentences (~120 chars). At very long lengths the
// editorial serif gets crushed; pick a font size by length and trim
// pathological cases at ~160 chars so layout never overflows.
function pickTitleFontSize(title: string): number {
  const len = title.length;
  if (len <= 50) return 72;
  if (len <= 80) return 60;
  if (len <= 110) return 52;
  return 44;
}

function trimTitle(title: string, max = 160): string {
  if (title.length <= max) return title;
  return title.slice(0, max - 1).replace(/[\s,;:.—-]+\S*$/, "") + "…";
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  // Brand-palette tokens (mirrored from src/app/globals.css)
  const paper = "#F4EFE6";
  const ink = "#1A1614";
  const inkSoft = "#6B615A";
  const rule = "#C9BFB2";
  const foilGold = "#B08A3E";
  const foilGoldDeep = "#8F6E2B";

  // Load the brand mark from disk and embed as data URI so satori doesn't
  // need network access at render time.
  const sealPath = path.join(process.cwd(), "public", "huamei-mark-512.png");
  const sealBuffer = await readFile(sealPath);
  const sealDataUri = `data:image/png;base64,${sealBuffer.toString("base64")}`;

  // Graceful fallback: missing slug renders a default "Huamei journal" card
  // rather than a 500. Matches the site-wide OG aesthetic.
  const title = post ? trimTitle(post.title) : "The Huamei Journal";
  const kicker = post
    ? "Blogs · the Huamei journal"
    : "Notes from the press floor · since 1992";
  const authorName = post?.author?.name ?? "Sonia Sun";
  const authorRole = post?.author?.role ?? "Founder";
  const tenure = post?.author?.tenure ?? "since 1992";
  const byline = `By ${authorName}, ${authorRole} · ${tenure}`;

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
          background: paper,
          color: ink,
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Inner editorial frame */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: `0.5px solid ${rule}`,
            pointerEvents: "none",
          }}
        />

        {/* Brand seal — top right, like a stamp */}
        <img
          src={sealDataUri}
          width={130}
          height={130}
          alt=""
          style={{
            position: "absolute",
            top: 64,
            right: 72,
          }}
        />

        {/* Top kicker rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            fontSize: 20,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: inkSoft,
            maxWidth: 880,
          }}
        >
          <span style={{ width: 56, height: 1, background: foilGold }} />
          <span>{kicker}</span>
        </div>

        {/* Article title — center block, editorial italic-then-roman cadence
            matched to the site-wide OG. For per-article cards we render a
            single block (real titles, not pull-quotes). */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            maxWidth: 1040,
          }}
        >
          <div
            style={{
              fontSize: pickTitleFontSize(title),
              lineHeight: 1.08,
              letterSpacing: "-0.015em",
              color: ink,
              // Light italic flourish on the first character set via
              // wrapper — Satori doesn't support :first-letter, so we keep
              // it simple and uniform.
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer — byline left, wordmark right, separated by foil rule */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            paddingTop: 24,
            borderTop: `1px solid ${foilGold}`,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 22,
                color: ink,
                letterSpacing: "0.02em",
              }}
            >
              {byline}
            </div>
            <div
              style={{
                fontSize: 18,
                color: foilGoldDeep,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              huamei.io
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 30,
                letterSpacing: "0.3em",
                fontWeight: 500,
                color: ink,
                paddingLeft: "0.3em",
              }}
            >
              HUAMEI
            </div>
            <div
              style={{
                fontSize: 22,
                letterSpacing: "0.22em",
                color: foilGold,
              }}
            >
              華 美
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
