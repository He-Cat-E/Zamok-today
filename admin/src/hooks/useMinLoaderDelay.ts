"use client";

import { useEffect, useState } from "react";

/** Minimum time the admin splash loader stays visible (matches public frontend). */
export const ADMIN_MIN_LOADER_MS = 3000;

export function useMinLoaderDelay(ms = ADMIN_MIN_LOADER_MS) {
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setElapsed(true), ms);
    return () => window.clearTimeout(id);
  }, [ms]);

  return elapsed;
}
