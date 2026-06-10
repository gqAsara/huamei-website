"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";

// Fires a GA4 `generate_lead` conversion exactly once per submission.
// /api/commission 303-redirects here with ?i=<industry>&q=<qty> so the
// event carries lead-mix dimensions without exposing anything sensitive.
// The sessionStorage guard keeps refreshes and back-button revisits from
// double-counting; a direct visit with no params is recorded as untagged
// (rare — the page is noindex and only linked from the form flow).
export function LeadEvent() {
  const params = useSearchParams();
  const industry = params.get("i") ?? "";
  const qty = params.get("q") ?? "";

  useEffect(() => {
    if (sessionStorage.getItem("hm_lead_sent")) return;
    sessionStorage.setItem("hm_lead_sent", "1");
    sendGAEvent("event", "generate_lead", {
      form: "begin",
      industry,
      quantity_band: qty,
    });
  }, [industry, qty]);

  return null;
}
