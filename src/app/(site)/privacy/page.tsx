import Link from "next/link";
import "../imprint/imprint.css";

export const metadata = {
  title: "Privacy policy",
  description:
    "What data Huamei's internal tools collect, how it is used, and how it is retained. Covers website analytics, contact-form submissions, and the OAuth-authorized Search Console puller used for our own search-performance analytics.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "2026-05-25";

export default function PrivacyPage() {
  return (
    <main className="lg-wrap">
      <section className="lg-mast">
        <div>
          <div className="crumbs">
            <Link href="/">Huamei</Link>
            <span className="sep">&middot;</span>
            Privacy policy
          </div>
          <div className="rn">iv.</div>
          <h1>
            <em>Privacy</em> policy.
          </h1>
        </div>
        <div className="meta">
          <span>Effective {UPDATED}</span>
        </div>
      </section>

      <section className="lg-prose">
        <h2>Who this covers</h2>
        <p>
          This policy applies to <strong>huamei.io</strong>, operated by Huamei
          Packaging &amp; Print Co., Ltd. (華美彩印有限公司), the publisher named on{" "}
          <Link href="/imprint">/imprint</Link>. It covers the website, the project
          intake form at <Link href="/begin">/begin</Link>, and the internal
          analytics tools we run against our own Search Console property.
        </p>

        <h2>Personal data we collect</h2>
        <ul>
          <li>
            <strong>Contact-form submissions.</strong> When you submit the form at{" "}
            <Link href="/begin">/begin</Link>, we collect your name, email, company,
            and the body of your inquiry. Submissions are routed to{" "}
            <a href="mailto:info@huamei.io">info@huamei.io</a> through{" "}
            <a href="https://resend.com" target="_blank" rel="noopener noreferrer">
              Resend
            </a>{" "}
            and retained in our internal correspondence archive. The data is used
            only to reply to your inquiry and to fulfil any project that follows.
            We do not sell, rent, or share form submissions with third parties.
          </li>
          <li>
            <strong>Standard server logs.</strong> Our hosting provider (Vercel)
            records IP address, user agent, requested URL, and timestamp for each
            request. Logs are retained for 30 days and are used for security
            triage and aggregate traffic counts.
          </li>
          <li>
            <strong>Google Analytics 4.</strong> We run GA4 with IP anonymization
            enabled and a 14-month retention window. GA4 stores cookies under the{" "}
            <code>_ga*</code> namespace. You can opt out with the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
            >
              official browser add-on
            </a>{" "}
            or via your browser&rsquo;s cookie controls.
          </li>
        </ul>

        <h2>Search Console data — OAuth-authorized tool</h2>
        <p>
          We run an internal tool that uses the{" "}
          <a
            href="https://developers.google.com/webmaster-tools"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Search Console API
          </a>{" "}
          to pull search-performance metrics (query, page, impressions, clicks,
          position) for our own verified property{" "}
          <code>sc-domain:huamei.io</code>. The tool is single-tenant and
          accesses no other Google account&rsquo;s data.
        </p>
        <ul>
          <li>
            <strong>Scope.</strong>{" "}
            <code>https://www.googleapis.com/auth/webmasters.readonly</code> —
            read-only access to Search Console properties the authorizing account
            already owns.
          </li>
          <li>
            <strong>Authorizing account.</strong> A single Huamei founder account.
            Tokens are not shared with anyone outside the company.
          </li>
          <li>
            <strong>Data flow.</strong> Pulled rows are stored as line-delimited
            JSON in a private GitHub repository and used to power an internal
            content prioritization workflow. No Search Console data is published
            on huamei.io or transmitted to any third party.
          </li>
          <li>
            <strong>Retention.</strong> Daily snapshots retained for two years
            for trend analysis, then deleted on a rolling window.
          </li>
          <li>
            <strong>Revocation.</strong> The authorizing user can revoke access at{" "}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
            >
              myaccount.google.com/permissions
            </a>{" "}
            at any time. Revocation immediately stops the daily puller.
          </li>
          <li>
            <strong>Limited Use compliance.</strong> Our use of information
            received from Google APIs adheres to{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </li>
        </ul>

        <h2>Email sending</h2>
        <p>
          Outgoing email from huamei.io (project replies, internal SEO digest,
          system notifications) is sent via{" "}
          <a href="https://resend.com" target="_blank" rel="noopener noreferrer">
            Resend
          </a>
          . Resend stores delivery metadata (recipient address, delivery status,
          open/click events when enabled) for operational purposes. Resend&rsquo;s
          privacy policy applies in addition to ours.
        </p>

        <h2>Cookies</h2>
        <p>
          We set cookies only for analytics (GA4) and for any third-party widgets
          you explicitly interact with (e.g. embedded video). No advertising
          cookies. Cookies can be cleared from your browser settings at any time.
        </p>

        <h2>Your rights</h2>
        <p>
          You may request a copy of data we hold about you, ask for it to be
          corrected, or ask for it to be deleted. Email{" "}
          <a href="mailto:info@huamei.io">info@huamei.io</a> with the subject
          &ldquo;Privacy request&rdquo;. We respond within thirty days.
        </p>

        <h2>Children</h2>
        <p>
          huamei.io is a business-to-business website. We do not knowingly
          collect personal information from anyone under sixteen.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We update this policy when we change a data practice. The effective
          date at the top reflects the most recent material change. The full
          version history is on{" "}
          <a
            href="https://github.com/gqAsara/huamei-website/commits/main/src/app/(site)/privacy/page.tsx"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>

        <h2>Contact</h2>
        <p>
          Privacy questions: <a href="mailto:info@huamei.io">info@huamei.io</a>
          <br />
          Publisher and registered address:{" "}
          <Link href="/imprint">/imprint</Link>.
        </p>
      </section>
    </main>
  );
}
