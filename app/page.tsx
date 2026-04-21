import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowRight, BookOpenText, Building2, FileCheck2, Sparkles } from "lucide-react";
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

  const latestGuides = articles.slice(0, 5);
  const latestClaimsUpdates: Array<{ key: string; label: string; href?: string }> = [];
  for (let i = 0; latestClaimsUpdates.length < 5; i++) {
    const claimGuide = claimsGuides[i];
    const claimCase = claimCases[i];

    if (claimGuide) {
      latestClaimsUpdates.push({
        key: `claim-guide-${claimGuide.id}`,
        label: claimGuide.title,
        href: claimGuide.slug ? `/claims/guides/${claimGuide.slug}` : undefined,
      });
    }
    if (claimCase && latestClaimsUpdates.length < 5) {
      latestClaimsUpdates.push({
        key: `claim-case-${claimCase.id}`,
        label: claimCase.title,
        href: `/claims/cases/${claimCase.id}`,
      });
    }
    if (!claimGuide && !claimCase) {
      break;
    }
  }
  const latestDataUpdates = [
    ...products.slice(0, 5).map((product) => ({
      key: `product-${product.id}`,
      label: `Product: ${product.name}`,
      href: `/products/${product.slug}`,
    })),
    ...providers.slice(0, 5).map((provider) => ({
      key: `provider-${provider.id}`,
      label: `Provider: ${provider.name}`,
      href: `/providers/${provider.slug}`,
    })),
    ...faqItems.slice(0, 5).map((faq) => ({
      key: `faq-${faq.id}`,
      label: `FAQ: ${faq.question}`,
      href: "/content-map",
    })),
    ...pages.slice(0, 5).map((page) => ({
      key: `page-${page.id}`,
      label: `Page: ${page.title}`,
      href: "/content-map",
    })),
  ].slice(0, 5);
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

      <section
        className="relative overflow-hidden rounded-2xl border bg-card/90 p-4 lg:p-5 dark:border-slate-700/70 dark:bg-slate-900/50"
        style={{ backgroundImage: "url('/home-latest-bg.svg')" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/70 via-blue-50/50 to-cyan-50/60 dark:from-slate-950/70 dark:via-slate-900/55 dark:to-cyan-950/35" />
        <div className="relative grid gap-3 lg:grid-cols-3">
          <article className="group animate-card-fade-up relative overflow-hidden rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-white/95 via-indigo-50/70 to-blue-50/60 p-4 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300/80 hover:shadow-lg dark:border-indigo-500/30 dark:from-slate-900/90 dark:via-indigo-950/30 dark:to-slate-900/80 dark:hover:border-indigo-400/50">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/70 to-transparent dark:from-indigo-200/10" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-300/35 blur-2xl transition-transform duration-500 group-hover:scale-110 dark:bg-indigo-500/20" />
          <p className="relative flex items-center gap-2 text-sm font-medium">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200 transition-transform duration-300 group-hover:scale-105 dark:bg-indigo-500/20 dark:text-indigo-200 dark:ring-indigo-400/30">
              <BookOpenText className="h-4 w-4" />
            </span>
            Latest guides
          </p>
          {latestGuides.length ? (
            <ul className="relative mt-3 space-y-2 text-sm text-muted-foreground">
              {latestGuides.map((guide) => (
                <li key={`guide-${guide.id}`}>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="inline-flex transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
                  >
                    {guide.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No guides published yet.</p>
          )}
        </article>

          <article
            className="group animate-card-fade-up relative overflow-hidden rounded-2xl border border-cyan-200/70 bg-gradient-to-br from-white/95 via-cyan-50/70 to-blue-50/60 p-4 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/80 hover:shadow-lg dark:border-cyan-500/30 dark:from-slate-900/90 dark:via-cyan-950/25 dark:to-slate-900/80 dark:hover:border-cyan-400/50"
            style={{ animationDelay: "90ms" }}
          >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/70 to-transparent dark:from-cyan-200/10" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-300/35 blur-2xl transition-transform duration-500 group-hover:scale-110 dark:bg-cyan-500/20" />
          <p className="relative flex items-center gap-2 text-sm font-medium">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200 transition-transform duration-300 group-hover:scale-105 dark:bg-cyan-500/20 dark:text-cyan-200 dark:ring-cyan-400/30">
              <FileCheck2 className="h-4 w-4" />
            </span>
            Claims spotlight
          </p>
          {latestClaimsUpdates.length ? (
            <ul className="relative mt-3 space-y-2 text-sm text-muted-foreground">
              {latestClaimsUpdates.map((item) => (
                <li key={item.key}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="inline-flex transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    item.label
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No claims content published yet.</p>
          )}
        </article>

          <article
            className="group animate-card-fade-up relative overflow-hidden rounded-2xl border border-blue-200/70 bg-gradient-to-br from-white/95 via-blue-50/70 to-sky-50/60 p-4 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/80 hover:shadow-lg dark:border-blue-500/30 dark:from-slate-900/90 dark:via-blue-950/25 dark:to-slate-900/80 dark:hover:border-blue-400/50"
            style={{ animationDelay: "180ms" }}
          >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/70 to-transparent dark:from-blue-200/10" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-300/35 blur-2xl transition-transform duration-500 group-hover:scale-110 dark:bg-blue-500/20" />
          <p className="relative flex items-center gap-2 text-sm font-medium">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 ring-1 ring-blue-200 transition-transform duration-300 group-hover:scale-105 dark:bg-blue-500/20 dark:text-blue-200 dark:ring-blue-400/30">
              <Building2 className="h-4 w-4" />
            </span>
            Latest data updates
          </p>
          <ul className="relative mt-3 space-y-2 text-sm text-muted-foreground">
            {latestDataUpdates.map((item) => (
              <li key={item.key}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="inline-flex transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
                  >
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </li>
            ))}
          </ul>
          </article>
        </div>
      </section>
    </div>
  );
}
