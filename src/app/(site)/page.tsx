"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { VOLUMES } from "@/lib/volumes";
import "./home.css";

const FEATURED_CASES = VOLUMES.filter((v) => v.featured);

type CapStage = {
  rn: string;
  lbl: string;
  verb: string;
  italic: string;
  desc: string;
  image: string;
};

const CAP_STAGES: CapStage[] = [
  {
    rn: "i.", lbl: "Consultation",
    verb: "We ", italic: "listen.",
    desc: "Bilingual account lead · brief intake · reference review · samples dispatched · budget & schedule framed before a line is drawn.",
    image: "/photos/consultation.jpg",
  },
  {
    rn: "ii.", lbl: "Design",
    verb: "We ", italic: "design.",
    desc: "Structural & graphic design · typography · material sourcing · white-model mock-up, then a working prototype in 72 hours.",
    image: "/photos/design-office-1.jpg",
  },
  {
    rn: "iii.", lbl: "The Press",
    verb: "We ", italic: "print.",
    desc: "Offset & digital presses, in-house plate-making, four- to eight-colour proofing. 22,000 m² across Henan, Zhejiang, Sichuan and Guizhou.",
    image: "/photos/press-die-cut-cropped.jpg",
  },
  {
    rn: "iv.", lbl: "Finishing",
    verb: "We ", italic: "finish.",
    desc: "Hot-foil in gold, copper, silver · blind & registered emboss · spot varnish · soft-touch · UV and die-cut.",
    image: "/photos/finishing-1.jpg",
  },
  {
    rn: "v.", lbl: "Assembly",
    verb: "We ", italic: "hand-assemble.",
    desc: "Closures, ribbon, magnets, lining, inserts, wrapping. One hundred and twenty craftsmen in the factory — everything that a machine cannot do.",
    image: "/photos/assembly-1.jpg",
  },
  {
    rn: "vi.", lbl: "Fulfilment",
    verb: "We ", italic: "ship.",
    desc: "DDP on request · tracked global freight · quality hold & warehousing. Fastest delivery in two weeks from sample to dispatch.",
    image: "/photos/fulfilment-1.jpg",
  },
];

type CraftCard = {
  rn: string;
  lbl: string;
  num: string;
  href: string;
  image?: string;
  tone?: string;
  plate?: string;
};

const CRAFT_CARDS: CraftCard[] = [
  { rn: "I.",   lbl: "Rigid & telescoping",   num: "14", href: "/craft/rigid",     image: "/photos/case-01-fragrance-souverain.jpg" },
  { rn: "II.",  lbl: "Magnetic closure",      num: "11", href: "/craft/magnetic",  image: "/photos/bronze-jar-black-box.jpg" },
  { rn: "III.", lbl: "Drawer & slipcase",     num: "9",  href: "/craft/drawer",    image: "/photos/huamei-pink-drawer.jpg" },
  { rn: "IV.",  lbl: "Folding cartons",       num: "22", href: "/craft/folding",   image: "/photos/757-cream-box.jpg" },
  { rn: "V.",   lbl: "Shoppers & carriers",   num: "12", href: "/craft/shoppers",  image: "/photos/shopper-sophisticated.jpg" },
  { rn: "VI.",  lbl: "Book-style & clamshell", num: "7", href: "/craft/book",      tone: "tone-paper", plate: "B O O K — S T Y L E" },
  { rn: "VII.", lbl: "Inserts & cradles",     num: "18", href: "/craft/inserts",   tone: "tone-sage",  plate: "I N S E R T S" },
];

