"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { VOLUMES, type Volume } from "@/lib/volumes";
import "./volumes.css";

const YEARS = ["all", "2025", "2024"] as const;
const CATS = [
  "all",
  "Cosmetics",
  "Skincare",
  "Spirits",
  "Tea",
  "Wellness",
  "Gifting",
] as const;

type View = "list" | "grid";

const SECTIONS: { id: "dtc" | "branded"; label: string; kicker: string }[] = [
  { id: "dtc",     label: "DTC Brand",       kicker: "House & emerging" },
  { id: "branded", label: "Maison clients",  kicker: "Maison & global" },
];

export default function VolumesPage() {
  const [year, setYear] = useState<string>("all");
  const [cat, setCat] = useState<string>("all");
  const [view, setView] = useState<View>("list");

  const rows = useMemo(
    () =>
      VOLUMES.filter(
        (v) =>
          (year === "all" || String(v.year) === year) &&
          (cat === "all" || v.category === cat),
      ),
    [year, cat],
  );

  const grouped = useMemo(() => {
    const out: Record<"dtc" | "branded", Volume[]> = { dtc: [], branded: [] };
    for (const v of rows) out[v.section].push(v);
    return out;
  }, [rows]);

  return (
    <main className="vol-wrap">
      <section className="vol-mast">
        <div>
          <div className="rn">Archive &middot; IV</div>
          <h1>Case studies.</h1>
        </div>
        <div>
          <div className="count">
            <span>{rows.length}</span> entries &middot; 2024 — 2025
          </div>
          <p className="intro">
            A running ledger of work. Every volume is a closed book; every drawer pulled
            left a record behind.
          </p>
        </div>
      </section>

      <section className="vol-filters">
        <div className="vol-filter-group">
          <span className="lbl">Year</span>
          {YEARS.map((y) => (
            <button
              key={y}
              className={year === y ? "on" : undefined}
              onClick={() => setYear(y)}
            >
              {y === "all" ? "All" : y}
            </button>
          ))}
        </div>
        <div className="vol-filter-group">
          <span className="lbl">Category</span>
          {CATS.map((c) => (
            <button
              key={c}
              className={cat === c ? "on" : undefined}
              onClick={() => setCat(c)}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
        <div className="vol-view-toggle">
          <span className="lbl">View</span>
          <button
            className={view === "list" ? "on" : undefined}
            onClick={() => setView("list")}
          >
            Ledger
          </button>
          <button
            className={view === "grid" ? "on" : undefined}
            onClick={() => setView("grid")}
          >
            Plates
          </button>
        </div>
      </section>

      {rows.length === 0 ? (
        <div className="vol-empty">Nothing in this register. Yet.</div>
      ) : (
        SECTIONS.map((s) => {
          const group = grouped[s.id];
          if (!group.length) return null;
          return (
            <div key={s.id} className="vol-section">
              <header className="vol-section-head">
                <span className="kicker">{s.kicker}</span>
                <h2>{s.label}</h2>
                <span className="cnt">{group.length}</span>
              </header>

              {view === "list" ? (
                <section className="vol-list">
                  {group.map((v) => (
                    <Link key={v.slug} className="row" href={`/volumes/${v.slug}`}>
                      <span className="rn">{v.num}.</span>
                      <span className="ttl">
                        <span className="name">{v.name}</span>
                        <span className="client">{v.client}</span>
                      </span>
                      <span className="tag">{v.tag}</span>
                      <span className="year">{v.year}</span>
                      <span className="thumb" style={{ backgroundImage: `url('${v.cover}')` }} />
                    </Link>
                  ))}
                </section>
              ) : (
                <section className="vol-grid">
                  {group.map((v) => (
                    <Link key={v.slug} className="vol-card" href={`/volumes/${v.slug}`}>
                      <div className="cover" style={{ backgroundImage: `url('${v.cover}')` }}>
                        <span className="rn">{v.num}.</span>
                      </div>
                      <div className="meta-row">
                        <span>{v.category}</span>
                        <span>{v.year}</span>
                      </div>
                      <h3>{v.name}</h3>
                      <div className="tag">{v.tag}</div>
                    </Link>
                  ))}
                </section>
              )}
            </div>
          );
        })
      )}

      <section className="vol-cta">
        <div className="kicker">Projects open &middot; Vol. XV</div>
        <h4>Begin your volume.</h4>
        <p>
          Every piece of work in this archive began as a conversation. Tell us what
          you&rsquo;re making and we&rsquo;ll put a first sample in your hands within
          six weeks.
        </p>
        <Link className="begin" href="/begin">
          Begin a conversation <span className="arrow">→</span>
        </Link>
      </section>
    </main>
  );
}
