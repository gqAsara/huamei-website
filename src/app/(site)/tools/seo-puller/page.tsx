import Link from "next/link";
import "../../imprint/imprint.css";

export const metadata = {
  title: "Huamei SEO Puller — internal search analytics tool",
  description:
    "An internal tool that pulls Huamei's own Google Search Console data to inform our content prioritization. Single-tenant, founder-only, read-only OAuth scope.",
  alternates: { canonical: "/tools/seo-puller" },
  // Don't index this in Google — it's a verification artifact, not a marketing
  // page. Keeping it indexable adds noise.
  robots: { index: false, follow: true },
};

const UPDATED = "2026-05-25";

export default function SeoPullerPage() {
  return (
    <main className="lg-wrap">
      <section className="lg-mast">
        <div>
          <div className="crumbs">
            <Link href="/">Huamei</Link>
            <span className="sep">&middot;</span>
            Tools
            <span className="sep">&middot;</span>
            SEO Puller
          </div>
          <div className="rn">i.</div>
          <h1>
            Huamei <em>SEO Puller</em>.
          </h1>
        </div>
        <div className="meta">
          <span>Last updated {UPDATED}</span>
        </div>
      </section>

      <section className="lg-prose">
        <h2>What it is</h2>
        <p>
          An internal command-line tool that pulls Huamei&rsquo;s own search-
          performance data from{" "}
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Search Console
          </a>{" "}
          and stores it as line-delimited JSON in our private git repository.
          The data feeds an internal content prioritization workflow that
          decides which topics to publish next.
        </p>

        <h2>Who it is for</h2>
        <p>
          A single Huamei founder account. The tool is not a public-facing
          product, has no sign-up page, and cannot be used by accounts outside
          our company. There is no user database, billing, or multi-tenant
          surface.
        </p>

        <h2>What data it accesses</h2>
        <ul>
          <li>
            <strong>Property scope.</strong> Read-only access to a single
            verified Search Console property:{" "}
            <code>sc-domain:huamei.io</code>. The application is granted
            permission only by an account that already owns this property.
          </li>
          <li>
            <strong>OAuth scope.</strong>{" "}
            <code>https://www.googleapis.com/auth/webmasters.readonly</code>{" "}
            — read-only access to Search Console properties the authorizing
            account already controls. The tool does not write to Search
            Console, does not create or remove properties, and does not query
            any property the user does not own.
          </li>
          <li>
            <strong>Endpoint used.</strong>{" "}
            <code>searchAnalytics/query</code> over a rolling 28-day window,
            once daily. The tool fetches aggregate metrics (query, page,
            clicks, impressions, CTR, average position) — no user-level data,
            no PII.
          </li>
        </ul>

        <h2>What it does with the data</h2>
        <ul>
          <li>
            Stores each daily snapshot as <code>.seo/reports/gsc-YYYY-MM-DD.jsonl</code>{" "}
            in our private GitHub repository.
          </li>
          <li>
            Feeds an opportunity scorer that detects keywords ranking on
            page 2&ndash;3 of Google (positions 11&ndash;30) with rising
            impressions — these are the &ldquo;near-miss&rdquo; queries where
            new editorial work can push a page onto page 1.
          </li>
          <li>
            Summarizes weekly metrics in an internal email digest delivered
            only to the authorizing founder account.
          </li>
        </ul>

        <h2>What it does NOT do</h2>
        <ul>
          <li>It does not transmit Search Console data to any third party.</li>
          <li>It does not publish Search Console data on huamei.io.</li>
          <li>
            It does not sell, rent, license, share, or otherwise transfer the
            data outside Huamei.
          </li>
          <li>
            It does not use the data for advertising or to determine
            creditworthiness or lending eligibility.
          </li>
          <li>
            It does not allow humans (including Huamei employees) to read or
            analyze the data through paid services or external APIs that
            re-process it.
          </li>
        </ul>

        <h2>Limited Use compliance</h2>
        <p>
          Our use of information received from Google APIs adheres to the{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements. Specifically, we use the
          data only to provide the internal SEO analytics function described
          above; we do not transfer data to third parties except as necessary
          to provide that function (e.g. hosting it inside our own private
          repository); and we do not allow humans to read it except where
          required for security and debugging.
        </p>

        <h2>Architecture (high level)</h2>
        <ul>
          <li>
            <strong>Language &amp; runtime.</strong> Node.js / TypeScript.
            Repository:{" "}
            <a
              href="https://github.com/gqAsara/huamei-website"
              target="_blank"
              rel="noopener noreferrer"
            >
              gqAsara/huamei-website
            </a>
            .
          </li>
          <li>
            <strong>Where it runs.</strong> A scheduled GitHub Actions
            workflow on the same repository, on GitHub-hosted runners.
          </li>
          <li>
            <strong>Credential storage.</strong> The OAuth client ID, client
            secret, and refresh token live as GitHub Actions Secrets, scoped
            to the repository. They are never logged.
          </li>
        </ul>

        <h2>Revocation</h2>
        <p>
          The authorizing user can revoke the application&rsquo;s access at
          any time at{" "}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noopener noreferrer"
          >
            myaccount.google.com/permissions
          </a>{" "}
          (look for &ldquo;Huamei SEO Puller&rdquo;). Revocation takes effect
          immediately; the daily pull will fail with{" "}
          <code>invalid_grant</code> and we will be notified.
        </p>

        <h2>Contact</h2>
        <p>
          Privacy or security questions:{" "}
          <a href="mailto:info@huamei.io">info@huamei.io</a>.<br />
          Privacy policy: <Link href="/privacy">/privacy</Link>.<br />
          Publisher and registered address:{" "}
          <Link href="/imprint">/imprint</Link>.
        </p>
      </section>
    </main>
  );
}
