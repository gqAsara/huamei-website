import { UtilityBar } from "@/components/UtilityBar";
import { PrimaryNav } from "@/components/PrimaryNav";
import { Footer } from "@/components/Footer";
import { LiveChatProvider } from "@/components/LiveChat";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LiveChatProvider>
      <UtilityBar />
      <PrimaryNav />
      {children}
      <Footer />
    </LiveChatProvider>
  );
}