export default function Home() {
  const [capIdx, setCapIdx] = useState(0);
  const [caseIdx, setCaseIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const cap = CAP_STAGES[capIdx];

  function scrollCraft(dir: number) {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector(".hcar-card") as HTMLElement | null;
    const step = (card?.offsetWidth ?? 280) + 22;
    t.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  }

  return (
    <>
      {/* Hero */}
      <section className="context-hero">
        <div className="photo">
          <Image
            src="/photos/house-showroom.jpg"
            alt="Huamei showroom — one of four factories"
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className="veil" />
        <div className="context-body">
          <div className="eyebrow">
            <span className="rule" /> I &nbsp; · &nbsp; T H E &nbsp; H O U S E &nbsp; · &nbsp; S I N C E &nbsp; 1 9 9 2
          </div>
          <h1>
            The shape of a<br />
            <em>promise becoming</em> physical.
          </h1>
          <p className="sub">
            A packaging house for founder-led brands in cosmetic &amp; skincare, wine
            spirits &amp; tea, seasonal gifting, and wellness. Thirty-four years of
            work for Fortune 500 distributors — now, directly for you.
          </p>
          <div className="hero-meta">
            <span>Henan &middot; Zhejiang &middot; Sichuan &middot; Guizhou</span>
            <span className="dot">&middot;</span>
            <span>22,000 m²</span>
            <span className="dot">&middot;</span>
            <span>3,000+ people</span>
            <span className="dot">&middot;</span>
            <span className="cn">包 · 装 · 如 · 禮</span>
          </div>
        </div>
      </section>

      {/* §I House — full-bleed band */}
      <section className="sec sec-house">
        <div className="sec-video">
          <div className="sec-video-photo">
            <Image
              src="/photos/factory-floor.jpg"
              alt="A Huamei press floor — one of four factories"
              fill
              sizes="100vw"
            />
          </div>
          <div className="sec-video-veil" />
          <div className="sec-video-over">
            <div className="eyebrow">
              <span className="rn">i.</span>T H E &nbsp; F L O O R
            </div>
            <h2>
              22,000 m² of <em>paper &amp; ink,</em> across four provinces.
            </h2>
            <div className="house-facts">
              <div><span className="n">34</span><span className="l">Years of making</span></div>
              <div><span className="n">22,000 m²</span><span className="l">Press floor</span></div>
              <div><span className="n">3,000<span className="u">+</span></span><span className="l">Craftsmen on site</span></div>
              <div><span className="n">2<span className="u">wk</span></span><span className="l">Fastest delivery</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* §II Craft — horizontal carousel */}
      <section className="sec sec-craft">
        <div className="sec-head">
          <div className="eyebrow">
            <span className="rn">ii.</span>C R A F T &nbsp; · &nbsp; N I N E T Y — N I N E &nbsp; S T R U C T U R E S
          </div>
          <h2>A box is <em>not a container.</em></h2>
          <p>Each form is chosen for the gesture it asks a buyer to make. Corrections are free.</p>
        </div>
        <div className="hcar">
          <div className="hcar-track" ref={trackRef} tabIndex={0}>
            {CRAFT_CARDS.map((c) => (
              <Link key={c.rn} className="hcar-card" href={c.href}>
                {c.image ? (
                  <div className="img" style={{ backgroundImage: `url('${c.image}')` }} />
                ) : (
                  <div className={`img ${c.tone ?? ""}`}>
                    <span className="plate-label">{c.plate}</span>
                  </div>
                )}
                <div className="meta">
                  <span className="rn">{c.rn}</span>
                  <span className="lbl">{c.lbl}</span>
                  <span className="num">{c.num}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="hcar-foot">
            <Link className="link" href="/craft">See all structures →</Link>
            <div className="hcar-nav">
              <button className="hcar-btn" onClick={() => scrollCraft(-1)} aria-label="Previous">←</button>
              <button className="hcar-btn" onClick={() => scrollCraft(1)} aria-label="Next">→</button>
            </div>
          </div>
        </div>
      </section>

      {/* §III Process — flip-stage */}
      <section className="sec sec-caps">
        <div className="sec-col">
          <div className="eyebrow">
            <span className="rn">iii.</span>T H E &nbsp; P R O C E S S
          </div>
          <h2>From <em>sketch</em> to sealed crate.</h2>
          <p>Six stages under one roof — brief to dispatch, with bilingual account craft at every step.</p>
          <div className="cr-carousel">
            {CAP_STAGES.map((s, i) => (
              <button
                key={s.rn}
                className={`cr-row${i === capIdx ? " on" : ""}`}
                onClick={() => setCapIdx(i)}
              >
                <span className="diag">
                  <svg viewBox="0 0 52 36" fill="none" stroke="currentColor" strokeWidth="0.8">
                    <path d="M8 10 L38 10 L42 14 L42 26 L12 26 L8 22 Z" />
                    <path d="M14 16 L34 16 M14 20 L30 20" />
                  </svg>
                </span>
                <span className="lbl">{s.lbl}</span>
                <span className="num">{s.rn}</span>
              </button>
            ))}
          </div>
          <Link className="link" href="/craft">See the catalogue →</Link>
        </div>
        <div className="sec-photo">
          <div className="caps-plate tone-photo">
            {CAP_STAGES.map((s, i) => (
              <div
                key={s.rn}
                className={`caps-plate-img${i === capIdx ? " on" : ""}`}
                style={{ backgroundImage: `url('${s.image}')` }}
              />
            ))}
          </div>
          <div className="caps-stage-cap">
            <div className="verb">
              <span className="rn">{cap.rn}</span>
              {cap.verb}
              <em>{cap.italic}</em>
            </div>
            <div className="desc">{cap.desc}</div>
          </div>
        </div>
      </section>

      {/* §IV Case studies — typographic-index turn, auto-pulled from VOLUMES.featured */}
      <section className="sec sec-volumes">
        <div className="sec-head">
          <div className="eyebrow">
            <span className="rn">iv.</span>C A S E &nbsp; S T U D I E S &nbsp; · &nbsp; S E L E C T E D &nbsp; W O R K
          </div>
          <h2>
            <em>Case studies.</em>
          </h2>
          <p>A short contents page — hover a title, turn the page.</p>
        </div>
        <div className="tix">
          <div className="tix-index" role="listbox" aria-label="Case studies">
            <div className="tix-top-rule" />
            {FEATURED_CASES.map((l, i) => (
              <button
                key={l.slug}
                className={`tix-row${i === caseIdx ? " on" : ""}`}
                onClick={() => setCaseIdx(i)}
                onMouseEnter={() => setCaseIdx(i)}
              >
                <span className="tix-rn">{l.num}.</span>
                <span className="tix-body">
                  <span className="tix-name">{l.name}</span>
                  <span className="tix-tag">{l.tag}</span>
                </span>
                <span className="tix-year">{l.year}</span>
              </button>
            ))}
            <div className="tix-bot-rule" />
            <Link className="link tix-seeall" href="/volumes">See all case studies →</Link>
          </div>
          <div className="tix-stage">
            <div className="tix-book">
              {FEATURED_CASES.map((l, i) => (
                <Link
                  key={l.slug}
                  href={`/volumes/${l.slug}`}
                  className={`tix-leaf${i === caseIdx ? " on" : ""}`}
                  aria-hidden={i !== caseIdx}
                  tabIndex={i === caseIdx ? 0 : -1}
                >
                  <div className="tix-photo" style={{ backgroundImage: `url('${l.cover}')` }} />
                  <div className="tix-caption">
                    <div className="tix-foil-rule" />
                    <div className="tix-client">{l.client}</div>
                    <h3 className="tix-h">{l.name}</h3>
                    <div className="tix-meta">
                      <span>{l.tag}</span>
                      <span>{l.year}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="tix-num">
              <span>{String(caseIdx + 1).padStart(2, "0")}</span>
              <span className="tix-sep">/</span>
              <span>{String(FEATURED_CASES.length).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* §V Industry — clickable category tiles with line-art icons */}
      <section className="sec sec-industry">
        <div className="sec-industry-inner">
          <div className="left">
            <div className="eyebrow">
              <span className="rn">v.</span>I N D U S T R Y
            </div>
            <h2>We know <em>your</em> category.</h2>
            <p>
              Categories we serve most often — each with its own structural vocabulary,
              schedule, and press-floor muscle memory.
            </p>
          </div>
          <ul className="cats">
            <li>
              <Link href="/industry/cosmetic">
                <span className="rn">i.</span>
                <span className="ico" aria-hidden="true">
                  {/* Cosmetic — slim serum bottle with pump and label band */}
                  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="miter">
                    <path d="M17 6 H23 V11 H17 Z" />
                    <path d="M19 11 H21 V14 H19 Z" />
                    <path d="M14 14 H26 V33 H14 Z" />
                    <path d="M14 21 H26" />
                    <path d="M14 28 H26" />
                  </svg>
                </span>
                <span className="t">Cosmetic &amp; skincare</span>
                <span className="meta">Skin &middot; make-up</span>
                <span className="arr">→</span>
              </Link>
            </li>
            <li>
              <Link href="/industry/spirits">
                <span className="rn">ii.</span>
                <span className="ico" aria-hidden="true">
                  {/* Wine, spirits & tea — bottle with shoulder + label */}
                  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="miter">
                    <path d="M18 4 H22 V12 L25 16 V34 H15 V16 L18 12 Z" />
                    <path d="M15 21 H25 V28 H15 Z" />
                  </svg>
                </span>
                <span className="t">Wine, spirits &amp; tea</span>
                <span className="meta">Bottle &middot; box</span>
                <span className="arr">→</span>
              </Link>
            </li>
            <li>
              <Link href="/industry/seasonal">
                <span className="rn">iii.</span>
                <span className="ico" aria-hidden="true">
                  {/* Seasonal & gifting — flat-lid box with crossed ribbon and bow */}
                  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="miter">
                    <path d="M8 14 H32 V34 H8 Z" />
                    <path d="M20 14 V34" />
                    <path d="M8 22 H32" />
                    <path d="M16 14 C16 9, 20 9, 20 14" />
                    <path d="M24 14 C24 9, 20 9, 20 14" />
                  </svg>
                </span>
                <span className="t">Seasonal &amp; gifting</span>
                <span className="meta">CNY &middot; holiday</span>
                <span className="arr">→</span>
              </Link>
            </li>
            <li>
              <Link href="/industry/wellness">
                <span className="rn">iv.</span>
                <span className="ico" aria-hidden="true">
                  {/* Wellness — slim stem with a single elegant leaf */}
                  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round">
                    <path d="M20 6 V34" />
                    <path d="M20 18 C12 18, 10 12, 14 8 C20 8, 21 14, 20 18 Z" />
                  </svg>
                </span>
                <span className="t">Wellness</span>
                <span className="meta">Botanical &middot; supplement</span>
                <span className="arr">→</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* §VI Blogs — sage plate */}
      <section className="sec sec-sustain">
        <div className="sustain-inner">
          <div
            className="sustain-photo"
            style={{ backgroundImage: "url('/photos/blog-showroom.jpg')" }}
          />
          <div className="sustain-copy">
            <div className="eyebrow">
              <span className="rn">vi.</span>B L O G S
            </div>
            <blockquote>
              Notes from the press floor — <em>posted</em> when there is something
              worth saying.
            </blockquote>
            <p>
              Production and process, the people we work with, the projects we
              ship, sustainability with receipts, and news from the four floors.
              Five sections, one floor.
            </p>
            <div className="chips">
              <span>P R O D U C T I O N</span>
              <span>P E O P L E</span>
              <span>C U S T O M E R &nbsp; S U C C E S S</span>
              <span>S U S T A I N A B I L I T Y</span>
              <span>N E W S</span>
            </div>
            <Link className="link" href="/blogs" style={{ marginTop: 18, display: "inline-block" }}>
              Read the blogs →
            </Link>
          </div>
        </div>
      </section>

      {/* §VII Start CTA */}
      <section className="sec sec-start">
        <div className="start-inner">
          <div className="eyebrow">
            <span className="rn">vii.</span>S T A R T &nbsp; Y O U R &nbsp; D E S I G N
          </div>
          <h2>
            Begin with a <em>sketch,</em> a reference, or a structure on file.
          </h2>
          <p>
            Minimum order 300 pcs &nbsp;&middot;&nbsp; Fastest delivery in 2 wks
            &nbsp;&middot;&nbsp; Corrections are free.
          </p>
          <div className="start-actions">
            <Link className="hm-plate inv" href="/begin">
              <span className="roman">→</span>Begin a Project
            </Link>
            <a className="start-mail" href="mailto:info@huamei.io">
              info@huamei.io
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
