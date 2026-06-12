import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  FolderKanban,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { LinkifiedText } from "@/components/cms-rich-text";
import { EditorialDisclosure } from "@/components/editorial-disclosure";
import { HomeLatestFeed } from "@/components/home-latest-feed";
import { HubCategoryGrid } from "@/components/hub-category-grid";
import { HubIndexHero } from "@/components/hub-index-hero";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand, InsurancePanel } from "@/components/insurance-page-band";
import {
  getClaimCases,
  getClaimsGuides,
  getLatestArticles,
  getProducts,
  getProviders,
} from "@/lib/cms-client";
import { categoryDescriptions, heroStatLabels, homeTrustFaqs } from "@/lib/home-content";
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
  const [articles, claimsGuides, claimCases, products, providers] = await Promise.all([
    getLatestArticles(),
    getClaimsGuides(),
    getClaimCases(),
    getProducts(),
    getProviders(),
  ]);

  const faqPageJsonLd = buildFaqPageJsonLd(
    homeTrustFaqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
  );
  const claimsResourceCount = claimsGuides.length + claimCases.length;

  const stats = [
    {
      label: "Categories",
      value: `${insuranceCategories.length} ${heroStatLabels.categories}`,
      icon: FolderKanban,
    },
    {
      label: "Analysis",
      value: `${products.length} ${heroStatLabels.analysis}`,
      icon: ShieldCheck,
    },
    {
      label: "Expertise",
      value: `${articles.length} ${heroStatLabels.expertise}`,
      icon: BookOpen,
    },
    {
      label: "Support",
      value: `${claimsResourceCount} ${heroStatLabels.support}`,
      icon: ClipboardList,
    },
  ];

  const categoryItems = insuranceCategories.map((category) => ({
    slug: category.slug,
    title: category.title,
    meta:
      categoryDescriptions[category.slug as keyof typeof categoryDescriptions] ??
      "Guides, products, and claims help.",
    href: `/insurance/${category.slug}`,
    linkLabel: "Open hub",
  }));

  return (
    <div className="-mx-4 -my-8">
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

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <div className="space-y-6">
          <HubIndexHero
            eyebrow="Independent insurance research"
            title="Compare insurance options & claims guidance"
            description="Insurhi provides independent research across auto, home, life, and Medicare. Our playbooks are written by category experts to help you navigate coverage decisions and claims with confidence."
            stats={stats}
          />
          <EditorialDisclosure variant="homepage" />
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="accent" innerClassName="py-8 sm:py-10">
        <div className="space-y-5">
          <HubCategoryGrid
            heading="Insurance categories"
            description="Access comprehensive hubs for specialized coverage with expert reviews and step-by-step claims playbooks."
            items={categoryItems}
          />
          <Link
            href="/resources"
            className="group flex flex-col justify-center rounded-2xl border border-dashed border-sky-200 bg-sky-50/40 p-5 transition-colors hover:border-sky-400/80 hover:bg-sky-50/70 dark:border-sky-500/30 dark:bg-sky-950/15 sm:max-w-md"
          >
            <p className="font-semibold text-foreground">View all resources</p>
            <p className="mt-1 text-sm text-muted-foreground">Glossary, FAQs, and deep dives.</p>
            <span className="mt-3 inline-flex items-center text-sm font-medium text-sky-800 dark:text-sky-400">
              Open resource hub
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <HomeLatestFeed
          articles={articles}
          claimsGuides={claimsGuides}
          claimCases={claimCases}
          products={products}
          providers={providers}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="muted" id="faq" innerClassName="py-8 sm:py-10">
        <InsurancePanel className="p-6 sm:p-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Frequently asked questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Our experts answer common questions about our research and methodology.
            </p>
          </div>
          <div className="mx-auto mt-6 grid max-w-4xl gap-4 md:grid-cols-2">
            {homeTrustFaqs.map((faq) => (
              <article key={faq.id} className="rounded-xl border border-blue-100 bg-background p-4">
                <h3 className="text-base font-semibold text-foreground">{faq.question}</h3>
                <LinkifiedText
                  text={faq.answer}
                  className="mt-2 block text-sm leading-6 text-muted-foreground"
                />
              </article>
            ))}
          </div>
        </InsurancePanel>
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
          description="Start with a category hub, dive into guides, or bookmark claims workflows before you need them."
          paths={[
            {
              key: "insurance",
              icon: Sparkles,
              title: "Insurance categories",
              description: "Six coverage hubs with guides, products, providers, and FAQs.",
              href: "/insurance",
            },
            {
              key: "guides",
              icon: BookOpen,
              title: "Buying guides",
              description: "Step-by-step playbooks for smarter coverage decisions.",
              href: "/guides",
            },
            {
              key: "claims",
              icon: ClipboardList,
              title: "Claims center",
              description: "Filing playbooks, checklists, and real case examples.",
              href: "/claims",
            },
            {
              key: "glossary",
              icon: BookOpen,
              title: "Resource hub",
              description: "Glossary, learning tracks, and reference content.",
              href: "/resources",
            },
          ]}
        />
      </InsurancePageBand>
    </div>
  );
}
