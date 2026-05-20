import type { Metadata } from "next";
import Link from "next/link";
import { CmsRichText, extractCmsText } from "@/components/cms-rich-text";
import { getPageBySlug } from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("methodology");

  return buildMetadata({
    title:
      cmsPage?.seo?.metaTitle ??
      "Editorial Methodology | How Insurhi Reviews Insurance Products & Providers",
    description:
      cmsPage?.seo?.metaDescription ??
      (cmsPage
        ? extractCmsText(cmsPage.content).slice(0, 160)
        : "Insurhi reviews insurance products and providers using a transparent framework: coverage clarity, pricing context, claim quality, and consumer suitability."),
    path: "/methodology",
  });
}

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Methodology", path: "/methodology" },
]);

export default async function MethodologyPage() {
  const cmsPage = await getPageBySlug("methodology");

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="rounded-2xl border bg-gradient-to-br from-card via-emerald-500/[0.05] to-cyan-500/[0.04] p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Insurhi / Methodology
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{cmsPage?.title ?? "Editorial methodology"}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          We review insurance products and providers using a consistent framework: coverage clarity, pricing
          transparency, claim experience, and consumer suitability. Rankings are not paid placements.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link
            href="/insurance"
            className="rounded-full border bg-background px-3 py-1.5 transition-colors hover:bg-accent"
          >
            Insurance categories
          </Link>
          <Link
            href="/products"
            className="rounded-full border bg-background px-3 py-1.5 transition-colors hover:bg-accent"
          >
            Browse products
          </Link>
          <Link
            href="/providers"
            className="rounded-full border bg-background px-3 py-1.5 transition-colors hover:bg-accent"
          >
            Browse providers
          </Link>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        {cmsPage?.content ? (
          <CmsRichText content={cmsPage.content} />
        ) : (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Coverage clarity.</span> We summarize what is covered, the
              key exclusions, and which scenarios matter most for typical readers.
            </p>
            <p>
              <span className="font-medium text-foreground">Pricing context.</span> We present pricing as ranges and
              scenarios instead of a single headline number, so readers can map cost to their situation.
            </p>
            <p>
              <span className="font-medium text-foreground">Claim experience.</span> We highlight claim workflow
              expectations, documented SLA behavior, and common reasons for delay or denial.
            </p>
            <p>
              <span className="font-medium text-foreground">Consumer suitability.</span> We describe who each option
              fits and who should look elsewhere, instead of declaring one universal winner.
            </p>
            <p>
              Ratings and summaries are informational. Always validate against official policy wording and your local
              regulatory guidance before purchase decisions.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
