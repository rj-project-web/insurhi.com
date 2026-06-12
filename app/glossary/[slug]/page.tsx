import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookOpenText, ClipboardList, Sparkles } from "lucide-react";

import { DetailPageSidebar } from "@/components/detail-page-sidebar";
import { EditorialDisclosure } from "@/components/editorial-disclosure";
import {
  getGlossaryTermSections,
  GlossaryTermContent,
} from "@/components/glossary-term-content";
import { GlossaryTermHero } from "@/components/glossary-term-hero";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand } from "@/components/insurance-page-band";
import { getGlossaryTermBySlug, getGlossaryTerms } from "@/lib/cms-client";
import { glossaryResourceLinks } from "@/lib/glossary-links";
import { categorySlugFromRelation, categoryTitleFromRelation } from "@/lib/hub-list-utils";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildDefinedTermJsonLd,
  buildMetadata,
} from "@/lib/seo";

type GlossaryTermPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const terms = await getGlossaryTerms();
  return terms.map((term) => ({ slug: term.slug }));
}

export async function generateMetadata({ params }: GlossaryTermPageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = await getGlossaryTermBySlug(slug);

  if (!term) {
    return buildMetadata({
      title: "Glossary Term",
      description: "Insurance glossary definition.",
      path: "/glossary",
    });
  }

  return buildMetadata({
    title: `${term.term} | Insurance Glossary`,
    description: term.definition.slice(0, 160),
    path: `/glossary/${term.slug}`,
    ogImagePath: null,
  });
}

export default async function GlossaryTermPage({ params }: GlossaryTermPageProps) {
  const { slug } = await params;
  const term = await getGlossaryTermBySlug(slug);

  if (!term) notFound();

  const allTerms = await getGlossaryTerms();
  const relatedSlugs = (term.relatedSlugs ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const relatedTerms = allTerms.filter((item) => relatedSlugs.includes(item.slug));
  const resources = glossaryResourceLinks[term.slug];
  const catSlug = categorySlugFromRelation(term.category);
  const catTitle = categoryTitleFromRelation(term.category);
  const sections = getGlossaryTermSections({ resources, relatedTerms });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Glossary", path: "/glossary" },
    { name: term.term, path: `/glossary/${term.slug}` },
  ]);
  const definedTermJsonLd = buildDefinedTermJsonLd({
    name: term.term,
    url: absoluteUrl(`/glossary/${term.slug}`),
    description: term.definition,
  });

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <GlossaryTermHero
          term={term.term}
          slug={term.slug}
          definition={term.definition}
          categorySlug={catSlug}
          categoryTitle={catTitle}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            <GlossaryTermContent
              definition={term.definition}
              resources={resources}
              relatedTerms={relatedTerms}
            />
          </div>
          <DetailPageSidebar sections={sections} categorySlug={catSlug} categoryTitle={catTitle} />
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <div className="space-y-8">
          <EditorialDisclosure variant="compact" />
          <HubQuickPaths
            description="Connect this definition to guides, claims playbooks, and the full glossary index."
            paths={[
              {
                key: "glossary",
                icon: BookOpenText,
                title: "Glossary index",
                description: "Browse all indexed insurance terms.",
                href: "/glossary",
              },
              {
                key: "guides",
                icon: Sparkles,
                title: "Buying guides",
                description: "See how this term affects real coverage decisions.",
                href: "/guides",
              },
              {
                key: "claims",
                icon: ClipboardList,
                title: "Claims center",
                description: "Understand claim language before you file.",
                href: "/claims",
              },
            ]}
          />
        </div>
      </InsurancePageBand>
    </div>
  );
}
