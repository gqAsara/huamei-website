"use client";

import { useState } from "react";
import type { CaseFrame } from "@/lib/cases";

export function CaseOpening({ frames }: { frames: CaseFrame[] }) {
  const [idx, setIdx] = useState(0);

  if (frames.length < 2) return null;

  return (
    <section className="cs-open" id="cs-open">
      <div className="cs-open-head">
        <h3>
          <em>Opening</em> the box.
        </h3>
        <div className="counter">
          <span>{String(idx + 1).padStart(2, "0")}</span> /{" "}
          <span>{String(frames.length).padStart(2, "0")}</span>
        </div>
      </div>
      <div className="cs-open-stage">
        {frames.map((f, i) => (
          <div
            key={i}
            className={`cs-open-frame${i === idx ? " on" : ""}`}
            style={{ backgroundImage: `url('${f.photo}')` }}
          />
        ))}
      </div>
      <div className="cs-open-captions">
        {frames.map((f, i) => (
          <button
            key={i}
            className={`cs-open-cap${i === idx ? " on" : ""}`}
            onClick={() => setIdx(i)}
          >
            <span className="n">{String(i + 1).padStart(2, "0")}.</span>
            <span className="c">{f.caption}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
