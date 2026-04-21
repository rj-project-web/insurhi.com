import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BadgeCheck, CircleDollarSign, ShieldCheck, Sparkles, Timer } from "lucide-react";

import { CmsRichText, extractCmsText } from "@/components/cms-rich-text";
import type { CmsCategory, CmsProvider } from "@/lib/cms-client";
import { getProductBySlug, getProducts } from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

async function getProductFromSnapshot(slug: string) {
  try {
    const snapshotPath =
      process.env.CMS_CONTENT_FILE_PATH ?? path.join(process.cwd(), "content", "cms-content.json");
    const raw = await readFile(snapshotPath, "utf8");
    const parsed = JSON.parse(raw) as {
      products?: Array<{
        id?: number | string;
        slug?: string;
        name?: string;
        oneLineVerdict?: string;
        editorConclusion?: string;
        coverageAmount?: string;
        coverageDetails?: unknown;
        deductible?: string;
        priceRange?: string;
        pricingRangeSummary?: string;
        premiumEstimateRows?: Array<{
          ageBand?: string;
          region?: string;
          profile?: string;
          estimatedPremium?: string;
          note?: string;
        }>;
        pros?: Array<{ item?: string }>;
        cons?: Array<{ item?: string }>;
        bestFor?: Array<{ item?: string }>;
        notFor?: Array<{ item?: string }>;
        recommendedFor?: string;
        claimsTurnaround?: {
          avgDays?: number;
          p90Days?: number;
          dataSource?: string;
          lastUpdated?: string;
        };
        competitorComparisons?: Array<{
          competitorName?: string;
          priceBand?: string;
          coverageScore?: number;
          claimsScore?: number;
          summary?: string;
        }>;
        ratingDistribution?: {
          star5?: number;
          star4?: number;
          star3?: number;
          star2?: number;
          star1?: number;
        };
        reviewHighlights?: unknown;
        faqItems?: Array<{ question?: string; answer?: unknown }>;
        methodology?: unknown;
        sources?: Array<{ sourceName?: string; url?: string; publishedAt?: string }>;
        category?: string | CmsCategory;
        provider?: string | CmsProvider;
        seo?: { metaTitle?: string; metaDescription?: string };
      }>;
    };

    const products = parsed.products ?? [];
    const matched = products.find((item) => item.slug?.toLowerCase() === slug.toLowerCase());

    if (!matched?.slug || !matched?.name) {
      return null;
    }

    return {
      id: String(matched.id ?? matched.slug),
      slug: matched.slug,
      name: matched.name,
      oneLineVerdict: matched.oneLineVerdict,
      editorConclusion: matched.editorConclusion,
      coverageAmount: matched.coverageAmount,
      coverageDetails: matched.coverageDetails,
      deductible: matched.deductible,
      priceRange: matched.priceRange,
      pricingRangeSummary: matched.pricingRangeSummary,
      premiumEstimateRows: matched.premiumEstimateRows,
      pros: matched.pros,
      cons: matched.cons,
      bestFor: matched.bestFor,
      notFor: matched.notFor,
      recommendedFor: matched.recommendedFor,
      claimsTurnaround: matched.claimsTurnaround,
      competitorComparisons: matched.competitorComparisons,
      ratingDistribution: matched.ratingDistribution,
      reviewHighlights: matched.reviewHighlights,
      faqItems: matched.faqItems,
      methodology: matched.methodology,
      sources: matched.sources,
      category: matched.category,
      provider: matched.provider,
      seo: matched.seo,
    };
  } catch {
    return null;
  }
}

function resolveRelation<T extends object>(value: string | T | undefined): T | null {
  if (!value || typeof value === "string") {
    return null;
  }

  return value as T;
}

