import Link from "next/link";

// Closing CTA band for /house/* pages. Uses the .hs-cta styles that already
// live in house.css — every page rendering this must import "../house.css".
export default function HouseCta({
  heading,
  sub = "Founder-led reply within 48 hours. Samples in 7 – 10 days, production in 15 – 20. MOQ 200+ pieces.",
}: {
  heading: React.ReactNode;
  sub?: string;
}) {
  return (
    <section className="hs-cta">
      <span className="yi" aria-hidden="true">
        始
      </span>
      <h4>{heading}</h4>
      <p>{sub}</p>
      <div className="actions">
        <Link className="hm-plate" href="/begin">
          <span className="roman">→</span> Begin a project
        </Link>
        <a className="alt" href="mailto:info@huamei.io">
          info@huamei.io
        </a>
      </div>
    </section>
  );
}
