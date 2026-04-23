import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  CircleDollarSign,
  ClipboardCheck,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  getArticlesList,
  getClaimsGuidesList,
  getCategoryBySlug,
  getFaqsByCategory,
  getProductsByCategory,
  getProvidersByCategory,
} from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { insuranceCategories } from "@/lib/site-data";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

function guideMatchesCategory(slug: string, title: string, categorySlug: string): boolean {
  const text = `${slug} ${title}`.toLowerCase();
  if (categorySlug === "auto") return /\bauto\b/.test(text) || /\bcar\b/.test(text);
  if (categorySlug === "life") return text.includes("life");
  if (categorySlug === "home") return text.includes("home") || text.includes("property");
  if (categorySlug === "pet") return text.includes("pet");
  if (categorySlug === "medicare") return text.includes("medicare") || text.includes("medigap");
  if (categorySlug === "renters") return text.includes("renters") || text.includes("renter");
  return false;
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
  });
}

export default async function InsuranceCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const fallbackCategory = insuranceCategories.find((item) => item.slug === slug);
  const cmsCategory = await getCategoryBySlug(slug);
  const category = cmsCategory ?? fallbackCategory;
  const categorySummary = cmsCategory?.summary;

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

  const helpYouDoBySlug: Record<string, [string, string, string]> = {
    auto: [
      "Match liability, collision, and comprehensive limits to your driving exposure.",
      "Balance premium savings with deductibles you can realistically pay after an accident.",
      "Compare providers on claim speed, repair network quality, and roadside support.",
    ],
    life: [
      "Estimate coverage needed to protect income replacement and long-term family goals.",
      "Compare term vs whole life structures against your budget and timeline.",
      "Shortlist insurers with stronger underwriting clarity and beneficiary support.",
    ],
    home: [
      "Align dwelling and personal property limits with your home's rebuild risk.",
      "Compare deductible options for weather, fire, and theft claim scenarios.",
      "Evaluate provider claim handling for local catastrophe and contractor coordination.",
    ],
    pet: [
      "Match accident and illness coverage to your pet's age and breed risk profile.",
      "Compare reimbursement rates, annual limits, and waiting periods side by side.",
      "Shortlist providers with clearer exclusions and faster veterinary reimbursements.",
    ],
    medicare: [
      "Compare Medicare plan structures based on provider access and prescription needs.",
      "Review premium and out-of-pocket trade-offs for predictable annual healthcare costs.",
      "Choose carriers with stronger member support and enrollment guidance.",
    ],
    renters: [
      "Set personal property and liability limits that fit your rental lifestyle.",
      "Compare premiums with deductibles for theft, fire, and water damage scenarios.",
      "Identify providers with smoother digital claims and temporary living support.",
    ],
  };
  const helpYouDoItems =
    helpYouDoBySlug[slug] ??
    ([
      "Identify policy terms that match your risk profile.",
      "Compare premium and deductible trade-offs quickly.",
      "Shortlist providers with stronger service confidence.",
    ] as [string, string, string]);

  const productRows = products.slice(0, 6);
  const providerRows = providers.slice(0, 6);
  const faqRows = faqs.slice(0, 8);
  const glanceMetrics = [
    {
      label: "Products compared",
      value: productRows.length > 0 ? String(productRows.length) : "0",
      hint: "Live CMS entries",
      icon: ClipboardCheck,
    },
    {
      label: "Provider shortlist",
      value: providerRows.length > 0 ? String(providerRows.length) : "0",
      hint: "With regional support",
      icon: Users,
    },
    {
      label: "Decision horizon",
      value: "15 min",
      hint: "To shortlist options",
      icon: Timer,
    },
    {
      label: "Review confidence",
      value: "High",
      hint: "Coverage-first framework",
      icon: TrendingUp,
    },
  ];
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

  const relatedGuides = allArticles
    .filter((article) => guideMatchesCategory(article.slug, article.title, slug))
    .sort((a, b) => {
      const aTime = Date.parse((a as { publishedAt?: string }).publishedAt ?? "") || 0;
      const bTime = Date.parse((b as { publishedAt?: string }).publishedAt ?? "") || 0;
      return bTime - aTime;
    })
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
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Insurance", path: "/insurance" },
    { name: category.title, path: `/insurance/${slug}` },
  ]);
  const featureSectionClass =
    "relative space-y-4 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card via-blue-500/[0.03] to-cyan-500/[0.04] p-4 shadow-sm sm:p-5";
  const featureSectionAccentClass =
    "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/60 to-cyan-500/0";
  const featureSectionHeaderClass =
    "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4";
  const featureSectionTitleClass = "text-xl font-semibold tracking-tight text-foreground sm:text-2xl";
  const featureSectionDescriptionClass = "max-w-3xl text-sm leading-6 text-muted-foreground";
  const featureActionLinkClass =
    "inline-flex min-h-10 items-center justify-center rounded-full border border-primary/25 bg-primary/10 px-3 text-sm font-medium text-primary transition-colors hover:border-primary/40 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const featureListItemClass =
    "block rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm transition-colors hover:bg-accent";

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="space-y-6 rounded-2xl border bg-gradient-to-br from-blue-600/[0.06] via-cyan-500/[0.03] to-card p-6 lg:p-8">
        <div className="hidden lg:grid lg:grid-cols-[1.45fr_1fr] lg:gap-6">
          <div className="space-y-3">
            <p className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="mr-1 h-3.5 w-3.5 text-cyan-600" />
              Insurance / {category.title}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">{category.title}</h1>
            <p className="max-w-4xl text-muted-foreground">
              {categorySummary ??
                `Compare ${category.title.toLowerCase()} plans with practical guidance on coverage fit, deductible trade-offs, and provider trust.`}
            </p>
          </div>
          <aside className="rounded-xl border bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-indigo-500/10 p-4">
            <p className="text-sm font-semibold text-foreground">What this page helps you do</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-600" />
                {helpYouDoItems[0]}
              </li>
              <li className="flex items-start gap-2">
                <CircleDollarSign className="mt-0.5 h-4 w-4 text-cyan-600" />
                {helpYouDoItems[1]}
              </li>
              <li className="flex items-start gap-2">
                <BadgeCheck className="mt-0.5 h-4 w-4 text-indigo-600" />
                {helpYouDoItems[2]}
              </li>
            </ul>
          </aside>
        </div>

        <div className="space-y-4 lg:hidden">
          <p className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="mr-1 h-3.5 w-3.5 text-cyan-600" />
            Insurance / {category.title}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{category.title}</h1>
          <p className="text-sm text-muted-foreground">
            {categorySummary ??
              `Compare ${category.title.toLowerCase()} plans with practical guidance on coverage fit, deductible trade-offs, and provider trust.`}
          </p>
          <div className="grid gap-2">
            <article className="rounded-lg border bg-background/90 p-3">
              <p className="text-xs font-medium text-foreground">Coverage fit</p>
              <p className="mt-1 text-xs text-muted-foreground">{helpYouDoItems[0]}</p>
            </article>
            <article className="rounded-lg border bg-background/90 p-3">
              <p className="text-xs font-medium text-foreground">Price vs deductible</p>
              <p className="mt-1 text-xs text-muted-foreground">{helpYouDoItems[1]}</p>
            </article>
          </div>
        </div>

        <div className="hidden gap-3 sm:grid-cols-2 lg:grid lg:grid-cols-4">
          <Link href="#products" className="rounded-lg border bg-background p-4 transition-colors hover:bg-accent">
            Compare products
          </Link>
          <Link href="#decision-factors" className="rounded-lg border bg-background p-4 transition-colors hover:bg-accent">
            Key decision factors
          </Link>
          <Link href="#providers" className="rounded-lg border bg-background p-4 transition-colors hover:bg-accent">
            Provider shortlist
          </Link>
          <Link href="#faqs" className="rounded-lg border bg-background p-4 transition-colors hover:bg-accent">
            Common questions
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 lg:hidden">
          <Link href="#products" className="rounded-lg border bg-background px-3 py-2 text-sm">
            Products
          </Link>
          <Link href="#providers" className="rounded-lg border bg-background px-3 py-2 text-sm">
            Providers
          </Link>
          <Link href="#decision-factors" className="rounded-lg border bg-background px-3 py-2 text-sm">
            Decisions
          </Link>
          <Link href="#faqs" className="rounded-lg border bg-background px-3 py-2 text-sm">
            FAQs
          </Link>
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border bg-gradient-to-br from-cyan-500/[0.05] to-blue-500/[0.02] p-4 md:grid-cols-2 xl:grid-cols-4">
        {glanceMetrics.map((item) => (
          <article
            key={item.label}
            className="rounded-xl border bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-transparent p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <item.icon className="h-4 w-4 text-cyan-600" />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
          </article>
        ))}
      </section>

      <section className={featureSectionClass}>
        <div className={featureSectionAccentClass} />
        <div className={featureSectionHeaderClass}>
          <h2 className={featureSectionTitleClass}>
            Insurance buying guides for {category.title}
          </h2>
          <Link href="/guides" className={featureActionLinkClass}>
            Browse all guides
          </Link>
        </div>
        <p className={featureSectionDescriptionClass}>
          Explore practical articles to learn coverage basics, compare policies, and avoid common buying mistakes.
        </p>
        <div className="space-y-2.5">
          {relatedGuides.length > 0 ? (
            relatedGuides.map((article) => (
              <Link
                key={article.id}
                href={`/guides/${article.slug}`}
                className={featureListItemClass}
              >
                {article.title}
              </Link>
            ))
          ) : (
            <p className="rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm text-muted-foreground">
              More category-specific guides are being curated.
            </p>
          )}
        </div>
      </section>

      <section className={featureSectionClass}>
        <div className={featureSectionAccentClass} />
        <div className={featureSectionHeaderClass}>
          <h2 className={featureSectionTitleClass}>Claims guides (step-by-step)</h2>
          <Link href="/claims" className={featureActionLinkClass}>
            Open claims center
          </Link>
        </div>
        <p className={featureSectionDescriptionClass}>
          Review practical claim workflows and document checklists before incidents happen.
        </p>
        <div className="space-y-2.5">
          {relatedClaimsGuides.length > 0 ? (
            relatedClaimsGuides.map((guide) => (
              <Link
                key={guide.id}
                href={guide.slug ? `/claims/guides/${guide.slug}` : "/claims"}
                className={featureListItemClass}
              >
                {guide.title}
              </Link>
            ))
          ) : (
            <p className="rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm text-muted-foreground">
              No claims guides are published for this insurance category yet.
            </p>
          )}
        </div>
      </section>

      <section id="products" className={featureSectionClass}>
        <div className={featureSectionAccentClass} />
        <div className={featureSectionHeaderClass}>
          <div className="space-y-1.5">
            <h2 className={featureSectionTitleClass}>Product comparison snapshot</h2>
            <p className={featureSectionDescriptionClass}>
              Scan side-by-side product signals to shortlist options before reading full policy details.
            </p>
          </div>
          <Link href="/guides" className={featureActionLinkClass}>
            More buying guides
          </Link>
        </div>
        <div className="overflow-x-auto rounded-xl border bg-card">
          {productRows.length > 0 ? (
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Price range</th>
                  <th className="px-4 py-3 font-medium">Coverage</th>
                  <th className="px-4 py-3 font-medium">Deductible</th>
                </tr>
              </thead>
              <tbody>
                {productRows.map((product) => (
                  <tr key={product.id} className="border-t align-top">
                    <td className="px-4 py-3">
                      <Link href={`/products/${product.slug}`} className="font-medium underline-offset-4 hover:underline">
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{product.priceRange ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{product.coverageAmount ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{product.deductible ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-4 text-sm text-muted-foreground">
              CMS products for this category will appear here after publishing.
            </p>
          )}
        </div>
      </section>

      <section id="faqs" className="space-y-3 rounded-2xl border bg-gradient-to-br from-card to-cyan-500/[0.03] p-5">
        <h2 className="text-xl font-semibold tracking-tight">Frequently asked questions</h2>
        <div className="grid gap-3">
          {faqRows.length > 0 ? (
            faqRows.map((faq) => (
              <article key={faq.id} className="rounded-lg border bg-card p-4">
                <p className="font-medium">{faq.question}</p>
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              </article>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              CMS FAQs will appear here after content is published.
            </p>
          )}
        </div>
      </section>

      <section id="providers" className={featureSectionClass}>
        <div className={featureSectionAccentClass} />
        <div className={featureSectionHeaderClass}>
          <div className="space-y-1.5">
            <h2 className={featureSectionTitleClass}>Provider shortlist</h2>
            <p className={featureSectionDescriptionClass}>
              Review insurers by service quality, claim handling, and regional coverage fit.
            </p>
          </div>
          <Link href="/providers" className={featureActionLinkClass}>
            View more
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {providerRows.length > 0 ? (
            providerRows.map((provider) => (
              <article key={provider.id} className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
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
                {provider.coverageRegions && provider.coverageRegions.length > 0 ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Regions: {provider.coverageRegions.join(", ")}
                  </p>
                ) : null}
              </article>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              CMS provider recommendations will appear here after content is published.
            </p>
          )}
        </div>
      </section>

      <section
        id="decision-factors"
        className="space-y-3 rounded-2xl border bg-gradient-to-r from-indigo-500/[0.04] via-blue-500/[0.03] to-transparent p-4 sm:p-5"
      >
        <h2 className="text-xl font-semibold tracking-tight">How to choose well</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {decisionFactors.map((factor) => (
            <article key={factor.title} className="rounded-xl border bg-gradient-to-br from-card to-blue-500/5 p-4">
              <p className="font-medium">{factor.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{factor.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold tracking-tight">Continue researching</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <Link href="/guides" className="underline underline-offset-4">
            Insurance guides library
          </Link>
          <Link href="/claims" className="underline underline-offset-4">
            Claims playbooks
          </Link>
        </div>
      </section>
    </div>
  );
}
