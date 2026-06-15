/**
 * JsonLd — renders schema.org JSON-LD as a <script> tag.
 * Must be a Server Component so it renders only on the server,
 * avoiding the React 19 "script tag inside React component" warning
 * that fires during client-side navigation when inline scripts appear
 * in the component tree.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
    />
  );
}
