"use client";

import { useCallback, useSyncExternalStore } from "react";

export type ViewMode = "section" | "tape";
const STORAGE_KEY = "pulse:view-mode";
const DEFAULT: ViewMode = "section";

let cache: ViewMode | null = null;
const listeners = new Set<() => void>();

function read(): ViewMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "section" || raw === "tape") return raw;
  } catch {}
  return DEFAULT;
}

function getSnapshot(): ViewMode {
  if (cache === null) cache = read();
  return cache;
}

function getServerSnapshot(): ViewMode {
  return DEFAULT;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useViewMode(): [ViewMode, (next: ViewMode) => void] {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const set = useCallback((next: ViewMode) => {
    cache = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    listeners.forEach((l) => l());
  }, []);
  return [mode, set];
}
