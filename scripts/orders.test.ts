import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { POST } from "../src/app/api/orders/route";
import { MAX_DESIGN_BYTES } from "../src/lib/order-request";

const originalFetch = globalThis.fetch;
const keys = ["RESEND_API_KEY","CONTACT_TO_EMAIL","CONTACT_FROM_EMAIL"] as const;
const originalEnv = Object.fromEntries(keys.map(k=>[k,process.env[k]]));
let sends: { url:string; init?:RequestInit }[];
beforeEach(()=>{
  process.env.RESEND_API_KEY="test-only-no-real-email";
  process.env.CONTACT_TO_EMAIL="intake@example.com";
  process.env.CONTACT_FROM_EMAIL="Huamei <sender@example.com>";
  sends=[];
  globalThis.fetch=async (url,init)=>{sends.push({url:String(url),init});return Response.json({id:"mock-email-id"});};
});
afterEach(()=>{globalThis.fetch=originalFetch;for(const k of keys){if(originalEnv[k]===undefined)delete process.env[k];else process.env[k]=originalEnv[k];}});
function form(){const d=new FormData();Object.entries({requestKey:"00000000-0000-4000-8000-000000000001",boxType:"mailer",length:"200",width:"150",height:"60",unit:"mm",quantity:"100",name:"Internal Test",email:"buyer@example.com",country:"United States",consent:"yes"}).forEach(([k,v])=>d.set(k,v));d.append("finishes","Hot foil");return d;}
function req(d:FormData,origin="https://huamei.io"){return new Request("https://huamei.io/api/orders",{method:"POST",headers:{origin},body:d});}

test("sends an application without artwork to the configured mailbox",async()=>{
  const r=await POST(req(form()));assert.equal(r.status,200);const result=await r.json();assert.equal(result.ok,true);assert.match(result.reference,/^HM-[A-F0-9]{16}$/);
  assert.equal(sends.length,1);assert.equal(sends[0].url,"https://api.resend.com/emails");
  const email=JSON.parse(String(sends[0].init!.body));assert.deepEqual(email.to,["intake@example.com"]);assert.equal(email.reply_to,"buyer@example.com");assert.match(email.subject,/Packaging order request — HM-/);assert.match(email.html,/200 × 150 × 60 mm/);assert.match(email.html,/Mailer box/);assert.match(email.html,/No design file yet/);assert.match(email.html,/No online payment taken/);assert.equal(email.attachments,undefined);
});
test("retry preserves provider idempotency key; changed brief uses a distinct key",async()=>{
  await POST(req(form()));await POST(req(form()));const headers=sends.map(s=>new Headers(s.init!.headers));assert.equal(headers[0].get("Idempotency-Key"),headers[1].get("Idempotency-Key"));
  const d=form();d.set("notes","Different artwork");await POST(req(d));assert.notEqual(headers[0].get("Idempotency-Key"),new Headers(sends[2].init!.headers).get("Idempotency-Key"));
});
test("valid design attachment arrives as actual bytes",async()=>{
  const d=form();d.append("designFiles",new File(["%PDF-artwork"],"artwork.pdf",{type:"application/pdf"}));assert.equal((await POST(req(d))).status,200);const mail=JSON.parse(String(sends[0].init!.body));assert.equal(mail.attachments[0].filename,"artwork.pdf");assert.equal(Buffer.from(mail.attachments[0].content,"base64").toString(),"%PDF-artwork");
});
test("all three specified box types and multiple finishes are supported",async()=>{
  for(const type of ["mailer","book","folding"]){const d=form();d.set("boxType",type);d.append("finishes","Embossing");assert.equal((await POST(req(d))).status,200);}
  for(const send of sends){const mail=JSON.parse(String(send.init!.body));assert.match(mail.html,/Embossing/);assert.match(mail.html,/Hot foil/);}
});
test("invalid dimensions, units, quantities and finishes cannot send",async()=>{
  for(const [field,value] of [["length","0"],["length","Infinity"],["quantity","1.5"],["quantity","-1"],["unit","meters"],["boxType","other"],["finishes","unknown"]]){const d=form();d.set(field,value);assert.equal((await POST(req(d))).status,400);}
  const d=form();d.set("unit","in");d.set("length","200");assert.equal((await POST(req(d))).status,400);assert.equal(sends.length,0);
});
test("missing consent, duplicate fields, trap and cross-origin are rejected",async()=>{
  const a=form();a.delete("consent");assert.equal((await POST(req(a))).status,400);const b=form();b.append("quantity","1");assert.equal((await POST(req(b))).status,400);const c=form();c.set("website","bot");assert.equal((await POST(req(c))).status,400);assert.equal((await POST(req(form(),"https://other.example"))).status,403);assert.equal(sends.length,0);
});
test("file count, aggregate size, signature and unexpected fields are rejected",async()=>{
  const a=form();for(let i=0;i<3;i++)a.append("designFiles",new File(["%PDF-test"],`${i}.pdf`));assert.equal((await POST(req(a))).status,400);
  const b=form();b.append("designFiles",new File([new Uint8Array(MAX_DESIGN_BYTES+1)],"big.pdf"));assert.equal((await POST(req(b))).status,400);
  const c=form();c.append("designFiles",new File(["<script>"],"bad.png"));assert.equal((await POST(req(c))).status,400);
  const d=form();d.append("otherFile",new File(["%PDF-test"],"test.pdf"));assert.equal((await POST(req(d))).status,400);assert.equal(sends.length,0);
});
test("absent email configuration or provider rejection never claims sent",async()=>{
  delete process.env.RESEND_API_KEY;assert.equal((await POST(req(form()))).status,503);assert.equal(sends.length,0);process.env.RESEND_API_KEY="test-only";
  globalThis.fetch=async()=>Response.json({error:"rejected"},{status:429});let r=await POST(req(form()));assert.equal(r.status,502);assert.equal((await r.json()).reference,undefined);
  globalThis.fetch=async()=>{throw Error("timeout");};r=await POST(req(form()));assert.equal(r.status,502);assert.equal((await r.json()).ok,undefined);
});
