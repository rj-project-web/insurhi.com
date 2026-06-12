import {
  Building2,
  CircleDollarSign,
  ClipboardCheck,
  FolderKanban,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { HubCategoryGrid } from "@/components/hub-category-grid";
import { HubGroupedSection } from "@/components/hub-grouped-section";
import { HubIndexHero } from "@/components/hub-index-hero";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand } from "@/components/insurance-page-band";
import { ProductListCard } from "@/components/product-list-card";
import { getProducts, getProviders } from "@/lib/cms-client";
import {
  buildCategoryItemGroups,
  categorySlugFromRelation,
  countUniqueCategories,
} from "@/lib/hub-list-utils";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { insuranceCategories } from "@/lib/site-data";

const PRODUCTS_PER_CATEGORY = 9;

export const metadata = buildMetadata({
  title: "Compare Insurance Products 2026 | Coverage, Pricing, Claims | Insurhi",
  description:
    "Browse insurance products with coverage highlights, pricing bands, claim quality, and provider details. Compare options before requesting full quotes.",
  path: "/products",
});

export default async function ProductsPage() {
  const [products, providers] = await Promise.all([getProducts(), getProviders()]);
  const publishedProducts = products.filter((item) => item.slug);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ]);

  const categoryCount = countUniqueCategories(publishedProducts, (product) =>
    categorySlugFromRelation(product.category),
  );
  const withPricing = publishedProducts.filter((product) => product.priceRange).length;
  const groupedProducts = buildCategoryItemGroups(
    publishedProducts,
    insuranceCategories,
    (product) => categorySlugFromRelation(product.category),
    PRODUCTS_PER_CATEGORY,
  );

  const stats = [
    { label: "Products", value: `${publishedProducts.length} reviews`, icon: ShieldCheck },
    {
      label: "Categories",
      value: `${categoryCount || insuranceCategories.length} lines`,
      icon: FolderKanban,
    },
    { label: "With pricing", value: `${withPricing} price bands`, icon: CircleDollarSign },
    { label: "Providers", value: `${providers.length} carriers`, icon: Building2 },
  ];

  const categoryItems = insuranceCategories.map((category) => {
    const count = publishedProducts.filter(
      (product) => categorySlugFromRelation(product.category) === category.slug,
    ).length;
    return {
      slug: category.slug,
      title: category.title,
      meta:
        count > 0
          ? `${count} product review${count === 1 ? "" : "s"}`
          : "Hub + flagship reviews",
      href: `/insurance/${category.slug}#compare`,
      linkLabel: "Compare products",
    };
  });

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <HubIndexHero
          eyebrow="Product comparison library"
          title="Insurance products"
          description="Compare published insurance products by coverage scope, pricing bands, and provider service quality — each review includes pros/cons, premium estimates, and FAQs."
          stats={stats}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="accent" innerClassName="py-8 sm:py-10">
        <HubCategoryGrid
          heading="Products by coverage line"
          description="Open a category hub to compare flagship reviews alongside buying guides and claims workflows."
          items={categoryItems}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="surface" id="product-library" innerClassName="py-8 sm:py-10">
        <div className="space-y-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Featured catalog
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Products by coverage line
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Up to {PRODUCTS_PER_CATEGORY} reviews per category — open a hub to compare the full
              lineup.
            </p>
          </div>

          {groupedProducts.map((group) => (
            <HubGroupedSection
              key={group.slug}
              idPrefix="products-group"
              slug={group.slug}
              title={group.title}
              items={group.items}
              totalCount={group.totalCount}
              itemNoun="review"
              gridClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              hubHref={`/insurance/${group.slug}#compare`}
              hubLinkLabel="category hub"
            >
              {group.items.map((product) => (
                <ProductListCard key={product.id} product={product} />
              ))}
            </HubGroupedSection>
          ))}
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
          description="Use product reviews alongside provider profiles, buying guides, and editorial methodology."
          paths={[
            {
              key: "providers",
              icon: Building2,
              title: "Insurance providers",
              description: "Review carrier ratings, regions, and linked product lines.",
              href: "/providers",
            },
            {
              key: "methodology",
              icon: ClipboardCheck,
              title: "Review methodology",
              description: "How Insurhi scores coverage, pricing, and claim experience.",
              href: "/methodology",
            },
            {
              key: "insurance",
              icon: Sparkles,
              title: "Category hubs",
              description: "Six coverage lines with guides, products, and FAQs.",
              href: "/insurance",
            },
          ]}
        />
      </InsurancePageBand>
    </div>
  );
}
