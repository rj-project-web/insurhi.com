import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductListCard } from "@/components/product-list-card";
import { InsurancePanel } from "@/components/insurance-page-band";
import type { CmsCategory, CmsProduct } from "@/lib/cms-client";

export function buildProviderFaqs(input: {
  name: string;
  bestForItems: string[];
  linkedCategories: CmsCategory[];
}) {
  const primaryCategory = input.linkedCategories[0];
  const categoryLabel = primaryCategory?.title ?? "insurance";
  return [
    {
      question: `Is ${input.name} good for ${categoryLabel.toLowerCase()}?`,
      answer: `${input.name} may be worth shortlisting for ${categoryLabel.toLowerCase()} if its coverage regions, product lineup, and service model fit your needs. Compare linked products and claim considerations before choosing.`,
    },
    {
      question: `Who is ${input.name} best for?`,
      answer:
        input.bestForItems[0] ??
        `${input.name} is best evaluated by matching its available insurance lines, regions, and linked products against your budget, coverage limits, and support preferences.`,
    },
    {
      question: `What should I compare before choosing ${input.name}?`,
      answer: `Compare pricing assumptions, policy exclusions, claims support, available discounts, financial strength, and the linked product reviews for ${input.name}.`,
    },
  ];
}

type ProviderDetailContentProps = {
  name: string;
  summary?: string | null;
  rating?: number | null;
  bestForItems: string[];
  linkedCategories: CmsCategory[];
  linkedProducts: CmsProduct[];
  coverageRegions?: string[];
};

export function ProviderDetailContent({
  name,
  summary,
  rating,
  bestForItems,
  linkedCategories,
  linkedProducts,
  coverageRegions,
}: ProviderDetailContentProps) {
  const primaryCategory = linkedCategories[0];
  const categoryLabel = primaryCategory?.title ?? "insurance";
  const ratingText = typeof rating === "number" ? `${rating.toFixed(1)} out of 5` : "not yet rated";
  const quickAnswer =
    summary ??
    `${name} is a carrier profile to review before comparing ${categoryLabel.toLowerCase()} products, service regions, claims context, and linked policy reviews.`;
  const notBestFor =
    linkedProducts.length > 0 ?
      `shoppers who want to compare only a single policy without checking related ${categoryLabel.toLowerCase()} alternatives`
    : "shoppers who need detailed product-level pricing before reviewing carrier fit";
  const providerFaqs = buildProviderFaqs({ name, bestForItems, linkedCategories });

  return (
    <div className="space-y-6">
      <InsurancePanel id="quick-answer" className="p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Quick answer</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Is {name} a good insurance provider?
        </h2>
        <p className="mt-4 text-base leading-8 text-muted-foreground">
          {quickAnswer} Its current Insurhi profile rating is {ratingText}; use that as a starting
          signal, then confirm policy terms, discounts, and claim handling before you switch.
        </p>
      </InsurancePanel>

      <InsurancePanel id="decision-factors" className="p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Decision table</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
          <dl className="divide-y divide-border/70 text-sm">
            <div className="grid gap-1 bg-background/80 p-4 sm:grid-cols-[11rem_1fr]">
              <dt className="font-medium text-foreground">Best fit</dt>
              <dd className="text-muted-foreground">
                {bestForItems[0] ?? `${categoryLabel} shoppers comparing carrier fit and policy options.`}
              </dd>
            </div>
            <div className="grid gap-1 bg-card p-4 sm:grid-cols-[11rem_1fr]">
              <dt className="font-medium text-foreground">Not ideal for</dt>
              <dd className="text-muted-foreground">{notBestFor}.</dd>
            </div>
            <div className="grid gap-1 bg-background/80 p-4 sm:grid-cols-[11rem_1fr]">
              <dt className="font-medium text-foreground">Coverage signal</dt>
              <dd className="text-muted-foreground">
                {linkedCategories.length > 0 ?
                  linkedCategories.map((category) => category.title).join(", ")
                : "Coverage lines are still being mapped."}
              </dd>
            </div>
            <div className="grid gap-1 bg-card p-4 sm:grid-cols-[11rem_1fr]">
              <dt className="font-medium text-foreground">Claim check</dt>
              <dd className="text-muted-foreground">
                Review claim timelines, documentation requirements, denial patterns, and available support
                channels before relying on any carrier profile.
              </dd>
            </div>
          </dl>
        </div>
      </InsurancePanel>

      {bestForItems.length > 0 ? (
        <InsurancePanel id="best-for" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Best for</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {bestForItems.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-border/70 bg-background/90 px-3 py-2.5 text-sm leading-6 text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </InsurancePanel>
      ) : null}

      {coverageRegions && coverageRegions.length > 0 ? (
        <InsurancePanel id="coverage-regions" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Coverage regions</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {coverageRegions.join(", ")}
          </p>
        </InsurancePanel>
      ) : null}

      {linkedCategories.length > 0 ? (
        <InsurancePanel id="linked-categories" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Insurance lines</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {linkedCategories.map((category) => (
              <Link
                key={category.id}
                href={`/insurance/${category.slug}`}
                className="group flex items-center justify-between rounded-xl border border-border/70 bg-background/90 px-4 py-3 transition-colors hover:border-sky-300/60 hover:bg-sky-50/50"
              >
                <span className="font-medium text-foreground">{category.title}</span>
                <ArrowRight className="h-4 w-4 text-sky-700 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </InsurancePanel>
      ) : null}

      {linkedProducts.length > 0 ? (
        <InsurancePanel id="linked-products" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Linked products</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {linkedProducts.map((product) => (
              <ProductListCard key={product.id} product={product} />
            ))}
          </div>
        </InsurancePanel>
      ) : null}

      <InsurancePanel id="provider-faqs" className="p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Provider questions</h2>
        <div className="mt-4 space-y-4">
          {providerFaqs.map((item) => (
            <div key={item.question} className="rounded-xl border border-border/70 bg-background/90 p-4">
              <h3 className="font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </InsurancePanel>
    </div>
  );
}

export function getProviderDetailSections(input: {
  bestForItems: string[];
  linkedCategories: CmsCategory[];
  linkedProducts: CmsProduct[];
  coverageRegions?: string[];
}) {
  const sections = [
    { id: "quick-answer", label: "Quick answer" },
    { id: "decision-factors", label: "Decision table" },
  ];
  if (input.bestForItems.length) sections.push({ id: "best-for", label: "Best for" });
  if (input.coverageRegions?.length) sections.push({ id: "coverage-regions", label: "Regions" });
  if (input.linkedCategories.length) sections.push({ id: "linked-categories", label: "Insurance lines" });
  if (input.linkedProducts.length) sections.push({ id: "linked-products", label: "Products" });
  sections.push({ id: "provider-faqs", label: "FAQs" });
  return sections;
}
