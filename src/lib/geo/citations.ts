/**
 * Citation parser. Given a probe response (text + citedUrls list), figure out:
 *  - did the response cite huamei.io?
 *  - did it mention "Huamei" by name without a URL?
 *  - what's the surrounding context where Huamei appears?
 *  - which configured competitors got cited?
 */

const OUR_DOMAINS = ["huamei.io", "www.huamei.io"];
const OUR_BRAND_NAMES = ["Huamei", "華美", "huamei"];

export type CompetitorMatch = { brand: string; domain: string };

export type CitationAnalysis = {
  ourDomainCited: boolean;
  ourBrandMentioned: boolean;
  ourCitationContext: string;
  competitorsCited: CompetitorMatch[];
};

export type CompetitorDef = { brand: string; domains: string[] };

function hostFromUrl(u: string): string | null {
  try {
    return new URL(u).host.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

function domainMatches(host: string, domain: string): boolean {
  const normDomain = domain.toLowerCase().replace(/^www\./, "");
  return host === normDomain || host.endsWith(`.${normDomain}`);
}

/**
 * Pull the sentence(s) around the first appearance of any brand name or
 * domain. Returns at most ~2 surrounding sentences, ~280 chars.
 */
function contextAroundBrand(text: string): string {
  if (!text) return "";
  const lc = text.toLowerCase();
  // Find first hit on either a brand name or a domain.
  const needles = [
    ...OUR_BRAND_NAMES.map((b) => b.toLowerCase()),
    ...OUR_DOMAINS,
  ];
  let firstHit = -1;
  for (const n of needles) {
    const i = lc.indexOf(n.toLowerCase());
    if (i >= 0 && (firstHit < 0 || i < firstHit)) firstHit = i;
  }
  if (firstHit < 0) return "";

  // Walk back to a sentence boundary; walk forward two sentence boundaries.
  let start = firstHit;
  while (start > 0 && !/[.!?\n]/.test(text[start - 1])) start--;
  let end = firstHit;
  let sentences = 0;
  while (end < text.length && sentences < 2) {
    if (/[.!?\n]/.test(text[end])) sentences++;
    end++;
  }
  return text.slice(start, Math.min(end, start + 280)).trim();
}

export function analyzeCitations(
  responseText: string,
  citedUrls: string[],
  competitors: CompetitorDef[],
): CitationAnalysis {
  // 1. Did any URL in citedUrls match our domain?
  let ourDomainCited = false;
  for (const u of citedUrls) {
    const host = hostFromUrl(u);
    if (!host) continue;
    if (OUR_DOMAINS.some((d) => domainMatches(host, d))) {
      ourDomainCited = true;
      break;
    }
  }

  // 2. Was "Huamei" or 華美 mentioned in the response text?
  const lc = responseText.toLowerCase();
  const ourBrandMentioned = OUR_BRAND_NAMES.some((b) =>
    lc.includes(b.toLowerCase()),
  );

  // 3. Context around our brand/domain (when present).
  const ourCitationContext =
    ourBrandMentioned || ourDomainCited ? contextAroundBrand(responseText) : "";

  // 4. Competitor citations.
  const competitorsCited: CompetitorMatch[] = [];
  for (const comp of competitors) {
    for (const d of comp.domains) {
      for (const u of citedUrls) {
        const host = hostFromUrl(u);
        if (host && domainMatches(host, d)) {
          competitorsCited.push({ brand: comp.brand, domain: d });
          break;
        }
      }
    }
  }

  return {
    ourDomainCited,
    ourBrandMentioned,
    ourCitationContext,
    competitorsCited,
  };
}
