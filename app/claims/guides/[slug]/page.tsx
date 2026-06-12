import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClaimsGuideContent } from "@/components/claims-guide-content";
import { ClaimsGuideDetailQuickPaths } from "@/components/claims-guide-detail-quick-paths";
import { ClaimsGuideHero } from "@/components/claims-guide-hero";
import { ClaimsGuideHighlights } from "@/components/claims-guide-highlights";
import { ClaimsGuideSidebar } from "@/components/claims-guide-sidebar";
import { EditorialDisclosure } from "@/components/editorial-disclosure";
import { InsurancePageBand } from "@/components/insurance-page-band";
import { RelatedContentPanel } from "@/components/related-content-panel";
import { getClaimsGuideBySlug, getClaimsGuidesList } from "@/lib/cms-client";
import {
  buildClaimsGuideSummary,
  estimateClaimsGuideReadMinutes,
  getClaimsGuideHighlights,
  getClaimsGuideSections,
} from "@/lib/claims-guide-utils";
import { getRelatedContentForClaimsGuide } from "@/lib/content-links";
import { buildClaimsGuidePageTitle } from "@/lib/page-titles";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildHowToJsonLd,
  buildMetadata,
} from "@/lib/seo";

type ClaimsGuideDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function categorySlugFromGuide(category: unknown): string | null {
  if (!category) return null;
  if (typeof category === "string") return category;
  if (typeof category === "object") return (category as { slug?: string }).slug ?? null;
  return null;
}

function categoryTitleFromGuide(category: unknown): string | null {
  if (!category || typeof category !== "object") return null;
  return (category as { title?: string }).title ?? null;
}

export async function generateStaticParams() {
  const guides = await getClaimsGuidesList();
  return guides
    .filter((guide) => Boolean(guide.slug))
    .map((guide) => ({ slug: guide.slug as string }));
}

export async function generateMetadata({
  params,
}: ClaimsGuideDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getClaimsGuideBySlug(slug);

  if (!guide) {
    return buildMetadata({
      title: "Claims Guide",
      description: "Insurance claims walkthrough.",
      path: "/claims",
    });
  }

  return buildMetadata({
    title: buildClaimsGuidePageTitle(guide.title),
    description: buildClaimsGuideSummary(guide),
    path: `/claims/guides/${slug}`,
    ogImagePath: null,
  });
}

export default async function ClaimsGuideDetailPage({ params }: ClaimsGuideDetailPageProps) {
  const { slug } = await params;
  const guide = await getClaimsGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Claims", path: "/claims" },
    { name: guide.title, path: `/claims/guides/${slug}` },
  ]);
  const howToJsonLd = buildHowToJsonLd({
    name: guide.title,
    url: absoluteUrl(`/claims/guides/${slug}`),
    description: buildClaimsGuideSummary(guide),
    steps: (guide.steps ?? []).map((step) => step.step).filter(Boolean),
    datePublished: guide.createdAt,
    dateModified: guide.updatedAt ?? guide.createdAt,
  });
  const relatedContent = getRelatedContentForClaimsGuide(slug, guide.category);
  const categorySlug = categorySlugFromGuide(guide.category);
  const categoryTitle = categoryTitleFromGuide(guide.category);
  const sections = getClaimsGuideSections(guide);
  const summary = buildClaimsGuideSummary(guide);
  const readMinutes = estimateClaimsGuideReadMinutes(guide);
  const highlights = getClaimsGuideHighlights(guide, 3);

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <ClaimsGuideHero
          guide={guide}
          summary={summary}
          readMinutes={readMinutes}
          categorySlug={categorySlug}
          categoryTitle={categoryTitle}
          updatedAt={guide.updatedAt}
          createdAt={guide.createdAt}
          reviewedBy={guide.reviewedBy}
          lastReviewedAt={guide.lastReviewedAt}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 space-y-6">
            <ClaimsGuideHighlights items={highlights} />
            <ClaimsGuideContent guide={guide} />
          </div>

          <ClaimsGuideSidebar
            sections={sections}
            categorySlug={categorySlug}
            categoryTitle={categoryTitle}
          />
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <div className="space-y-8">
          <EditorialDisclosure />
          <RelatedContentPanel bundle={relatedContent} title="Before and after you file" />
          <ClaimsGuideDetailQuickPaths
            categorySlug={categorySlug}
            categoryTitle={categoryTitle}
          />
        </div>
      </InsurancePageBand>
    </div>
  );
}
