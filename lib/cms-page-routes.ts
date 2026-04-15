/** Slugs that render CMS `pages` on first-class site routes instead of `/cms-pages/[slug]`. */
export const CMS_PAGE_FIXED_PATHS: Record<string, string> = {
  about: "/about",
  contact: "/contact",
  "privacy-policy": "/privacy-policy",
  terms: "/terms",
};

export function cmsPagePublicPath(slug: string) {
  return CMS_PAGE_FIXED_PATHS[slug] ?? `/cms-pages/${slug}`;
}

export function isFixedCmsPageSlug(slug: string) {
  return Boolean(CMS_PAGE_FIXED_PATHS[slug]);
}
