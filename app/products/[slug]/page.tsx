import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound, redirect } from "next/navigation";
import { BookOpen, ClipboardList, ShieldCheck } from "lucide-react";

import { DetailPageSidebar } from "@/components/detail-page-sidebar";
import { EditorialDisclosure } from "@/components/editorial-disclosure";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand } from "@/components/insurance-page-band";
import { ProductDetailContent } from "@/components/product-detail-content";
import { ProductDetailHero } from "@/components/product-detail-hero";
import { RelatedContentPanel } from "@/components/related-content-panel";
import { extractCmsText } from "@/components/cms-rich-text";
import type { CmsCategory, CmsProvider } from "@/lib/cms-client";
import { getProductBySlug, getProducts } from "@/lib/cms-client";
import { getRelatedContentForProduct } from "@/lib/content-links";
import { getProductDetailSections } from "@/lib/product-detail-utils";
import { buildProductPageTitle } from "@/lib/page-titles";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildMetadata,
  buildProductJsonLd,
} from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

async function getProductFromSnapshot(slug: string) {
  try {
    const snapshotPath =
      process.env.CMS_CONTENT_FILE_PATH ?? path.join(process.cwd(), "content", "cms-content.json");
    const raw = await readFile(snapshotPath, "utf8");
    const parsed = JSON.parse(raw) as {
      products?: Array<Record<string, unknown> & { slug?: string; name?: string }>;
    };

    const matched = (parsed.products ?? []).find(
      (item) => item.slug?.toLowerCase() === slug.toLowerCase(),
    );

    if (!matched?.slug || !matched?.name) return null;
    return matched as Awaited<ReturnType<typeof getProductBySlug>>;
  } catch {
    return null;
  }
}

function resolveRelation<T extends object>(value: string | T | undefined): T | null {
  if (!value || typeof value === "string") return null;
  return value as T;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return buildMetadata({
      title: "Insurance product",
      description: "Insurance product details.",
      path: "/insurance",
    });
  }

  const derivedDescription =
    product.seo?.metaDescription ||
    product.oneLineVerdict ||
    extractCmsText(product.editorConclusion).slice(0, 160) ||
    product.recommendedFor ||
    `${product.name} coverage and pricing notes from the CMS.`;

  return buildMetadata({
    title: buildProductPageTitle(product),
    description: derivedDescription,
    path: `/products/${slug}`,
    ogImagePath: null,
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product = await getProductBySlug(slug);

  if (!product) {
    const products = await getProducts();
    const matched = products.find((item) => item.slug.toLowerCase() === slug.toLowerCase());
    if (matched && matched.slug !== slug) redirect(`/products/${matched.slug}`);
  }

  if (!product) {
    product = await getProductFromSnapshot(slug);
    if (product && product.slug !== slug) redirect(`/products/${product.slug}`);
  }

  if (!product) notFound();

  const category = resolveRelation<CmsCategory>(product.category);
  const provider = resolveRelation<CmsProvider>(product.provider);
  const relatedContent = getRelatedContentForProduct(slug, category ?? product.category);
  const sections = getProductDetailSections(product);
  const faqItems = (product.faqItems ?? []).filter((item) => item.question);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Insurance", path: "/insurance" },
    ...(category
      ? [{ name: category.title, path: `/insurance/${category.slug}` }]
      : [{ name: "Insurance", path: "/insurance" }]),
    { name: product.name, path: `/products/${slug}` },
  ]);
  const productDescription =
    product.oneLineVerdict ||
    extractCmsText(product.editorConclusion).slice(0, 160) ||
    product.recommendedFor;
  const productJsonLd = buildProductJsonLd({
    name: product.name,
    url: absoluteUrl(`/products/${slug}`),
    description: productDescription,
    brand: provider?.name,
    priceRange: product.priceRange ?? product.pricingRangeSummary,
    ratingDistribution: product.ratingDistribution,
  });
  const faqPageJsonLd = buildFaqPageJsonLd(
    faqItems.map((item) => ({
      question: item.question ?? "",
      answer: extractCmsText(item.answer),
    })),
  );

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {faqPageJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
        />
      ) : null}

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <ProductDetailHero
          name={product.name}
          slug={slug}
          summary={product.oneLineVerdict}
          category={category}
          provider={provider}
          coverageAmount={product.coverageAmount}
          priceRange={product.priceRange}
          deductible={product.deductible}
          avgClaimDays={product.claimsTurnaround?.avgDays ?? null}
          pricingRangeSummary={product.pricingRangeSummary}
          updatedAt={product.updatedAt}
          createdAt={product.createdAt}
          reviewedBy={product.reviewedBy}
          lastReviewedAt={product.lastReviewedAt}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            <ProductDetailContent product={product} />
          </div>
          <DetailPageSidebar
            sections={sections}
            categorySlug={category?.slug}
            categoryTitle={category?.title}
          />
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <div className="space-y-8">
          <EditorialDisclosure />
          <RelatedContentPanel bundle={relatedContent} />
          <HubQuickPaths
            description="Compare alternatives, read buying guides, and bookmark claims workflows."
            paths={[
              {
                key: "products",
                icon: ShieldCheck,
                title: "All product reviews",
                description: "Browse the full comparison catalog by coverage line.",
                href: "/products",
              },
              {
                key: "guides",
                icon: BookOpen,
                title: "Buying guides",
                description: "Understand limits and exclusions before you switch carriers.",
                href: "/guides",
              },
              {
                key: "claims",
                icon: ClipboardList,
                title: "Claims playbooks",
                description: "Step-by-step filing guides if you need to claim on this policy.",
                href: "/claims#claims-playbooks",
              },
            ]}
          />
        </div>
      </InsurancePageBand>
    </div>
  );
}
