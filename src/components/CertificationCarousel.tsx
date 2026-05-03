"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Certification } from "@/lib/certifications";

const PER_PAGE = 4;

export default function CertificationCarousel({ items }: { items: Certification[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(items.length / PER_PAGE);

  const scrollToPage = useCallback((p: number) => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[p * PER_PAGE] as HTMLElement | undefined;
    if (!child) return;
    track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, []);

  const next = () => {
    const p = Math.min(page + 1, totalPages - 1);
    setPage(p);
    scrollToPage(p);
  };
  const prev = () => {
    const p = Math.max(page - 1, 0);
    setPage(p);
    scrollToPage(p);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const w = track.clientWidth;
      const p = Math.round(track.scrollLeft / w);
      setPage(Math.max(0, Math.min(totalPages - 1, p)));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [totalPages]);

  return (
    <div className="cert-carousel">
      <div className="cert-head">
        <div className="cert-meta">
          <span className="rn">No.</span>
          <span className="page">
            {String(page + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
          </span>
          <span className="dot">&middot;</span>
          <span className="count">{items.length} on file</span>
        </div>
        <div className="cert-controls">
          <button type="button" aria-label="Previous" onClick={prev} disabled={page === 0}>
            ←
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={next}
            disabled={page === totalPages - 1}
          >
            →
          </button>
        </div>
      </div>

      <div className="cert-track" ref={trackRef}>
        {items.map((c, i) => (
          <article className="cert-card" key={c.id}>
            <div className="cert-photo">
              <Image
                src={c.image}
                alt={`${c.name} — ${c.body}`}
                fill
                sizes="(max-width: 960px) 50vw, 280px"
              />
            </div>
            <div className="cert-rn">No. {String(i + 1).padStart(2, "0")}</div>
            <h4 className="cert-name">{c.name}</h4>
            <div className="cert-body">{c.body}</div>
            <div className="cert-scope">{c.scope}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
