import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { CmsCategory, CmsProduct } from "@/lib/cms-client";
import { getProducts, getProviderBySlug, getProviders } from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type ProviderPageProps = {
  params: Promise<{ slug: string }>;
};

function resolveCategories(value: (string | CmsCategory)[] | undefined): CmsCategory[] {
  if (!value?.length) {
    return [];
  }

  return value.filter((item): item is CmsCategory => typeof item === "object" && item !== null && "slug" in item);
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
  if (typeof product.provider === "string") {
    return product.provider === providerId;
  }
  return product.provider.id === providerId || product.provider.slug === providerSlug;
}

export async function generateStaticParams() {
  const providers = await getProviders();
  return providers.map((provider) => ({ slug: provider.slug }));
}

export async function generateMetadata({ params }: ProviderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    return buildMetadata({
      title: "Insurance provider",
      description: "Insurance provider profile.",
      path: "/insurance",
    });
  }

  return buildMetadata({
    title: provider.seo?.metaTitle ?? provider.name,
    description:
      provider.seo?.metaDescription ??
      `Compare ${provider.name} coverage regions and linked insurance categories.`,
    path: `/providers/${slug}`,
  });
}

export default async function ProviderDetailPage({ params }: ProviderPageProps) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    notFound();
  }

  const linkedCategories = resolveCategories(provider.categories);
  const bestForItems = resolveBestFor(provider.bestFor);
  const allProducts = await getProducts();
  const linkedProducts = allProducts
    .filter((product) => providerMatchesProduct(product, provider.slug, provider.id))
    .slice(0, 12);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Insurance", path: "/insurance" },
    { name: provider.name, path: `/providers/${slug}` },
  ]);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="space-y-3">
        <p className="text-sm text-muted-foreground">Providers / {slug}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{provider.name}</h1>
        {provider.summary ? <p className="max-w-3xl text-sm text-muted-foreground">{provider.summary}</p> : null}
        <p className="text-sm text-muted-foreground">Rating: {provider.rating ?? "N/A"} / 5</p>
        {provider.coverageRegions && provider.coverageRegions.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            Coverage regions: {provider.coverageRegions.join(", ")}
          </p>
        ) : null}
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold tracking-tight">Best for</h2>
        {bestForItems.length > 0 ? (
          <ul className="grid gap-2 text-sm text-muted-foreground">
            {bestForItems.map((item) => (
              <li key={item} className="rounded-md border bg-background px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No best-for highlights are published yet.</p>
        )}
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold tracking-tight">Linked categories</h2>
        {linkedCategories.length > 0 ? (
          <ul className="flex flex-wrap gap-2 text-sm">
            {linkedCategories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/insurance/${category.slug}`}
                  className="rounded-md border px-3 py-1 transition-colors hover:bg-accent"
                >
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No category relationships are published yet.</p>
        )}
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold tracking-tight">Linked products</h2>
        {linkedProducts.length > 0 ? (
          <div className="grid gap-2 text-sm">
            {linkedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="rounded-md border px-3 py-2 transition-colors hover:bg-accent"
              >
                {product.name}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No product relationships are published yet.</p>
        )}
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold tracking-tight">Continue exploring</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <Link href="/insurance" className="underline underline-offset-4">
            Insurance categories
          </Link>
          <Link href="/guides" className="underline underline-offset-4">
            Guides
          </Link>
        </div>
      </section>
    </div>
  );
}
