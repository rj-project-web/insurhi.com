import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { FileText, Home, Map } from "lucide-react";

import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand, InsurancePanel } from "@/components/insurance-page-band";
import { StaticPageHero } from "@/components/static-page-hero";
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

function ContentMapSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <InsurancePanel id={id} className="p-5 sm:p-6">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-3">{children}</div>
    </InsurancePanel>
  );
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

  const collectionCount =
    categories.length +
    providers.length +
    products.length +
    articles.length +
    faqs.length +
    guides.length +
    cases.length +
    pages.length;

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <StaticPageHero
          eyebrow="Internal QA"
          title="CMS → site map"
          description="Use this page while you fill the CMS: each row links to the public URL where that document should render. The users collection is for admin sign-in only and is intentionally not listed here."
        >
          <p className="inline-flex items-center rounded-full border border-amber-200/80 bg-amber-50/80 px-3 py-1 text-xs font-medium text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            {collectionCount} indexed entries · noindex
          </p>
        </StaticPageHero>
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <div className="space-y-4">
          <ContentMapSection id="categories" title="Categories">
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
          </ContentMapSection>

          <ContentMapSection id="providers" title="Providers">
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
          </ContentMapSection>

          <ContentMapSection id="products" title="Products">
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
          </ContentMapSection>

          <ContentMapSection id="articles" title="Articles">
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
          </ContentMapSection>

          <ContentMapSection id="faqs" title="FAQ items">
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
          </ContentMapSection>

          <ContentMapSection id="claims-guides" title="Claims guides">
            <ul className="space-y-2 text-sm">
              {guides.length ? (
                guides.map((guide) =>
                  guide.slug ? (
                    <li key={guide.id}>
                      <Link href={`/claims/guides/${guide.slug}`} className="underline underline-offset-4">
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
          </ContentMapSection>

          <ContentMapSection id="claim-cases" title="Claim cases">
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
          </ContentMapSection>

          <ContentMapSection id="pages" title="Pages">
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
          </ContentMapSection>
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
          title="Site navigation"
          description="Return to the public site from this internal QA index."
          paths={[
            {
              key: "home",
              icon: Home,
              title: "Home",
              description: "Main insurance comparison hub.",
              href: "/",
            },
            {
              key: "resources",
              icon: Map,
              title: "Resources",
              description: "Public resource hub and learning tracks.",
              href: "/resources",
            },
            {
              key: "guides",
              icon: FileText,
              title: "Guides",
              description: "Editorial buying guides index.",
              href: "/guides",
            },
          ]}
        />
      </InsurancePageBand>
    </div>
  );
}
