/**
 * VideoObject schema for embedded video assets.
 *
 * Google indexes videos via this JSON-LD on the host page (preferred
 * over deprecated video sitemaps). Required fields: name, description,
 * thumbnailUrl, uploadDate, contentUrl. Recommended: duration.
 */

const SITE = "https://huamei.io";

export type VideoSpec = {
  /** Slug-or-id used to build the @id; must be unique per page. */
  id: string;
  /** Display name / title shown in Google video carousels. */
  name: string;
  /** 1–2 sentence description. ~300 chars max. */
  description: string;
  /** Thumbnail / poster image, /public-relative or absolute. */
  thumbnailUrl: string;
  /** ISO 8601 upload date, e.g. "2026-05-02T18:12:00+08:00". */
  uploadDate: string;
  /** /public-relative or absolute URL of the video file. */
  contentUrl: string;
  /** The page that embeds the video. */
  embedPageUrl: string;
  /** ISO 8601 duration, e.g. "PT2M5S" for 2 min 5 sec. */
  duration?: string;
};

function abs(url: string): string {
  if (url.startsWith("http")) return url;
  return `${SITE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function videoObject(spec: VideoSpec) {
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${abs(spec.embedPageUrl)}#video-${spec.id}`,
    name: spec.name,
    description: spec.description,
    thumbnailUrl: abs(spec.thumbnailUrl),
    uploadDate: spec.uploadDate,
    contentUrl: abs(spec.contentUrl),
    embedUrl: abs(spec.embedPageUrl),
    publisher: { "@id": `${SITE}/#org` },
    inLanguage: "en",
  };
  if (spec.duration) node.duration = spec.duration;
  return node;
}
