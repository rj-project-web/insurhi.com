export const siteName = "Insurhi";

export const topNavItems = [
  { href: "/insurance", label: "Insurance" },
  { href: "/guides", label: "Guides" },
  { href: "/claims", label: "Claims Help" },
  { href: "/about", label: "About" },
];

export const insuranceCategories = [
  { slug: "auto", title: "Auto Insurance" },
  { slug: "life", title: "Life Insurance" },
  { slug: "home", title: "Home Insurance" },
  { slug: "pet", title: "Pet Insurance" },
  { slug: "medicare", title: "Medicare" },
  { slug: "renters", title: "Renters Insurance" },
];

export const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

/**
 * Duplicate provider entities in the CMS. Key pages canonicalize to the value
 * page and are excluded from the sitemap until the CMS data is merged.
 */
export const providerCanonicalAliases: Record<string, string> = {
  "state-farm-auto": "state-farm",
};
