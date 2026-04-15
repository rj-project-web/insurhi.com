import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import type { CmsCategory, CmsProvider } from "@/lib/cms-client";
import { getProductBySlug, getProducts } from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function resolveRelation<T extends object>(value: string | T | undefined): T | null {
  if (!value || typeof value === "string") {
    return null;
  }

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

  return buildMetadata({
    title: product.seo?.metaTitle ?? product.name,
    description:
      product.seo?.metaDescription ??
      product.recommendedFor ??
      `${product.name} coverage and pricing notes from the CMS.`,
    path: `/products/${slug}`,
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = resolveRelation<CmsCategory>(product.category);
  const provider = resolveRelation<CmsProvider>(product.provider);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Insurance", path: "/insurance" },
    ...(category
      ? [{ name: category.title, path: `/insurance/${category.slug}` }]
      : [{ name: "Insurance", path: "/insurance" }]),
    { name: product.name, path: `/products/${slug}` },
  ]);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="space-y-3">
        <p className="text-sm text-muted-foreground">Products / {slug}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
        {category ? (
          <p className="text-sm text-muted-foreground">
            Category:{" "}
            <Link href={`/insurance/${category.slug}`} className="underline underline-offset-4">
              {category.title}
            </Link>
          </p>
        ) : null}
        {provider ? (
          <p className="text-sm text-muted-foreground">
            Provider:{" "}
            <Link href={`/providers/${provider.slug}`} className="underline underline-offset-4">
              {provider.name}
            </Link>
          </p>
        ) : null}
      </section>

      <section className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-2">
        {product.coverageAmount ? (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Coverage
            </p>
            <p className="mt-1 text-sm">{product.coverageAmount}</p>
          </div>
        ) : null}
        {product.deductible ? (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Deductible
            </p>
            <p className="mt-1 text-sm">{product.deductible}</p>
          </div>
        ) : null}
        {product.priceRange ? (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Price range
            </p>
            <p className="mt-1 text-sm">{product.priceRange}</p>
          </div>
        ) : null}
      </section>

      {product.recommendedFor ? (
        <section className="space-y-2 rounded-lg border bg-card p-4">
          <h2 className="text-lg font-semibold tracking-tight">Recommended for</h2>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{product.recommendedFor}</p>
        </section>
      ) : null}

      {product.seo?.metaTitle || product.seo?.metaDescription ? (
        <section className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
          <h2 className="text-base font-semibold tracking-tight text-foreground">CMS SEO</h2>
          {product.seo.metaTitle ? <p className="mt-2">Meta title: {product.seo.metaTitle}</p> : null}
          {product.seo.metaDescription ? (
            <p className="mt-2">Meta description: {product.seo.metaDescription}</p>
          ) : null}
        </section>
      ) : null}

      <AdSlot slotId="ad_in_content_1" />

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold tracking-tight">Continue exploring</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          {category ? (
            <Link href={`/insurance/${category.slug}`} className="underline underline-offset-4">
              Back to {category.title}
            </Link>
          ) : (
            <Link href="/insurance" className="underline underline-offset-4">
              Insurance categories
            </Link>
          )}
          <Link href="/guides" className="underline underline-offset-4">
            Guides
          </Link>
        </div>
      </section>
    </div>
  );
}
