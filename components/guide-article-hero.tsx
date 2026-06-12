import Link from "next/link";
import { BookOpen, Clock3, Sparkles } from "lucide-react";

import { CategoryIconBadge } from "@/components/insurance-visuals";
import { EditorialMetadata, type EditorialMetadataProps } from "@/components/editorial-disclosure";

type GuideArticleHeroProps = EditorialMetadataProps & {
  title: string;
  summary: string;
  categorySlug?: string | null;
  categoryTitle?: string | null;
  readMinutes: number;
};

export function GuideArticleHero({
  title,
  summary,
  categorySlug,
  categoryTitle,
  readMinutes,
  ...metadata
}: GuideArticleHeroProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-0 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.35fr_auto] lg:items-start lg:gap-10">
        <div className="space-y-6">
          <p className="inline-flex flex-wrap items-center gap-1 rounded-full border border-sky-200/80 bg-background/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            <Link href="/guides" className="hover:text-foreground">
              Guides
            </Link>
            <span>/</span>
            {categorySlug && categoryTitle ? (
              <Link href={`/insurance/${categorySlug}`} className="hover:text-foreground">
                {categoryTitle}
              </Link>
            ) : (
              <span>Insurance</span>
            )}
          </p>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.12]">
              {title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {summary}
            </p>
          </div>

          <EditorialMetadata {...metadata} className="text-sm text-muted-foreground" />

          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/70 bg-background/90 p-3 shadow-sm">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5 text-sky-600" />
                Read time
              </dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">{readMinutes} min</dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/90 p-3 shadow-sm">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                Format
              </dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">Buying guide</dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/90 p-3 shadow-sm">
              <dt className="text-xs font-medium text-muted-foreground">Category</dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">
                {categoryTitle ?? "Insurance"}
              </dd>
            </div>
          </dl>
        </div>

        {categorySlug ? (
          <div className="flex justify-center lg:justify-end">
            <div className="rounded-3xl border border-sky-200/70 bg-gradient-to-br from-white via-sky-50/80 to-blue-50/60 p-8 shadow-lg dark:border-blue-500/25 dark:from-blue-950/40 dark:to-sky-950/20">
              <CategoryIconBadge slug={categorySlug} label={categoryTitle ?? "Guide"} size="lg" />
              <p className="mt-4 text-center text-sm font-semibold text-blue-950 dark:text-blue-50 lg:text-right">
                Editorial guide
              </p>
              <p className="mt-1 text-center text-xs text-muted-foreground lg:text-right">
                Compare · Decide · Act
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
