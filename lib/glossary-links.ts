export type GlossaryResourceLinks = {
  guides?: Array<{ slug: string; label: string }>;
  claims?: Array<{ slug: string; label: string }>;
  insurance?: string;
};

export const glossaryResourceLinks: Record<string, GlossaryResourceLinks> = {
  "actual-cash-value": {
    insurance: "home",
    guides: [
      {
        slug: "home-replacement-cost-vs-acv-deep-guide-2026",
        label: "Replacement cost vs ACV deep guide",
      },
    ],
    claims: [{ slug: "home-hail-damage-claim-guide-2026", label: "Home hail damage claim guide" }],
  },
  "replacement-cost": {
    insurance: "home",
    guides: [
      {
        slug: "home-replacement-cost-vs-acv-deep-guide-2026",
        label: "Replacement cost vs ACV deep guide",
      },
    ],
  },
  "extended-replacement-cost": {
    insurance: "home",
    guides: [
      {
        slug: "home-replacement-cost-vs-acv-deep-guide-2026",
        label: "Replacement cost vs ACV deep guide",
      },
    ],
  },
  "recoverable-depreciation": {
    insurance: "home",
    guides: [
      {
        slug: "home-replacement-cost-vs-acv-deep-guide-2026",
        label: "Replacement cost vs ACV deep guide",
      },
    ],
    claims: [{ slug: "home-claim-guide-2026", label: "Home claim guide" }],
  },
  "hail-deductible": {
    insurance: "home",
    claims: [{ slug: "home-hail-damage-claim-guide-2026", label: "Home hail damage claim guide" }],
  },
  deductible: {
    insurance: "auto",
    guides: [{ slug: "auto-insurance-buying-guide-2026", label: "Auto insurance buying guide" }],
  },
  "liability-limit": {
    insurance: "auto",
    guides: [{ slug: "auto-um-uim-coverage-deep-guide-2026", label: "UM/UIM coverage deep guide" }],
  },
  "uninsured-motorist-coverage": {
    insurance: "auto",
    guides: [{ slug: "auto-um-uim-coverage-deep-guide-2026", label: "UM/UIM coverage deep guide" }],
    claims: [{ slug: "auto-accident-claim-guide-2026", label: "Auto accident claim guide" }],
  },
  fnol: {
    insurance: "auto",
    claims: [
      { slug: "auto-accident-claim-guide-2026", label: "Auto accident claim guide" },
      { slug: "auto-total-loss-claim-guide-2026", label: "Auto total loss claim guide" },
    ],
  },
  subrogation: {
    insurance: "auto",
    claims: [{ slug: "auto-accident-claim-guide-2026", label: "Auto accident claim guide" }],
  },
  premium: {
    insurance: "auto",
    guides: [{ slug: "auto-insurance-buying-guide-2026", label: "Auto insurance buying guide" }],
  },
  "contestability-period": {
    insurance: "life",
    guides: [{ slug: "life-beneficiary-claim-deep-guide-2026", label: "Life beneficiary claim guide" }],
    claims: [{ slug: "life-contestability-period-claim-guide-2026", label: "Life contestability claim guide" }],
  },
  "medigap-plan-g": {
    insurance: "medicare",
    guides: [
      {
        slug: "medicare-medigap-plan-letters-deep-guide-2026",
        label: "Medigap plan letters deep guide",
      },
    ],
    claims: [{ slug: "medicare-claim-guide-2026", label: "Medicare claim guide" }],
  },
  "pre-existing-condition": {
    insurance: "pet",
    guides: [
      {
        slug: "pet-pre-existing-waiting-period-deep-guide-2026",
        label: "Pet pre-existing & waiting period guide",
      },
    ],
  },
  "bilateral-exclusion": {
    insurance: "pet",
    guides: [
      {
        slug: "pet-pre-existing-waiting-period-deep-guide-2026",
        label: "Pet pre-existing & waiting period guide",
      },
    ],
  },
  "waiting-period": {
    insurance: "pet",
    guides: [
      {
        slug: "pet-pre-existing-waiting-period-deep-guide-2026",
        label: "Pet pre-existing & waiting period guide",
      },
    ],
    claims: [{ slug: "pet-claim-guide-2026", label: "Pet claim guide" }],
  },
  "loss-of-use": {
    insurance: "renters",
    claims: [{ slug: "renters-claim-guide-2026", label: "Renters claim guide" }],
  },
  "scheduled-personal-property": {
    insurance: "renters",
    guides: [
      {
        slug: "renters-theft-claim-evidence-deep-guide-2026",
        label: "Renters theft claim evidence guide",
      },
    ],
    claims: [{ slug: "renters-claim-guide-2026", label: "Renters claim guide" }],
  },
  "sub-limit": {
    insurance: "renters",
    guides: [
      {
        slug: "renters-theft-claim-evidence-deep-guide-2026",
        label: "Renters theft claim evidence guide",
      },
    ],
  },
};
