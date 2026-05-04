// Render any JSON-LD payload as a <script type="application/ld+json">
// tag. Server-renders as part of the React tree so crawlers see it
// in the initial HTML.

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
