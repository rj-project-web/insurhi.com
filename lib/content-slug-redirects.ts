/**
 * Permanent redirects for renamed CMS slugs (W3/W4: drop year from URL).
 * Keep in sync with insurhi-cms-admin/scripts/migrate-w3-w4-evergreen-slugs.ts
 */
export const guideSlugRedirects = [
  {
    source: "/guides/auto-gap-insurance-buying-guide-2026",
    destination: "/guides/auto-gap-insurance-buying-guide",
  },
  {
    source: "/guides/flood-vs-water-backup-buying-guide-2026",
    destination: "/guides/flood-vs-water-backup-buying-guide",
  },
  {
    source: "/guides/life-policy-lapse-reinstatement-guide-2026",
    destination: "/guides/life-policy-lapse-reinstatement-guide",
  },
  {
    source: "/guides/medicare-part-d-formulary-guide-2026",
    destination: "/guides/medicare-part-d-formulary-guide",
  },
  {
    source: "/claims/guides/auto-uninsured-motorist-claim-guide-2026",
    destination: "/claims/guides/auto-uninsured-motorist-claim-guide",
  },
  {
    source: "/claims/guides/home-water-damage-claim-guide-2026",
    destination: "/claims/guides/home-water-damage-claim-guide",
  },
  {
    source: "/claims/guides/life-claim-delay-denial-guide-2026",
    destination: "/claims/guides/life-claim-delay-denial-guide",
  },
  {
    source: "/claims/guides/pet-allergy-claim-guide-2026",
    destination: "/claims/guides/pet-allergy-claim-guide",
  },
] as const;
