import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { HomeHeroBadges } from "@/components/home-hero-badges";
import { CategoryIconBadge } from "@/components/insurance-visuals";

type HeroMetric = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
};

type InsuranceCategoryHeroProps = {
  slug: string;
  title: string;
  summary: string;
  scenarios: string[];
  metrics: HeroMetric[];
};

export function InsuranceCategoryHero({
  slug,
  title,
  summary,
  scenarios,
  metrics,
}: InsuranceCategoryHeroProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sky-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-0 h-56 w-56 rounded-full bg-blue-600/15 blur-3xl" />

      <div className="relative space-y-8 lg:space-y-10">
        <HomeHeroBadges />

        <div className="grid gap-8 lg:grid-cols-[1.35fr_auto] lg:items-start lg:gap-10">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full border border-sky-200/80 bg-background/90 px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
              <Sparkles className="mr-2 h-4 w-4 text-sky-600" />
              Insurance / {title}
            </p>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.08]">
                {title}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
                {summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {scenarios.map((scenario) => (
                <span
                  key={scenario}
                  className="rounded-full border border-blue-200/80 bg-background/90 px-4 py-2 text-sm text-muted-foreground shadow-sm"
                >
                  {scenario}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 lg:items-end">
            <div className="rounded-3xl border border-sky-200/70 bg-gradient-to-br from-white via-sky-50/80 to-blue-50/60 p-8 shadow-lg dark:border-blue-500/25 dark:from-blue-950/40 dark:to-sky-950/20">
              <CategoryIconBadge slug={slug} label={title} size="lg" />
              <p className="mt-4 text-center text-sm font-semibold text-blue-950 dark:text-blue-50 lg:text-right">
                Coverage hub
              </p>
              <p className="mt-1 text-center text-xs text-muted-foreground lg:text-right">
                Learn · Compare · Claim
              </p>
            </div>
          </div>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-sky-200/60 bg-background/95 p-4 shadow-sm backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <dt className="text-sm font-medium text-muted-foreground">{item.label}</dt>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
              </div>
              <dd className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{item.value}</dd>
              <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
