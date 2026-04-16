import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowRight, BookOpenText, Building2, FileCheck2, Sparkles } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import {
  getAllPages,
  getClaimCases,
  getClaimsGuides,
  getFaqItems,
  getLatestArticles,
  getProducts,
  getProviders,
} from "@/lib/cms-client";
import { isMobileUserAgent } from "@/lib/device";
import { buildMetadata, buildWebSiteJsonLd } from "@/lib/seo";
import { insuranceCategories } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Insurance Comparison and Claims Guidance",
  description:
    "Compare insurance options, browse practical guides, and get claims assistance across major insurance categories.",
  path: "/",
});

export default async function Home() {
  const webSiteJsonLd = buildWebSiteJsonLd();
  const userAgent = (await headers()).get("user-agent") ?? "";
  const isMobile = isMobileUserAgent(userAgent);
  const [articles, claimsGuides, claimCases, providers, products, faqItems, pages] =
    await Promise.all([
      getLatestArticles(),
      getClaimsGuides(),
      getClaimCases(),
      getProviders(),
      getProducts(),
      getFaqItems(),
      getAllPages(),
    ]);

  const latestArticle = articles[0];
  const latestClaimGuide = claimsGuides[0];
  const latestClaimCase = claimCases[0];
  const latestProvider = providers[0];
  const latestProduct = products[0];
  const latestFaq = faqItems[0];
  const latestPage = pages[0];
  const latestDataUpdates: Array<{ key: string; label: string; href?: string }> = [];

  if (latestProduct) {
    latestDataUpdates.push({
      key: `product-${latestProduct.id}`,
      label: `Product: ${latestProduct.name}`,
      href: `/products/${latestProduct.slug}`,
    });
  }
  if (latestProvider) {
    latestDataUpdates.push({
      key: `provider-${latestProvider.id}`,
      label: `Provider: ${latestProvider.name}`,
      href: `/providers/${latestProvider.slug}`,
    });
  }
  if (latestFaq) {
    latestDataUpdates.push({
      key: `faq-${latestFaq.id}`,
      label: `FAQ: ${latestFaq.question}`,
      href: "/content-map",
    });
  }
  if (latestPage) {
    latestDataUpdates.push({
      key: `page-${latestPage.id}`,
      label: `Page: ${latestPage.title}`,
      href: "/content-map",
    });
  }

  if (!latestDataUpdates.length && latestArticle) {
    latestDataUpdates.push({
      key: `article-fallback-${latestArticle.id}`,
      label: `Guide update: ${latestArticle.title}`,
      href: `/guides/${latestArticle.slug}`,
    });
  }
  if (!latestDataUpdates.length && latestClaimCase) {
    latestDataUpdates.push({
      key: `claim-fallback-${latestClaimCase.id}`,
      label: `Claim case update: ${latestClaimCase.title}`,
      href: `/claims/cases/${latestClaimCase.id}`,
    });
  }
  if (!latestDataUpdates.length) {
    latestDataUpdates.push({
      key: "content-map-fallback",
      label: "Open content map for full latest data",
      href: "/content-map",
    });
  }

  const heroDescription = isMobile
    ? "Compare plans and claims help on the go."
    : "Insurhi helps users compare options, learn coverage basics, and handle claims with practical guidance.";

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <section className="space-y-5 rounded-2xl border bg-gradient-to-br from-blue-600/[0.08] via-cyan-500/[0.05] to-card p-6 lg:p-8">
        <p className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="mr-1 h-3.5 w-3.5 text-cyan-600" />
          Insurance content hub
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Insurance clarity, made simple.</h1>
        <p className="max-w-2xl text-muted-foreground">{heroDescription}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-lg border bg-background/90 p-3">
            <p className="text-xs text-muted-foreground">Categories</p>
            <p className="mt-1 text-xl font-semibold">{insuranceCategories.length}</p>
          </article>
          <article className="rounded-lg border bg-background/90 p-3">
            <p className="text-xs text-muted-foreground">Products</p>
            <p className="mt-1 text-xl font-semibold">{products.length}</p>
          </article>
          <article className="rounded-lg border bg-background/90 p-3">
            <p className="text-xs text-muted-foreground">Guides</p>
            <p className="mt-1 text-xl font-semibold">{articles.length}</p>
          </article>
          <article className="rounded-lg border bg-background/90 p-3">
            <p className="text-xs text-muted-foreground">Claims resources</p>
            <p className="mt-1 text-xl font-semibold">{claimsGuides.length + claimCases.length}</p>
          </article>
        </div>
      </section>

      <AdSlot slotId="ad_top_banner" />

      <section className="space-y-4 rounded-2xl border bg-gradient-to-br from-card to-blue-500/[0.03] p-5">
        <h2 className="text-2xl font-semibold tracking-tight">Insurance Categories</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {insuranceCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/insurance/${category.slug}`}
              className="rounded-lg border bg-background p-4 transition-colors hover:bg-accent"
            >
              <p className="font-medium">{category.title}</p>
              <p className="mt-2 inline-flex items-center text-xs text-muted-foreground">
                Explore channel
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </p>
            </Link>
          ))}
          <Link
            href="/resources"
            className="rounded-lg border bg-background p-4 transition-colors hover:bg-accent"
          >
            <p className="font-medium">Explore more insurance resources</p>
          </Link>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        <article className="rounded-xl border bg-gradient-to-br from-indigo-500/[0.08] to-card p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <BookOpenText className="h-4 w-4 text-indigo-600" />
            Latest guide
          </p>
          {latestArticle ? (
            <Link href={`/guides/${latestArticle.slug}`} className="mt-3 block">
              <p className="font-medium">{latestArticle.title}</p>
              <p className="mt-2 text-xs text-muted-foreground">/guides/{latestArticle.slug}</p>
            </Link>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No guide published yet.</p>
          )}
        </article>

        <article className="rounded-xl border bg-gradient-to-br from-teal-500/[0.08] to-card p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <FileCheck2 className="h-4 w-4 text-cyan-600" />
            Claims spotlight
          </p>
          <div className="mt-3 space-y-2">
            {latestClaimGuide?.slug ? (
              <Link href={`/claims/guides/${latestClaimGuide.slug}`} className="block text-sm underline underline-offset-4">
                {latestClaimGuide.title}
              </Link>
            ) : null}
            {latestClaimCase ? (
              <Link href={`/claims/cases/${latestClaimCase.id}`} className="block text-sm underline underline-offset-4">
                {latestClaimCase.title}
              </Link>
            ) : null}
            {!latestClaimGuide && !latestClaimCase ? (
              <p className="text-sm text-muted-foreground">No claims content published yet.</p>
            ) : null}
          </div>
        </article>

        <article className="rounded-xl border bg-gradient-to-br from-blue-500/[0.08] to-card p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Building2 className="h-4 w-4 text-blue-600" />
            Latest data updates
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {latestDataUpdates.map((item) => (
              <li key={item.key}>
                {item.href ? (
                  <Link href={item.href} className="underline underline-offset-4">
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
