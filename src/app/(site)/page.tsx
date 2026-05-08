import { HomeContent } from "@/components/HomeContent";

export const metadata = {
  title: { absolute: "Huamei 華美 — Premium custom luxury packaging" },
  description:
    "Huamei is a custom luxury packaging house with factories across four Chinese provinces — Henan, Zhejiang, Sichuan and Guizhou. Founded 1992. Rigid boxes, drawer boxes, magnetic closures, hot-foil, emboss, lamination — for cosmetic & skincare, wine spirits & tea, seasonal gifting, and wellness categories.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeContent />;
}
