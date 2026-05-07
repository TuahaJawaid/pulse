import { Suspense } from "react";
import { format } from "date-fns";
import { aggregateNews } from "@/lib/aggregator";
import { WireMasthead } from "@/components/wire/wire-masthead";
import { WireDossier } from "@/components/wire/wire-dossier";
import { WireConsole } from "@/components/wire/wire-console";
import { WireFooter } from "@/components/wire/wire-footer";
import { WireTape } from "@/components/wire/wire-tape";
import { HomeJsonLd } from "@/components/wire/home-json-ld";

export const revalidate = 300;

export default async function Home() {
  const { items, stats } = await aggregateNews();

  const lead =
    [...items].sort((a, b) => (b.signalScore ?? 0) - (a.signalScore ?? 0))[0] ??
    null;

  const now = new Date();
  const dayOfYear = Math.ceil(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  const cycle = `${format(now, "yyyy.MM.dd HH:mm")} UTC · CYC ${dayOfYear
    .toString()
    .padStart(3, "0")}`;

  return (
    <div className="wire-root wire-scanlines">
      <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8 pb-8">
        <WireMasthead
          cycle={cycle}
          stats={{
            stories: stats.totalStories,
            hot: stats.hotSignals,
            capital: items.filter((i) => i.category === "funding").length,
          }}
        />
        <WireTape items={items} />
        <WireDossier
          lead={lead}
          cycleStats={{
            stories: stats.totalStories,
            capital: items.filter((i) => i.category === "funding").length,
            launches: stats.majorLaunches,
            research: stats.researchPapers,
          }}
          newSinceLabel={null}
        />
        <Suspense
          fallback={
            <p
              className="py-10 text-[12px] uppercase tracking-[0.18em]"
              style={{ color: "var(--wire-mute)" }}
            >
              &gt; tuning the wire…
            </p>
          }
        >
          <WireConsole items={items} />
        </Suspense>
        <WireFooter refreshSeconds={revalidate} />
      </div>
      <HomeJsonLd items={items} />
    </div>
  );
}
