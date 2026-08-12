import Image from "next/image";
import Link from "next/link";
import { FootprintCarousel } from "@/components/FootprintCarousel";
import "@/app/(site)/home.css";

const ADVANTAGES = [
  {
    number: "01",
    title: "30+ Years Manufacturing Experience",
    copy: "Since 1992, Huamei has specialized in premium paper packaging manufacturing, serving customers worldwide.",
  },
  {
    number: "02",
    title: "Large-Scale Production Capability",
    copy: "Advanced equipment and experienced teams ensure stable quality and efficient mass production.",
  },
  {
    number: "03",
    title: "Sustainable Packaging Solutions",
    copy: "FSC-certified materials, recycled paper options, and eco-friendly production processes support global sustainability goals.",
  },
  {
    number: "04",
    title: "Reliable Quality Control",
    copy: "From raw materials to final inspection, every step follows strict quality management standards.",
  },
];

const PROCESS = [
  {
    title: "Design & Engineering",
    image: "/photos/home-reference/process/01-design-engineering.jpg",
    alt: "Paperboard packaging structural dieline",
  },
  {
    title: "Material Selection",
    image: "/photos/home-reference/process/02-material-selection.jpg",
    alt: "FSC-certified paper and packaging materials",
  },
  {
    title: "Prototype Development",
    image: "/photos/home-reference/process/03-prototype-development.jpg",
    alt: "Custom packaging prototype development",
  },
  {
    title: "Mass Production",
    image: "/photos/home-reference/process/04-mass-production.jpg",
    alt: "Huamei automated packaging production",
  },
  {
    title: "Quality Inspection",
    image: "/photos/home-reference/process/05-quality-inspection.jpg",
    alt: "Finished packaging sample for quality inspection",
  },
  {
    title: "Global Shipping",
    image: "/photos/home-reference/process/06-global-shipping.jpg",
    alt: "Finished packaging loaded for global shipping",
  },
];

const CAPABILITIES = [
  "Offset Printing",
  "Automatic Die Cutting",
  "Surface Finishing",
  "Assembly Lines",
  "Quality Inspection",
];

const COMMITMENTS = [
  {
    number: "01",
    title: "FSC Certified Materials",
    copy: "Responsible paper sourcing options.",
  },
  {
    number: "02",
    title: "Recycled Paperboard",
    copy: "Supporting circular packaging solutions.",
  },
  {
    number: "03",
    title: "Solar Powered Factory",
    copy: "85% of factory energy supported by solar photovoltaic panels.",
  },
  {
    number: "04",
    title: "EU PPWR Ready",
    copy: "Supporting material traceability and compliance documentation.",
  },
];

const FOOTPRINT = [
  {
    number: "01",
    title: "Global Delivery",
    copy: "On-time logistics, shipping worldwide.",
  },
  {
    number: "02",
    title: "Our Facilities",
    copy: "22,000 m² production base in China.",
  },
  {
    number: "03",
    title: "Premium Quality",
    copy: "Crafted packaging that elevates your brand.",
  },
];

const PARTNERS = [
  { number: "01", slug: "niulanshan", name: "Niulanshan", image: "/photos/home-reference/partners/01-niulanshan.png", width: 104, height: 150 },
  { number: "02", slug: "wuliangye", name: "Wuliangye", image: "/photos/home-reference/partners/02-wuliangye.png", width: 173, height: 44 },
  { number: "03", slug: "yangshao", name: "Yangshao", image: "/photos/home-reference/partners/03-yangshao.png", width: 83, height: 60 },
  { number: "04", slug: "red-star", name: "Red Star", image: "/photos/home-reference/partners/04-red-star.png", width: 180, height: 150 },
  { number: "05", slug: "shede", name: "Shede", image: "/photos/home-reference/partners/05-shede.png", width: 174, height: 150 },
  { number: "06", slug: "kefumei", name: "Kefumei", image: "/photos/home-reference/partners/06-kefumei.png", width: 440, height: 148 },
  { number: "07", slug: "verity", name: "Verity", image: "/photos/home-reference/partners/07-verity.png", width: 411, height: 150 },
  { number: "08", slug: "stora-enso", name: "Stora Enso", image: "/photos/home-reference/partners/08-stora-enso.png", width: 167, height: 150 },
  { number: "09", slug: "alibaba", name: "Alibaba", image: "/photos/home-reference/partners/09-alibaba.png", width: 398, height: 150 },
  { number: "10", slug: "nacomi", name: "Nacomi", image: "/photos/home-reference/partners/10-nacomi.png", width: 144, height: 46 },
];

