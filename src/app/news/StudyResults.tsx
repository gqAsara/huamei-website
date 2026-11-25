import type { PackagingStudy } from "@/lib/news";

export function StudyResults({ study, date }: { study: PackagingStudy; date: string }) {
  return (
    <div className="packaging-study">
      <section><h2>Methods</h2><p>{study.method}</p></section>
      <section id="data">
        <h2>Results</h2>
        <div className="study-table-wrap" role="region" aria-label={study.title} tabIndex={0}>
          <table>
            <caption>{study.title}</caption>
            <thead><tr>{study.columns.map((column, index) => <th key={index} scope="col">{column}</th>)}</tr></thead>
            <tbody>{study.rows.map((row, index) => <tr key={index}>
              <th scope="row">{row.cells[0]}</th>
              {row.cells.slice(1).map((value, col) => <td key={col}>{value}</td>)}
            </tr>)}</tbody>
          </table>
        </div>
        <a className="news-action" href={"/news/" + date + "/data.csv"} download>Download data (CSV)</a>
      </section>
      <section><h2>Findings</h2><ul>{study.findings.map((finding) => <li key={finding}>{finding}</li>)}</ul></section>
      <section><h2>Limitations</h2><p>{study.limitations}</p></section>
    </div>
  );
}
