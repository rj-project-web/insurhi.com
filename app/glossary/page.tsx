import type { Metadata } from "next";
import { BookOpenText, FileSearch, FolderKanban, Sparkles } from "lucide-react";

import { GlossaryTermCard } from "@/components/glossary-term-card";
import { HubCategoryGrid } from "@/components/hub-category-grid";
import { HubGroupedSection } from "@/components/hub-grouped-section";
import { HubIndexHero } from "@/components/hub-index-hero";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand } from "@/components/insurance-page-band";
import { getGlossaryTerms } from "@/lib/cms-client";
import { categoryContentHubs, isCategorySlug } from "@/lib/category-content-hub";
import {
  buildCategoryItemGroups,
  categorySlugFromRelation,
  countUniqueCategories,
} from "@/lib/hub-list-utils";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { insuranceCategories } from "@/lib/site-data";

const GLOSSARY_PER_CATEGORY = 9;

export const metadata: Metadata = buildMetadata({
  title: "Insurance Glossary | Key Terms Explained",
  description:
    "Plain-language definitions for insurance terms: deductibles, replacement cost, UM/UIM, Medigap plans, pet exclusions, and more.",
  path: "/glossary",
});

export default async function GlossaryPage() {
  const terms = await getGlossaryTerms();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Glossary", path: "/glossary" },
  ]);

  const categoryCount = countUniqueCategories(terms, (term) => categorySlugFromRelation(term.category));
  const groupedTerms = buildCategoryItemGroups(
    terms,
    insuranceCategories,
    (term) => categorySlugFromRelation(term.category),
    GLOSSARY_PER_CATEGORY,
  );

  const stats = [
    { label: "Terms", value: `${terms.length} definitions`, icon: BookOpenText },
    {
      label: "Categories",
      value: `${categoryCount || insuranceCategories.length} lines`,
      icon: FolderKanban,
    },
    { label: "Format", value: "Plain language", icon: FileSearch },
    { label: "Links", value: "Guides + hubs", icon: Sparkles },
  ];

  const categoryItems = insuranceCategories.map((category) => {
    const count = terms.filter(
      (term) => categorySlugFromRelation(term.category) === category.slug,
    ).length;
    const hubTerms = isCategorySlug(category.slug)
      ? categoryContentHubs[category.slug].glossaryTerms.length
      : 0;
    return {
      slug: category.slug,
      title: category.title,
      meta:
        count > 0
          ? `${count} term${count === 1 ? "" : "s"} in glossary`
          : `${hubTerms} featured terms in hub`,
      href: `/insurance/${category.slug}#faqs`,
      linkLabel: "Open category glossary",
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
          eyebrow="Reference library"
          title="Insurance glossary"
          description="Short, practical definitions for terms you will see in policies, claims letters, and comparison guides — each entry links to related guides and category hubs."
          stats={stats}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="accent" innerClassName="py-8 sm:py-10">
        <HubCategoryGrid
          heading="Terms by coverage line"
          description="Browse glossary entries organized by insurance category, or open a hub for featured terms and FAQs."
          items={categoryItems}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="surface" id="glossary-library" innerClassName="py-8 sm:py-10">
        <div className="space-y-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Featured index
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Terms by coverage line
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Up to {GLOSSARY_PER_CATEGORY} terms per category — open a hub for the complete
              glossary.
            </p>
          </div>

          {groupedTerms.map((group) => (
            <HubGroupedSection
              key={group.slug}
              idPrefix="glossary-group"
              slug={group.slug}
              title={group.title}
              items={group.items}
              totalCount={group.totalCount}
              itemNoun="term"
              gridClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              hubHref={`/insurance/${group.slug}#faqs`}
              hubLinkLabel="category hub"
            >
              {group.items.map((term) => (
                <GlossaryTermCard key={term.id} term={term} />
              ))}
            </HubGroupedSection>
          ))}
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
          description="Use glossary definitions alongside buying guides, claims playbooks, and category hubs."
          paths={[
            {
              key: "guides",
              icon: BookOpenText,
              title: "Buying guides",
              description: "Deep dives that explain how terms affect real coverage decisions.",
              href: "/guides",
            },
            {
              key: "claims",
              icon: FileSearch,
              title: "Claims center",
              description: "Understand claim language before you file or appeal.",
              href: "/claims",
            },
            {
              key: "resources",
              icon: Sparkles,
              title: "Resource tracks",
              description: "Learning paths that connect guides, glossary, and comparisons.",
              href: "/resources",
            },
          ]}
        />
      </InsurancePageBand>
    </div>
  );
}
