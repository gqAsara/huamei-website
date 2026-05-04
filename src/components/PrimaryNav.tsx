"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navCategories, type NavCategory } from "@/lib/nav";

export function PrimaryNav() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastPath, setLastPath] = useState<string | null>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const pathname = usePathname();
  const activeKey = activeKeyFor(pathname);

  // Close drawer/menus on route change — done during render so React batches
  // it into the same commit, instead of triggering a cascading re-render via
  // setState-in-useEffect (which the lint rule rightly flags).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (drawerOpen) setDrawerOpen(false);
    if (openKey) setOpenKey(null);
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target as Node)) setOpenKey(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenKey(null);
        setDrawerOpen(false);
      }
    }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [drawerOpen]);

  function toggle(key: string) {
    setOpenKey((prev) => (prev === key ? null : key));
  }

  return (
    <nav className={`hm-nav${drawerOpen ? " drawer-open" : ""}`} id="nav">
      <div className="hm-nav-inner">
        <Link className="hm-wm" href="/">
          <span className="lat">Huamei</span>
          <span className="bar" />
          <img
            src="/huamei-mark-512.png"
            alt="華美"
            width={40}
            height={40}
            className="seal"
          />
        </Link>

        <ul className="hm-primary" ref={navRef}>
          {navCategories.map((cat) => {
            const classes = [
              openKey === cat.key ? "open" : "",
              activeKey === cat.key ? "active" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <li key={cat.key} className={classes || undefined}>
                {cat.href ? (
                  <Link href={cat.href}>{cat.label}</Link>
                ) : (
                  <>
                    <button
                      aria-expanded={openKey === cat.key}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(cat.key);
                      }}
                    >
                      {cat.label} <span className="caret" />
                    </button>
                    <Dropdown category={cat} />
                  </>
                )}
              </li>
            );
          })}
        </ul>

        <div className="hm-cta-cluster">
          <Link className="hm-plate" href="/begin">
            <span className="roman">→</span>
            Begin
          </Link>
        </div>

        <button
          className="hm-burger"
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`hm-drawer${drawerOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!drawerOpen}
      >
        <div className="hm-drawer-inner">
          <ul className="hm-drawer-list">
            {navCategories.map((cat) => (
              <li
                key={cat.key}
                className={activeKey === cat.key ? "active" : undefined}
              >
                <Link href={cat.href ?? `/${cat.key}`}>
                  <span className="lbl">{cat.label}</span>
                  <span className="arr">→</span>
                </Link>
              </li>
            ))}
            <li className="hm-drawer-cta">
              <Link className="hm-plate" href="/begin">
                <span className="roman">→</span> Begin a project
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function activeKeyFor(pathname: string): string | null {
  if (pathname.startsWith("/craft")) return "craft";
  if (pathname.startsWith("/industry")) return "industry";
  if (pathname.startsWith("/margin")) return "margin";
  if (pathname.startsWith("/house")) return "house";
  if (pathname.startsWith("/volumes")) return "volumes";
  return null;
}

function Dropdown({ category }: { category: NavCategory }) {
  if (!category.columns) return null;
  const widthClass =
    category.width === "xwide" ? " xwide" : category.width === "wide" ? " wide" : "";
  return (
    <div className={`hm-drop${widthClass}`} role="menu">
      <div className="hm-drop-inner">
        {category.columns.map((col) => (
          <div className="hm-col" key={col.heading}>
            <h4>
              <span className="roman">{col.roman}</span>
              {col.heading}
            </h4>
            <ul>
              {col.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span>
                      {item.label}
                      {item.italic ? <em>{item.italic}</em> : null}
                    </span>
                    {item.meta ? <span className="meta">{item.meta}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {category.feature ? (
          <div className="hm-feature">
            <div className="plate-eyebrow">
              <span>
                <span className="gold">Featured</span> &nbsp;&middot;&nbsp; Case I
              </span>
              <span>{category.feature.volume}</span>
            </div>
            <div
              className="img"
              style={{ backgroundImage: `url('${category.feature.image}')` }}
            />
            <div className="caption">
              <p className="t">
                {category.feature.title}
                {category.feature.italicTitle ? <em>{category.feature.italicTitle}</em> : null}
                {category.feature.caption ? ` ${category.feature.caption}` : null}
              </p>
              <div className="s">{category.feature.client}</div>
            </div>
          </div>
        ) : null}

        {category.foot ? (
          <div className="hm-drop-foot">
            <div>{category.foot.meta}</div>
            <div className="quote">&ldquo;{category.foot.quote}&rdquo;</div>
            <Link href={category.foot.linkHref}>{category.foot.linkLabel}</Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
