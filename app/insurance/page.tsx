import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Building2,
  ClipboardList,
  FolderKanban,
  ShieldCheck,
} from "lucide-react";

import { HubCategoryGrid } from "@/components/hub-category-grid";
import { HubIndexHero } from "@/components/hub-index-hero";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand, InsurancePanel } from "@/components/insurance-page-band";
import {
  InsuranceCategoryPoster,
  InsuranceJourneyVisual,
} from "@/components/insurance-visuals";
import {
  getCategories,
  getClaimCases,
  getClaimsGuides,
  getLatestArticles,
  getProducts,
} from "@/lib/cms-client";
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
    { label: "Categories", value: `${categories.length} deep hubs`, icon: FolderKanban },
    { label: "Products", value: `${products.length} reviews`, icon: ShieldCheck },
    { label: "Guides", value: `${articles.length} articles`, icon: BookOpen },
    {
      label: "Claims",
      value: `${claimsGuides.length + claimCases.length} resources`,
      icon: ClipboardList,
    },
  ];

  const categoryItems = categories.map((category) => ({
    slug: category.slug,
    title: category.title,
    meta:
      categoryDescriptions[category.slug as CategorySlug] ??
      "Guides, products, and claims help.",
    href: `/insurance/${category.slug}`,
    linkLabel: "Open hub",
  }));

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_auto] lg:items-start">
          <HubIndexHero
            eyebrow="Coverage line directory"
            title="Insurance categories"
            description="Pick a coverage line, then compare guides, products, providers, and claims workflows in one visual hub."
            stats={stats}
          />
          <div className="hidden lg:block">
            <InsuranceJourneyVisual />
          </div>
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="accent" innerClassName="py-8 sm:py-10">
        <HubCategoryGrid
          heading="Choose your coverage line"
          description="Each channel bundles deep guides, flagship reviews, provider data, category FAQs, and claims workflows."
          items={categoryItems}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <div className="space-y-5">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Visual coverage gallery
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
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
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <InsurancePanel className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How to use each hub</h2>
          <ol className="mt-5 grid gap-3 md:grid-cols-3">
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
              <p className="mt-2 font-medium">Compare products & providers</p>
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
        </InsurancePanel>
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
          description="Pair category hubs with product reviews, claims playbooks, and editorial methodology."
          paths={[
            {
              key: "products",
              icon: ShieldCheck,
              title: "All products",
              description: "Browse the full comparison catalog by coverage line.",
              href: "/products",
            },
            {
              key: "providers",
              icon: Building2,
              title: "All providers",
              description: "Compare carriers with ratings and linked products.",
              href: "/providers",
            },
            {
              key: "claims",
              icon: ClipboardList,
              title: "Claims center",
              description: "Step-by-step filing guides and case examples.",
              href: "/claims",
            },
          ]}
        />
      </InsurancePageBand>
    </div>
  );
}
