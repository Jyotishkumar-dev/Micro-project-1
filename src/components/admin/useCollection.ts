"use client";

import { useCallback, useEffect, useState } from "react";
import type { Result } from "@/lib/data/admin";

/**
 * Small collection hook shared by every admin CRUD screen.
 *
 * Holds the same three states the spec asks for — loading, error, empty — in
 * one place so each manager only has to describe its own table and form. The
 * loader must be a stable reference (a module-level function), otherwise the
 * effect re-runs on every render.
 */
export function useCollection<T>(loader: () => Promise<Result<T[]>>) {
  const [items, setItems] = useState<T[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setStatus("loading");
    setError(null);

    const result = await loader();

    if (result.ok) {
      setItems(result.data);
      setStatus("ready");
    } else {
      setError(result.error);
      setStatus("error");
    }
  }, [loader]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { items, setItems, status, error, reload };
}

/** Tracks an in-flight mutation so buttons can show progress and be disabled. */
export function useMutation() {
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "error" | "success";
    message: string;
  } | null>(null);

  const run = useCallback(
    async (action: () => Promise<{ ok: boolean; error?: string }>, successMessage: string) => {
      setBusy(true);
      setFeedback(null);

      const result = await action();

      setBusy(false);
      setFeedback(
        result.ok
          ? { tone: "success", message: successMessage }
          : { tone: "error", message: result.error ?? "Something went wrong." }
      );

      return result.ok;
    },
    []
  );

  return { busy, feedback, setFeedback, run };
}