export function HomeContent() {
  return (
    <main className="premium-home">
      <section className="premium-home__hero" aria-labelledby="home-hero-title">
        <Image
          className="premium-home__hero-image"
          src="/photos/home-reference/hero-v3.png"
          alt="Huamei paper packaging production facility"
          fill
          sizes="100vw"
          priority
          unoptimized
        />
        <div className="premium-home__hero-shade" />
        <div className="premium-home__hero-inner">
          <p className="premium-home__eyebrow premium-home__eyebrow--light">
            Premium Paper Packaging · Since 1992
          </p>
          <h1 id="home-hero-title" className="premium-home__hero-title">
            <span>Trust.</span>
            <span>Consistency.</span>
            <span>Elevation.</span>
          </h1>
          <p className="premium-home__hero-copy">
            With 30+ years of manufacturing experience, Huamei delivers custom
            packaging solutions for international brands with reliable quality,
            scalable production, and sustainable materials.
          </p>
          <div className="premium-home__actions">
            <Link className="premium-home__button premium-home__button--ghost" href="/begin">
              Request a Quote
            </Link>
            <Link className="premium-home__hero-link" href="#advantage">
              Explore Packaging Solutions
            </Link>
          </div>
          <dl className="premium-home__facts">
            <div><dt>1992</dt><dd>Founded</dd></div>
            <div><dt>22,000 m²</dt><dd>Production Base</dd></div>
            <div><dt>200,000+</dt><dd>Boxes Daily Capacity</dd></div>
            <div><dt>Global</dt><dd>Brand Partner</dd></div>
          </dl>
        </div>
      </section>

      <section id="advantage" className="premium-home__section premium-home__advantage">
        <div className="premium-home__section-intro">
          <div>
            <p className="premium-home__eyebrow">Our Advantage</p>
            <h2>Why Global Brands<br />Choose Huamei</h2>
          </div>
          <p className="premium-home__lead">
            We combine craftsmanship, technology, and service to create packaging
            that elevates your brand and performs globally.
          </p>
        </div>
        <div className="premium-home__advantage-grid">
          <div className="premium-home__portrait-media">
            <Image
              src="/photos/home-reference/advantage-inspection.png"
              alt="A Huamei craftsperson inspecting a premium paper box"
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
            />
          </div>
          <ol className="premium-home__advantage-list">
            {ADVANTAGES.map((item) => (
              <li key={item.number}>
                <span className="premium-home__index">{item.number}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="process" className="premium-home__section premium-home__process">
        <div className="premium-home__process-head">
          <p className="premium-home__eyebrow premium-home__eyebrow--light">From Concept to Delivery</p>
          <h2>A Process Built<br />Around Precision</h2>
          <p>Every detail is controlled from initial concept to final delivery.</p>
        </div>
        <ol className="premium-home__process-list">
          {PROCESS.map((item, index) => (
            <li key={item.title}>
              <div className="premium-home__process-media">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 620px) 78vw, (max-width: 900px) 42vw, 16vw"
                />
              </div>
              <div className="premium-home__process-step-copy">
                <span className="premium-home__process-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="capability" className="premium-home__section premium-home__capability">
        <div className="premium-home__section-intro premium-home__section-intro--wide">
          <div>
            <p className="premium-home__eyebrow">Our Capability</p>
            <h2>Advanced Manufacturing<br />Capability</h2>
          </div>
          <p className="premium-home__lead">
            Combining advanced equipment with skilled craftsmanship, HUAMEI ensures
            consistent quality for every order.
          </p>
        </div>
        <div className="premium-home__capability-stage">
          <div className="premium-home__capability-media">
            <Image
              src="/photos/home-reference/capability.jpg"
              alt="Huamei advanced offset printing equipment"
              fill
              sizes="100vw"
            />
          </div>
          <ol className="premium-home__capability-list">
            {CAPABILITIES.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="sustainability" className="premium-home__sustainability">
        <div className="premium-home__sustainability-media">
          <Image
            src="/photos/home-reference/sustainability.jpg"
            alt="FSC-certified and recycled paper materials"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className="premium-home__sustainability-copy">
          <div>
            <p className="premium-home__eyebrow premium-home__eyebrow--light">Our Commitment</p>
            <h2>Sustainable<br />Packaging Solutions</h2>
            <p className="premium-home__lead premium-home__lead--light">
              Packaging designed for a more sustainable future.
            </p>
          </div>
          <ol className="premium-home__commitment-list">
            {COMMITMENTS.map((item) => (
              <li key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </li>
            ))}
          </ol>
          <Link className="premium-home__text-link premium-home__text-link--light" href="/house/certifications">
            Explore Our Sustainability <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section id="footprint" className="premium-home__section premium-home__footprint">
        <div className="premium-home__footprint-copy">
          <p className="premium-home__eyebrow">Our Footprint</p>
          <h2>Trusted by<br />Brands Worldwide</h2>
          <p className="premium-home__lead">
            From emerging brands to global enterprises, Huamei supports customers
            with dependable packaging solutions worldwide.
          </p>
          <ol className="premium-home__footprint-list">
            {FOOTPRINT.map((item) => (
              <li key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </li>
            ))}
          </ol>
        </div>
        <FootprintCarousel />
        <div className="premium-home__partners">
          <div className="premium-home__partners-head">
            <div>
              <p className="premium-home__eyebrow">Selected Partnerships</p>
              <h3>Built on lasting trust.</h3>
            </div>
            <p>Trusted collaborations across premium spirits, beauty, retail and global materials.</p>
          </div>
          <div className="premium-home__brand-wall" aria-label="Selected Huamei brand partners">
            {PARTNERS.map((partner) => (
              <figure
                className={`premium-home__partner premium-home__partner--${partner.slug}`}
                key={partner.number}
              >
                <span>{partner.number}</span>
                <Image
                  src={partner.image}
                  alt={`${partner.name} logo`}
                  width={partner.width}
                  height={partner.height}
                  sizes="(max-width: 620px) 42vw, (max-width: 900px) 28vw, 18vw"
                  unoptimized
                />
                <figcaption>{partner.name}</figcaption>
              </figure>
            ))}
          </div>
          <p className="premium-home__partner-note">
            A selection of brands and organizations we have collaborated with.
          </p>
        </div>
      </section>

      <section className="premium-home__cta">
        <p className="premium-home__eyebrow premium-home__eyebrow--light">Start a Conversation</p>
        <h2>Let&apos;s Create Something<br /><span>Remarkable.</span></h2>
        <p>Tell us about your packaging project.</p>
        <Link className="premium-home__button premium-home__button--gold" href="/begin">
          Start Your Project <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
