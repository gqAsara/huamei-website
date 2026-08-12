"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    src: "/photos/home-reference/footprint/01-factory-exterior.jpg",
    alt: "Huamei factory exterior and production base",
  },
  {
    src: "/photos/home-reference/footprint/02-office-team.jpg",
    alt: "Huamei office and design team",
  },
  {
    src: "/photos/home-reference/footprint/03-warehouse.jpg",
    alt: "Huamei finished goods warehouse",
  },
  {
    src: "/photos/home-reference/footprint/04-production-equipment.jpg",
    alt: "Huamei automated production equipment",
  },
  {
    src: "/photos/home-reference/footprint/05-quality-inspection.jpg",
    alt: "Huamei packaging quality inspection",
  },
  {
    src: "/photos/home-reference/footprint/06-global-shipping.jpg",
    alt: "Huamei finished packaging prepared for global shipping",
  },
];

export function FootprintCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const move = (direction: number) => {
    setActive((current) => (current + direction + SLIDES.length) % SLIDES.length);
  };

  return (
    <div
      className="premium-home__footprint-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Huamei global footprint"
    >
      <div className="premium-home__footprint-slides">
        {SLIDES.map((slide, index) => (
          <figure
            className={`premium-home__footprint-slide${index === active ? " is-active" : ""}`}
            aria-hidden={index !== active}
            key={slide.src}
          >
            <Image
              src={slide.src}
              alt={index === active ? slide.alt : ""}
              fill
              sizes="(max-width: 900px) 100vw, 52vw"
              priority={index === 0}
            />
          </figure>
        ))}
      </div>
      <div className="premium-home__carousel-controls">
        <div className="premium-home__carousel-count" aria-live="polite">
          <strong>{String(active + 1).padStart(2, "0")}</strong>
          <span>/ {String(SLIDES.length).padStart(2, "0")}</span>
        </div>
        <div className="premium-home__carousel-progress" aria-hidden="true">
          <i style={{ width: `${((active + 1) / SLIDES.length) * 100}%` }} />
        </div>
        <div className="premium-home__carousel-buttons">
          <button type="button" onClick={() => move(-1)} aria-label="Previous image">←</button>
          <button type="button" onClick={() => move(1)} aria-label="Next image">→</button>
        </div>
      </div>
    </div>
  );
}
