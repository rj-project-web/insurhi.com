import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Compass,
  FileText,
  Layers,
  Sparkles,
  Users,
} from "lucide-react";
import { LinkifiedText } from "@/components/cms-rich-text";
import { EditorialDisclosure } from "@/components/editorial-disclosure";
import { InsuranceCategoryHero } from "@/components/insurance-category-hero";
import { InsuranceHubStickyNav } from "@/components/insurance-hub-sticky-nav";
import { InsurancePageBand, InsurancePanel } from "@/components/insurance-page-band";
import { CategoryIconBadge } from "@/components/insurance-visuals";
import {
  getArticlesList,
  getClaimsGuidesList,
  getCategoryBySlug,
  getFaqsByCategory,
  getProductsByCategory,
  getProvidersByCategory,
} from "@/lib/cms-client";
import { categoryContentHubs, isCategorySlug } from "@/lib/category-content-hub";
import { categoryDescriptions } from "@/lib/home-content";
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd, buildMetadata } from "@/lib/seo";
import { insuranceCategories } from "@/lib/site-data";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

function articleCategorySlug(article: { category?: string | { slug?: string } }): string | undefined {
  const category = article.category;
  if (!category) return undefined;
  if (typeof category === "string") return category;
  return category.slug;
}

function guideMatchesCategory(slug: string, title: string, categorySlug: string): boolean {
  const text = `${slug} ${title}`.toLowerCase();
  if (categorySlug === "auto") return /\bauto\b/.test(text) || /\bcar\b/.test(text);
  if (categorySlug === "life") return /\blife\b/.test(text);
  if (categorySlug === "home") {
    if (/\brenters?\b/.test(text)) return false;
    return /\bhome\b/.test(text) || /\bhomeowners?\b/.test(text);
  }
  if (categorySlug === "pet") return /\bpet\b/.test(text);
  if (categorySlug === "medicare") return /\bmedicare\b/.test(text) || /\bmedigap\b/.test(text);
  if (categorySlug === "renters") return /\brenters?\b/.test(text);
  return false;
}

function articleMatchesCategory(
  article: { slug: string; title: string; category?: string | { slug?: string } },
  categorySlug: string,
): boolean {
  const cmsCategorySlug = articleCategorySlug(article);
  if (cmsCategorySlug) {
    return cmsCategorySlug === categorySlug;
  }
  return guideMatchesCategory(article.slug, article.title, categorySlug);
}

type TopicClusterItem = {
  title: string;
  description: string;
  href: string;
  icon: typeof BookOpen;
};

type CategoryHub = {
  intro: string;
  topicCluster: TopicClusterItem[];
  scenarios: string[];
};

