"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import BoxOutline from "./BoxOutline";
import { BOX_TYPES, FINISHES, MAX_DESIGN_BYTES } from "@/lib/order-request";

export default function PackagingOrderForm({initialBox="mailer"}:{initialBox?:string}) {
  const [reference, setReference] = useState("");
  const [box, setBox] = useState(initialBox);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const key = useRef<string | null>(null);
  const lock = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const files = data.getAll("designFiles").filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length > 2 || files.reduce((n,f) => n+f.size,0) > MAX_DESIGN_BYTES) { setError("Please upload up to 2 files, maximum 3 MiB combined. You can also submit without a file."); return; }
    key.current ??= crypto.randomUUID();
    data.set("requestKey", key.current);
    lock.current = true; setPending(true); setError("");
    try {
      const response = await fetch("/api/orders", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok || !result.reference || result.ok !== true) {
        if (response.status === 409) key.current = null;
        throw new Error(result.error || "Unable to send your request. Please try again.");
      }
      setReference(result.reference);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection interrupted. Please try again; no payment has been taken.");
      lock.current = false; setPending(false);
    }
  }

  if (reference) return <section className="pack-order-receipt" role="status" tabIndex={-1} ref={el=>el?.focus()}>
    <div className="pack-order-record"><div><span>Request sent</span><strong>{reference}</strong></div><div><span>Status</span><strong>Awaiting quotation</strong></div></div>
    <h2>Thank you. Your request has been sent.</h2>
    <p>Our email service has accepted your request for delivery to the Huamei team. Keep the reference above when contacting us. Final pricing, delivery and payment arrangements will be confirmed by email. No payment has been taken.</p>
    <p>Need to update your details? Email <a href={`mailto:info@huamei.io?subject=${encodeURIComponent(reference)}`}>info@huamei.io</a> with your reference. Please do not send the same request again.</p>
    <div className="pack-order-actions"><Link href="/">Return to homepage ↗</Link><Link href="/order" onClick={()=>{setReference("");setPending(false);lock.current=false;key.current=null;setFileNames([]);setBox("mailer");}}>Start another request</Link></div>
  </section>;

  return <form className="pack-order-form" onSubmit={submit} aria-busy={pending}>
    <fieldset disabled={pending}>
      <legend><span>01</span> Choose your box</legend>
      <div className="pack-order-types">
        {BOX_TYPES.map((item, i) => <label className={`pack-order-type ${box === item.value ? "is-selected" : ""}`} key={item.value}>
          <input type="radio" name="boxType" value={item.value} checked={box === item.value} onChange={() => setBox(item.value)} />
          <BoxOutline index={i} />
          <strong>{item.label}</strong><small>{item.detail}</small>
        </label>)}
      </div>
    </fieldset>

    <fieldset disabled={pending}>
      <legend><span>02</span> Size &amp; quantity</legend>
      <p className="pack-order-hint">Enter the inside dimensions of your finished box. Final structure and feasibility will be confirmed with you.</p>
      <div className="pack-order-dimensions">
        <label>Length<input name="length" type="number" inputMode="decimal" min="1" max="3000" step="0.1" required placeholder="e.g. 200" /></label>
        <label>Width<input name="width" type="number" inputMode="decimal" min="1" max="3000" step="0.1" required placeholder="e.g. 150" /></label>
        <label>Height<input name="height" type="number" inputMode="decimal" min="1" max="3000" step="0.1" required placeholder="e.g. 60" /></label>
        <label>Unit<select name="unit" defaultValue="mm"><option value="mm">mm</option><option value="cm">cm</option><option value="in">inches</option></select></label>
      </div>
      <label className="pack-order-quantity">Quantity<input name="quantity" type="number" inputMode="numeric" min="1" max="1000000" step="1" required placeholder="Number of boxes" /></label>
      <p className="pack-order-hint">Minimum quantities depend on the structure, materials and finish. Submitting a request does not confirm production availability.</p>
    </fieldset>

    <fieldset disabled={pending}>
      <legend><span>03</span> Finishing &amp; artwork</legend>
      <div className="pack-order-finishes">{FINISHES.map(f => <label key={f}><input type="checkbox" name="finishes" value={f} defaultChecked={f === "Help me choose"} />{f}</label>)}</div>
      <label className="pack-order-upload">Design files <span>Optional</span>
        <input type="file" className="pack-order-file-input" aria-label="Upload design files" name="designFiles" multiple accept=".pdf,.ai,.indd,.png,.jpg,.jpeg" onChange={e => setFileNames(Array.from(e.target.files || []).map(f => f.name))} />
        <span className="pack-order-file-control">Choose files</span>
        <small role="status">{fileNames.length ? fileNames.join(" · ") : "No files selected"}</small>
        <small>PDF, AI, INDD, PNG or JPG · up to 2 files / 3 MiB total</small>
      </label>
      <p className="pack-order-hint">No artwork yet? Leave this empty and tell us what you need. For larger files, request a secure transfer method in your notes.</p>
      <label>Project notes <span className="pack-order-optional">Optional</span><textarea name="notes" maxLength={2000} rows={3} placeholder="Materials, intended contents, target delivery date, or design assistance…" /></label>
    </fieldset>

    <fieldset disabled={pending}>
      <legend><span>04</span> Your details</legend>
      <div className="pack-order-contact">
        <label>Name<input name="name" autoComplete="name" maxLength={100} required /></label>
        <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
        <label>Company <span className="pack-order-optional">Optional</span><input name="company" autoComplete="organization" maxLength={160} /></label>
        <label>Destination country / region<input name="country" autoComplete="country-name" minLength={2} maxLength={100} required /></label>
      </div>
      <div className="pack-order-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="pack-order-consent"><input name="consent" type="checkbox" value="yes" required />
        <span>I agree to the <a href="/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a> and understand this is an order request. Pricing, shipping, availability and payment instructions will be confirmed before payment.</span>
      </label>
    </fieldset>
    <div className="pack-order-submit">
      <div><strong>No payment required now.</strong><p>Your specification and design files are emailed to our team. Our team will confirm the quotation and payment arrangements by email.</p></div>
      <button type="submit" disabled={pending}>{pending ? "Sending your request…" : "Submit order request"}<span aria-hidden="true">↗</span></button>
    </div>
    {error && <p className="pack-order-error" role="alert">{error}</p>}
  </form>;
}
