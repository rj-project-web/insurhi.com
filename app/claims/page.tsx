import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileCheck2,
  FolderKanban,
  Scale,
  Sparkles,
} from "lucide-react";

import {
  categorySlugFromClaimsGuide,
  categoryTitleFromClaimsGuide,
  ClaimsGuideCard,
} from "@/components/claims-guide-card";
import { ClaimsHubHero } from "@/components/claims-hub-hero";
import { ClaimsQuickPaths } from "@/components/claims-quick-paths";
import { CategoryIconBadge } from "@/components/insurance-visuals";
import { InsurancePageBand, InsurancePanel } from "@/components/insurance-page-band";
import type { CmsClaimsGuide } from "@/lib/cms-client";
import { getClaimCasesList, getClaimsGuidesList } from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { insuranceCategories } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Insurance Claims Assistance",
  description:
    "Find insurance claim steps, required document checklists, and real claim case examples.",
  path: "/claims",
});

function groupGuidesByCategory(guides: CmsClaimsGuide[]) {
  const grouped = new Map<string, { slug: string; title: string; guides: CmsClaimsGuide[] }>();

  for (const guide of guides) {
    const slug = categorySlugFromClaimsGuide(guide.category) ?? "general";
    const title = categoryTitleFromClaimsGuide(guide.category) ?? "General";
    const bucket = grouped.get(slug) ?? { slug, title, guides: [] };
    bucket.guides.push(guide);
    grouped.set(slug, bucket);
  }

  const categoryOrder = insuranceCategories.map((category) => category.slug);
  return [...grouped.values()].sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.slug);
    const bIndex = categoryOrder.indexOf(b.slug);
    if (aIndex === -1 && bIndex === -1) return a.title.localeCompare(b.title);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export default async function ClaimsPage() {
  const [guides, claimCases] = await Promise.all([getClaimsGuidesList(), getClaimCasesList()]);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Claims", path: "/claims" },
  ]);

  const categoryCount = new Set(
    guides.map((guide) => categorySlugFromClaimsGuide(guide.category)).filter(Boolean),
  ).size;
  const totalChecklistItems = guides.reduce(
    (sum, guide) => sum + (guide.documentChecklist?.length ?? 0),
    0,
  );
  const avgSteps =
    guides.length > 0
      ? Math.round(
          guides.reduce((sum, guide) => sum + (guide.steps?.length ?? 0), 0) / guides.length,
        )
      : 0;

  const stats = [
    { label: "Playbooks", value: `${guides.length} workflows`, icon: FileCheck2 },
    { label: "Categories", value: `${categoryCount || insuranceCategories.length} lines`, icon: FolderKanban },
    { label: "Avg steps", value: `${avgSteps || 5} per guide`, icon: Scale },
    {
      label: "Checklists",
      value: `${totalChecklistItems} document items`,
      icon: Sparkles,
    },
  ];

  const groupedGuides = groupGuidesByCategory(guides);

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <ClaimsHubHero stats={stats} />
      </InsurancePageBand>

      <InsurancePageBand tone="accent" innerClassName="py-8 sm:py-10">
        <section aria-labelledby="category-claims-heading" className="space-y-5">
          <div className="space-y-2">
            <h2
              id="category-claims-heading"
              className="text-2xl font-semibold tracking-tight text-blue-950 dark:text-blue-50"
            >
              Claims help by coverage line
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Jump into category hubs for buying guides, product comparisons, and category-specific
              claim workflows.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {insuranceCategories.map((category) => {
              const categoryGuides = guides.filter(
                (guide) => categorySlugFromClaimsGuide(guide.category) === category.slug,
              );
              return (
                <Link
                  key={category.slug}
                  href={`/insurance/${category.slug}#claims-guides`}
                  className="group rounded-2xl border border-blue-100 bg-background/90 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300/70 hover:shadow-md dark:border-blue-500/20"
                >
                  <div className="flex items-start gap-3">
                    <CategoryIconBadge slug={category.slug} label={category.title} />
                    <div className="min-w-0">
                      <p className="font-semibold text-blue-900 dark:text-blue-100">
                        {category.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {categoryGuides.length > 0
                          ? `${categoryGuides.length} claim playbook${categoryGuides.length === 1 ? "" : "s"}`
                          : "Hub + FAQs + claims section"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 inline-flex items-center text-sm font-medium text-sky-800 dark:text-sky-400">
                    Open claims section
                    <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </InsurancePageBand>

      <InsurancePageBand tone="surface" id="claims-playbooks" innerClassName="py-8 sm:py-10">
        <div className="space-y-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Playbook library
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Step-by-step claim guides
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Each playbook includes filing steps, a document checklist, and common denial or delay
              patterns to watch for.
            </p>
          </div>

          {groupedGuides.length > 0 ? (
            groupedGuides.map((group) => (
              <section key={group.slug} aria-labelledby={`claims-group-${group.slug}`} className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3
                      id={`claims-group-${group.slug}`}
                      className="text-xl font-semibold tracking-tight text-foreground"
                    >
                      {group.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {group.guides.length} playbook{group.guides.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  {group.slug !== "general" ? (
                    <Link
                      href={`/insurance/${group.slug}#claims-guides`}
                      className="text-sm font-medium text-sky-800 underline-offset-4 hover:underline dark:text-sky-400"
                    >
                      View in {group.title.toLowerCase()} hub
                    </Link>
                  ) : null}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.guides.map((guide) => (
                    <ClaimsGuideCard key={guide.id} guide={guide} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <InsurancePanel>Step-by-step claim flow</InsurancePanel>
              <InsurancePanel>Online filing entry points</InsurancePanel>
              <InsurancePanel>Required document checklists</InsurancePanel>
              <InsurancePanel>Claim case library</InsurancePanel>
            </div>
          )}
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <div className="space-y-10">
          <section aria-labelledby="claim-cases-heading" className="space-y-4">
            <div className="space-y-2">
              <h2
                id="claim-cases-heading"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                Claim case examples
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Real-world scenarios showing how documentation, timing, and policy language affect
                outcomes.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {claimCases.length > 0 ? (
                claimCases.map((claimCase) => (
                  <Link
                    key={claimCase.id}
                    href={`/claims/cases/${claimCase.id}`}
                    className="group rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300/60 hover:shadow-md"
                  >
                    <p className="inline-flex items-center rounded-full border border-sky-200/70 bg-sky-50/80 px-2.5 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
                      Case study
                    </p>
                    <h3 className="mt-3 font-semibold text-foreground group-hover:text-sky-900">
                      {claimCase.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {claimCase.scenario}
                    </p>
                    {claimCase.outcome && claimCase.outcome !== claimCase.scenario ? (
                      <p className="mt-3 text-sm text-foreground/80">
                        <span className="font-medium">Outcome:</span> {claimCase.outcome}
                      </p>
                    ) : null}
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-sky-700 group-hover:text-sky-900">
                      Read case
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))
              ) : (
                <InsurancePanel>
                  <p className="text-sm text-muted-foreground">
                    CMS claim case content will appear here after publishing.
                  </p>
                </InsurancePanel>
              )}
            </div>
          </section>

          <ClaimsQuickPaths />
        </div>
      </InsurancePageBand>
    </div>
  );
}
