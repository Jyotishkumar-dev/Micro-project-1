/**
 * Route-level loading state for the public portfolio.
 *
 * The page itself is server-rendered from Supabase with a bundled fallback, so
 * this skeleton only appears on a cold compile or a slow network — it is
 * deliberately a lightweight page frame rather than a copy of every section.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 space-y-16">
        <div className="space-y-6">
          <div className="h-4 w-32 rounded-full bg-slate-200 dark:bg-white/5 animate-pulse" />
          <div className="h-14 w-3/4 max-w-xl rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
          <div className="h-5 w-2/3 max-w-lg rounded-full bg-slate-200 dark:bg-white/5 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-40 rounded-3xl bg-slate-200/70 dark:bg-white/[0.04] animate-pulse"
            />
          ))}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        Loading portfolio content
      </p>
    </div>
  );
}
