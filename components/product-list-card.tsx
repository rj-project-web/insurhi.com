import Link from "next/link";
import { ArrowRight, CircleDollarSign, ShieldCheck } from "lucide-react";

import { CategoryIconBadge } from "@/components/insurance-visuals";
import type { CmsProduct, CmsProvider } from "@/lib/cms-client";
import {
  categorySlugFromRelation,
  categoryTitleFromRelation,
} from "@/lib/hub-list-utils";

function providerName(provider: string | CmsProvider | undefined): string | null {
  if (!provider || typeof provider === "string") return null;
  return provider.name ?? null;
}

type ProductListCardProps = {
  product: CmsProduct;
};

export function ProductListCard({ product }: ProductListCardProps) {
  const categorySlug = categorySlugFromRelation(product.category);
  const categoryTitle = categoryTitleFromRelation(product.category);
  const provider = providerName(product.provider as string | CmsProvider | undefined);
  const blurb =
    product.oneLineVerdict ??
    product.priceRange ??
    product.coverageAmount ??
    "Open the full product review";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300/60 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        {categorySlug ? (
          <CategoryIconBadge slug={categorySlug} label={categoryTitle ?? "Product"} />
        ) : (
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </span>
        )}
        <div className="min-w-0 space-y-1">
          {categoryTitle ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
              {categoryTitle}
            </p>
          ) : null}
          <h3 className="font-semibold leading-snug text-foreground group-hover:text-sky-900">
            {product.name}
          </h3>
          {provider ? (
            <p className="text-xs text-muted-foreground">Provider: {provider}</p>
          ) : null}
        </div>
      </div>

      <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-muted-foreground">{blurb}</p>

      <dl className="mt-4 flex flex-wrap gap-2 text-xs">
        {product.coverageAmount ? (
          <div className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
            {product.coverageAmount}
          </div>
        ) : null}
        {product.priceRange ? (
          <div className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-muted-foreground">
            <CircleDollarSign className="h-3.5 w-3.5 text-blue-600" />
            {product.priceRange}
          </div>
        ) : null}
      </dl>

      <span className="mt-4 inline-flex items-center text-sm font-medium text-sky-700 group-hover:text-sky-900">
        Read review
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
