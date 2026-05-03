"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Equipment } from "@/lib/equipment";

const PER_PAGE = 5;

export default function EquipmentCarousel({ items }: { items: Equipment[] }) {
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
    <div className="eq-carousel">
      <div className="eq-head">
        <div className="eq-meta">
          <span className="rn">No.</span>
          <span className="page">
            {String(page + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
          </span>
          <span className="dot">&middot;</span>
          <span className="count">{items.length} machines on register</span>
        </div>
        <div className="eq-controls">
          <button
            type="button"
            aria-label="Previous"
            onClick={prev}
            disabled={page === 0}
          >
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

      <div className="eq-track" ref={trackRef}>
        {items.map((it) => (
          <article className="eq-card" key={it.row}>
            <div className="eq-photo">
              <Image
                src={it.image}
                alt={`${it.model} — ${it.brand ?? "unbranded"}`}
                fill
                sizes="(max-width: 960px) 50vw, 240px"
              />
            </div>
            <div className="eq-rn">No. {String(it.row).padStart(2, "0")}</div>
            <h4 className="eq-model">{it.model}</h4>
            {it.brand && <div className="eq-brand">{it.brand}</div>}
            <div className="eq-foot">
              <span className="serial">{it.serial}</span>
              <span className="dot">&middot;</span>
              <span className="year">{it.year}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
