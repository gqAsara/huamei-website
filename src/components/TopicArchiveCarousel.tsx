"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TopicRelated } from "@/lib/topics";

export function TopicArchiveCarousel({ related }: { related: TopicRelated[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const total = el.scrollWidth;
    const view = el.clientWidth;
    setPages(Math.max(1, Math.ceil(total / view)));
    setPage(view > 0 ? Math.round(el.scrollLeft / view) : 0);
  }, []);

  useEffect(() => {
    measure();
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const view = el.clientWidth;
      if (view > 0) setPage(Math.round(el.scrollLeft / view));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [measure, related.length]);

  const scrollByPage = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="tp-related-carousel" aria-label="Cases in this category">
      <div className="tp-related-track" ref={trackRef}>
        {related.map((r) => (
          <Link key={r.href} className="tp-rel" href={r.href}>
            <div className="cover" style={{ backgroundImage: `url('${r.cover}')` }}>
              <span className="rn">{r.rn}</span>
            </div>
            <div className="meta">
              <span>{r.category}</span>
              <span>{r.year}</span>
            </div>
            <h4>{r.name}</h4>
            <div className="tag">{r.tag}</div>
          </Link>
        ))}
      </div>

      {pages > 1 ? (
        <div className="tp-related-controls">
          <span className="count">
            {related.length} {related.length === 1 ? "case" : "cases"}
            <span className="dot">&middot;</span>
            {String(page + 1).padStart(2, "0")} / {String(pages).padStart(2, "0")}
          </span>
          <div className="btns">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              disabled={page === 0}
              aria-label="Previous cases"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              disabled={page >= pages - 1}
              aria-label="Next cases"
            >
              ›
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
