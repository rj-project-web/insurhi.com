import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

import { HomeHeroBadges } from "@/components/home-hero-badges";

export type HubIndexStat = {
  label: string;
  value: string;
  icon: LucideIcon;
};

type HubIndexHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats: HubIndexStat[];
  visual?: ReactNode;
};

export function HubIndexHero({ eyebrow, title, description, stats, visual }: HubIndexHeroProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-0 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.35fr_auto] lg:items-start lg:gap-10">
        <div className="space-y-6">
          <HomeHeroBadges />

          <div className="space-y-4">
            <p className="inline-flex items-center rounded-full border border-sky-200/80 bg-background/90 px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
              <Sparkles className="mr-2 h-4 w-4 text-sky-600" />
              {eyebrow}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.12]">
              {title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {description}
            </p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border/70 bg-background/90 p-3 shadow-sm"
                >
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 text-sky-600" />
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground sm:text-base">
                    {stat.value}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        {visual ? <div className="flex justify-center lg:justify-end">{visual}</div> : null}
      </div>
    </div>
  );
}
