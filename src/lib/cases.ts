import { VOLUMES } from "./volumes";

export type CasePlate = {
  photo: string;
  caption: string;
  span?: "wide" | "full" | "tall" | "half";
};

export type CaseFrame = {
  photo: string;
  caption: string;
};

export type CaseNeighbour = {
  slug: string;
  name: string;
};

export type Case = {
  slug: string;
  number: string;
  client: string;
  name: string;
  tagline: string;
  year: number;
  month?: string;
  tags: string[];
  hero: string;
  ledger: string[];
  brief: string[];
  pullQuote: string;
  openingSequence: CaseFrame[];
  plates: CasePlate[];
  specification: Record<string, string>;
  prev: CaseNeighbour | null;
  next: CaseNeighbour | null;
};

export const CASES: Record<string, Case> = {};

export function getCase(slug: string): Case | null {
  return CASES[slug] ?? null;
}

export function getVolumeNeighbours(slug: string): { prev: CaseNeighbour | null; next: CaseNeighbour | null } {
  const idx = VOLUMES.findIndex((v) => v.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  const prevV = VOLUMES[idx - 1];
  const nextV = VOLUMES[idx + 1];
  return {
    prev: prevV ? { slug: prevV.slug, name: prevV.name } : null,
    next: nextV ? { slug: nextV.slug, name: nextV.name } : null,
  };
}
