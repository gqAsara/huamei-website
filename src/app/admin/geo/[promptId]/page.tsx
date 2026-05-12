import Link from "next/link";
import { notFound } from "next/navigation";
import { getRunsForPrompt, type RunDetail } from "@/lib/geo/queries";
import { RunButton } from "../RunButton";
import "../geo.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "HuameiGEO · Prompt detail",
  robots: { index: false, follow: false },
};

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toISOString().slice(0, 16).replace("T", " ");
  } catch {
    return iso;
  }
}

function RunCard({ run }: { run: RunDetail }) {
  return (
    <div className="run-card">
      <div className="run-head">
        <span className="run-engine">{run.engine}</span>
        <span className="run-model">{run.model}</span>
        <span className="run-date">{fmtDate(run.runAt)}</span>
        <span className="run-flags">
          {run.ourDomainCited ? <em className="flag flag-cited">● cited</em> : null}
          {run.ourBrandMentioned && !run.ourDomainCited ? <em className="flag flag-mentioned">◐ mentioned</em> : null}
          {!run.ourDomainCited && !run.ourBrandMentioned && !run.error ? <em className="flag flag-missed">○ not cited</em> : null}
          {run.error ? <em className="flag flag-err">✗ error</em> : null}
        </span>
      </div>
      {run.ourCitationContext ? (
        <blockquote className="run-context">
          &ldquo;{run.ourCitationContext}&rdquo;
        </blockquote>
      ) : null}
      {run.error ? (
        <pre className="run-error">{run.error}</pre>
      ) : (
        <details className="run-body">
          <summary>Full response ({run.responseText.length} chars)</summary>
          <pre>{run.responseText}</pre>
        </details>
      )}
      {run.competitorsCited?.length ? (
        <div className="run-competitors">
          <span className="lbl">Competitors cited:</span>
          {run.competitorsCited.map((c, i) => (
            <span key={i} className="chip">{c.brand}</span>
          ))}
        </div>
      ) : null}
      {run.citedUrls?.length ? (
        <details className="run-urls">
          <summary>All cited URLs ({run.citedUrls.length})</summary>
          <ul>
            {run.citedUrls.map((u, i) => (
              <li key={i}><a href={u} target="_blank" rel="noopener">{u}</a></li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

export default async function PromptDetail({
  params,
}: {
  params: Promise<{ promptId: string }>;
}) {
  const { promptId } = await params;
  const runs = await getRunsForPrompt(decodeURIComponent(promptId));
  if (runs.length === 0) notFound();

  // Group by engine
  const engines = ["claude", "openai", "perplexity"] as const;
  const byEngine = new Map<string, RunDetail[]>();
  for (const r of runs) {
    const arr = byEngine.get(r.engine) ?? [];
    arr.push(r);
    byEngine.set(r.engine, arr);
  }

  // Find prompt text from the first run (denormalized)
  const promptText = runs[0]?.promptText ?? "(unknown prompt)";

  return (
    <main className="geo-wrap geo-detail">
      <div className="back">
        <Link href="/admin/geo">← Back to matrix</Link>
      </div>
      <header className="geo-head">
        <h1 className="prompt-text">&ldquo;{promptText}&rdquo;</h1>
        <div className="geo-sub">{runs.length} total runs across {byEngine.size} engines</div>
        <div className="geo-actions">
          <RunButton
            label="▶ Re-run this prompt"
            promptId={decodeURIComponent(promptId)}
          />
        </div>
      </header>

      {engines.map((e) => {
        const list = byEngine.get(e) ?? [];
        if (list.length === 0) return (
          <section key={e} className="engine-block">
            <h2>{e}</h2>
            <p className="empty">No runs yet.</p>
          </section>
        );
        return (
          <section key={e} className="engine-block">
            <h2>{e} <span className="count">({list.length})</span></h2>
            {list.map((r) => <RunCard key={r._id} run={r} />)}
          </section>
        );
      })}
    </main>
  );
}
