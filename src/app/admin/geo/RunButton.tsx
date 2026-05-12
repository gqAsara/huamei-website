/**
 * Simple form-POST trigger. Posts to /admin/geo/run (basic-auth gated by
 * proxy.ts — browser sends cached creds automatically). The route fires
 * the cron in the background and redirects back to /admin/geo?triggered=1.
 *
 * This is a server-component-friendly version: no client JS required.
 * Feedback banner is rendered by the dashboard reading ?triggered=1.
 */

export function RunButton({
  label = "▶ Run all now",
  promptId,
  className = "btn",
}: {
  label?: string;
  promptId?: string;
  className?: string;
}) {
  const action = promptId
    ? `/admin/geo/run?promptId=${encodeURIComponent(promptId)}`
    : `/admin/geo/run`;
  return (
    <form action={action} method="post" style={{ display: "inline" }}>
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
