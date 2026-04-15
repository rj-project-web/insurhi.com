import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import type { CmsCategory } from "@/lib/cms-client";
import { getProviderBySlug, getProviders } from "@/lib/cms-client";
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
        <p className="text-sm text-muted-foreground">Rating: {provider.rating ?? "N/A"} / 5</p>
        {provider.coverageRegions && provider.coverageRegions.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            Coverage regions: {provider.coverageRegions.join(", ")}
          </p>
        ) : null}
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

      {provider.seo?.metaTitle || provider.seo?.metaDescription ? (
        <section className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
          <h2 className="text-base font-semibold tracking-tight text-foreground">CMS SEO</h2>
          {provider.seo.metaTitle ? <p className="mt-2">Meta title: {provider.seo.metaTitle}</p> : null}
          {provider.seo.metaDescription ? (
            <p className="mt-2">Meta description: {provider.seo.metaDescription}</p>
          ) : null}
        </section>
      ) : null}

      <AdSlot slotId="ad_in_content_1" />

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
