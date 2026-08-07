import Image from "next/image";
import Link from "next/link";
import "@/app/(site)/home.css";

const ADVANTAGES = [
  {
    title: "30+ Years Manufacturing Experience",
    description:
      "Since 1992, Huamei has specialized in premium paper packaging manufacturing, serving customers worldwide.",
    icon: "/photos/home/advantage-experience.png",
  },
  {
    title: "Large-Scale Production Capability",
    description:
      "Advanced equipment and experienced teams ensure stable quality and efficient mass production.",
    icon: "/photos/home/advantage-production.png",
  },
  {
    title: "Sustainable Packaging Solutions",
    description:
      "FSC-certified materials, recycled paper options, and eco-friendly production processes support global sustainability goals.",
    icon: "/photos/home/advantage-sustainability.png",
  },
  {
    title: "Reliable Quality Control",
    description:
      "From raw materials to final inspection, every step follows strict quality management standards.",
    icon: "/photos/home/advantage-quality.png",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Design & Engineering",
    icon: "/photos/home/process/icon-design.png",
    image: "/photos/home/process/design.jpg",
    alt: "Packaging dieline design",
  },
  {
    number: "02",
    title: "Material Selection",
    icon: "/photos/home/process/icon-materials.png",
    image: "/photos/home/process/materials.jpg",
    alt: "FSC-certified packaging materials",
  },
  {
    number: "03",
    title: "Prototype Development",
    icon: "/photos/home/process/icon-prototype.png",
    image: "/photos/home/process/prototype.jpg",
    alt: "Packaging prototype development",
  },
  {
    number: "04",
    title: "Mass Production",
    icon: "/photos/home/process/icon-production.png",
    image: "/photos/home/process/production.jpg",
    alt: "Packaging production equipment",
  },
  {
    number: "05",
    title: "Quality Inspection",
    icon: "/photos/home/process/icon-inspection.png",
    image: "/photos/home/process/inspection.jpg",
    alt: "Finished packaging quality inspection",
  },
  {
    number: "06",
    title: "Global Shipping",
    icon: "/photos/home/process/icon-shipping.png",
    image: "/photos/home/process/shipping.jpg",
    alt: "Packaging shipment loading",
  },
];

const CAPABILITIES = [
  { title: "Offset Printing", icon: "/photos/home/capability/icon-printing.png" },
  {
    title: "Automatic Die Cutting",
    icon: "/photos/home/capability/icon-die-cutting.png",
  },
  { title: "Surface Finishing", icon: "/photos/home/capability/icon-finishing.png" },
  { title: "Assembly Lines", icon: "/photos/home/capability/icon-assembly.png" },
  { title: "Quality Inspection", icon: "/photos/home/capability/icon-inspection.png" },
];

const SUSTAINABILITY_ITEMS = [
  {
    title: "FSC Certified Materials",
    description: "Responsible paper sourcing options.",
    icon: "/photos/home/sustainability/icon-fsc.png",
  },
  {
    title: "Recycled Paperboard",
    description: "Supporting circular packaging solutions.",
    icon: "/photos/home/sustainability/icon-recycled.png",
  },
  {
    title: "Solar Powered Factory",
    description: "85% of factory energy is supported by solar photovoltaic panels.",
    icon: "/photos/home/sustainability/icon-solar.png",
  },
  {
    title: "EU PPWR Ready",
    description:
      "Supporting customers with material traceability and compliance documentation.",
    icon: "/photos/home/sustainability/icon-ppwr.png",
  },
];

const FOOTPRINT_CARDS = [
  {
    title: "Global Delivery",
    description: "On-time logistics, shipping worldwide.",
    image: "/photos/home/footprint/global-delivery.jpg",
    alt: "Global packaging logistics by air, sea, and road",
  },
  {
    title: "Our Facilities",
    description: "22,000 m² production base in China.",
    image: "/photos/home/footprint/facility.jpg",
    alt: "Huamei packaging production facility",
  },
  {
    title: "Premium Quality",
    description: "Crafted packaging that elevates your brand.",
    image: "/photos/home/footprint/premium-quality.jpg",
    alt: "Premium custom cosmetic packaging",
  },
];

