import Link from "next/link";
import {
  getAllPrompts,
  getLatestRunsMatrix,
  dedupeMatrixToLatest,
  computeShareOfVoice,
  getRecentRunCount,
  type Prompt,
  type RunSummary,
} from "@/lib/geo/queries";
import { RunButton } from "./RunButton";
import "./geo.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "HuameiGEO",
  robots: { index: false, follow: false },
};

const ENGINES = ["claude", "openai", "perplexity"] as const;

function CitationCell({ r }: { r: RunSummary | undefined }) {
  if (!r) return <td className="cell empty">—</td>;
  if (r.error) {
    return (
      <td className="cell err" title={r.error}>
        ✗
      </td>
    );
  }
  if (r.ourDomainCited) return <td className="cell cited" title="Domain cited">●</td>;
  if (r.ourBrandMentioned) return <td className="cell mentioned" title="Brand mentioned (no link)">◐</td>;
  return <td className="cell missed" title="Not cited">○</td>;
}

function StageGroup({ stage, label }: { stage: string; label: string }) {
  return (
    <tr className="group">
      <td colSpan={ENGINES.length + 2} className="group-head">
        {label}
      </td>
    </tr>
  );
}

export default async function GeoDashboard({
  searchParams,
}: {
  searchParams: Promise<{ triggered?: string }>;
}) {
  const params = await searchParams;
  const justTriggered = params.triggered === "1";

  const [prompts, runsAll, recentRunsLast10Min] = await Promise.all([
    getAllPrompts(),
    getLatestRunsMatrix(),
    getRecentRunCount(600), // 10 min window for "probing now" indicator
  ]);

  const latest = dedupeMatrixToLatest(runsAll);
  const sov = computeShareOfVoice(latest);
  const isProbing = recentRunsLast10Min > 0;

  // Index: promptId × engine → latest run
  const byKey = new Map<string, RunSummary>();
  for (const r of latest) byKey.set(`${r.promptId}::${r.engine}`, r);

  // Group prompts by stage
  const stages: { key: string; label: string }[] = [
    { key: "discovery", label: "Discovery" },
    { key: "evaluation", label: "Evaluation" },
    { key: "comparison", label: "Comparison" },
    { key: "decision", label: "Decision" },
    { key: "procurement", label: "Procurement" },
  ];
  const byStage = new Map<string, Prompt[]>();
  for (const p of prompts) {
    if (!p.isActive) continue;
    const arr = byStage.get(p.stage) ?? [];
    arr.push(p);
    byStage.set(p.stage, arr);
  }

  return (
    <main className="geo-wrap">
      <header className="geo-head">
        <h1>HuameiGEO</h1>
        <div className="geo-sub">
          {prompts.filter((p) => p.isActive).length} active prompts ·{" "}
          {ENGINES.length} engines · weekly cadence
        </div>
        <div className="geo-actions">
          <RunButton />
          <Link className="btn" href="/studio">↗ Manage prompts in Studio</Link>
          {isProbing ? (
            <span className="probing-indicator">
              <span className="dot" /> Probing — {recentRunsLast10Min} runs in last 10 min
            </span>
          ) : null}
        </div>
        {justTriggered ? (
          <div className="run-banner">
            ✓ Probe started. First batch in ~2 min, full sweep ~10–15 min.
            Refresh this page to see results as they arrive.
          </div>
        ) : null}
      </header>

      <section className="geo-sov">
        <div className="geo-sov-row">
          <div className="metric">
            <div className="num">{sov.shareOfVoicePct}%</div>
            <div className="lbl">huamei.io cited (latest run per prompt × engine)</div>
          </div>
          <div className="metric">
            <div className="num">{sov.huameiCited}</div>
            <div className="lbl">cited (domain link)</div>
          </div>
          <div className="metric">
            <div className="num">{sov.huameiMentioned}</div>
            <div className="lbl">mentioned (brand name)</div>
          </div>
          <div className="metric">
            <div className="num">{sov.totalRuns}</div>
            <div className="lbl">total tracked</div>
          </div>
        </div>
        {sov.competitorCounts.length > 0 ? (
          <div className="geo-comp">
            <span className="lbl">Top competitor citations:</span>
            {sov.competitorCounts.slice(0, 5).map((c) => (
              <span key={c.brand} className="chip">
                {c.brand} · {c.count}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <section className="geo-matrix">
        <table>
          <thead>
            <tr>
              <th className="th-prompt">Prompt</th>
              <th className="th-prio">P</th>
              {ENGINES.map((e) => (
                <th key={e} className="th-eng">{e}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stages.map(({ key, label }) => {
              const list = byStage.get(key) ?? [];
              if (list.length === 0) return null;
              return (
                <>
                  <StageGroup key={`g-${key}`} stage={key} label={label} />
                  {list.map((p) => (
                    <tr key={p._id}>
                      <td className="td-prompt">
                        <Link href={`/admin/geo/${encodeURIComponent(p._id)}`}>
                          {p.text}
                        </Link>
                      </td>
                      <td className="td-prio">{p.priority}</td>
                      {ENGINES.map((e) => (
                        <CitationCell key={e} r={byKey.get(`${p._id}::${e}`)} />
                      ))}
                    </tr>
                  ))}
                </>
              );
            })}
          </tbody>
        </table>
      </section>

      <footer className="geo-foot">
        <div>● cited &middot; ◐ mentioned &middot; ○ not cited &middot; ✗ error &middot; — no run yet</div>
        <div>Click any prompt to see the full response from each engine.</div>
      </footer>
    </main>
  );
}
