"use client";

import { useState } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "starting" }
  | { kind: "started"; total: number; remaining: number; processed: number }
  | { kind: "error"; message: string };

export function RunButton({
  label = "▶ Run all now",
  promptId,
  className = "btn",
}: {
  label?: string;
  promptId?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function trigger() {
    setStatus({ kind: "starting" });
    try {
      const url = promptId
        ? `/api/cron/geo-probe?promptId=${encodeURIComponent(promptId)}`
        : `/api/cron/geo-probe`;
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setStatus({
          kind: "error",
          message: json.error ?? `HTTP ${res.status}`,
        });
        return;
      }
      // Single-prompt response shape differs from batched.
      if (json.mode === "single-prompt") {
        setStatus({
          kind: "started",
          total: 1,
          processed: 1,
          remaining: 0,
        });
        return;
      }
      setStatus({
        kind: "started",
        total: json.total ?? 0,
        processed: json.processed ?? 0,
        remaining: json.remaining ?? 0,
      });
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  if (status.kind === "started") {
    const totalBatches = Math.ceil(status.total / Math.max(1, status.processed));
    return (
      <span className="run-feedback">
        ✓ First batch of {status.processed} done.{" "}
        {status.remaining > 0
          ? `${status.remaining} prompts queued (auto-chains every ~2 min, ~${totalBatches - 1} more batches).`
          : "All prompts complete."}{" "}
        Refresh in ~{status.remaining > 0 ? "5–10" : "0"} min for full results.
      </span>
    );
  }
  if (status.kind === "error") {
    return (
      <span className="run-feedback err">
        ✗ {status.message}
      </span>
    );
  }
  return (
    <button
      type="button"
      className={className}
      onClick={trigger}
      disabled={status.kind === "starting"}
    >
      {status.kind === "starting" ? "Starting…" : label}
    </button>
  );
}
