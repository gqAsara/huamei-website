import { getNewsIssue } from "@/lib/news";

export const dynamic = "force-static";
export const revalidate = 60;

function csvField(value: string): string {
  // Keep numeric cells usable. Treat any other spreadsheet formula as plain text.
  const formula = /^[\s\uFEFF]*[=+@-]/.test(value) && !/^[+-]?\d+(?:\.\d+)?%?$/.test(value.trim());
  return '"' + (formula ? "'" : "") + value.replaceAll('"', '""') + '"';
}

export async function GET(_request: Request, { params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const study = (await getNewsIssue(date))?.study;
  if (!study) return new Response(null, { status: 404 });
  const csv = [study.columns, ...study.rows.map((row) => row.cells)]
    .map((row) => row.map(csvField).join(",")).join("\r\n") + "\r\n";
  return new Response(csv, { headers: {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": 'attachment; filename="huamei-packaging-study-' + date + '.csv"',
  } });
}
