import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductListCard } from "@/components/product-list-card";
import { InsurancePanel } from "@/components/insurance-page-band";
import type { CmsCategory, CmsProduct } from "@/lib/cms-client";

type ProviderDetailContentProps = {
  bestForItems: string[];
  linkedCategories: CmsCategory[];
  linkedProducts: CmsProduct[];
  coverageRegions?: string[];
};

export function ProviderDetailContent({
  bestForItems,
  linkedCategories,
  linkedProducts,
  coverageRegions,
}: ProviderDetailContentProps) {
  return (
    <div className="space-y-6">
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
    </div>
  );
}

export function getProviderDetailSections(input: {
  bestForItems: string[];
  linkedCategories: CmsCategory[];
  linkedProducts: CmsProduct[];
  coverageRegions?: string[];
}) {
  const sections = [];
  if (input.bestForItems.length) sections.push({ id: "best-for", label: "Best for" });
  if (input.coverageRegions?.length) sections.push({ id: "coverage-regions", label: "Regions" });
  if (input.linkedCategories.length) sections.push({ id: "linked-categories", label: "Insurance lines" });
  if (input.linkedProducts.length) sections.push({ id: "linked-products", label: "Products" });
  return sections;
}
