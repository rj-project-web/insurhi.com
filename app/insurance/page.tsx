import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeHeroBadges } from "@/components/home-hero-badges";
import {
  CategoryIconBadge,
  InsuranceCategoryPoster,
  InsuranceJourneyVisual,
} from "@/components/insurance-visuals";
import { getCategories, getClaimCases, getClaimsGuides, getLatestArticles, getProducts } from "@/lib/cms-client";
import { categoryDescriptions } from "@/lib/home-content";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { insuranceCategories } from "@/lib/site-data";
import type { CategorySlug } from "@/lib/category-content-hub";

export const metadata: Metadata = buildMetadata({
  title: "Insurance Categories",
  description:
    "Browse auto, life, home, pet, medicare, and renters insurance comparisons and learning resources.",
  path: "/insurance",
});

export default async function InsurancePage() {
  const [cmsCategories, articles, products, claimsGuides, claimCases] = await Promise.all([
    getCategories(),
    getLatestArticles(),
    getProducts(),
    getClaimsGuides(),
    getClaimCases(),
  ]);

  const categories =
    cmsCategories.length > 0
      ? cmsCategories.map((category) => ({ slug: category.slug, title: category.title }))
      : insuranceCategories;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Insurance", path: "/insurance" },
  ]);

  const stats = [
    { label: "Categories", value: `${categories.length} deep hubs` },
    { label: "Products", value: `${products.length} reviews` },
    { label: "Guides", value: `${articles.length} articles` },
    { label: "Claims", value: `${claimsGuides.length + claimCases.length} resources` },
  ];

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section
        aria-labelledby="insurance-hub-heading"
        className="rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-800/[0.07] via-sky-500/[0.05] to-white p-6 lg:p-10 dark:to-card"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div className="space-y-5 text-center lg:text-left">
            <HomeHeroBadges />
            <div className="space-y-4">
              <h1
                id="insurance-hub-heading"
                className="text-3xl font-semibold tracking-tight text-blue-950 sm:text-4xl dark:text-blue-50"
              >
                Insurance categories
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                Pick a coverage line, then compare guides, products, providers, and claims workflows
                in one visual hub.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {stats.map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-xl border border-blue-100 bg-white/90 px-4 py-4 shadow-sm dark:bg-background/95"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-blue-900 dark:text-blue-100">{stat.value}</p>
                </article>
              ))}
            </div>
          </div>
          <InsuranceJourneyVisual />
        </div>
      </section>

      <section aria-labelledby="channels-heading" className="space-y-5">
        <div className="space-y-2 text-center">
          <h2
            id="channels-heading"
            className="text-2xl font-semibold tracking-tight text-blue-950 dark:text-blue-50"
          >
            Choose your coverage line
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-muted-foreground">
            Each channel bundles deep guides, flagship reviews, provider data, category FAQs, and
            claims workflows.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/insurance/${category.slug}`}
              className="rounded-xl border border-blue-100 bg-white p-5 transition-colors hover:border-sky-300/80 hover:bg-blue-50/40 dark:bg-card"
            >
              <div className="flex items-start gap-3">
                <CategoryIconBadge slug={category.slug} label={category.title} />
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">{category.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {categoryDescriptions[category.slug as CategorySlug] ??
                      "Guides, products, and claims help."}
                  </p>
                </div>
              </div>
              <p className="mt-3 inline-flex items-center text-sm font-medium text-sky-800 dark:text-sky-400">
                Open hub
                <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="visual-gallery-heading" className="space-y-5">
        <div className="space-y-2 text-center">
          <h2
            id="visual-gallery-heading"
            className="text-2xl font-semibold tracking-tight text-blue-950 dark:text-blue-50"
          >
            Visual coverage gallery
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-muted-foreground">
            A faster way to scan the six major insurance lines before opening the full hub.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={`poster-${category.slug}`} href={`/insurance/${category.slug}`}>
              <InsuranceCategoryPoster
                slug={category.slug}
                title={category.title}
                description={
                  categoryDescriptions[category.slug as CategorySlug] ??
                  "Guides, products, and claims help."
                }
              />
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="workflow-heading" className="space-y-4 rounded-2xl border bg-card p-5 lg:p-6">
        <h2
          id="workflow-heading"
          className="text-2xl font-semibold tracking-tight text-blue-950 dark:text-blue-50"
        >
          How to use each hub
        </h2>
        <ol className="grid gap-3 md:grid-cols-3">
          <li className="rounded-xl border border-blue-100 bg-background p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-sky-700 dark:text-sky-400">
              Step 1
            </p>
            <p className="mt-2 font-medium">Read the buying guide</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Understand limits, deductibles, and exclusions before comparing premiums.
            </p>
          </li>
          <li className="rounded-xl border border-blue-100 bg-background p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-sky-700 dark:text-sky-400">
              Step 2
            </p>
            <p className="mt-2 font-medium">Compare products &amp; providers</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Shortlist options using editorial reviews, price bands, and service signals.
            </p>
          </li>
          <li className="rounded-xl border border-blue-100 bg-background p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-sky-700 dark:text-sky-400">
              Step 3
            </p>
            <p className="mt-2 font-medium">Bookmark claims playbooks</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Save FNOL steps and checklists before an incident compresses your timeline.
            </p>
          </li>
        </ol>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            href="/products"
            className="font-medium text-sky-800 underline-offset-4 hover:underline dark:text-sky-400"
          >
            All products
          </Link>
          <Link
            href="/providers"
            className="font-medium text-sky-800 underline-offset-4 hover:underline dark:text-sky-400"
          >
            All providers
          </Link>
          <Link
            href="/claims"
            className="font-medium text-sky-800 underline-offset-4 hover:underline dark:text-sky-400"
          >
            Claims center
          </Link>
          <Link
            href="/methodology"
            className="font-medium text-sky-800 underline-offset-4 hover:underline dark:text-sky-400"
          >
            Editorial methodology
          </Link>
        </div>
      </section>
    </div>
  );
}
