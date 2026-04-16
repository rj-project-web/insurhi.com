import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ad-slot";
import {
  getCategoryBySlug,
  getFaqsByCategory,
  getProductsByCategory,
  getProvidersByCategory,
} from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { insuranceCategories } from "@/lib/site-data";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return insuranceCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cmsCategory = await getCategoryBySlug(slug);
  const fallbackCategory = insuranceCategories.find((item) => item.slug === slug);
  const category = cmsCategory ?? fallbackCategory;
  const categorySummary = cmsCategory?.summary;

  if (!category) {
    return buildMetadata({
      title: "Insurance Category",
      description: "Insurance comparisons and guidance.",
      path: "/insurance",
    });
  }

  return buildMetadata({
    title: cmsCategory?.seo?.metaTitle ?? `${category.title} Coverage Guides`,
    description:
      cmsCategory?.seo?.metaDescription ??
      categorySummary ??
      `Compare ${category.title.toLowerCase()} providers, understand coverage options, and review common claim questions.`,
    path: `/insurance/${slug}`,
  });
}

export default async function InsuranceCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const fallbackCategory = insuranceCategories.find((item) => item.slug === slug);
  const cmsCategory = await getCategoryBySlug(slug);
  const category = cmsCategory ?? fallbackCategory;
  const categorySummary = cmsCategory?.summary;

  if (!category) {
    notFound();
  }

  const [faqs, providers, products] = cmsCategory
    ? await Promise.all([
        getFaqsByCategory(cmsCategory.id),
        getProvidersByCategory(cmsCategory.id),
        getProductsByCategory(cmsCategory.id),
      ])
    : [[], [], []];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Insurance", path: "/insurance" },
    { name: category.title, path: `/insurance/${slug}` },
  ]);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="space-y-3">
        <p className="text-sm text-muted-foreground">Insurance / {category.title}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{category.title}</h1>
        <p className="max-w-3xl text-muted-foreground">
          {categorySummary ??
            `This channel will host plan comparisons, best picks, FAQs, and trusted provider recommendations for ${category.title.toLowerCase()}.`}
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="#products" className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
          CMS products
        </Link>
        <Link href="/guides" className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
          Insurance guides
        </Link>
        <Link href="#faqs" className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
          Frequently asked questions
        </Link>
        <Link href="#providers" className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
          Recommended providers
        </Link>
      </div>

      <AdSlot slotId="ad_in_content_1" />

      <section id="products" className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Products</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
              >
                <p className="font-medium">{product.name}</p>
                {product.priceRange ? (
                  <p className="mt-1 text-sm text-muted-foreground">Price: {product.priceRange}</p>
                ) : null}
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              CMS products for this category will appear here after publishing.
            </p>
          )}
        </div>
      </section>

      <section id="faqs" className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">FAQs</h2>
        <div className="grid gap-3">
          {faqs.length > 0 ? (
            faqs.map((faq) => (
              <article key={faq.id} className="rounded-lg border bg-card p-4">
                <p className="font-medium">{faq.question}</p>
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              </article>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              CMS FAQs will appear here after content is published.
            </p>
          )}
        </div>
      </section>

      <section id="providers" className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Recommended Providers</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {providers.length > 0 ? (
            providers.map((provider) => (
              <article key={provider.id} className="rounded-lg border bg-card p-4">
                <Link href={`/providers/${provider.slug}`} className="font-medium underline-offset-4 hover:underline">
                  {provider.name}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  Rating: {provider.rating ?? "N/A"}
                </p>
                {provider.coverageRegions && provider.coverageRegions.length > 0 ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Regions: {provider.coverageRegions.join(", ")}
                  </p>
                ) : null}
                {provider.seo?.metaTitle || provider.seo?.metaDescription ? (
                  <div className="mt-3 rounded-md border border-dashed p-2 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground/80">CMS SEO</p>
                    {provider.seo.metaTitle ? <p className="mt-1">Title: {provider.seo.metaTitle}</p> : null}
                    {provider.seo.metaDescription ? (
                      <p className="mt-1">Description: {provider.seo.metaDescription}</p>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              CMS provider recommendations will appear here after content is published.
            </p>
          )}
        </div>
      </section>

      {cmsCategory?.seo?.metaTitle || cmsCategory?.seo?.metaDescription ? (
        <section className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
          <h2 className="text-base font-semibold tracking-tight text-foreground">Category CMS SEO</h2>
          {cmsCategory.seo?.metaTitle ? <p className="mt-2">Meta title: {cmsCategory.seo.metaTitle}</p> : null}
          {cmsCategory.seo?.metaDescription ? (
            <p className="mt-2">Meta description: {cmsCategory.seo.metaDescription}</p>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold tracking-tight">Explore related channels</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <Link href="/guides" className="underline underline-offset-4">
            Insurance guides
          </Link>
          <Link href="/claims" className="underline underline-offset-4">
            Claims assistance
          </Link>
        </div>
      </section>
    </div>
  );
}
