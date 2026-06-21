export type TimestampedContent = {
  lastReviewedAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  createdAt?: string;
};

/** Pick the newest valid ISO timestamp (not first match). */
export function latestModified(...candidates: Array<string | undefined | null>): Date | undefined {
  let newest: Date | undefined;
  for (const value of candidates) {
    if (!value) continue;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) continue;
    if (!newest || date.getTime() > newest.getTime()) newest = date;
  }
  return newest;
}

export function contentLastModified(item: TimestampedContent): Date | undefined {
  return latestModified(item.lastReviewedAt, item.updatedAt, item.publishedAt, item.createdAt);
}

export function categorySlugFromRelation(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "object" && value !== null && "slug" in value) {
    const slug = (value as { slug?: string }).slug;
    return slug?.trim() || undefined;
  }
  if (typeof value === "string") return value.trim() || undefined;
  return undefined;
}

export function buildCategoryLastModifiedMap(
  items: Array<{ category?: unknown } & TimestampedContent>,
): Map<string, Date> {
  const map = new Map<string, number>();
  for (const item of items) {
    const slug = categorySlugFromRelation(item.category);
    const date = contentLastModified(item);
    if (!slug || !date) continue;
    const ms = date.getTime();
    map.set(slug, Math.max(map.get(slug) ?? 0, ms));
  }
  return new Map([...map.entries()].map(([slug, ms]) => [slug, new Date(ms)]));
}

export function maxDateFromItems(items: Array<TimestampedContent>): Date | undefined {
  return latestModified(...items.flatMap((item) => [item.lastReviewedAt, item.updatedAt, item.publishedAt, item.createdAt]));
}
