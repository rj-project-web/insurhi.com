export function categorySlugFromRelation(category: unknown): string | null {
  if (!category) return null;
  if (typeof category === "string") return category;
  if (typeof category === "object") return (category as { slug?: string }).slug ?? null;
  return null;
}

export function categoryTitleFromRelation(category: unknown): string | null {
  if (!category || typeof category !== "object") return null;
  return (category as { title?: string }).title ?? null;
}

export function groupItemsByCategory<T>(
  items: T[],
  getSlug: (item: T) => string | null,
  getTitle: (item: T) => string | null,
  categoryOrder: string[],
): Array<{ slug: string; title: string; items: T[] }> {
  const grouped = new Map<string, { slug: string; title: string; items: T[] }>();

  for (const item of items) {
    const slug = getSlug(item) ?? "general";
    const title = getTitle(item) ?? "General";
    const bucket = grouped.get(slug) ?? { slug, title, items: [] };
    bucket.items.push(item);
    grouped.set(slug, bucket);
  }

  return [...grouped.values()].sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.slug);
    const bIndex = categoryOrder.indexOf(b.slug);
    if (aIndex === -1 && bIndex === -1) return a.title.localeCompare(b.title);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export function countUniqueCategories<T>(
  items: T[],
  getSlug: (item: T) => string | null,
): number {
  return new Set(items.map(getSlug).filter(Boolean)).size;
}

export type CategoryItemGroup<T> = {
  slug: string;
  title: string;
  items: T[];
  totalCount: number;
};

/** Build fixed category sections with a per-category display cap (6 or 9). */
export function buildCategoryItemGroups<T>(
  items: T[],
  categories: Array<{ slug: string; title: string }>,
  getSlug: (item: T) => string | null,
  limit: number,
): CategoryItemGroup<T>[] {
  return categories
    .map((category) => {
      const matched = items.filter((item) => getSlug(item) === category.slug);
      return {
        slug: category.slug,
        title: category.title,
        items: matched.slice(0, limit),
        totalCount: matched.length,
      };
    })
    .filter((group) => group.totalCount > 0);
}

export type CmsProviderLike = {
  id: string;
  name: string;
  slug: string;
  rating?: number;
  summary?: string | null;
  categories?: Array<string | { slug?: string }>;
};

/** Providers may belong to multiple categories — list under each line, capped per section. */
export function buildProviderCategoryGroups(
  providers: CmsProviderLike[],
  categories: Array<{ slug: string; title: string }>,
  limit: number,
): CategoryItemGroup<CmsProviderLike>[] {
  return categories
    .map((category) => {
      const matched = providers
        .filter((provider) =>
          (provider.categories ?? []).some(
            (item) => typeof item === "object" && item !== null && item.slug === category.slug,
          ),
        )
        .sort((a, b) => {
          const ratingA = typeof a.rating === "number" ? a.rating : -1;
          const ratingB = typeof b.rating === "number" ? b.rating : -1;
          if (ratingB !== ratingA) return ratingB - ratingA;
          return a.name.localeCompare(b.name);
        });

      return {
        slug: category.slug,
        title: category.title,
        items: matched.slice(0, limit),
        totalCount: matched.length,
      };
    })
    .filter((group) => group.totalCount > 0);
}
