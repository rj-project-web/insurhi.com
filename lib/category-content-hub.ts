export type CategorySlug = "auto" | "home" | "life" | "medicare" | "pet" | "renters";

export type ContentLink = {
  slug: string;
  label: string;
};

export type CategoryContentHub = {
  title: string;
  deepGuide: ContentLink;
  buyingGuide: ContentLink;
  flagshipProduct: ContentLink;
  claimsGuides: ContentLink[];
  glossaryTerms: ContentLink[];
};

export const categoryContentHubs: Record<CategorySlug, CategoryContentHub> = {
  auto: {
    title: "Auto Insurance",
    deepGuide: {
      slug: "auto-um-uim-coverage-deep-guide-2026",
      label: "UM/UIM coverage deep guide",
    },
    buyingGuide: {
      slug: "auto-insurance-buying-guide-2026",
      label: "Auto insurance buying guide",
    },
    flagshipProduct: {
      slug: "state-farm-auto",
      label: "State Farm Auto Insurance",
    },
    claimsGuides: [
      { slug: "auto-accident-claim-guide-2026", label: "Auto accident claim guide" },
      { slug: "auto-total-loss-claim-guide-2026", label: "Auto total loss claim guide" },
    ],
    glossaryTerms: [
      { slug: "deductible", label: "Deductible" },
      { slug: "uninsured-motorist-coverage", label: "Uninsured motorist coverage" },
      { slug: "fnol", label: "First notice of loss (FNOL)" },
      { slug: "subrogation", label: "Subrogation" },
      { slug: "premium", label: "Premium" },
    ],
  },
  home: {
    title: "Home Insurance",
    deepGuide: {
      slug: "home-replacement-cost-vs-acv-deep-guide-2026",
      label: "Replacement cost vs ACV deep guide",
    },
    buyingGuide: {
      slug: "home-insurance-buying-guide-2026",
      label: "Home insurance buying guide",
    },
    flagshipProduct: {
      slug: "state-farm-home",
      label: "State Farm Home Insurance",
    },
    claimsGuides: [
      { slug: "home-hail-damage-claim-guide-2026", label: "Home hail damage claim guide" },
      { slug: "home-claim-guide-2026", label: "Home claim guide" },
    ],
    glossaryTerms: [
      { slug: "actual-cash-value", label: "Actual cash value (ACV)" },
      { slug: "replacement-cost", label: "Replacement cost" },
      { slug: "extended-replacement-cost", label: "Extended replacement cost" },
      { slug: "hail-deductible", label: "Hail deductible" },
      { slug: "recoverable-depreciation", label: "Recoverable depreciation" },
    ],
  },
  life: {
    title: "Life Insurance",
    deepGuide: {
      slug: "life-beneficiary-claim-deep-guide-2026",
      label: "Life beneficiary claim deep guide",
    },
    buyingGuide: {
      slug: "life-insurance-buying-guide-2026",
      label: "Life insurance buying guide",
    },
    flagshipProduct: {
      slug: "banner-life",
      label: "Banner Life Insurance",
    },
    claimsGuides: [
      { slug: "life-contestability-period-claim-guide-2026", label: "Life contestability claim guide" },
      { slug: "life-claim-guide-2026", label: "Life claim guide" },
    ],
    glossaryTerms: [{ slug: "contestability-period", label: "Contestability period" }],
  },
  medicare: {
    title: "Medicare Supplement",
    deepGuide: {
      slug: "medicare-medigap-plan-letters-deep-guide-2026",
      label: "Medigap plan letters deep guide",
    },
    buyingGuide: {
      slug: "medicare-supplement-buying-guide-2026",
      label: "Medicare supplement buying guide",
    },
    flagshipProduct: {
      slug: "aarp-uhc-medicare",
      label: "AARP UHC Medicare Supplement",
    },
    claimsGuides: [{ slug: "medicare-claim-guide-2026", label: "Medicare claim guide" }],
    glossaryTerms: [{ slug: "medigap-plan-g", label: "Medigap Plan G" }],
  },
  pet: {
    title: "Pet Insurance",
    deepGuide: {
      slug: "pet-pre-existing-waiting-period-deep-guide-2026",
      label: "Pet pre-existing & waiting period guide",
    },
    buyingGuide: {
      slug: "pet-insurance-buying-guide-2026",
      label: "Pet insurance buying guide",
    },
    flagshipProduct: {
      slug: "trupanion-pet",
      label: "Trupanion Pet Insurance",
    },
    claimsGuides: [
      { slug: "pet-surgery-claim-guide-2026", label: "Pet surgery claim guide" },
      { slug: "pet-claim-guide-2026", label: "Pet claim guide" },
    ],
    glossaryTerms: [
      { slug: "pre-existing-condition", label: "Pre-existing condition" },
      { slug: "bilateral-exclusion", label: "Bilateral exclusion" },
      { slug: "waiting-period", label: "Waiting period" },
    ],
  },
  renters: {
    title: "Renters Insurance",
    deepGuide: {
      slug: "renters-theft-claim-evidence-deep-guide-2026",
      label: "Renters theft claim evidence guide",
    },
    buyingGuide: {
      slug: "renters-insurance-buying-guide-2026",
      label: "Renters insurance buying guide",
    },
    flagshipProduct: {
      slug: "lemonade-renters",
      label: "Lemonade Renters Insurance",
    },
    claimsGuides: [{ slug: "renters-claim-guide-2026", label: "Renters claim guide" }],
    glossaryTerms: [
      { slug: "scheduled-personal-property", label: "Scheduled personal property" },
      { slug: "sub-limit", label: "Sub-limit" },
      { slug: "loss-of-use", label: "Loss of use" },
    ],
  },
};

export const CATEGORY_SLUGS = Object.keys(categoryContentHubs) as CategorySlug[];

export function isCategorySlug(value: string): value is CategorySlug {
  return value in categoryContentHubs;
}
