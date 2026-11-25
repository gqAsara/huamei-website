import Image from "next/image";
import type { ReactNode } from "react";
import "./news.css";

const links = [
  ["/craft", "Packaging"],
  ["/industry", "Industries"],
  ["/volumes", "Case library"],
  ["/#factory", "Inside Huamei"],
  ["/#ordering", "How to order"],
];

function CatalogueLinks() {
  return links.map(([href, label]) => <a key={href} href={href}>{label}</a>);
}

export default function NewsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="news-shell">
      <a className="news-skip" href="#news-content">Skip to content</a>
      <header className="news-header">
        <a className="news-wordmark" href="/" aria-label="Huamei 華美 Packaging home">
          <Image unoptimized src="/catalogue/assets/huamei-logo-dark.png" alt="Huamei 華美 Product Packaging" width={142} height={34} />
        </a>
        <nav className="news-desktop-menu" aria-label="Main navigation"><CatalogueLinks /></nav>
        <a className="news-quote" href="/#quote">Request a quote</a>
        <details className="news-mobile-menu"><summary>Menu</summary>
          <nav aria-label="Main navigation"><CatalogueLinks /></nav>
        </details>
      </header>
      {children}
      <footer className="news-footer">
        <a href="/">Huamei 華美 Packaging</a>
        <nav aria-label="Footer navigation"><a href="/news">Packaging Q&amp;A</a><a href="/volumes">Case library</a><a href="mailto:jackychan@huamei.io">jackychan@huamei.io</a></nav>
      </footer>
    </div>
  );
}
