/** Shared fallback while a page's route content is loading. */
export default function Loading() {
  return (
    <div
      role="status"
      className="flex min-h-48 w-full items-center justify-center"
    >
      <span
        aria-hidden="true"
        className="size-8 animate-spin rounded-full border-2 border-gray/25 border-t-gray motion-reduce:animate-none"
      />
      <span className="sr-only">Loading page…</span>
    </div>
  );
}
