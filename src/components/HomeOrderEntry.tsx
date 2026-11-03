"use client";
import { useRef } from "react";
import Link from "next/link";
import { BOX_TYPES } from "@/lib/order-request";
import BoxOutline from "./BoxOutline";

export default function HomeOrderEntry(){
  const track=useRef<HTMLDivElement>(null);
  function scroll(direction:number){
    const el=track.current;if(!el)return;
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const end=el.scrollWidth-el.clientWidth;
    const target=direction>0 && el.scrollLeft>=end-5 ? 0 : direction<0 && el.scrollLeft<=5 ? end : el.scrollLeft+direction*el.clientWidth*.85;
    el.scrollTo({left:target,behavior:reduced?"instant":"smooth"});
  }
  return <section id="order-request" className="home-order-showcase" aria-labelledby="home-order-title">
    <header><div><p className="pack-order-eyebrow">Packaging order request · 订购申请</p><h2 id="home-order-title">Choose a box. Make it yours.</h2><p>Select your structure, dimensions and finishing. Send your request directly to our team for pricing and payment confirmation.</p></div><Link href="/order">Start an order request ↗</Link></header>
    <div className="home-order-track" ref={track} tabIndex={0} role="region" aria-label="Packaging types — scroll left or right">
      {BOX_TYPES.map((box,i)=><Link href={`/order?box=${box.value}`} className="home-order-card" key={box.value}>
        <div><span>0{i+1}</span><BoxOutline index={i}/></div><strong>{box.label}</strong><small>{box.detail}</small><p>Custom size · Your choice of finish</p><span className="home-order-card-action">Configure &amp; request <span aria-hidden="true">↗</span></span>
      </Link>)}
    </div>
    <div className="home-order-scroll"><p>Scroll to explore · 选择盒型开始订购申请</p><div><button type="button" onClick={()=>scroll(-1)} aria-label="Previous box type">←</button><button type="button" onClick={()=>scroll(1)} aria-label="Next box type">→</button></div></div>
  </section>;
}
