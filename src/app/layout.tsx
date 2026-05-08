import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { fontDisplay, fontBody, fontLabel, fontCN } from "./fonts";
import { JsonLd } from "@/lib/schema/JsonLd";
import { organizationGraph } from "@/lib/schema/organization";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://huamei.io"),
  title: {
    default: "Huamei 華美 — Premium custom luxury packaging",
    template: "%s · Huamei",
  },
  description:
    "Huamei is a custom luxury packaging house with factories across four Chinese provinces — Henan, Zhejiang, Sichuan and Guizhou. Founded 1992. Rigid boxes, drawer boxes, magnetic closures, hot-foil, emboss, lamination — for cosmetic & skincare, wine spirits & tea, seasonal gifting, and wellness categories.",
  openGraph: {
    type: "website",
    siteName: "Huamei 華美",
    locale: "en_US",
    // alternateLocale removed 2026-05-08 — /zh-Hans not yet built (per ADR
    // 0003). Re-add as ["zh_Hans"] when the locale-prefix migration ships.
  },
  twitter: {
    card: "summary_large_image",
    title: "Huamei 華美 — Premium custom luxury packaging",
    description:
      "A custom luxury packaging house across Henan, Zhejiang, Sichuan and Guizhou. Since 1992.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontLabel.variable} ${fontCN.variable}`}
    >
      <body>
        <JsonLd data={organizationGraph} />
        {children}
      </body>
      {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
    </html>
  );
}
