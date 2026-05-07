import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-[900px] items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime text-base font-bold text-lime-foreground">
              P
            </div>
            <span className="text-xl font-semibold tracking-tight">Pulse</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[900px] flex-1 px-6 py-10">
        <div className="space-y-8">
          <section>
            <p className="mb-3 text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">
              About
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">
              Public AI news signal, without a login.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Pulse tracks AI stories from Hacker News, Reddit, RSS publishers,
              and ArXiv, then groups them by category, company, source, and
              recency. It does not generate paid AI briefings.
            </p>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            {[
              ["Sources", "Hacker News, Reddit, RSS, and ArXiv."],
              ["Refresh", "The homepage revalidates every 5 minutes."],
              ["Ranking", "Signal scores are rule-based and free to run."],
              ["Bookmarks", "Saved stories stay in your browser only."],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">
                  {label}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                  {value}
                </p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
