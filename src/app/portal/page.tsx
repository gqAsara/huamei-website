"use client";

import Image from "next/image";
import Link from "next/link";
import "./portal.css";

export default function PortalPage() {
  return (
    <>
      {/* Bespoke utility bar — no nav for the portal entry */}
      <div className="hm-utility">
        <div className="hm-utility-inner pt-utility-inner">
          <div className="left">
            <span>Client portal &middot; Huamei 華美</span>
            <span className="dot">&middot;</span>
            <span>Projects &amp; proofs</span>
            <span className="dot">&middot;</span>
            <span>TLS 1.3 &middot; SGS audited</span>
          </div>
          <div className="right">
            <span className="lang">
              <a className="on" href="#">EN</a>
              <span className="sep">/</span>
              <a href="#" style={{ fontFamily: "var(--font-cn)", letterSpacing: ".08em" }}>中文</a>
            </span>
            <a
              href="mailto:info@huamei.io"
              style={{ color: "var(--paper-white)", opacity: 0.78 }}
            >
              info@huamei.io
            </a>
          </div>
        </div>
      </div>

      <section className="pt-stage">
        {/* Left editorial */}
        <aside className="pt-left">
          <div className="photo">
            <Image
              src="/photos/design-office.jpg"
              alt="Huamei design office"
              fill
              sizes="(max-width: 960px) 100vw, 55vw"
              priority
            />
          </div>
          <div className="veil" />
          <span className="mark tl" />
          <span className="mark tr" />
          <span className="mark bl" />
          <span className="mark br" />

          <div className="top">
            <Link className="wm" href="/">
              <span className="lat">Huamei</span>
              <span className="bar" />
              <span className="cn">華美</span>
            </Link>
            <Link className="back" href="/">← Return to the house</Link>
          </div>

          <div className="body">
            <div className="kicker">
              <span className="rule" />
              Client portal &middot; Vol. I &middot; Pl. vi
            </div>
            <h1>
              The factory, <span className="gold">in private.</span>
            </h1>
            <p className="lede">
              Where your project lives between proof and press. Signed-off dielines,
              foil swatches, colour-managed PDFs, and the chronology of every correction.
            </p>

            <div className="inside">
              <h4>Inside</h4>
              <ul>
                <li><span className="rn">i.</span><span className="t"><em>Proofs</em> &middot; digital and hand-pulled, versioned</span></li>
                <li><span className="rn">ii.</span><span className="t"><em>Dielines</em> &middot; downloadable in AI and PDF</span></li>
                <li><span className="rn">iii.</span><span className="t"><em>Foil</em> &middot; swatches posted to your address</span></li>
                <li><span className="rn">iv.</span><span className="t"><em>Shipments</em> &middot; live tracking &amp; CMR</span></li>
                <li><span className="rn">v.</span><span className="t"><em>Invoices</em> &middot; in RMB, USD, or EUR</span></li>
                <li><span className="rn">vi.</span><span className="t"><em>Archive</em> &middot; all past projects, on file</span></li>
              </ul>
            </div>
          </div>

          <div className="foot">
            <span>Henan &middot; Zhejiang &middot; Sichuan &middot; Guizhou</span>
            <span className="quote">&ldquo;Corrections are free.&rdquo;</span>
            <span>24 / 7</span>
          </div>
        </aside>

        {/* Right form */}
        <div className="pt-right">
          <div className="label">
            <span>Entry &middot; authorised only</span>
            <span className="gold">vi.</span>
          </div>

          <h2>
            Sign <em>in.</em>
          </h2>
          <p className="sub">
            Clients and press agents — use the credentials sent at onboarding. If you
            were introduced through a distributor,{" "}
            <a href="#">your account manager holds the key</a>.
          </p>

          <form
            className="pt-form"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Demo only — no authentication wired.");
            }}
          >
            <div className="pt-field">
              <label htmlFor="email">
                <span>i. &nbsp; Your email</span>
                <span className="rn">@</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="brand@maison.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="pt-field">
              <label htmlFor="pass">
                <span>ii. &nbsp; Password</span>
                <span className="opt">12 chars, at least</span>
              </label>
              <input
                type="password"
                id="pass"
                name="password"
                placeholder="•••••••••••"
                autoComplete="current-password"
                required
              />
              <div className="hint">
                Forgotten? <a href="#">We&rsquo;ll post a reset link.</a>
              </div>
            </div>

            <div className="pt-row">
              <label className="pt-check">
                <input type="checkbox" name="remember" defaultChecked />
                <span>Keep me signed in</span>
              </label>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: 13,
                  color: "var(--ink-3)",
                }}
              >
                on this device only
              </span>
            </div>

            <button type="submit" className="pt-submit">
              <span>Enter the portal</span>
              <span className="roman">→</span>
            </button>
          </form>

          <div className="pt-or">or by</div>

          <div className="pt-magic">
            <a href="#" aria-label="Magic link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 7h16M4 12h16M4 17h10" />
              </svg>
              <span>Email link</span>
            </a>
            <a href="#" aria-label="Corporate SSO">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="4" y="4" width="16" height="16" />
                <path d="M9 9h6v6H9z" />
              </svg>
              <span>Corporate SSO</span>
            </a>
          </div>

          <div className="pt-signoff">
            <div className="ask">
              Not yet working with us? <Link href="/begin">Begin a project →</Link>
            </div>
            <div className="secure">
              <span className="gold">●</span>
              <span>Secured &middot; TLS 1.3</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
