import { DaySnapshot, snapshotPath } from "./archive";

/**
 * Thin wrapper around @vercel/blob that gracefully no-ops when the
 * BLOB_READ_WRITE_TOKEN env var is absent (local dev without Blob configured).
 * Read paths return null; write paths silently succeed.
 */
function isConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function writeSnapshot(snapshot: DaySnapshot): Promise<string | null> {
  if (!isConfigured()) {
    console.warn("[Pulse archive] BLOB_READ_WRITE_TOKEN missing — snapshot skipped");
    return null;
  }
  const { put } = await import("@vercel/blob");
  const blob = await put(snapshotPath(snapshot.date), JSON.stringify(snapshot), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return blob.url;
}

export async function readSnapshot(date: string): Promise<DaySnapshot | null> {
  if (!isConfigured()) return null;
  const { list } = await import("@vercel/blob");
  const path = snapshotPath(date);
  const result = await list({ prefix: path, limit: 1 });
  const blob = result.blobs.find((b) => b.pathname === path);
  if (!blob) return null;
  const res = await fetch(blob.url, { next: { revalidate: 86_400 } });
  if (!res.ok) return null;
  return (await res.json()) as DaySnapshot;
}

export async function listSnapshots(): Promise<{ date: string; url: string; size: number }[]> {
  if (!isConfigured()) return [];
  const { list } = await import("@vercel/blob");
  const result = await list({ prefix: "archive/", limit: 1000 });
  return result.blobs
    .map((b) => {
      const m = b.pathname.match(/archive\/(\d{4}-\d{2}-\d{2})\.json$/);
      return m ? { date: m[1], url: b.url, size: b.size } : null;
    })
    .filter((x): x is { date: string; url: string; size: number } => x !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
