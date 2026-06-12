import {
  Building2,
  FolderKanban,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import { HubCategoryGrid } from "@/components/hub-category-grid";
import { HubGroupedSection } from "@/components/hub-grouped-section";
import { HubIndexHero } from "@/components/hub-index-hero";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand } from "@/components/insurance-page-band";
import { ProviderListCard } from "@/components/provider-list-card";
import { getProviders } from "@/lib/cms-client";
import { buildProviderCategoryGroups } from "@/lib/hub-list-utils";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { insuranceCategories, providerCanonicalAliases } from "@/lib/site-data";

const PROVIDERS_PER_CATEGORY = 6;

export const metadata = buildMetadata({
  title: "Compare Insurance Providers 2026 | Ratings, Strengths, Coverage | Insurhi",
  description:
    "Compare insurance providers by service quality, category coverage, claim handling, and ratings. Open profile pages to review strengths and policy fit.",
  path: "/providers",
});

function providerCategoryCount(provider: Awaited<ReturnType<typeof getProviders>>[number]): number {
  const categories = provider.categories ?? [];
  return categories.filter((item) => typeof item === "object" && item !== null).length;
}

export default async function ProvidersPage() {
  const providers = await getProviders();
  const publishedProviders = providers.filter(
    (item) => item.slug && !providerCanonicalAliases[item.slug],
  );
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Providers", path: "/providers" },
  ]);

  const ratedCount = publishedProviders.filter((provider) => typeof provider.rating === "number").length;
  const multiLineCount = publishedProviders.filter((provider) => providerCategoryCount(provider) > 1).length;
  const avgCategories =
    publishedProviders.length > 0
      ? (
          publishedProviders.reduce((sum, provider) => sum + providerCategoryCount(provider), 0) /
          publishedProviders.length
        ).toFixed(1)
      : "0";

  const stats = [
    { label: "Providers", value: `${publishedProviders.length} profiles`, icon: Building2 },
    { label: "Rated", value: `${ratedCount} with scores`, icon: Star },
    { label: "Multi-line", value: `${multiLineCount} carriers`, icon: FolderKanban },
    { label: "Avg lines", value: `${avgCategories} per carrier`, icon: ShieldCheck },
  ];

  const categoryItems = insuranceCategories.map((category) => {
    const count = publishedProviders.filter((provider) =>
      (provider.categories ?? []).some(
        (item) => typeof item === "object" && item !== null && item.slug === category.slug,
      ),
    ).length;
    return {
      slug: category.slug,
      title: category.title,
      meta:
        count > 0
          ? `${count} provider${count === 1 ? "" : "s"} in category`
          : "Hub + provider comparisons",
      href: `/insurance/${category.slug}#compare`,
      linkLabel: "View providers in hub",
    };
  });

  const groupedProviders = buildProviderCategoryGroups(
    publishedProviders,
    insuranceCategories,
    PROVIDERS_PER_CATEGORY,
  );

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <HubIndexHero
          eyebrow="Carrier comparison library"
          title="Insurance providers"
          description="Review insurers by service quality, category coverage, and claim handling. Use provider profiles alongside product reviews to find the right balance of price and reliability."
          stats={stats}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="accent" innerClassName="py-8 sm:py-10">
        <HubCategoryGrid
          heading="Providers by coverage line"
          description="See which carriers operate in each insurance category and jump into hub comparisons."
          items={categoryItems}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="surface" id="provider-library" innerClassName="py-8 sm:py-10">
        <div className="space-y-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Featured directory
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Providers by coverage line
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Up to {PROVIDERS_PER_CATEGORY} top-rated carriers per category ·{" "}
              {publishedProviders.length} profiles indexed site-wide.
            </p>
          </div>

          {groupedProviders.map((group) => (
            <HubGroupedSection
              key={group.slug}
              idPrefix="providers-group"
              slug={group.slug}
              title={group.title}
              items={group.items}
              totalCount={group.totalCount}
              itemNoun="provider"
              gridClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              hubHref={`/insurance/${group.slug}#compare`}
              hubLinkLabel="category hub"
            >
              {group.items.map((provider) => (
                <ProviderListCard key={`${group.slug}-${provider.id}`} provider={provider} />
              ))}
            </HubGroupedSection>
          ))}
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
          description="Combine provider research with product reviews, buying guides, and claims playbooks."
          paths={[
            {
              key: "products",
              icon: ShieldCheck,
              title: "Product reviews",
              description: "Compare policies with pricing bands and coverage details.",
              href: "/products",
            },
            {
              key: "guides",
              icon: Sparkles,
              title: "Buying guides",
              description: "Understand limits and exclusions before choosing a carrier.",
              href: "/guides",
            },
            {
              key: "methodology",
              icon: Star,
              title: "Review methodology",
              description: "How Insurhi evaluates carriers and products independently.",
              href: "/methodology",
            },
          ]}
        />
      </InsurancePageBand>
    </div>
  );
}
