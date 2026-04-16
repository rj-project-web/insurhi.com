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
    </div>
  );
}
