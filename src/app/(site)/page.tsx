import { HomeContent } from "@/components/HomeContent";

export const metadata = {
  title: { absolute: "Huamei 華美 — Luxury packaging manufacturer since 1992" },
  description:
    "Luxury packaging manufacturer since 1992 — rigid boxes, magnetic closures, hot-foil, emboss. Hua Mei 華美, Henan, Zhejiang, Sichuan, Guizhou. MOQ 200+.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeContent />;
}
