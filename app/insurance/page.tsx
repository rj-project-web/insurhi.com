import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { getCategories } from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { insuranceCategories } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Insurance Categories",
  description:
    "Browse auto, life, home, pet, medicare, and renters insurance comparisons and learning resources.",
  path: "/insurance",
});

export default async function InsurancePage() {
  const cmsCategories = await getCategories();
  const categories =
    cmsCategories.length > 0
      ? cmsCategories.map((category) => ({ slug: category.slug, title: category.title }))
      : insuranceCategories;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Insurance", path: "/insurance" },
  ]);
  const quickActions = [
    {
      title: "Compare insurance products",
      description: "Open side-by-side snapshots for pricing, coverage amount, and deductible signals.",
      href: "/products",
      cta: "Browse products",
    },
    {
      title: "Review provider shortlist",
      description: "Check provider pages for ratings, summaries, and regional availability context.",
      href: "/providers",
      cta: "Browse providers",
    },
    {
      title: "Prepare for claims",
      description: "Use claims guides and case references to understand document and timeline expectations.",
      href: "/claims",
      cta: "Open claims center",
    },
  ];
  const comparisonHighlights = [
    "Category-specific guidance for major insurance needs.",
    "Coverage, deductible, and provider confidence context in one flow.",
    "Mobile-friendly structure for fast scanning and quick decisions.",
  ];

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="space-y-4 rounded-2xl border bg-gradient-to-br from-blue-600/[0.08] via-cyan-500/[0.05] to-card p-6 lg:p-8">
        <p className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="mr-1 h-3.5 w-3.5 text-cyan-600" />
          Insurance decision hub
        </p>
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">Insurance Channels</h1>
        <p className="max-w-3xl text-muted-foreground">
          Browse category-specific comparisons, recommended plans, FAQs, and provider snapshots.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:max-w-2xl">
          <article className="rounded-lg border bg-background/90 p-3">
            <p className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              Coverage-first framework
            </p>
          </article>
          <article className="rounded-lg border bg-background/90 p-3">
            <p className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4 text-cyan-600" />
              Claims and FAQ context included
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/insurance/${category.slug}`}
            className="rounded-xl border bg-gradient-to-br from-card to-blue-500/[0.03] p-4 transition-colors hover:bg-accent"
          >
            <p className="font-medium">{category.title}</p>
            <p className="mt-2 inline-flex items-center text-xs text-muted-foreground">
              View channel
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </p>
          </Link>
        ))}
      </section>

      <section className="space-y-4 rounded-2xl border bg-gradient-to-br from-card via-cyan-500/[0.02] to-blue-500/[0.03] p-5">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">How to use this insurance hub</h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Pick your channel first, then compare products and providers before opening claims guides.
            This keeps your decision process consistent across categories.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <article className="rounded-xl border bg-background/90 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-cyan-700">Step 1</p>
            <p className="mt-2 font-medium">Choose category</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Start with auto, life, home, pet, medicare, or renters based on your current need.
            </p>
          </article>
          <article className="rounded-xl border bg-background/90 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-cyan-700">Step 2</p>
            <p className="mt-2 font-medium">Compare options</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Review product snapshots and provider entries to shortlist the best-fit choices.
            </p>
          </article>
          <article className="rounded-xl border bg-background/90 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-cyan-700">Step 3</p>
            <p className="mt-2 font-medium">Plan claims readiness</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check claims resources early so filing steps are clearer if incidents happen.
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border bg-gradient-to-br from-card to-indigo-500/[0.03] p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Quick paths</h2>
          <Link href="/content-map" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            Open content map
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {quickActions.map((action) => (
            <article key={action.href} className="rounded-xl border bg-background/90 p-4 shadow-sm">
              <p className="font-medium">{action.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{action.description}</p>
              <Link
                href={action.href}
                className="mt-3 inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                {action.cta}
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border bg-gradient-to-br from-card to-cyan-500/[0.03] p-5">
        <h2 className="text-2xl font-semibold tracking-tight">Why compare by channel first</h2>
        <ul className="grid gap-3 md:grid-cols-3">
          {comparisonHighlights.map((item) => (
            <li key={item} className="rounded-xl border bg-background/90 p-4 text-sm text-muted-foreground">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
