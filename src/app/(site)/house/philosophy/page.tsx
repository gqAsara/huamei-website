import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/lib/schema/JsonLd";
import { breadcrumbList } from "@/lib/schema/breadcrumbs";
import "../house.css";

export const metadata = {
  title: "Philosophy — a letter from Sonia Sun",
  description:
    "A letter from Sonia Sun, founder of Huamei, and the threshold — why we believe a box is a brand's first physical handshake.",
  alternates: { canonical: "/house/philosophy" },
};

export default function PhilosophyPage() {
  return (
    <main className="hs-wrap">
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "The House", path: "/house" },
          { name: "Philosophy", path: "/house/philosophy" },
        ])}
      />
      <header className="hs-subcover">
        <div className="kicker">
          <Link href="/house">← The House</Link>
        </div>
        <h1>
          Our <em>philosophy.</em>
        </h1>
        <span className="cn">理 · 念</span>
      </header>

      <section className="hs-philosophy" id="philosophy">
        <div className="hs-philosophy-body">
          {/* A letter from Sonia */}
          <div className="hs-philosophy-letter-mark">A letter from Sonia</div>
          <figure className="hs-letter-portrait">
            <div className="img">
              <Image
                src="/photos/people/sonia-sun.jpg"
                alt="Sonia Sun, Founder of Huamei"
                fill
                sizes="(max-width: 720px) 80vw, (max-width: 960px) 340px, 420px"
                priority
              />
            </div>
            <figcaption>Sonia Sun</figcaption>
          </figure>
          <p>
            I started Huamei in <em>one small room,</em> in 1992. There were four
            of us. One offset press. We made folding cartons for the printers down
            the street. I was twenty-six, and I had no idea what I was doing — only
            that I loved paper, and the smell of the ink, and the quiet sound a
            clean lid makes when it closes.
          </p>
          <p>
            Bigger work came. Veritiv and Stora Enso bought our boxes for
            L&rsquo;Or&eacute;al, Lanc&ocirc;me, Est&eacute;e Lauder. My name never
            showed up on a single one. I was happy to be there — but I knew,
            somewhere quiet inside, that I wanted to meet the people I was making
            boxes for.
          </p>
          <p>
            Thirty-four years later, I still print for those big houses. But now I
            also pick up the phone for founders. People who started a skincare line
            in their kitchen. A tea brand built around a grandfather&rsquo;s recipe.
            A small wellness studio that ships four boxes a season. They write to
            me, and I write back. The work is the same as it ever was. The
            conversation is just a lot shorter.
          </p>

          <div className="hs-philosophy-letter-sign">
            <span className="name">Sonia Sun</span>
            <span className="role">Founder &middot; info@huamei.io</span>
          </div>

          <hr className="hs-philosophy-rule" />

          {/* The threshold */}
          <div className="hs-philosophy-letter-mark">The threshold</div>
          <p>
            Every box stands between wanting something and having it. The shipping
            mailer treats that moment as friction — throw it away, move on. The
            kind of box we have been making for thirty-four years treats it as the
            most important moment of the customer journey.
          </p>
          <p>
            A magnetic closure that snaps with the right resistance. A lid that
            lifts in one clean motion. An interior color you do not see until you
            are already inside. The weight in your hands. None of this is
            engineering for protection. All of it is the work of turning the act
            of opening into a small ceremony — and ceremonies are how people mark
            that something matters.
          </p>

          <blockquote className="hs-philosophy-pull">
            We believe a box is a brand&rsquo;s <em>first physical handshake.</em>
          </blockquote>

          <p>
            Long before the customer touches the product, they touch the box: its
            texture, its weight, the sound it makes. What that moment feels like
            decides whether they think they have bought something exceptional or
            something ordinary. The product cannot do this work alone.
          </p>
          <p>
            This conviction shapes how we operate. Why our paper is FSC-certified
            even when no one asks. Why we keep foil stamping, embossing, debossing,
            and soft-touch lamination under our own roof instead of outsourcing the
            finishing. Why we will run sample iterations until the Pantone match is
            exact. Why we take orders most factories of our scale will not —
            because the next great brand is small before it is large.
          </p>
          <p>
            Three decades in, we have made boxes for cosmetic factories, baijiu
            and tea houses, seasonal-calendar projects, and wellness lines
            across four continents. The work has changed, the customers have
            changed, the technology has changed. What a box is for has not.
          </p>

          <p className="hs-philosophy-coda">
            The cheap box wants to be forgotten. We build boxes that
            <em> want to be remembered.</em>
          </p>
        </div>
      </section>
    </main>
  );
}
