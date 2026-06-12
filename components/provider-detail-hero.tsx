import Link from "next/link";
import {
  Building2,
  Globe2,
  Layers,
  Sparkles,
  Star,
} from "lucide-react";

import { CategoryIconBadge } from "@/components/insurance-visuals";
import type { CmsCategory } from "@/lib/cms-client";

type ProviderDetailHeroProps = {
  name: string;
  slug: string;
  summary?: string | null;
  rating?: number | null;
  regionCount: number;
  categoryCount: number;
  productCount: number;
  categories: CmsCategory[];
};

export function ProviderDetailHero({
  name,
  slug,
  summary,
  rating,
  regionCount,
  categoryCount,
  productCount,
  categories,
}: ProviderDetailHeroProps) {
  const primaryCategory = categories[0];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-0 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.35fr_auto] lg:items-start lg:gap-10">
        <div className="space-y-6">
          <p className="inline-flex flex-wrap items-center gap-1 rounded-full border border-sky-200/80 bg-background/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            <Link href="/providers" className="hover:text-foreground">
              Providers
            </Link>
            <span>/</span>
            <span>{slug}</span>
          </p>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.12]">
              {name}
            </h1>
            {summary ? (
              <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {summary}
              </p>
            ) : null}
          </div>

          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border/70 bg-background/90 p-3 shadow-sm">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Star className="h-3.5 w-3.5 text-amber-600" />
                Rating
              </dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">
                {typeof rating === "number" ? `${rating.toFixed(1)} / 5` : "N/A"}
              </dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/90 p-3 shadow-sm">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Layers className="h-3.5 w-3.5 text-sky-600" />
                Categories
              </dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">{categoryCount}</dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/90 p-3 shadow-sm">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 text-blue-600" />
                Products
              </dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">{productCount}</dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/90 p-3 shadow-sm">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Globe2 className="h-3.5 w-3.5 text-sky-600" />
                Regions
              </dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">{regionCount || "—"}</dd>
            </div>
          </dl>
        </div>

        {primaryCategory ? (
          <div className="flex justify-center lg:justify-end">
            <div className="rounded-3xl border border-sky-200/70 bg-gradient-to-br from-white via-sky-50/80 to-blue-50/60 p-8 shadow-lg dark:border-blue-500/25 dark:from-blue-950/40 dark:to-sky-950/20">
              <CategoryIconBadge slug={primaryCategory.slug} label={primaryCategory.title} size="lg" />
              <p className="mt-4 text-center text-sm font-semibold text-blue-950 dark:text-blue-50 lg:text-right">
                Carrier profile
              </p>
              <p className="mt-1 text-center text-xs text-muted-foreground lg:text-right">
                Service · Products · Claims
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
