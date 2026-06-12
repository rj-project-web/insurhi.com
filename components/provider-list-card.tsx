import Link from "next/link";
import { ArrowRight, Building2, Star } from "lucide-react";

import type { CmsProviderLike } from "@/lib/hub-list-utils";

function resolveCategories(
  value: CmsProviderLike["categories"],
): Array<{ slug?: string; title?: string }> {
  if (!value?.length) return [];
  return value.filter(
    (item): item is { slug?: string; title?: string } =>
      typeof item === "object" && item !== null,
  );
}

type ProviderListCardProps = {
  provider: CmsProviderLike;
};

export function ProviderListCard({ provider }: ProviderListCardProps) {
  const categories = resolveCategories(provider.categories);
  const rating =
    typeof provider.rating === "number" ? `${provider.rating.toFixed(1)} / 5` : null;

  return (
    <Link
      href={`/providers/${provider.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300/60 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-sky-50 text-blue-800">
          <Building2 className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 space-y-1">
          <h3 className="font-semibold leading-snug text-foreground group-hover:text-sky-900">
            {provider.name}
          </h3>
          {rating ? (
            <p className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
              <Star className="h-3.5 w-3.5 fill-current" />
              {rating}
            </p>
          ) : null}
        </div>
      </div>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
        {provider.summary ?? "Open the provider profile for coverage regions and linked products."}
      </p>

      {categories.length > 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">
          {categories.length} coverage line{categories.length === 1 ? "" : "s"}:{" "}
          {categories
            .slice(0, 3)
            .map((category) => category.title ?? category.slug)
            .filter(Boolean)
            .join(", ")}
          {categories.length > 3 ? "…" : ""}
        </p>
      ) : null}

      <span className="mt-4 inline-flex items-center text-sm font-medium text-sky-700 group-hover:text-sky-900">
        Open profile
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
