import Link from "next/link";
import { ArrowRight, BookOpenText, Calculator, FileSearch, ShieldCheck } from "lucide-react";

export default function ResourcesPage() {
  const resourceTracks = [
    {
      title: "Coverage learning track",
      description: "Understand coverage terms, deductible logic, and category-specific risk trade-offs.",
      href: "/guides",
      cta: "Browse guides",
      icon: BookOpenText,
    },
    {
      title: "Claims preparation track",
      description: "Review filing steps, timelines, and practical case references before incidents occur.",
      href: "/claims",
      cta: "Open claims center",
      icon: FileSearch,
    },
    {
      title: "Comparison track",
      description: "Compare products and providers with a consistent channel-by-channel framework.",
      href: "/insurance",
      cta: "Start comparing",
      icon: ShieldCheck,
    },
  ];
  const upcomingTools = [
    "Premium and deductible scenario calculator",
    "Coverage term glossary for faster policy reading",
    "State and regional insurance requirement references",
    "Plan comparison worksheets for family decision-making",
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-2xl border bg-gradient-to-br from-blue-600/[0.08] via-cyan-500/[0.05] to-card p-6 lg:p-8">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
          Explore More Insurance Resources
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          This section brings together practical tools, explainers, and reference content to make
          insurance comparisons easier and more consistent.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-lg border bg-background/90 p-3">
            <p className="text-xs text-muted-foreground">Resource tracks</p>
            <p className="mt-1 text-xl font-semibold">{resourceTracks.length}</p>
          </article>
          <article className="rounded-lg border bg-background/90 p-3">
            <p className="text-xs text-muted-foreground">Upcoming tools</p>
            <p className="mt-1 text-xl font-semibold">{upcomingTools.length}</p>
          </article>
          <article className="rounded-lg border bg-background/90 p-3">
            <p className="text-xs text-muted-foreground">Primary use cases</p>
            <p className="mt-1 text-xl font-semibold">Learn + Compare + Claim</p>
          </article>
          <article className="rounded-lg border bg-background/90 p-3">
            <p className="text-xs text-muted-foreground">Navigation style</p>
            <p className="mt-1 text-xl font-semibold">Quick paths</p>
          </article>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border bg-gradient-to-br from-card via-cyan-500/[0.02] to-blue-500/[0.03] p-5">
        <h2 className="text-2xl font-semibold tracking-tight">Resource tracks</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {resourceTracks.map((track) => (
            <article key={track.title} className="rounded-xl border bg-background/90 p-4 shadow-sm">
              <p className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
                <track.icon className="h-4 w-4" />
              </p>
              <p className="mt-3 font-medium">{track.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{track.description}</p>
              <Link
                href={track.href}
                className="mt-3 inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                {track.cta}
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border bg-gradient-to-br from-card to-indigo-500/[0.03] p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Planned tools and references</h2>
          <Link href="/content-map" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            Open content map
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {upcomingTools.map((item) => (
            <article key={item} className="rounded-xl border bg-background/90 p-4 text-sm text-muted-foreground">
              <p className="inline-flex items-center gap-2 font-medium text-foreground">
                <Calculator className="h-4 w-4 text-cyan-600" />
                {item}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
