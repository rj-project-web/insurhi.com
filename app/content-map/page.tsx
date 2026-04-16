import type { Metadata } from "next";
import Link from "next/link";

import {
  getAllPages,
  getArticlesList,
  getCategories,
  getClaimCasesList,
  getClaimsGuidesList,
  getFaqItems,
  getProducts,
  getProviders,
} from "@/lib/cms-client";
import { cmsPagePublicPath } from "@/lib/cms-page-routes";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

/** Avoid baking empty snapshot at build time when env differs from runtime. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "CMS content map",
    description:
      "Quick index of Payload collections and where each entry appears on the marketing site for QA.",
    path: "/content-map",
  }),
  robots: { index: false, follow: false },
};

function categorySlugFromRelation(value: unknown) {
  if (!value || typeof value === "string") {
    return null;
  }

  if (typeof value === "object" && value !== null && "slug" in value) {
    return String((value as { slug: string }).slug);
  }

  return null;
}

export default async function ContentMapPage() {
  const [categories, providers, products, articles, faqs, guides, cases, pages] = await Promise.all([
    getCategories(),
    getProviders(),
    getProducts(),
    getArticlesList(),
    getFaqItems(),
    getClaimsGuidesList(),
    getClaimCasesList(),
    getAllPages(),
  ]);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Content map", path: "/content-map" },
  ]);

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">CMS → site map</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Use this page while you fill the CMS: each row links to the public URL where that document
          should render. The <code className="rounded bg-muted px-1 py-0.5 text-xs">users</code>{" "}
          collection is for admin sign-in only and is intentionally not listed here.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Categories</h2>
        <ul className="space-y-2 text-sm">
          {categories.length ? (
            categories.map((category) => (
              <li key={category.id}>
                <Link href={`/insurance/${category.slug}`} className="underline underline-offset-4">
                  {category.title}
                </Link>{" "}
                <span className="text-muted-foreground">/insurance/{category.slug}</span>
              </li>
            ))
          ) : (
            <li className="text-muted-foreground">No categories found in current content source.</li>
          )}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Providers</h2>
        <ul className="space-y-2 text-sm">
          {providers.length ? (
            providers.map((provider) => (
              <li key={provider.id}>
                <Link href={`/providers/${provider.slug}`} className="underline underline-offset-4">
                  {provider.name}
                </Link>{" "}
                <span className="text-muted-foreground">/providers/{provider.slug}</span>
              </li>
            ))
          ) : (
            <li className="text-muted-foreground">No providers found in current content source.</li>
          )}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Products</h2>
        <ul className="space-y-2 text-sm">
          {products.length ? (
            products.map((product) => {
              const catSlug = categorySlugFromRelation(product.category);
              return (
                <li key={product.id}>
                  <Link href={`/products/${product.slug}`} className="underline underline-offset-4">
                    {product.name}
                  </Link>{" "}
                  <span className="text-muted-foreground">/products/{product.slug}</span>
                  {catSlug ? (
                    <span className="text-muted-foreground">
                      {" "}
                      · also listed under{" "}
                      <Link href={`/insurance/${catSlug}#products`} className="underline underline-offset-4">
                        /insurance/{catSlug}#products
                      </Link>
                    </span>
                  ) : null}
                </li>
              );
            })
          ) : (
            <li className="text-muted-foreground">No products found in current content source.</li>
          )}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Articles</h2>
        <ul className="space-y-2 text-sm">
          {articles.length ? (
            articles.map((article) => (
              <li key={article.id}>
                <Link href={`/guides/${article.slug}`} className="underline underline-offset-4">
                  {article.title}
                </Link>{" "}
                <span className="text-muted-foreground">/guides/{article.slug}</span>
              </li>
            ))
          ) : (
            <li className="text-muted-foreground">No articles found in current content source.</li>
          )}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">FAQ items</h2>
        <ul className="space-y-2 text-sm">
          {faqs.length ? (
            faqs.map((faq) => {
              const catSlug = categorySlugFromRelation(faq.category);
              return (
                <li key={faq.id}>
                  <span className="font-medium text-foreground">{faq.question}</span>
                  {catSlug ? (
                    <span className="text-muted-foreground">
                      {" "}
                      →{" "}
                      <Link href={`/insurance/${catSlug}#faqs`} className="underline underline-offset-4">
                        /insurance/{catSlug}#faqs
                      </Link>
                    </span>
                  ) : (
                    <span className="text-muted-foreground"> (assign a category in CMS to link)</span>
                  )}
                </li>
              );
            })
          ) : (
            <li className="text-muted-foreground">No FAQ items found in current content source.</li>
          )}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Claims guides</h2>
        <ul className="space-y-2 text-sm">
          {guides.length ? (
            guides.map((guide) =>
              guide.slug ? (
                <li key={guide.id}>
                  <Link
                    href={`/claims/guides/${guide.slug}`}
                    className="underline underline-offset-4"
                  >
                    {guide.title}
                  </Link>{" "}
                  <span className="text-muted-foreground">/claims/guides/{guide.slug}</span>
                </li>
              ) : (
                <li key={guide.id} className="text-muted-foreground">
                  {guide.title} (missing slug in CMS)
                </li>
              ),
            )
          ) : (
            <li className="text-muted-foreground">No claims guides found in current content source.</li>
          )}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Claim cases</h2>
        <ul className="space-y-2 text-sm">
          {cases.length ? (
            cases.map((claimCase) => (
              <li key={claimCase.id}>
                <Link href={`/claims/cases/${claimCase.id}`} className="underline underline-offset-4">
                  {claimCase.title}
                </Link>{" "}
                <span className="text-muted-foreground">/claims/cases/{claimCase.id}</span>
              </li>
            ))
          ) : (
            <li className="text-muted-foreground">No claim cases found in current content source.</li>
          )}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Pages</h2>
        <ul className="space-y-2 text-sm">
          {pages.length ? (
            pages.map((page) => {
              const path = cmsPagePublicPath(page.slug);
              return (
                <li key={page.id}>
                  <Link href={path} className="underline underline-offset-4">
                    {page.title}
                  </Link>{" "}
                  <span className="text-muted-foreground">{path}</span>
                </li>
              );
            })
          ) : (
            <li className="text-muted-foreground">No pages found in current content source.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
