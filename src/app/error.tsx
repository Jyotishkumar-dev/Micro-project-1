"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * Route-level error boundary for the public portfolio.
 *
 * A data-layer failure should never be able to take the portfolio down: every
 * Supabase read already falls back to bundled content, so reaching this
 * boundary means something unexpected broke during render. It shows a plain,
 * recoverable message instead of a blank screen or a stack trace.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Portfolio render failed:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The portfolio could not be rendered just now. This is usually
            temporary — try again, or reach out directly if it keeps happening.
          </p>
          {error.digest && (
            <p className="text-xs font-mono text-slate-400">Reference: {error.digest}</p>
          )}
        </div>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try again</span>
        </button>
      </div>
    </div>
  );
}
