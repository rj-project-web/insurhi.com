import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";

import { CategoryIconBadge } from "@/components/insurance-visuals";
import type { CmsGlossaryTerm } from "@/lib/cms-client";
import {
  categorySlugFromRelation,
  categoryTitleFromRelation,
} from "@/lib/hub-list-utils";

type GlossaryTermCardProps = {
  term: CmsGlossaryTerm;
};

export function GlossaryTermCard({ term }: GlossaryTermCardProps) {
  const categorySlug = categorySlugFromRelation(term.category);
  const categoryTitle = categoryTitleFromRelation(term.category);

  return (
    <Link
      href={`/glossary/${term.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300/60 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        {categorySlug ? (
          <CategoryIconBadge slug={categorySlug} label={categoryTitle ?? "Term"} />
        ) : (
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <BookOpenText className="h-5 w-5" aria-hidden />
          </span>
        )}
        <div className="min-w-0">
          {categoryTitle ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
              {categoryTitle}
            </p>
          ) : null}
          <h3 className="font-semibold leading-snug text-foreground group-hover:text-sky-900">
            {term.term}
          </h3>
        </div>
      </div>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
        {term.definition}
      </p>

      <span className="mt-4 inline-flex items-center text-sm font-medium text-sky-700 group-hover:text-sky-900">
        Read definition
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