export function HomeContent() {
  return (
    <>
      <section className="context-hero">
        <div className="photo">
          <Image
            src="/photos/home/hero-press-floor.png"
            alt="Huamei packaging factory technician operating press equipment"
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className="veil" />
        <div className="context-body">
          <h1>
            <span>Trust</span>
            <span>Consistency</span>
            <span>Elevation</span>
          </h1>
          <div className="hero-actions">
            <Link className="hero-primary" href="/begin">
              Request a Quote
            </Link>
            <Link className="hero-secondary" href="/craft">
              Explore Packaging Solutions
            </Link>
          </div>
        </div>
      </section>

      <section className="home-advantages">
        <div className="advantages-inner">
          <div className="advantages-head">
            <div className="advantages-eyebrow">Our Advantage</div>
            <h2>Why Global Brands Choose Huamei</h2>
            <p>
              We combine craftsmanship, technology, and service to create packaging
              that elevates your brand and performs globally.
            </p>
          </div>
          <div className="advantages-grid">
            {ADVANTAGES.map((advantage) => (
              <article className="advantage-card" key={advantage.title}>
                <Image
                  src={advantage.icon}
                  alt=""
                  width={512}
                  height={512}
                  sizes="88px"
                />
                <h3>{advantage.title}</h3>
                <p>{advantage.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-process" aria-labelledby="process-title">
        <div className="home-section-inner">
          <header className="home-process-head">
            <div className="home-eyebrow">Our Process</div>
            <h2 id="process-title">From Concept to Mass Production</h2>
          </header>
          <ol className="process-grid">
            {PROCESS_STEPS.map((step) => (
              <li key={step.number}>
                <div className="process-photo">
                  <Image src={step.image} alt={step.alt} fill sizes="200px" />
                </div>
                <div className="process-icon" aria-hidden="true">
                  <Image src={step.icon} alt="" width={320} height={320} sizes="72px" />
                </div>
                <span className="process-number">{step.number}</span>
                <h3>{step.title}</h3>
              </li>
            ))}
          </ol>
          <p className="process-note">
            Every detail is controlled from initial concept to final delivery.
          </p>
        </div>
      </section>

      <section className="home-capability" aria-labelledby="capability-title">
        <div className="home-section-inner">
          <div className="capability-feature">
            <div className="capability-copy">
              <div className="home-eyebrow">Our Capability</div>
              <h2 id="capability-title">Advanced Manufacturing Capability</h2>
              <p>
                Combining advanced equipment with skilled craftsmanship, HUAMEI ensures
                consistent quality for every order.
              </p>
              <Link className="home-text-link" href="/house/factory">
                View all capabilities <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="capability-photo">
              <Image
                src="/photos/home/capability/press-floor.jpg"
                alt="Huamei advanced offset printing equipment"
                fill
                sizes="(max-width: 760px) 100vw, 70vw"
              />
            </div>
          </div>
          <ul className="capability-list">
            {CAPABILITIES.map((item) => (
              <li key={item.title}>
                <Image src={item.icon} alt="" width={320} height={320} sizes="76px" />
                <h3>{item.title}</h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-commitment" aria-labelledby="commitment-title">
        <div className="home-section-inner commitment-inner">
          <div className="commitment-copy">
            <div className="home-eyebrow">Our Commitment</div>
            <h2 id="commitment-title">Sustainable Packaging Solutions</h2>
            <p>Packaging Designed for a More Sustainable Future</p>
            <Link className="home-text-link" href="/house/standards">
              Explore our sustainability <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className="commitment-list">
            {SUSTAINABILITY_ITEMS.map((item) => (
              <li key={item.title}>
                <Image src={item.icon} alt="" width={320} height={320} sizes="82px" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-footprint" aria-labelledby="footprint-title">
        <div className="home-section-inner footprint-grid">
          <div className="footprint-copy">
            <div className="home-eyebrow">Our Footprint</div>
            <h2 id="footprint-title">Trusted by Brands Worldwide</h2>
            <p>
              From emerging brands to global enterprises, Huamei supports customers
              with dependable packaging solutions worldwide.
            </p>
            <Link className="home-text-link" href="/volumes">
              View case studies <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="footprint-map">
            <Image
              src="/photos/home/footprint/world-map.jpg"
              alt="Shipping routes from China to North America and Europe"
              fill
              sizes="(max-width: 960px) 100vw, 32vw"
            />
          </div>
          <div className="footprint-cards">
            {FOOTPRINT_CARDS.map((card) => (
              <article key={card.title}>
                <div className="footprint-card-image">
                  <Image src={card.image} alt={card.alt} fill sizes="220px" />
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec-start">
        <div className="start-inner">
          <div className="eyebrow">Start Your Design</div>
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
