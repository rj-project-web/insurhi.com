import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BookOpen, Building2, ShieldCheck } from "lucide-react";

import { DetailPageSidebar } from "@/components/detail-page-sidebar";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand } from "@/components/insurance-page-band";
import {
  getProviderDetailSections,
  ProviderDetailContent,
} from "@/components/provider-detail-content";
import { ProviderDetailHero } from "@/components/provider-detail-hero";
import type { CmsCategory, CmsProduct } from "@/lib/cms-client";
import { getProducts, getProviderBySlug, getProviders } from "@/lib/cms-client";
import { buildProviderPageTitle } from "@/lib/page-titles";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { providerCanonicalAliases } from "@/lib/site-data";

type ProviderPageProps = {
  params: Promise<{ slug: string }>;
};

function resolveCategories(value: (string | CmsCategory)[] | undefined): CmsCategory[] {
  if (!value?.length) return [];
  return value.filter(
    (item): item is CmsCategory => typeof item === "object" && item !== null && "slug" in item,
  );
}

function resolveBestFor(value: string | string[] | Array<{ item?: string }> | undefined) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (typeof entry === "string") return entry.trim();
        return String(entry?.item ?? "").trim();
      })
      .filter(Boolean);
  }
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function providerMatchesProduct(product: CmsProduct, providerSlug: string, providerId: string) {
  if (!product.provider) return false;
  if (typeof product.provider === "string") return product.provider === providerId;
  return product.provider.id === providerId || product.provider.slug === providerSlug;
}

export async function generateStaticParams() {
  const providers = await getProviders();
  return providers
    .filter((provider) => !providerCanonicalAliases[provider.slug])
    .map((provider) => ({ slug: provider.slug }));
}

export async function generateMetadata({ params }: ProviderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSlug = providerCanonicalAliases[slug] ?? slug;
  const provider = await getProviderBySlug(resolvedSlug);

  if (!provider) {
    return buildMetadata({
      title: "Insurance provider",
      description: "Insurance provider profile.",
      path: "/insurance",
    });
  }

  return buildMetadata({
    title: buildProviderPageTitle(provider),
    description:
      provider.seo?.metaDescription ??
      `Compare ${provider.name} coverage regions, linked products, and claims quality across insurance categories.`,
    path: `/providers/${resolvedSlug}`,
    ogImagePath: null,
  });
}

export default async function ProviderDetailPage({ params }: ProviderPageProps) {
  const { slug } = await params;
  const canonicalSlug = providerCanonicalAliases[slug];
  if (canonicalSlug) redirect(`/providers/${canonicalSlug}`);

  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  const linkedCategories = resolveCategories(provider.categories);
  const bestForItems = resolveBestFor(provider.bestFor);
  const allProducts = await getProducts();
  const linkedProducts = allProducts
    .filter((product) => providerMatchesProduct(product, provider.slug, provider.id))
    .slice(0, 6);
  const sections = getProviderDetailSections({
    bestForItems,
    linkedCategories,
    linkedProducts,
    coverageRegions: provider.coverageRegions,
  });
  const primaryCategory = linkedCategories[0];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Providers", path: "/providers" },
    { name: provider.name, path: `/providers/${slug}` },
  ]);

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <ProviderDetailHero
          name={provider.name}
          slug={slug}
          summary={provider.summary}
          rating={provider.rating ?? null}
          regionCount={provider.coverageRegions?.length ?? 0}
          categoryCount={linkedCategories.length}
          productCount={linkedProducts.length}
          categories={linkedCategories}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            <ProviderDetailContent
              bestForItems={bestForItems}
              linkedCategories={linkedCategories}
              linkedProducts={linkedProducts}
              coverageRegions={provider.coverageRegions}
            />
          </div>
          <DetailPageSidebar
            sections={sections}
            categorySlug={primaryCategory?.slug}
            categoryTitle={primaryCategory?.title}
            hubLinks={
              primaryCategory
                ? [
                    { href: `/providers`, label: "All providers" },
                    { href: `/insurance/${primaryCategory.slug}#compare`, label: "Compare in hub" },
                    { href: `/products`, label: "Product reviews" },
                  ]
                : [{ href: "/providers", label: "All providers" }]
            }
          />
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
          description="Pair carrier research with product reviews, buying guides, and methodology notes."
          paths={[
            {
              key: "products",
              icon: ShieldCheck,
              title: "Product reviews",
              description: "Compare policies from this carrier and competitors.",
              href: "/products",
            },
            {
              key: "guides",
              icon: BookOpen,
              title: "Buying guides",
              description: "Learn what to look for before switching insurers.",
              href: "/guides",
            },
            {
              key: "providers",
              icon: Building2,
              title: "All providers",
              description: "Browse the full carrier directory.",
              href: "/providers",
            },
          ]}
        />
      </InsurancePageBand>
    </div>
  );
}
