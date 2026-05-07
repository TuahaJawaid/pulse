import { NextRequest } from "next/server";
import { aggregateNews } from "@/lib/aggregator";
import { todayUTC, trimForArchive, type DaySnapshot } from "@/lib/archive";
import { writeSnapshot } from "@/lib/archive-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return new Response("Unauthorized", { status: 401 });
}

export async function GET(req: NextRequest) {
  // Vercel Cron sends an Authorization: Bearer <CRON_SECRET> header. Allow
  // requests without a secret too if the env isn't set, so manual invocation
  // works in dev.
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${expected}`) return unauthorized();
  }

  const { items, stats } = await aggregateNews();
  const date = todayUTC();
  const snapshot: DaySnapshot = {
    date,
    capturedAt: new Date().toISOString(),
    items: trimForArchive(items),
    stats,
  };

  const url = await writeSnapshot(snapshot);
  return Response.json({
    ok: true,
    date,
    items: snapshot.items.length,
    url,
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  });
}
