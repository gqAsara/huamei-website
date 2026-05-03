import Link from "next/link";

export function UtilityBar() {
  return (
    <div className="hm-utility">
      <div className="hm-utility-inner">
        <div className="left">
          <span>Henan &middot; Zhejiang &middot; Sichuan &middot; Guizhou</span>
          <span className="dot">&middot;</span>
          <span>Est. 1992</span>
          <span className="dot">&middot;</span>
          <span>Press floor running 12 / 7</span>
        </div>
        <div className="right">
          <span className="lang">
            <Link className="on" href="/">EN</Link>
            <span className="sep">/</span>
            <Link
              href="/"
              style={{ fontFamily: "var(--font-cn)", letterSpacing: ".08em" }}
            >
              中文
            </Link>
          </span>
          <Link className="portal" href="/portal" aria-label="Client portal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <rect x="3" y="11" width="18" height="11" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Client portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
