import type { Metadata } from "next";
import { BookOpen, BookOpenCheck, Clock3, FolderKanban, Sparkles } from "lucide-react";

import { GuideArticleCard } from "@/components/guide-article-card";
import { HubCategoryGrid } from "@/components/hub-category-grid";
import { HubGroupedSection } from "@/components/hub-grouped-section";
import { HubIndexHero } from "@/components/hub-index-hero";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand } from "@/components/insurance-page-band";
import { getArticlesList } from "@/lib/cms-client";
import {
  buildCategoryItemGroups,
  categorySlugFromRelation,
  countUniqueCategories,
} from "@/lib/hub-list-utils";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { insuranceCategories } from "@/lib/site-data";

const GUIDES_PER_CATEGORY = 6;

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Insurance Guides and Tutorials",
  description:
    "Learn insurance fundamentals, compare policies, and understand claims with practical step-by-step guides.",
  path: "/guides",
});

export default async function GuidesPage() {
  const articles = await getArticlesList();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
  ]);

  const categoryCount = countUniqueCategories(articles, (article) =>
    categorySlugFromRelation(article.category),
  );
  const groupedArticles = buildCategoryItemGroups(
    articles,
    insuranceCategories,
    (article) => categorySlugFromRelation(article.category),
    GUIDES_PER_CATEGORY,
  );

  const stats = [
    { label: "Guides", value: `${articles.length} articles`, icon: BookOpen },
    {
      label: "Categories",
      value: `${categoryCount || insuranceCategories.length} lines`,
      icon: FolderKanban,
    },
    { label: "Format", value: "Buying playbooks", icon: BookOpenCheck },
    { label: "Updates", value: "CMS synced", icon: Clock3 },
  ];

  const categoryItems = insuranceCategories.map((category) => {
    const count = articles.filter(
      (article) => categorySlugFromRelation(article.category) === category.slug,
    ).length;
    return {
      slug: category.slug,
      title: category.title,
      meta:
        count > 0
          ? `${count} guide${count === 1 ? "" : "s"} in library`
          : "Hub + FAQs + buying guides",
      href: `/insurance/${category.slug}#buying-guides`,
      linkLabel: "Open buying guides",
    };
  });

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <HubIndexHero
          eyebrow="Editorial guides library"
          title="Insurance guides"
          description="Beginner basics, side-by-side reviews, claims tactics, and common pitfalls — structured buying playbooks for smarter coverage decisions."
          stats={stats}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="accent" innerClassName="py-8 sm:py-10">
        <HubCategoryGrid
          heading="Guides by coverage line"
          description="Jump into category hubs for deep guides, product comparisons, and FAQs alongside editorial articles."
          items={categoryItems}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="surface" id="guide-library" innerClassName="py-8 sm:py-10">
        <div className="space-y-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Featured library
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Guides by coverage line
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Up to {GUIDES_PER_CATEGORY} guides per category — open a hub for the full list.
            </p>
          </div>

          {groupedArticles.map((group) => (
            <HubGroupedSection
              key={group.slug}
              idPrefix="guides-group"
              slug={group.slug}
              title={group.title}
              items={group.items}
              totalCount={group.totalCount}
              itemNoun="guide"
              hubHref={`/insurance/${group.slug}#buying-guides`}
              hubLinkLabel="category hub"
            >
              {group.items.map((article) => (
                <GuideArticleCard key={article.id} article={article} />
              ))}
            </HubGroupedSection>
          ))}
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
          description="Pair guides with product reviews, claims playbooks, and glossary definitions for end-to-end research."
          paths={[
            {
              key: "insurance",
              icon: Sparkles,
              title: "Insurance categories",
              description: "Browse six coverage hubs with guides, products, and FAQs.",
              href: "/insurance",
            },
            {
              key: "products",
              icon: BookOpenCheck,
              title: "Product reviews",
              description: "Compare flagship policies with pros, cons, and premium estimates.",
              href: "/products",
            },
            {
              key: "claims",
              icon: Clock3,
              title: "Claims assistance",
              description: "Step-by-step claim playbooks and document checklists.",
              href: "/claims",
            },
          ]}
        />
      </InsurancePageBand>
    </div>
  );
}
