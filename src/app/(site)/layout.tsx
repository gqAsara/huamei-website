import { UtilityBar } from "@/components/UtilityBar";
import { PrimaryNav } from "@/components/PrimaryNav";
import { Footer } from "@/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UtilityBar />
      <PrimaryNav />
      {children}
      <Footer />
    </>
  );
}
