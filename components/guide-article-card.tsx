import Link from "next/link";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";

import { CategoryIconBadge } from "@/components/insurance-visuals";
import type { CmsArticle } from "@/lib/cms-client";
import {
  categorySlugFromRelation,
  categoryTitleFromRelation,
} from "@/lib/hub-list-utils";

type GuideArticleCardProps = {
  article: CmsArticle;
};

export function GuideArticleCard({ article }: GuideArticleCardProps) {
  const categorySlug = categorySlugFromRelation(article.category);
  const categoryTitle = categoryTitleFromRelation(article.category);
  const summary =
    article.seo?.metaDescription ??
    "Editorial buying guide with coverage trade-offs and next steps.";

  return (
    <Link
      href={`/guides/${article.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300/60 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        {categorySlug ? (
          <CategoryIconBadge slug={categorySlug} label={categoryTitle ?? "Guide"} />
        ) : (
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <BookOpen className="h-5 w-5" aria-hidden />
          </span>
        )}
        <div className="min-w-0 space-y-1">
          {categoryTitle ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
              {categoryTitle}
            </p>
          ) : null}
          <h3 className="font-semibold leading-snug text-foreground group-hover:text-sky-900">
            {article.title}
          </h3>
        </div>
      </div>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">{summary}</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock3 className="h-3.5 w-3.5 text-sky-600" />
          Buying guide
        </span>
        <span className="inline-flex items-center text-sm font-medium text-sky-700 group-hover:text-sky-900">
          Read guide
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