const categoryHubBySlug: Record<string, CategoryHub> = {
  auto: {
    intro:
      "Auto insurance shapes how quickly you recover after a crash, how much you pay out of pocket, and whether your settlement covers a hit-and-run. This hub focuses on what most drivers actually decide: liability and deductible levels, uninsured/underinsured motorist coverage, repair-network quality, and what to expect on claim day from major US carriers in 2026.",
    topicCluster: [
      {
        title: "Learn the basics",
        description:
          "Buying guides on liability limits, deductibles, and the UM/UIM gap most drivers underestimate.",
        href: "#buying-guides",
        icon: BookOpen,
      },
      {
        title: "Compare products & providers",
        description:
          "Scan price ranges, coverage, and deductibles before reading full policy language.",
        href: "#compare",
        icon: Compass,
      },
      {
        title: "File a claim with confidence",
        description:
          "Step-by-step claim workflows for accidents, total loss, and uninsured-driver scenarios.",
        href: "#claims-guides",
        icon: FileText,
      },
    ],
    scenarios: [
      "Comparing quotes after a teen joins your policy",
      "Settling a not-at-fault claim with an uninsured driver",
      "Switching carriers after a rate hike at renewal",
    ],
  },
  home: {
    intro:
      "Home insurance decisions get tested at the worst time—after a fire, hailstorm, or break-in. This hub explains what dwelling and contents limits actually cover, why replacement-cost vs actual-cash-value language matters more than the headline premium, and which provider behaviors lead to faster claim recovery for owner-occupied homes in 2026.",
    topicCluster: [
      {
        title: "Learn the basics",
        description:
          "HO-3 vs HO-5 forms, deductible types, and the roof endorsements that quietly convert RCV to ACV.",
        href: "#buying-guides",
        icon: BookOpen,
      },
      {
        title: "Compare products & providers",
        description:
          "Review coverage limits, premium ranges, and provider claim service across major carriers.",
        href: "#compare",
        icon: Compass,
      },
      {
        title: "File a claim with confidence",
        description:
          "Walk through hail, fire, and water-damage workflows with proof-of-loss checklists.",
        href: "#claims-guides",
        icon: FileText,
      },
    ],
    scenarios: [
      "Disputing a depreciated roof settlement after hail damage",
      "Filing a kitchen fire claim with mixed RCV/ACV contents",
      "Reviewing your dwelling limit after a renovation",
    ],
  },
  life: {
    intro:
      "Life insurance is bought for someone else, so the right policy depends on income replacement needs, time horizon, and how much complexity your family can manage. This hub covers term vs whole life trade-offs, beneficiary claim rules, the contestability period, and how to evaluate carriers on underwriting transparency and claim turnaround.",
    topicCluster: [
      {
        title: "Learn the basics",
        description:
          "Compare term, whole, and universal structures against income-replacement goals.",
        href: "#buying-guides",
        icon: BookOpen,
      },
      {
        title: "Compare products & providers",
        description:
          "Look at premium ranges, coverage amounts, and carrier underwriting clarity.",
        href: "#compare",
        icon: Compass,
      },
      {
        title: "File a claim with confidence",
        description:
          "Beneficiaries: gather documents, navigate contestability, and avoid common delays.",
        href: "#claims-guides",
        icon: FileText,
      },
    ],
    scenarios: [
      "Buying term coverage after a new mortgage or child",
      "Filing as a beneficiary within the contestability window",
      "Comparing two carriers when premiums look similar",
    ],
  },
  pet: {
    intro:
      "Pet insurance pays best when you enroll early and read the small print on pre-existing conditions. This hub explains how 2026 carriers actually define waiting periods, bilateral exclusions, curable vs incurable conditions, and which reimbursement models work for puppies, kittens, and senior pets across breeds with known predispositions.",
    topicCluster: [
      {
        title: "Learn the basics",
        description:
          "Waiting periods, exclusions, and reimbursement models explained without marketing fluff.",
        href: "#buying-guides",
        icon: BookOpen,
      },
      {
        title: "Compare products & providers",
        description:
          "Compare annual limits, deductibles, and reimbursement percentages.",
        href: "#compare",
        icon: Compass,
      },
      {
        title: "File a claim with confidence",
        description:
          "Submit clinic invoices and avoid the pre-existing condition denials that surprise first-time owners.",
        href: "#claims-guides",
        icon: FileText,
      },
    ],
    scenarios: [
      "Enrolling a puppy before any pre-existing flag exists",
      "Disputing a bilateral cruciate exclusion",
      "Comparing accident-only vs comprehensive plans",
    ],
  },
  medicare: {
    intro:
      "Medicare decisions affect annual out-of-pocket cost more than almost any other insurance choice, yet the standardized plan letters hide important pricing differences between carriers. This hub explains Original Medicare vs Medicare Advantage trade-offs, Medigap Plan G/N/HD comparisons, Part D coordination, and how birthday-rule states let you switch supplements later without underwriting.",
    topicCluster: [
      {
        title: "Learn the basics",
        description:
          "Original Medicare + Medigap vs Medicare Advantage: who each path actually fits.",
        href: "#buying-guides",
        icon: BookOpen,
      },
      {
        title: "Compare products & providers",
        description:
          "Review supplement plans by carrier rate-history and household discounts.",
        href: "#compare",
        icon: Compass,
      },
      {
        title: "File a claim with confidence",
        description:
          "Coordinate Part A/B claims, supplement reimbursement, and Part D coverage.",
        href: "#claims-guides",
        icon: FileText,
      },
    ],
    scenarios: [
      "Choosing a Medigap letter during your initial open enrollment",
      "Switching plans during a birthday-rule window",
      "Coordinating a hospital claim across Part A, B, and Medigap",
    ],
  },
  renters: {
    intro:
      "Renters insurance is one of the cheapest policies most renters will buy, but theft and water-damage claims surface sub-limits that surprise first-time filers. This hub covers personal property and liability sizing, sub-limits on jewelry/electronics/bicycles, scheduling rules, and how to file theft claims that don't get partially denied in 2026.",
    topicCluster: [
      {
        title: "Learn the basics",
        description:
          "Set personal property and liability limits that fit your rental.",
        href: "#buying-guides",
        icon: BookOpen,
      },
      {
        title: "Compare products & providers",
        description:
          "Compare premium, deductible, and personal property coverage by carrier.",
        href: "#compare",
        icon: Compass,
      },
      {
        title: "File a claim with confidence",
        description:
          "Document a theft or water-damage loss with police report and inventory.",
        href: "#claims-guides",
        icon: FileText,
      },
    ],
    scenarios: [
      "Filing a theft claim with mixed scheduled and unscheduled items",
      "Comparing sub-limits on jewelry and electronics across carriers",
      "Reviewing roommate liability coverage",
    ],
  },
};