function listItems(rows: Array<{ item?: string }> | undefined): string[] {
  return (rows ?? []).map((row) => row.item?.trim() ?? "").filter(Boolean);
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return buildMetadata({
      title: "Insurance product",
      description: "Insurance product details.",
      path: "/insurance",
    });
  }

  const derivedDescription =
    product.seo?.metaDescription ||
    product.oneLineVerdict ||
    extractCmsText(product.editorConclusion).slice(0, 160) ||
    product.recommendedFor ||
    `${product.name} coverage and pricing notes from the CMS.`;

  return buildMetadata({
    title: product.seo?.metaTitle ?? product.name,
    description: derivedDescription,
    path: `/products/${slug}`,
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product = await getProductBySlug(slug);

  if (!product) {
    const products = await getProducts();
    const matched = products.find((item) => item.slug.toLowerCase() === slug.toLowerCase());

    if (matched && matched.slug !== slug) {
      redirect(`/products/${matched.slug}`);
    }
  }

  if (!product) {
    product = await getProductFromSnapshot(slug);

    if (product && product.slug !== slug) {
      redirect(`/products/${product.slug}`);
    }
  }

  if (!product) {
    notFound();
  }

  const category = resolveRelation<CmsCategory>(product.category);
  const provider = resolveRelation<CmsProvider>(product.provider);
  const pros = listItems(product.pros);
  const cons = listItems(product.cons);
  const bestFor = listItems(product.bestFor);
  const notFor = listItems(product.notFor);
  const faqItems = (product.faqItems ?? []).filter((item) => item.question);
  const competitorRows = (product.competitorComparisons ?? []).filter((item) => item.competitorName);
  const premiumRows = (product.premiumEstimateRows ?? []).filter((row) => row.ageBand || row.estimatedPremium);
  const sourceRows = (product.sources ?? []).filter((row) => row.sourceName);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Insurance", path: "/insurance" },
    ...(category
      ? [{ name: category.title, path: `/insurance/${category.slug}` }]
      : [{ name: "Insurance", path: "/insurance" }]),
    { name: product.name, path: `/products/${slug}` },
  ]);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section
        className="relative overflow-hidden rounded-2xl border bg-card p-6 lg:p-8"
        style={{ backgroundImage: "url('/home-latest-bg.svg')" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/[0.08] via-cyan-500/[0.06] to-card" />
        <div className="pointer-events-none absolute -right-10 bottom-0 hidden md:block">
          <Image
            src="/product-hero-illustration.svg"
            alt=""
            width={280}
            height={220}
            className="opacity-80"
          />
        </div>
        <div className="relative space-y-4">
          <p className="text-sm text-muted-foreground">Products / {slug}</p>
          <p className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="mr-1 h-3.5 w-3.5 text-cyan-600" />
            Deep product review
          </p>
          <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">{product.name}</h1>
          {product.oneLineVerdict ? (
            <p className="max-w-3xl text-base text-muted-foreground">{product.oneLineVerdict}</p>
          ) : null}
          <div className="flex flex-wrap gap-3 text-sm">
            {category ? (
              <Link
                href={`/insurance/${category.slug}`}
                className="rounded-full border bg-background px-3 py-1 text-muted-foreground hover:text-foreground"
              >
                Category: {category.title}
              </Link>
            ) : null}
            {provider ? (
              <Link
                href={`/providers/${provider.slug}`}
                className="rounded-full border bg-background px-3 py-1 text-muted-foreground hover:text-foreground"
              >
                Provider: {provider.name}
              </Link>
            ) : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-lg border bg-background/85 p-3">
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-600" />
                Coverage
              </p>
              <p className="mt-1 text-sm font-medium">{product.coverageAmount ?? "Not specified"}</p>
            </article>
            <article className="rounded-lg border bg-background/85 p-3">
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <CircleDollarSign className="h-3.5 w-3.5 text-blue-600" />
                Price range
              </p>
              <p className="mt-1 text-sm font-medium">{product.priceRange ?? "Not specified"}</p>
            </article>
            <article className="rounded-lg border bg-background/85 p-3">
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <BadgeCheck className="h-3.5 w-3.5 text-indigo-600" />
                Deductible
              </p>
              <p className="mt-1 text-sm font-medium">{product.deductible ?? "Not specified"}</p>
            </article>
            <article className="rounded-lg border bg-background/85 p-3">
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Timer className="h-3.5 w-3.5 text-emerald-600" />
                Avg claim days
              </p>
              <p className="mt-1 text-sm font-medium">{product.claimsTurnaround?.avgDays ?? "N/A"}</p>
            </article>
          </div>
          {product.pricingRangeSummary ? (
            <p className="rounded-lg border bg-background/80 p-3 text-sm text-muted-foreground">
              {product.pricingRangeSummary}
            </p>
          ) : null}
        </div>
      </section>

      {product.editorConclusion ? (
        <section className="space-y-2 rounded-xl border bg-gradient-to-br from-card to-blue-500/[0.03] p-5">
          <h2 className="text-lg font-semibold tracking-tight">Editorial conclusion</h2>
          <p className="text-sm text-muted-foreground">{product.editorConclusion}</p>
        </section>
      ) : null}

      {product.coverageDetails ? (
        <section className="space-y-2 rounded-xl border bg-gradient-to-br from-card to-cyan-500/[0.03] p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-tight">Coverage details</h2>
            <Image
              src="/product-coverage-illustration.svg"
              alt=""
              width={120}
              height={72}
              className="hidden rounded-md border bg-background/70 p-1 md:block"
            />
          </div>
          <CmsRichText content={product.coverageDetails} />
        </section>
      ) : null}

      {premiumRows.length > 0 ? (
        <section className="space-y-2 rounded-xl border bg-gradient-to-br from-card to-blue-500/[0.02] p-5">
          <h2 className="text-lg font-semibold tracking-tight">Premium estimate table</h2>
          <div className="overflow-x-auto">
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
                  <tr key={`${row.ageBand ?? "row"}-${idx}`} className="border-t">
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
        </section>
      ) : null}

      {pros.length > 0 || cons.length > 0 ? (
        <section className="grid gap-3 rounded-xl border bg-gradient-to-br from-card to-indigo-500/[0.03] p-5 sm:grid-cols-2">
          {pros.length > 0 ? (
            <article className="rounded-lg border bg-emerald-500/[0.06] p-4">
              <h2 className="text-lg font-semibold tracking-tight text-emerald-700">Pros</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {pros.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ) : null}
          {cons.length > 0 ? (
            <article className="rounded-lg border bg-rose-500/[0.06] p-4">
              <h2 className="text-lg font-semibold tracking-tight text-rose-700">Cons</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {cons.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ) : null}
        </section>
      ) : null}

      {bestFor.length > 0 || notFor.length > 0 ? (
        <section className="grid gap-3 rounded-xl border bg-gradient-to-br from-card to-teal-500/[0.03] p-5 sm:grid-cols-2">
          {bestFor.length > 0 ? (
            <article className="rounded-lg border bg-background/80 p-4">
              <h2 className="text-lg font-semibold tracking-tight">Best for</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {bestFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ) : null}
          {notFor.length > 0 ? (
            <article className="rounded-lg border bg-background/80 p-4">
              <h2 className="text-lg font-semibold tracking-tight">Not ideal for</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {notFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ) : null}
        </section>
      ) : null}

      {product.recommendedFor ? (
        <section className="space-y-2 rounded-xl border bg-gradient-to-br from-card to-cyan-500/[0.02] p-5">
          <h2 className="text-lg font-semibold tracking-tight">Recommended for</h2>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{product.recommendedFor}</p>
        </section>
      ) : null}

      {product.claimsTurnaround?.avgDays != null ||
      product.claimsTurnaround?.p90Days != null ||
      product.claimsTurnaround?.dataSource ? (
        <section className="space-y-2 rounded-xl border bg-gradient-to-br from-card to-blue-500/[0.03] p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-tight">Claims turnaround</h2>
            <Image
              src="/product-claims-illustration.svg"
              alt=""
              width={120}
              height={72}
              className="hidden rounded-md border bg-background/70 p-1 md:block"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <p className="text-sm text-muted-foreground">
              Avg days: {product.claimsTurnaround?.avgDays ?? "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              P90 days: {product.claimsTurnaround?.p90Days ?? "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              Source: {product.claimsTurnaround?.dataSource ?? "N/A"}
            </p>
          </div>
        </section>
      ) : null}

      {competitorRows.length > 0 ? (
        <section className="space-y-2 rounded-xl border bg-gradient-to-br from-card to-indigo-500/[0.03] p-5">
          <h2 className="text-lg font-semibold tracking-tight">Competitor comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-3 py-2">Competitor</th>
                  <th className="px-3 py-2">Price band</th>
                  <th className="px-3 py-2">Coverage score</th>
                  <th className="px-3 py-2">Claims score</th>
                  <th className="px-3 py-2">Summary</th>
                </tr>
              </thead>
              <tbody>
                {competitorRows.map((item, idx) => (
                  <tr key={`${item.competitorName ?? "cmp"}-${idx}`} className="border-t">
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
        </section>
      ) : null}

      {product.ratingDistribution ? (
        <section className="space-y-2 rounded-xl border bg-gradient-to-br from-card to-violet-500/[0.03] p-5">
          <h2 className="text-lg font-semibold tracking-tight">Rating distribution</h2>
          <div className="grid gap-2 sm:grid-cols-5 text-sm text-muted-foreground">
            <p>5★: {product.ratingDistribution.star5 ?? 0}%</p>
            <p>4★: {product.ratingDistribution.star4 ?? 0}%</p>
            <p>3★: {product.ratingDistribution.star3 ?? 0}%</p>
            <p>2★: {product.ratingDistribution.star2 ?? 0}%</p>
            <p>1★: {product.ratingDistribution.star1 ?? 0}%</p>
          </div>
        </section>
      ) : null}

      {product.reviewHighlights ? (
        <section className="space-y-2 rounded-xl border bg-gradient-to-br from-card to-amber-500/[0.03] p-5">
          <h2 className="text-lg font-semibold tracking-tight">Real user review highlights</h2>
          <CmsRichText content={product.reviewHighlights} />
        </section>
      ) : null}

      {faqItems.length > 0 ? (
        <section className="space-y-3 rounded-xl border bg-gradient-to-br from-card to-teal-500/[0.03] p-5">
          <h2 className="text-lg font-semibold tracking-tight">FAQ</h2>
          {faqItems.map((item, idx) => (
            <article key={`${item.question ?? "faq"}-${idx}`} className="rounded-md border bg-background p-3">
              <p className="font-medium">{item.question}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                <CmsRichText content={item.answer} />
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {product.methodology ? (
        <section className="space-y-2 rounded-xl border bg-gradient-to-br from-card to-sky-500/[0.03] p-5">
          <h2 className="text-lg font-semibold tracking-tight">Methodology</h2>
          <CmsRichText content={product.methodology} />
        </section>
      ) : null}

      {sourceRows.length > 0 ? (
        <section className="space-y-2 rounded-xl border bg-gradient-to-br from-card to-blue-500/[0.03] p-5">
          <h2 className="text-lg font-semibold tracking-tight">Sources</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {sourceRows.map((row, idx) => (
              <li key={`${row.sourceName ?? "source"}-${idx}`}>
                {row.url ? (
                  <a href={row.url} className="underline underline-offset-4" target="_blank" rel="noreferrer">
                    {row.sourceName}
                  </a>
                ) : (
                  row.sourceName
                )}
                {row.publishedAt ? ` (${new Date(row.publishedAt).toLocaleDateString()})` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border bg-gradient-to-br from-card to-cyan-500/[0.02] p-5">
        <h2 className="text-lg font-semibold tracking-tight">Continue exploring</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          {category ? (
            <Link href={`/insurance/${category.slug}`} className="underline underline-offset-4">
              Back to {category.title}
            </Link>
          ) : (
            <Link href="/insurance" className="underline underline-offset-4">
              Insurance categories
            </Link>
          )}
          <Link href="/guides" className="underline underline-offset-4">
            Guides
          </Link>
        </div>
      </section>
    </div>
  );
}
