"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "pulse:hidden";
const EMPTY: Set<string> = new Set();

let cache: Set<string> | null = null;
const listeners = new Set<() => void>();

function read(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed);
  } catch {}
  return new Set();
}

function getSnapshot(): Set<string> {
  if (cache === null) cache = read();
  return cache;
}

function getServerSnapshot(): Set<string> {
  return EMPTY;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = read();
      listeners.forEach((l) => l());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function persist(next: Set<string>) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {}
  listeners.forEach((l) => l());
}

export function useHiddenStories() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const hide = useCallback((id: string) => {
    const next = new Set(getSnapshot());
    next.add(id);
    persist(next);
  }, []);

  const unhide = useCallback((id: string) => {
    const next = new Set(getSnapshot());
    next.delete(id);
    persist(next);
  }, []);

  const clear = useCallback(() => {
    persist(new Set());
  }, []);

  return { ids, hide, unhide, clear, count: ids.size };
}
