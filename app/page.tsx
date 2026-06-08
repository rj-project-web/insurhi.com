import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditorialDisclosure } from "@/components/editorial-disclosure";
import { HomeHeroBadges } from "@/components/home-hero-badges";
import { HomeLatestFeed } from "@/components/home-latest-feed";
import {
  getClaimCases,
  getClaimsGuides,
  getFaqItems,
  getLatestArticles,
  getProducts,
  getProviders,
} from "@/lib/cms-client";
import { categoryDescriptions } from "@/lib/home-content";
import { buildFaqPageJsonLd, buildMetadata, buildWebSiteJsonLd } from "@/lib/seo";
import { insuranceCategories } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Insurance Comparison and Claims Guidance",
  description:
    "Compare insurance options, browse practical guides, and get claims assistance across major insurance categories.",
  path: "/",
});

export default async function Home() {
  const webSiteJsonLd = buildWebSiteJsonLd();
  const [articles, claimsGuides, claimCases, products, providers, faqItems] = await Promise.all([
    getLatestArticles(),
    getClaimsGuides(),
    getClaimCases(),
    getProducts(),
    getProviders(),
    getFaqItems(),
  ]);

  const featuredFaqs = faqItems.slice(0, 4);
  const faqPageJsonLd = buildFaqPageJsonLd(
    featuredFaqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
  );
  const claimsResourceCount = claimsGuides.length + claimCases.length;

  const heroStats = [
    { label: "Categories", value: `${insuranceCategories.length} deep hubs` },
    { label: "Analysis", value: `${products.length} products` },
    { label: "Expertise", value: `${articles.length} guides` },
    { label: "Support", value: `${claimsResourceCount} claims resources` },
  ] as const;

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      {faqPageJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
        />
      ) : null}

      <section
        aria-labelledby="home-hero-heading"
        className="space-y-5 rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-800/[0.06] via-sky-500/[0.05] to-card p-6 lg:p-8"
      >
        <HomeHeroBadges />
        <h1
          id="home-hero-heading"
          className="text-3xl font-semibold tracking-tight text-blue-950 sm:text-4xl dark:text-blue-50"
        >
          Compare Insurance Options &amp; Claims Guidance
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          Insurhi provides independent research across auto, home, life, Medicare, pet, and renters.
          Category playbooks help you compare coverage and navigate claims with confidence.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {heroStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-lg border border-blue-100 bg-background/95 px-4 py-3"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-1 text-lg font-semibold capitalize text-blue-900 dark:text-blue-100">
                {stat.value}
              </p>
            </article>
          ))}
        </div>
        <EditorialDisclosure variant="compact" />
      </section>

      <section aria-labelledby="categories-heading" className="space-y-4 rounded-2xl border bg-card p-5 lg:p-6">
        <div className="space-y-2">
          <h2
            id="categories-heading"
            className="text-2xl font-semibold tracking-tight text-blue-950 dark:text-blue-50"
          >
            Insurance categories
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Access comprehensive hubs for specialized coverage with expert reviews and step-by-step
            claims playbooks.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {insuranceCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/insurance/${category.slug}`}
              className="rounded-xl border border-blue-100 bg-background p-4 transition-colors hover:border-sky-300/80 hover:bg-blue-50/40"
            >
              <p className="font-semibold text-blue-900 dark:text-blue-100">{category.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {categoryDescriptions[category.slug as keyof typeof categoryDescriptions] ??
                  "Guides, products, and claims help."}
              </p>
            </Link>
          ))}
          <Link
            href="/resources"
            className="flex flex-col justify-center rounded-xl border border-dashed border-blue-200 bg-blue-50/30 p-4 transition-colors hover:border-sky-400/80 hover:bg-blue-50/60 dark:border-blue-500/30 dark:bg-blue-950/15"
          >
            <p className="font-semibold text-blue-900 dark:text-blue-100">View all resources</p>
            <p className="mt-2 text-sm text-muted-foreground">Glossary, FAQs, and editorial deep dives.</p>
            <span className="mt-3 inline-flex items-center text-sm font-medium text-sky-800 dark:text-sky-400">
              Open resource hub
              <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
            </span>
          </Link>
        </div>
      </section>

      <HomeLatestFeed
        articles={articles}
        claimsGuides={claimsGuides}
        claimCases={claimCases}
        products={products}
        providers={providers}
      />

      <section aria-labelledby="faq-heading" className="space-y-4 rounded-2xl border bg-card p-5 lg:p-6">
        <div className="space-y-2">
          <h2
            id="faq-heading"
            className="text-2xl font-semibold tracking-tight text-blue-950 dark:text-blue-50"
          >
            Frequently asked questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Common questions about our research, independence, and how to use Insurhi.
          </p>
        </div>
        {featuredFaqs.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {featuredFaqs.map((faq) => (
              <article key={faq.id} className="rounded-xl border border-blue-100 bg-background p-4">
                <h3 className="text-base font-semibold text-blue-950 dark:text-blue-50">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
            FAQ content will appear here once entries are published.
          </p>
        )}
        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            href="/methodology"
            className="font-medium text-sky-800 underline-offset-4 hover:underline dark:text-sky-400"
          >
            Editorial methodology
          </Link>
          <Link
            href="/glossary"
            className="font-medium text-sky-800 underline-offset-4 hover:underline dark:text-sky-400"
          >
            Insurance glossary
          </Link>
          <Link
            href="/contact"
            className="font-medium text-sky-800 underline-offset-4 hover:underline dark:text-sky-400"
          >
            Contact editorial
          </Link>
        </div>
      </section>
    </div>
  );
}
