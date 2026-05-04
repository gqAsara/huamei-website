"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export function CaseCarousel({ photos, alt }: { photos: string[]; alt?: string }) {
  const [i, setI] = useState(0);
  const n = photos.length;

  const prev = useCallback(() => setI((x) => (x - 1 + n) % n), [n]);
  const next = useCallback(() => setI((x) => (x + 1) % n), [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <section className="cs-carousel" aria-label={alt ? `${alt} — photo carousel` : "Photo carousel"}>
      <Image
        className="cs-carousel-frame"
        src={photos[i]}
        alt={`${alt ?? "Photo"} ${i + 1} of ${n}`}
        fill
        sizes="(max-width: 760px) 100vw, 1200px"
        priority={i === 0}
      />
      {n > 1 ? (
        <>
          <button className="cs-carousel-btn prev" onClick={prev} aria-label="Previous photo">
            ‹
          </button>
          <button className="cs-carousel-btn next" onClick={next} aria-label="Next photo">
            ›
          </button>
          <div className="cs-carousel-dots" role="tablist">
            {photos.map((_, k) => (
              <button
                key={k}
                className={k === i ? "on" : undefined}
                onClick={() => setI(k)}
                aria-label={`Photo ${k + 1}`}
                aria-selected={k === i}
                role="tab"
              />
            ))}
          </div>
          <div className="cs-carousel-counter">
            {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </div>
        </>
      ) : null}
    </section>
  );
}
