import Link from "next/link";
import PackagingOrderForm from "@/components/PackagingOrderForm";
import "./order.css";

export default async function OrderPage({searchParams}:{searchParams:Promise<{box?:string}>}) {
  const {box}=await searchParams;
  const initialBox=box==="book"||box==="folding"?box:"mailer";
  return <main className="pack-order-page">
    <header className="pack-order-heading"><Link href="/">← Back to Huamei</Link>
      <p className="pack-order-eyebrow">Custom packaging · Order request</p>
      <h1>Your packaging,<br /><em>specified.</em></h1>
      <p>Choose a structure, set your dimensions and tell us the details. We will confirm the price, shipping and payment arrangements before you pay.</p>
    </header>
    <PackagingOrderForm initialBox={initialBox} />
  </main>;
}
