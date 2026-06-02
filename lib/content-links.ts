import {
  categoryContentHubs,
  isCategorySlug,
  type CategorySlug,
  type ContentLink,
} from "@/lib/category-content-hub";
import { glossaryResourceLinks } from "@/lib/glossary-links";

export type RelatedLinkGroup = {
  title: string;
  links: Array<{ href: string; label: string }>;
};

export type RelatedContentBundle = {
  categorySlug: CategorySlug | null;
  groups: RelatedLinkGroup[];
};

function categorySlugFromRelation(value: unknown): CategorySlug | null {
  if (!value) return null;
  if (typeof value === "string" && isCategorySlug(value)) return value;
  if (typeof value === "object") {
    const slug = (value as { slug?: string }).slug;
    if (slug && isCategorySlug(slug)) return slug;
  }
  return null;
}

function inferCategoryFromSlug(slug: string): CategorySlug | null {
  const text = slug.toLowerCase();
  if (text.includes("auto") || text.includes("um-uim")) return "auto";
  if (text.includes("home") || text.includes("hail") || text.includes("acv")) return "home";
  if (text.includes("life") || text.includes("beneficiary") || text.includes("contestability"))
    return "life";
  if (text.includes("medicare") || text.includes("medigap")) return "medicare";
  if (text.includes("pet") || text.includes("trupanion")) return "pet";
  if (text.includes("renters") || text.includes("renter") || text.includes("lemonade"))
    return "renters";
  return null;
}

function guideHref(link: ContentLink) {
  return `/guides/${link.slug}`;
}

function productHref(link: ContentLink) {
  return `/products/${link.slug}`;
}

function claimsHref(link: ContentLink) {
  return `/claims/guides/${link.slug}`;
}

function glossaryHref(link: ContentLink) {
  return `/glossary/${link.slug}`;
}

function hubGroup(categorySlug: CategorySlug): RelatedLinkGroup {
  const hub = categoryContentHubs[categorySlug];
  return {
    title: "Category hub",
    links: [
      { href: `/insurance/${categorySlug}`, label: `${hub.title} hub` },
      { href: `/insurance/${categorySlug}#faqs`, label: `${hub.title} FAQs` },
      { href: `/claims/${categorySlug}`, label: `${hub.title} claims center` },
    ],
  };
}

function formatTermLabel(slug: string): string {
  for (const hub of Object.values(categoryContentHubs)) {
    const match = hub.glossaryTerms.find((item) => item.slug === slug);
    if (match) return match.label;
  }
  return slug.replace(/-/g, " ");
}

function glossaryTermsForGuide(guideSlug: string): ContentLink[] {
  const terms: ContentLink[] = [];
  for (const [termSlug, resources] of Object.entries(glossaryResourceLinks)) {
    const matches = resources.guides?.some((guide) => guide.slug === guideSlug);
    if (matches) {
      terms.push({
        slug: termSlug,
        label: formatTermLabel(termSlug),
      });
    }
  }
  return terms;
}

function buildHubBundle(
  categorySlug: CategorySlug,
  options: {
    excludeGuideSlug?: string;
    excludeProductSlug?: string;
    excludeClaimsSlug?: string;
    includeDeepGuide?: boolean;
    includeBuyingGuide?: boolean;
    includeFlagship?: boolean;
    includeClaims?: boolean;
    includeGlossary?: boolean;
    extraGlossaryFromGuide?: string;
  } = {},
): RelatedContentBundle {
  const hub = categoryContentHubs[categorySlug];
  const groups: RelatedLinkGroup[] = [hubGroup(categorySlug)];

  const guides: Array<{ href: string; label: string }> = [];
  if (options.includeDeepGuide !== false && hub.deepGuide.slug !== options.excludeGuideSlug) {
    guides.push({ href: guideHref(hub.deepGuide), label: hub.deepGuide.label });
  }
  if (options.includeBuyingGuide !== false && hub.buyingGuide.slug !== options.excludeGuideSlug) {
    guides.push({ href: guideHref(hub.buyingGuide), label: hub.buyingGuide.label });
  }
  if (guides.length > 0) {
    groups.push({ title: "Guides", links: guides });
  }

  if (options.includeFlagship !== false && hub.flagshipProduct.slug !== options.excludeProductSlug) {
    groups.push({
      title: "Featured product review",
      links: [{ href: productHref(hub.flagshipProduct), label: hub.flagshipProduct.label }],
    });
  }

  if (options.includeClaims !== false) {
    const claims = hub.claimsGuides
      .filter((item) => item.slug !== options.excludeClaimsSlug)
      .map((item) => ({ href: claimsHref(item), label: item.label }));
    if (claims.length > 0) {
      groups.push({ title: "Claims playbooks", links: claims });
    }
  }

  if (options.includeGlossary !== false) {
    const termBySlug = new Map<string, ContentLink>();
    for (const item of hub.glossaryTerms) {
      termBySlug.set(item.slug, item);
    }
    if (options.extraGlossaryFromGuide) {
      for (const term of glossaryTermsForGuide(options.extraGlossaryFromGuide)) {
        termBySlug.set(term.slug, term);
      }
    }
    const glossary = [...termBySlug.values()].map((item) => ({
      href: glossaryHref(item),
      label: item.label,
    }));
    if (glossary.length > 0) {
      groups.push({ title: "Key terms", links: glossary });
    }
  }

  groups.push({
    title: "Reference",
    links: [
      { href: "/glossary", label: "Full glossary index" },
      { href: "/methodology", label: "Editorial methodology" },
    ],
  });

  return { categorySlug, groups };
}

