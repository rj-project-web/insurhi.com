import Image from "next/image";

import { CmsRichText } from "@/components/cms-rich-text";
import { GuideKeyTakeaways } from "@/components/guide-key-takeaways";
import { InsurancePanel } from "@/components/insurance-page-band";
import type { CmsProduct } from "@/lib/cms-client";
import { getProductHighlights } from "@/lib/product-detail-utils";

function listItems(rows: Array<{ item?: string }> | undefined): string[] {
  return (rows ?? []).map((row) => row.item?.trim() ?? "").filter(Boolean);
}

type ProductDetailContentProps = {
  product: CmsProduct;
};

export function ProductDetailContent({ product }: ProductDetailContentProps) {
  const pros = listItems(product.pros);
  const cons = listItems(product.cons);
  const bestFor = listItems(product.bestFor);
  const notFor = listItems(product.notFor);
  const faqItems = (product.faqItems ?? []).filter((item) => item.question);
  const competitorRows = (product.competitorComparisons ?? []).filter((item) => item.competitorName);
  const premiumRows = (product.premiumEstimateRows ?? []).filter(
    (row) => row.ageBand || row.estimatedPremium,
  );
  const sourceRows = (product.sources ?? []).filter((row) => row.sourceName);
  const highlights = getProductHighlights(product, 3);

  return (
    <div className="space-y-6">
      <GuideKeyTakeaways items={highlights} />

      {product.editorConclusion ? (
        <InsurancePanel id="editorial-conclusion" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Editorial verdict</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">{product.editorConclusion}</p>
        </InsurancePanel>
      ) : null}

      {product.coverageDetails ? (
        <InsurancePanel id="coverage-details" className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Coverage details</h2>
            <Image
              src="/product-coverage-illustration.svg"
              alt=""
              width={120}
              height={72}
              className="hidden shrink-0 rounded-md border bg-background/70 p-1 md:block"
            />
          </div>
          <div className="mt-4">
            <CmsRichText content={product.coverageDetails} />
          </div>
        </InsurancePanel>
      ) : null}

      {premiumRows.length > 0 ? (
        <InsurancePanel id="premium-estimates" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Premium estimates</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-3 py-2">Age</th>
                  <th className="px-3 py-2">Region</th>
                  <th className="px-3 py-2">Profile</th>
                  <th className="px-3 py-2">Estimated premium</th>
                  <th className="px-3 py-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {premiumRows.map((row, idx) => (
                  <tr key={`${row.ageBand ?? "row"}-${idx}`} className="border-t border-border/60">
                    <td className="px-3 py-2">{row.ageBand ?? "—"}</td>
                    <td className="px-3 py-2">{row.region ?? "—"}</td>
                    <td className="px-3 py-2">{row.profile ?? "—"}</td>
                    <td className="px-3 py-2">{row.estimatedPremium ?? "—"}</td>
                    <td className="px-3 py-2">{row.note ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InsurancePanel>
      ) : null}

      {pros.length > 0 || cons.length > 0 ? (
        <InsurancePanel id="pros-cons" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Pros & cons</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {pros.length > 0 ? (
              <article className="rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-4 dark:bg-emerald-950/20">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">Pros</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  {pros.map((item) => (
                    <li key={item} className="rounded-lg border border-border/60 bg-background/80 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ) : null}
            {cons.length > 0 ? (
              <article className="rounded-xl border border-rose-200/60 bg-rose-50/50 p-4 dark:bg-rose-950/20">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300">Cons</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  {cons.map((item) => (
                    <li key={item} className="rounded-lg border border-border/60 bg-background/80 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ) : null}
          </div>
        </InsurancePanel>
      ) : null}

      {bestFor.length > 0 || notFor.length > 0 ? (
        <InsurancePanel id="best-for" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Best for</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {bestFor.length > 0 ? (
              <article className="rounded-xl border border-border/70 bg-background/90 p-4">
                <h3 className="font-semibold text-foreground">Good fit</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  {bestFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ) : null}
            {notFor.length > 0 ? (
              <article className="rounded-xl border border-border/70 bg-background/90 p-4">
                <h3 className="font-semibold text-foreground">Not ideal for</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  {notFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ) : null}
          </div>
        </InsurancePanel>
      ) : null}

      {product.recommendedFor ? (
        <InsurancePanel id="recommended-for" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Recommended for</h2>
          <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-muted-foreground">
            {product.recommendedFor}
          </p>
        </InsurancePanel>
      ) : null}

      {product.claimsTurnaround?.avgDays != null ||
      product.claimsTurnaround?.p90Days != null ||
      product.claimsTurnaround?.dataSource ? (
        <InsurancePanel id="claims-turnaround" className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Claims turnaround</h2>
            <Image
              src="/product-claims-illustration.svg"
              alt=""
              width={120}
              height={72}
              className="hidden shrink-0 rounded-md border bg-background/70 p-1 md:block"
            />
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/70 bg-background/90 p-3">
              <dt className="text-xs text-muted-foreground">Avg days</dt>
              <dd className="mt-1 font-semibold">{product.claimsTurnaround?.avgDays ?? "N/A"}</dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/90 p-3">
              <dt className="text-xs text-muted-foreground">P90 days</dt>
              <dd className="mt-1 font-semibold">{product.claimsTurnaround?.p90Days ?? "N/A"}</dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/90 p-3">
              <dt className="text-xs text-muted-foreground">Source</dt>
              <dd className="mt-1 font-semibold">{product.claimsTurnaround?.dataSource ?? "N/A"}</dd>
            </div>
          </dl>
        </InsurancePanel>
      ) : null}

      {competitorRows.length > 0 ? (
        <InsurancePanel id="competitor-comparison" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Competitor comparison</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-3 py-2">Competitor</th>
                  <th className="px-3 py-2">Price band</th>
                  <th className="px-3 py-2">Coverage</th>
                  <th className="px-3 py-2">Claims</th>
                  <th className="px-3 py-2">Summary</th>
                </tr>
              </thead>
              <tbody>
                {competitorRows.map((item, idx) => (
                  <tr key={`${item.competitorName ?? "cmp"}-${idx}`} className="border-t border-border/60">
                    <td className="px-3 py-2">{item.competitorName}</td>
                    <td className="px-3 py-2">{item.priceBand ?? "—"}</td>
                    <td className="px-3 py-2">{item.coverageScore ?? "—"}</td>
                    <td className="px-3 py-2">{item.claimsScore ?? "—"}</td>
                    <td className="px-3 py-2">{item.summary ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InsurancePanel>
      ) : null}

      {product.ratingDistribution ? (
        <InsurancePanel id="rating-distribution" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Rating distribution</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-5">
            <div className="rounded-xl border border-border/70 bg-background/90 p-3 text-center">
              <dt className="text-xs text-muted-foreground">5★</dt>
              <dd className="mt-1 font-semibold">{product.ratingDistribution.star5 ?? 0}%</dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/90 p-3 text-center">
              <dt className="text-xs text-muted-foreground">4★</dt>
              <dd className="mt-1 font-semibold">{product.ratingDistribution.star4 ?? 0}%</dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/90 p-3 text-center">
              <dt className="text-xs text-muted-foreground">3★</dt>
              <dd className="mt-1 font-semibold">{product.ratingDistribution.star3 ?? 0}%</dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/90 p-3 text-center">
              <dt className="text-xs text-muted-foreground">2★</dt>
              <dd className="mt-1 font-semibold">{product.ratingDistribution.star2 ?? 0}%</dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/90 p-3 text-center">
              <dt className="text-xs text-muted-foreground">1★</dt>
              <dd className="mt-1 font-semibold">{product.ratingDistribution.star1 ?? 0}%</dd>
            </div>
          </dl>
        </InsurancePanel>
      ) : null}

      {product.reviewHighlights ? (
        <InsurancePanel id="review-highlights" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">User review highlights</h2>
          <div className="mt-4">
            <CmsRichText content={product.reviewHighlights} />
          </div>
        </InsurancePanel>
      ) : null}

      {faqItems.length > 0 ? (
        <InsurancePanel id="product-faq" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">FAQ</h2>
          <div className="mt-4 space-y-3">
            {faqItems.map((item, idx) => (
              <article
                key={`${item.question ?? "faq"}-${idx}`}
                className="rounded-xl border border-border/70 bg-background/90 p-4"
              >
                <h3 className="font-medium text-foreground">{item.question}</h3>
                <div className="mt-2 text-sm leading-6 text-muted-foreground">
                  <CmsRichText content={item.answer} />
                </div>
              </article>
            ))}
          </div>
        </InsurancePanel>
      ) : null}

      {product.methodology ? (
        <InsurancePanel id="methodology" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Methodology</h2>
          <div className="mt-4">
            <CmsRichText content={product.methodology} />
          </div>
        </InsurancePanel>
      ) : null}

      {sourceRows.length > 0 ? (
        <InsurancePanel id="sources" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Sources</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
            {sourceRows.map((row, idx) => (
              <li key={`${row.sourceName ?? "source"}-${idx}`}>
                {row.url ? (
                  <a
                    href={row.url}
                    className="font-medium text-sky-800 underline underline-offset-4 hover:text-sky-950"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {row.sourceName}
                  </a>
                ) : (
                  row.sourceName
                )}
                {row.publishedAt ? ` (${new Date(row.publishedAt).toLocaleDateString()})` : ""}
              </li>
            ))}
          </ul>
        </InsurancePanel>
      ) : null}
    </div>
  );
}
