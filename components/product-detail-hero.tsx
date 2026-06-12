import Link from "next/link";
import {
  BadgeCheck,
  CircleDollarSign,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";

import { CategoryIconBadge } from "@/components/insurance-visuals";
import { EditorialMetadata, type EditorialMetadataProps } from "@/components/editorial-disclosure";
import type { CmsCategory, CmsProvider } from "@/lib/cms-client";

type ProductDetailHeroProps = EditorialMetadataProps & {
  name: string;
  slug: string;
  summary?: string | null;
  category?: CmsCategory | null;
  provider?: CmsProvider | null;
  coverageAmount?: string;
  priceRange?: string;
  deductible?: string;
  avgClaimDays?: number | null;
  pricingRangeSummary?: string;
};

export function ProductDetailHero({
  name,
  slug,
  summary,
  category,
  provider,
  coverageAmount,
  priceRange,
  deductible,
  avgClaimDays,
  pricingRangeSummary,
  ...metadata
}: ProductDetailHeroProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-0 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.35fr_auto] lg:items-start lg:gap-10">
        <div className="space-y-6">
          <p className="inline-flex flex-wrap items-center gap-1 rounded-full border border-sky-200/80 bg-background/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            <Link href="/products" className="hover:text-foreground">
              Products
            </Link>
            <span>/</span>
            {category ? (
              <Link href={`/insurance/${category.slug}#compare`} className="hover:text-foreground">
                {category.title}
              </Link>
            ) : (
              <span>{slug}</span>
            )}
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

          <div className="flex flex-wrap gap-2">
            {provider ? (
              <Link
                href={`/providers/${provider.slug}`}
                className="rounded-full border border-border/70 bg-background/90 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                Provider: {provider.name}
              </Link>
            ) : null}
          </div>

          <EditorialMetadata {...metadata} className="text-sm text-muted-foreground" />

          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border/70 bg-background/90 p-3 shadow-sm">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
                Coverage
              </dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">
                {coverageAmount ?? "Not specified"}
              </dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/90 p-3 shadow-sm">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <CircleDollarSign className="h-3.5 w-3.5 text-blue-600" />
                Price range
              </dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">
                {priceRange ?? "Not specified"}
              </dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/90 p-3 shadow-sm">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <BadgeCheck className="h-3.5 w-3.5 text-sky-600" />
                Deductible
              </dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">
                {deductible ?? "Not specified"}
              </dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/90 p-3 shadow-sm">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Timer className="h-3.5 w-3.5 text-sky-600" />
                Avg claim days
              </dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">
                {avgClaimDays ?? "N/A"}
              </dd>
            </div>
          </dl>

          {pricingRangeSummary ? (
            <p className="rounded-xl border border-border/70 bg-background/90 p-3 text-sm leading-6 text-muted-foreground">
              {pricingRangeSummary}
            </p>
          ) : null}
        </div>

        {category ? (
          <div className="flex justify-center lg:justify-end">
            <div className="rounded-3xl border border-sky-200/70 bg-gradient-to-br from-white via-sky-50/80 to-blue-50/60 p-8 shadow-lg dark:border-blue-500/25 dark:from-blue-950/40 dark:to-sky-950/20">
              <CategoryIconBadge slug={category.slug} label={category.title} size="lg" />
              <p className="mt-4 text-center text-sm font-semibold text-blue-950 dark:text-blue-50 lg:text-right">
                Product review
              </p>
              <p className="mt-1 text-center text-xs text-muted-foreground lg:text-right">
                Coverage · Price · Claims
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