export function resolveCategorySlug(
  slug: string,
  category?: unknown,
): CategorySlug | null {
  return categorySlugFromRelation(category) ?? inferCategoryFromSlug(slug);
}

export function getRelatedContentForGuide(
  guideSlug: string,
  category?: unknown,
): RelatedContentBundle {
  const categorySlug = resolveCategorySlug(guideSlug, category);
  if (!categorySlug) {
    return {
      categorySlug: null,
      groups: [
        {
          title: "Explore",
          links: [
            { href: "/guides", label: "All guides" },
            { href: "/insurance", label: "Insurance categories" },
            { href: "/glossary", label: "Glossary" },
          ],
        },
      ],
    };
  }

  return buildHubBundle(categorySlug, {
    excludeGuideSlug: guideSlug,
    extraGlossaryFromGuide: guideSlug,
  });
}

export function getRelatedContentForProduct(
  productSlug: string,
  category?: unknown,
): RelatedContentBundle {
  const categorySlug = resolveCategorySlug(productSlug, category);
  if (!categorySlug) {
    return {
      categorySlug: null,
      groups: [
        {
          title: "Explore",
          links: [
            { href: "/products", label: "All products" },
            { href: "/insurance", label: "Insurance categories" },
          ],
        },
      ],
    };
  }

  return buildHubBundle(categorySlug, {
    excludeProductSlug: productSlug,
  });
}

export function getRelatedContentForClaimsGuide(
  claimsSlug: string,
  category?: unknown,
): RelatedContentBundle {
  const categorySlug = resolveCategorySlug(claimsSlug, category);
  if (!categorySlug) {
    return {
      categorySlug: null,
      groups: [
        {
          title: "Explore",
          links: [
            { href: "/claims", label: "Claims center" },
            { href: "/guides", label: "Insurance guides" },
          ],
        },
      ],
    };
  }

  return buildHubBundle(categorySlug, {
    excludeClaimsSlug: claimsSlug,
  });
}

export function getGlossaryLinksForCategory(categorySlug: CategorySlug): RelatedLinkGroup {
  const hub = categoryContentHubs[categorySlug];
  return {
    title: "Key terms for this category",
    links: hub.glossaryTerms.map((term) => ({
      href: glossaryHref(term),
      label: term.label,
    })),
  };
}

/** Flat list of internal paths used by hub maps — for validate-internal-links.mjs */
export function collectInternalLinkPaths(): string[] {
  const paths = new Set<string>(["/glossary", "/methodology", "/guides", "/claims", "/insurance"]);

  for (const slug of Object.keys(categoryContentHubs)) {
    const hub = categoryContentHubs[slug as CategorySlug];
    paths.add(`/insurance/${slug}`);
    paths.add(`/insurance/${slug}#faqs`);
    paths.add(`/claims/${slug}`);
    paths.add(guideHref(hub.deepGuide));
    paths.add(guideHref(hub.buyingGuide));
    paths.add(productHref(hub.flagshipProduct));
    for (const item of hub.claimsGuides) paths.add(claimsHref(item));
    for (const item of hub.glossaryTerms) paths.add(glossaryHref(item));
  }

  for (const resources of Object.values(glossaryResourceLinks)) {
    if (resources.insurance) {
      paths.add(`/insurance/${resources.insurance}`);
    }
    for (const guide of resources.guides ?? []) paths.add(guideHref(guide));
    for (const claim of resources.claims ?? []) paths.add(claimsHref(claim));
  }

  return [...paths].sort();
}
