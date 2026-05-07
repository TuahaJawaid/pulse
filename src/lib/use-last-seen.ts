"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "pulse:last-seen";
let cache: { previous: Date | null } | null = null;

/**
 * Returns the timestamp of the previous visit (null on first visit). On the
 * very first read on the client, this hook also bumps `last-seen` to "now"
 * so the *next* visit shows the diff.
 */
function getSnapshot(): { previous: Date | null } {
  if (cache !== null) return cache;
  let previous: Date | null = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const d = new Date(raw);
      if (!Number.isNaN(d.getTime())) previous = d;
    }
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  } catch {}
  cache = { previous };
  return cache;
}

const SERVER_SNAPSHOT = { previous: null };
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

function subscribe() {
  return () => {};
}

export function useLastSeen(): { previous: Date | null } {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
