import Link from "next/link";
import { ArrowRight, ClipboardList, FileCheck2 } from "lucide-react";

import { CategoryIconBadge } from "@/components/insurance-visuals";
import type { CmsClaimsGuide } from "@/lib/cms-client";

function categorySlugFromGuide(category: CmsClaimsGuide["category"]): string | null {
  if (!category) return null;
  if (typeof category === "string") return category;
  return category.slug ?? null;
}

function categoryTitleFromGuide(category: CmsClaimsGuide["category"]): string | null {
  if (!category || typeof category !== "object") return null;
  return category.title ?? null;
}

type ClaimsGuideCardProps = {
  guide: CmsClaimsGuide;
};

export function ClaimsGuideCard({ guide }: ClaimsGuideCardProps) {
  const categorySlug = categorySlugFromGuide(guide.category);
  const categoryTitle = categoryTitleFromGuide(guide.category);
  const stepCount = guide.steps?.length ?? 0;
  const checklistCount = guide.documentChecklist?.length ?? 0;
  const firstStep = guide.steps?.[0]?.step;
  const href = guide.slug ? `/claims/guides/${guide.slug}` : "/claims";

  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300/60 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        {categorySlug ? (
          <CategoryIconBadge slug={categorySlug} label={categoryTitle ?? "Claims"} />
        ) : (
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <FileCheck2 className="h-5 w-5" aria-hidden />
          </span>
        )}
        <div className="min-w-0 space-y-1">
          {categoryTitle ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
              {categoryTitle}
            </p>
          ) : null}
          <h3 className="font-semibold leading-snug text-foreground group-hover:text-sky-900">
            {guide.title}
          </h3>
        </div>
      </div>

      <dl className="mt-4 flex flex-wrap gap-2 text-xs">
        <div className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-muted-foreground">
          <ClipboardList className="h-3.5 w-3.5 text-sky-600" />
          <span>
            <span className="font-medium text-foreground">{stepCount}</span> steps
          </span>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-muted-foreground">
          <FileCheck2 className="h-3.5 w-3.5 text-blue-600" />
          <span>
            <span className="font-medium text-foreground">{checklistCount}</span> checklist items
          </span>
        </div>
      </dl>

      {firstStep ? (
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-muted-foreground">
          <span className="font-medium text-foreground/80">Step 1:</span> {firstStep}
        </p>
      ) : (
        <p className="mt-3 flex-1 text-sm text-muted-foreground">
          Open the playbook for filing steps and required documents.
        </p>
      )}

      <span className="mt-4 inline-flex items-center text-sm font-medium text-sky-700 group-hover:text-sky-900">
        Open playbook
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function categorySlugFromClaimsGuide(category: CmsClaimsGuide["category"]): string | null {
  return categorySlugFromGuide(category);
}

export function categoryTitleFromClaimsGuide(category: CmsClaimsGuide["category"]): string | null {
  return categoryTitleFromGuide(category);
}