function getCategoryHub(slug: string): CategoryHub {
  return categoryHubBySlug[slug] ?? categoryHubBySlug.auto;
}

export function generateStaticParams() {
  return insuranceCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cmsCategory = await getCategoryBySlug(slug);
  const fallbackCategory = insuranceCategories.find((item) => item.slug === slug);
  const category = cmsCategory ?? fallbackCategory;
  const categorySummary = cmsCategory?.summary;

  if (!category) {
    return buildMetadata({
      title: "Insurance Category",
      description: "Insurance comparisons and guidance.",
      path: "/insurance",
    });
  }

  return buildMetadata({
    title: cmsCategory?.seo?.metaTitle ?? `${category.title} Coverage Guides`,
    description:
      cmsCategory?.seo?.metaDescription ??
      categorySummary ??
      `Compare ${category.title.toLowerCase()} providers, understand coverage options, and review common claim questions.`,
    path: `/insurance/${slug}`,
    ogImagePath: null,
  });
}

export default async function InsuranceCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const fallbackCategory = insuranceCategories.find((item) => item.slug === slug);
  const cmsCategory = await getCategoryBySlug(slug);
  const category = cmsCategory ?? fallbackCategory;

  if (!category) {
    notFound();
  }

  const [faqs, providers, products, allArticles, claimsGuides] = cmsCategory
    ? await Promise.all([
        getFaqsByCategory(cmsCategory.id),
        getProvidersByCategory(cmsCategory.id),
        getProductsByCategory(cmsCategory.id),
        getArticlesList(),
        getClaimsGuidesList(),
      ])
    : [[], [], [], await getArticlesList(), await getClaimsGuidesList()];

  const productRows = products.slice(0, 6);
  const providerRows = providers.slice(0, 6);
  const faqDisplayRows = faqs.slice(0, 6);
  const decisionFactorsBySlug: Record<
    string,
    Array<{ title: string; description: string }>
  > = {
    auto: [
      {
        title: "Coverage fit",
        description:
          "Confirm liability limits first, then evaluate collision and comprehensive based on your vehicle value.",
      },
      {
        title: "Deductible strategy",
        description:
          "Use a deductible level you can pay quickly after an accident without forcing emergency borrowing.",
      },
      {
        title: "Provider confidence",
        description:
          "Prioritize insurers with reliable repair networks and strong roadside/claims responsiveness.",
      },
    ],
    life: [
      {
        title: "Coverage fit",
        description:
          "Estimate death-benefit needs from income replacement, debt, and long-term dependent obligations.",
      },
      {
        title: "Premium structure",
        description:
          "Compare fixed term premiums versus permanent policy cash-value trade-offs over your full timeline.",
      },
      {
        title: "Provider confidence",
        description:
          "Choose carriers with transparent underwriting and smoother beneficiary claim support.",
      },
    ],
    home: [
      {
        title: "Coverage fit",
        description:
          "Set dwelling and personal property limits by rebuild and replacement cost, not listing price alone.",
      },
      {
        title: "Deductible strategy",
        description:
          "Review separate deductible rules for wind, hail, and named-storm events before choosing a plan.",
      },
      {
        title: "Provider confidence",
        description:
          "Check catastrophe response quality and local contractor coordination for claim recovery speed.",
      },
    ],
    pet: [
      {
        title: "Coverage fit",
        description:
          "Pick annual limits and reimbursement percentages that match expected veterinary usage.",
      },
      {
        title: "Cost strategy",
        description:
          "Compare monthly premium with deductible and co-pay to avoid surprises during high-cost treatments.",
      },
      {
        title: "Provider confidence",
        description:
          "Favor plans with clearer exclusions and faster reimbursement to clinic or owner.",
      },
    ],
    medicare: [
      {
        title: "Coverage fit",
        description:
          "Align plan design with doctor access, specialist needs, and prescription formularies.",
      },
      {
        title: "Cost strategy",
        description:
          "Assess annual out-of-pocket exposure, not just monthly premium and copay headlines.",
      },
      {
        title: "Provider confidence",
        description:
          "Prefer carriers with strong enrollment support and consistent member-service quality.",
      },
    ],
    renters: [
      {
        title: "Coverage fit",
        description:
          "Match personal property, liability, and loss-of-use limits to your rental living situation.",
      },
      {
        title: "Deductible strategy",
        description:
          "Keep deductible practical for theft or water-damage claims where quick cash is needed.",
      },
      {
        title: "Provider confidence",
        description:
          "Look for digital-first claims and faster payout records on small-to-mid loss events.",
      },
    ],
  };
  const decisionFactors = decisionFactorsBySlug[slug] ?? decisionFactorsBySlug.auto;

  const categoryHub = getCategoryHub(slug);
  const contentHub = isCategorySlug(slug) ? categoryContentHubs[slug] : null;
  const heroIntro = categoryHub.intro;
  const heroSummary = isCategorySlug(slug)
    ? categoryDescriptions[slug]
    : `${heroIntro.split(".")[0]}.`;

  const sortedArticles = allArticles
    .filter((article) => articleMatchesCategory(article, slug))
    .sort((a, b) => {
      const aTime = Date.parse(a.publishedAt ?? "") || 0;
      const bTime = Date.parse(b.publishedAt ?? "") || 0;
      return bTime - aTime;
    });
  const featuredGuide =
    sortedArticles.find((article) => /-deep-guide-2026$/.test(article.slug)) ??
    sortedArticles[0];
  const relatedGuides = sortedArticles
    .filter((article) => article.id !== featuredGuide?.id)
    .slice(0, 3);
  const relatedClaimsGuides = claimsGuides
    .filter((guide) => {
      if (!guide.slug) return false;
      if (guide.category && typeof guide.category !== "string") {
        return guide.category.slug === slug;
      }
      return false;
    })
    .slice(0, 3);
  const categoryClaimsCount = claimsGuides.filter((guide) => {
    if (!guide.slug) return false;
    if (guide.category && typeof guide.category !== "string") {
      return guide.category.slug === slug;
    }
    return false;
  }).length;
  const glanceMetrics = [
    {
      label: "Products compared",
      value: String(products.length),
      hint: "Live CMS entries",
      icon: ClipboardCheck,
    },
    {
      label: "Provider shortlist",
      value: String(providers.length),
      hint: "Regional coverage data",
      icon: Users,
    },
    {
      label: "Editorial guides",
      value: String(sortedArticles.length),
      hint: "Buying & deep guides",
      icon: BookOpen,
    },
    {
      label: "Claims playbooks",
      value: String(categoryClaimsCount),
      hint: "Category workflows",
      icon: FileText,
    },
  ];
  const relatedCategories = insuranceCategories.filter(
    (item) => item.slug !== slug,
  );
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Insurance", path: "/insurance" },
    { name: category.title, path: `/insurance/${slug}` },
  ]);
  const faqPageJsonLd = buildFaqPageJsonLd(
    faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  );
  const featureSectionClass = "space-y-4";
  const featureSectionHeaderClass =
    "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4";
  const featureSectionTitleClass = "text-xl font-semibold tracking-tight text-foreground sm:text-2xl";
  const featureSectionDescriptionClass = "max-w-3xl text-sm leading-6 text-muted-foreground";
  const featureActionLinkClass =
    "inline-flex min-h-10 items-center justify-center rounded-full border border-primary/25 bg-primary/10 px-3 text-sm font-medium text-primary transition-colors hover:border-primary/40 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const featureListItemClass =
    "block rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm transition-colors hover:bg-accent";

  return (
    <div className="-mx-4 -my-8 overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqPageJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
        />
      ) : null}
      <InsurancePageBand tone="hero" innerClassName="py-12 sm:py-14 lg:py-16">
        <InsuranceCategoryHero
          slug={slug}
          title={category.title}
          summary={heroSummary}
          scenarios={categoryHub.scenarios}
          metrics={glanceMetrics}
        />
      </InsurancePageBand>

      <InsuranceHubStickyNav />

      <InsurancePageBand tone="muted" id="topic-cluster">
        <div className="space-y-6">
          <InsurancePanel>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Topic hub
                </p>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  How to use this {category.title.toLowerCase()} hub
                </h2>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                  Learn the basics, compare options, and prepare for a claim—three connected blocks
                  below. Scroll or use the section nav to jump.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {categoryHub.topicCluster.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex h-full flex-col justify-between gap-3 rounded-xl border border-border/70 bg-muted/30 p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
                  >
                    <div className="space-y-2">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <p className="text-base font-semibold tracking-tight text-foreground">{item.title}</p>
                      <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Jump to section
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </InsurancePanel>

          {featuredGuide ? (
            <InsurancePanel className="border-primary/20 bg-gradient-to-br from-blue-800/[0.04] to-card">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <p className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-background/80 px-3 py-1 text-xs font-medium text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Featured deep guide
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {featuredGuide.title}
                  </h2>
                  <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                    {featuredGuide.seo?.metaDescription ??
                      `Read our editor-curated deep dive into the ${category.title.toLowerCase()} decisions that change real claim outcomes.`}
                  </p>
                </div>
                <Link
                  href={`/guides/${featuredGuide.slug}`}
                  className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
                >
                  Read the deep guide
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </InsurancePanel>
          ) : null}
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="surface" id="buying-guides">
        <InsurancePanel>
          <div className={featureSectionClass}>
            <div className={featureSectionHeaderClass}>
              <div className="space-y-1.5">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                  <BookOpen className="h-4 w-4" />
                  Step 1 — Learn the basics
                </p>
                <h2 className={featureSectionTitleClass}>Buying guides for {category.title}</h2>
                <p className={featureSectionDescriptionClass}>
                  Practical articles on coverage basics, comparing policies, and common buying mistakes.
                </p>
              </div>
              <Link href="/guides" className={featureActionLinkClass}>
                Browse all guides
              </Link>
            </div>
            <div className="space-y-2.5">
              {relatedGuides.length > 0 ? (
                relatedGuides.map((article) => (
                  <Link
                    key={article.id}
                    href={`/guides/${article.slug}`}
                    className={`${featureListItemClass} group flex items-start justify-between gap-3`}
                  >
                    <span className="flex-1">
                      <span className="block font-medium text-foreground">{article.title}</span>
                      {article.seo?.metaDescription ? (
                        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                          {article.seo.metaDescription}
                        </span>
                      ) : null}
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))
              ) : featuredGuide ? (
                <p className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground">
                  The featured deep guide above is currently the only published article in this category.
                </p>
              ) : (
                <p className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground">
                  More category-specific guides are being curated.
                </p>
              )}
            </div>
          </div>
        </InsurancePanel>
      </InsurancePageBand>

      <InsurancePageBand tone="accent" id="compare">
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              <ClipboardCheck className="h-4 w-4" />
              Step 2 — Compare options
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">Products & providers</h2>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Shortlist plans and carriers side by side before reading full policy language.
            </p>
          </div>

          <InsurancePanel id="products">
            <div className={featureSectionClass}>
              <div className={featureSectionHeaderClass}>
                <h3 className={featureSectionTitleClass}>Product comparison snapshot</h3>
                <Link href="/products" className={featureActionLinkClass}>
                  All products
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {productRows.length > 0 ? (
                  productRows.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className={`${featureListItemClass} group space-y-2 p-4`}
                    >
                      <p className="font-medium text-foreground group-hover:underline group-hover:underline-offset-4">
                        {product.name}
                      </p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>
                          <span className="font-medium text-foreground">Price:</span>{" "}
                          {product.priceRange ?? "See details"}
                        </p>
                        <p>
                          <span className="font-medium text-foreground">Coverage:</span>{" "}
                          {product.coverageAmount ?? "Coverage varies"}
                        </p>
                        <p>
                          <span className="font-medium text-foreground">Deductible:</span>{" "}
                          {product.deductible ?? "See policy"}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    CMS products for this category will appear here after publishing.
                  </p>
                )}
              </div>
            </div>
          </InsurancePanel>

          <InsurancePanel id="providers">
            <div className={featureSectionClass}>
              <div className={featureSectionHeaderClass}>
                <h3 className={featureSectionTitleClass}>Provider shortlist</h3>
                <Link href="/providers" className={featureActionLinkClass}>
                  View more
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {providerRows.length > 0 ? (
                  providerRows.map((provider) => (
                    <article key={provider.id} className="rounded-xl border border-border/70 bg-muted/20 p-4">
                      <Link href={`/providers/${provider.slug}`} className="font-medium underline-offset-4 hover:underline">
                        {provider.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Rating: {provider.rating ?? "N/A"} / 5
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {provider.summary ??
                          `${provider.name} provides coverage options for this category and can be compared by service responsiveness, pricing fit, and claim support.`}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    CMS provider recommendations will appear here after content is published.
                  </p>
                )}
              </div>
            </div>
          </InsurancePanel>
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="surface" id="claims-guides">
        <InsurancePanel>
          <div className={featureSectionClass}>
            <div className={featureSectionHeaderClass}>
              <div className="space-y-1.5">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                  <FileText className="h-4 w-4" />
                  Step 3 — File a claim
                </p>
                <h2 className={featureSectionTitleClass}>Claims guides (step-by-step)</h2>
                <p className={featureSectionDescriptionClass}>
                  Document checklists and claim workflows—useful before you file, not just after.
                </p>
              </div>
              <Link href="/claims" className={featureActionLinkClass}>
                Open claims center
              </Link>
            </div>
            <div className="space-y-2.5">
              {relatedClaimsGuides.length > 0 ? (
                relatedClaimsGuides.map((guide) => (
                  <Link
                    key={guide.id}
                    href={guide.slug ? `/claims/guides/${guide.slug}` : "/claims"}
                    className={`${featureListItemClass} group flex items-start justify-between gap-3`}
                  >
                    <span className="font-medium text-foreground">{guide.title}</span>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))
              ) : (
                <p className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground">
                  No claims guides are published for this insurance category yet.
                </p>
              )}
            </div>
          </div>
        </InsurancePanel>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" id="faqs">
        <div className="space-y-6">
          <InsurancePanel>
            <div className={featureSectionClass}>
              <div className={featureSectionHeaderClass}>
                <h2 className={featureSectionTitleClass}>Frequently asked questions</h2>
                {faqDisplayRows.length > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Top {faqDisplayRows.length} of {faqs.length} ·{" "}
                    <Link href="/guides" className="underline underline-offset-4">
                      More in guides
                    </Link>
                  </p>
                ) : null}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {faqDisplayRows.length > 0 ? (
                  faqDisplayRows.map((faq) => (
                    <article key={faq.id} className="rounded-lg border border-border/70 bg-muted/20 p-4">
                      <h3 className="font-medium">{faq.question}</h3>
                      <LinkifiedText text={faq.answer} className="mt-2 block text-sm text-muted-foreground" />
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    CMS FAQs will appear here after content is published.
                  </p>
                )}
              </div>
            </div>
          </InsurancePanel>

          <InsurancePanel id="decision-factors">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">How to choose well</h2>
              <div className="grid gap-3 md:grid-cols-3">
                {decisionFactors.map((factor) => (
                  <article key={factor.title} className="rounded-xl border border-border/70 bg-muted/20 p-4">
                    <p className="font-medium">{factor.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{factor.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </InsurancePanel>

          {contentHub ? (
            <InsurancePanel id="glossary">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight">
                    Key terms for {category.title.toLowerCase()}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Look up policy language while you compare options.
                  </p>
                </div>
                <Link href="/glossary" className={featureActionLinkClass}>
                  Full glossary
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {contentHub.glossaryTerms.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/glossary/${item.slug}`}
                    className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </InsurancePanel>
          ) : null}
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="plain">
        <div className="space-y-6">
          <InsurancePanel>
            <div className="space-y-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <Layers className="h-3.5 w-3.5" />
                Cross-category
              </p>
              <h2 className="text-xl font-semibold tracking-tight">Other insurance topics</h2>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {relatedCategories.map((item) => {
                  const blurb =
                    isCategorySlug(item.slug) ? categoryDescriptions[item.slug] : undefined;
                  return (
                    <Link
                      key={item.slug}
                      href={`/insurance/${item.slug}`}
                      className="group flex items-start gap-3 rounded-xl border border-border/70 bg-muted/20 p-3 transition-colors hover:border-primary/40 hover:bg-accent/40"
                    >
                      <CategoryIconBadge slug={item.slug} label={item.title} />
                      <span className="flex-1 space-y-1">
                        <span className="block text-sm font-semibold text-foreground">{item.title}</span>
                        {blurb ? (
                          <span className="block text-xs leading-5 text-muted-foreground">{blurb}</span>
                        ) : null}
                      </span>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </InsurancePanel>

          <EditorialDisclosure variant="homepage" />

          <InsurancePanel>
            <h2 className="text-lg font-semibold tracking-tight">Continue researching</h2>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <Link href="/guides" className="underline underline-offset-4">
                Insurance guides library
              </Link>
              <Link href="/claims" className="underline underline-offset-4">
                Claims playbooks
              </Link>
              <Link href="/methodology" className="underline underline-offset-4">
                Editorial methodology
              </Link>
              <Link href="/providers" className="underline underline-offset-4">
                All providers
              </Link>
              <Link href="/products" className="underline underline-offset-4">
                All products
              </Link>
            </div>
          </InsurancePanel>
        </div>
      </InsurancePageBand>
    </div>
  );
}
