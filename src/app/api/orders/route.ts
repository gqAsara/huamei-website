import { submitOrderRequest } from "@/lib/order-handler";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(request: Request) { return submitOrderRequest(request); }
