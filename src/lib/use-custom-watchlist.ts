"use client";

import { useSyncExternalStore } from "react";

const EMPTY: string[] = [];
let cache: string[] | null = null;

function getSnapshot(): string[] {
  if (cache !== null) return cache;
  try {
    const param = new URLSearchParams(window.location.search).get("w");
    if (!param) {
      cache = EMPTY;
      return cache;
    }
    cache = param
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function subscribe() {
  return () => {};
}

/**
 * Reads `?w=token1,token2` from the URL once. Returns lowercased tokens.
 * Empty array when missing — caller decides what to do.
 */
export function useCustomWatchlist(): string[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
