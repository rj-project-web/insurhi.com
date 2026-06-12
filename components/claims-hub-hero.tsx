import Link from "next/link";
import {
  ClipboardList,
  FileCheck2,
  FolderOpen,
  Layers,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { HomeHeroBadges } from "@/components/home-hero-badges";

type ClaimsHubStat = {
  label: string;
  value: string;
  icon: typeof FileCheck2;
};

type ClaimsHubHeroProps = {
  stats: ClaimsHubStat[];
};

export function ClaimsHubHero({ stats }: ClaimsHubHeroProps) {
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
              Claims readiness center
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.12]">
              Claims assistance
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Step-by-step claim playbooks, document checklists, and real case examples — so you
              file correctly the first time and avoid common denials.
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

        <ClaimsWorkflowVisual />
      </div>
    </div>
  );
}

function ClaimsWorkflowVisual() {
  const steps = [
    {
      label: "Prepare",
      detail: "Gather documents before FNOL",
      icon: FolderOpen,
    },
    {
      label: "File",
      detail: "Follow the step-by-step playbook",
      icon: ClipboardList,
    },
    {
      label: "Follow up",
      detail: "Track delays and denials",
      icon: ShieldAlert,
    },
  ];

  return (
    <section
      aria-label="Claims workflow"
      className="relative w-full overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 p-5 text-white shadow-lg dark:border-blue-500/25"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="relative space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
            Claim workflow
          </p>
          <p className="mt-2 text-lg font-semibold tracking-tight">From incident to settlement</p>
        </div>
        <ol className="space-y-3">
          {steps.map(({ label, detail, icon: Icon }, index) => (
            <li
              key={label}
              className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-900">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-sky-100">Step {index + 1}</p>
                <p className="font-semibold">{label}</p>
                <p className="mt-0.5 text-sm text-sky-100/90">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <Link
          href="#claims-playbooks"
          className="inline-flex items-center text-sm font-medium text-sky-100 hover:text-white"
        >
          Browse all playbooks
          <Layers className="ml-1.5 h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
