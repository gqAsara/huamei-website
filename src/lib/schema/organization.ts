// Organization + WebSite schema graph. Rendered once in the root
// layout — every page inherits these entities.
//
// Per playbook §6.3 + ADR (forthcoming) on schema types.

const SITE = "https://huamei.io" as const;

export const organizationGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "Huamei",
      alternateName: ["華美", "Huamei Packaging"],
      url: SITE,
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/huamei-mark-512.png`,
        width: 512,
        height: 512,
      },
      description:
        "Custom luxury packaging house with factories across four Chinese provinces — Henan, Zhejiang, Sichuan and Guizhou. Founded 1992. Rigid boxes, magnetic closures, hot-foil stamping, embossing, deboss, spot-UV, soft-touch lamination.",
      foundingDate: "1992",
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        value: 3000,
      },
      knowsAbout: [
        "Custom luxury packaging",
        "Rigid box manufacturing",
        "Hot-foil stamping",
        "Embossing and debossing",
        "Magnetic closure engineering",
        "Soft-touch lamination",
      ],
      areaServed: ["Worldwide"],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          email: "info@huamei.io",
          availableLanguage: ["en"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "Huamei",
      publisher: { "@id": `${SITE}/#org` },
      inLanguage: ["en"],
    },
  ],
} as const;
