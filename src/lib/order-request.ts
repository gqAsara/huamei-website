import { z } from "zod";

export const BOX_TYPES = [
  { value: "mailer", label: "Mailer box", detail: "飞机盒" },
  { value: "book", label: "Book-style box", detail: "书型盒" },
  { value: "folding", label: "Folding box", detail: "折叠盒" },
] as const;
export const FINISHES = ["Printed artwork", "Hot foil", "Embossing", "Debossing", "Matte finish", "Gloss finish", "Help me choose"] as const;
export const MAX_DESIGN_BYTES = 3 * 1024 * 1024;
export const ORDER_BODY_LIMIT = 4 * 1024 * 1024;
const dimension = z.coerce.number().finite().min(1).max(3000);
export const orderRequestSchema = z.object({
  requestKey: z.string().uuid(),
  boxType: z.enum(["mailer", "book", "folding"]),
  length: dimension, width: dimension, height: dimension,
  unit: z.enum(["mm", "cm", "in"]),
  quantity: z.coerce.number().int().min(1).max(1000000),
  finishes: z.array(z.enum(FINISHES)).min(1, "Choose a finish, or select Help me choose.").max(FINISHES.length),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  country: z.string().trim().min(2).max(100),
  company: z.string().trim().max(160).default(""),
  notes: z.string().trim().max(2000).default(""),
  consent: z.literal("yes"),
}).superRefine((v, ctx) => {
  const scale = v.unit === "cm" ? 10 : v.unit === "in" ? 25.4 : 1;
  if ([v.length, v.width, v.height].some(n => n * scale > 3000)) {
    ctx.addIssue({ code: "custom", path: ["length"], message: "Each dimension must be no more than 3,000 mm (300 cm / 118 in)." });
  }
});
export type OrderRequest = z.infer<typeof orderRequestSchema>;
export function validDesignFile(name: string, bytes: Uint8Array): boolean {
  const ext = name.toLowerCase().split(".").pop();
  const start = new TextDecoder().decode(bytes.subarray(0, 5));
  if (ext === "pdf") return start === "%PDF-";
  if (ext === "ai") return start === "%PDF-" || start.startsWith("%!PS");
  if (ext === "png") return [137,80,78,71,13,10,26,10].every((n,i) => bytes[i] === n);
  if (ext === "jpg" || ext === "jpeg") return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (ext === "indd") return [6,6,237,245,216,29,70,229,189,49,239,231,254,116,183,29].every((n,i)=>bytes[i]===n);
  return false;
}
