"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

export function WireThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const next = resolvedTheme === "dark" ? "light" : "dark";
  const label = mounted
    ? resolvedTheme === "dark"
      ? "[NIGHT]"
      : "[DAY  ]"
    : "[----] ";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label="Toggle theme"
      className="text-[10px] uppercase tracking-[0.18em]"
    >
      {label}
    </button>
  );
}
