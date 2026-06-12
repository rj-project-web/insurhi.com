import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ShieldCheck, Users } from "lucide-react";

import { CmsRichText, extractCmsText } from "@/components/cms-rich-text";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand, InsurancePanel } from "@/components/insurance-page-band";
import { StaticPageHero } from "@/components/static-page-hero";
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

const fallbackPillars = [
  {
    title: "Coverage clarity",
    body: "We summarize what is covered, the key exclusions, and which scenarios matter most for typical readers.",
  },
  {
    title: "Pricing context",
    body: "We present pricing as ranges and scenarios instead of a single headline number, so readers can map cost to their situation.",
  },
  {
    title: "Claim experience",
    body: "We highlight claim workflow expectations, documented SLA behavior, and common reasons for delay or denial.",
  },
  {
    title: "Consumer suitability",
    body: "We describe who each option fits and who should look elsewhere, instead of declaring one universal winner.",
  },
];

export default async function MethodologyPage() {
  const cmsPage = await getPageBySlug("methodology");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Methodology", path: "/methodology" },
  ]);

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <StaticPageHero
          eyebrow="Methodology"
          title={cmsPage?.title ?? "Editorial methodology"}
          description="We review insurance products and providers using a consistent framework: coverage clarity, pricing transparency, claim experience, and consumer suitability. Rankings are not paid placements."
        >
          <div className="flex flex-wrap gap-2 text-sm">
            <Link
              href="/insurance"
              className="rounded-full border bg-background/90 px-3 py-1.5 transition-colors hover:bg-accent"
            >
              Insurance categories
            </Link>
            <Link
              href="/products"
              className="rounded-full border bg-background/90 px-3 py-1.5 transition-colors hover:bg-accent"
            >
              Browse products
            </Link>
            <Link
              href="/providers"
              className="rounded-full border bg-background/90 px-3 py-1.5 transition-colors hover:bg-accent"
            >
              Browse providers
            </Link>
          </div>
        </StaticPageHero>
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <InsurancePanel className="p-6 sm:p-8">
          {cmsPage?.content ? (
            <CmsRichText content={cmsPage.content} />
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {fallbackPillars.map((pillar) => (
                  <article key={pillar.title} className="rounded-xl border bg-background p-4">
                    <p className="font-medium text-foreground">{pillar.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{pillar.body}</p>
                  </article>
                ))}
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Ratings and summaries are informational. Always validate against official policy wording
                and your local regulatory guidance before purchase decisions.
              </p>
            </div>
          )}
        </InsurancePanel>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
          description="See the methodology in action across products, providers, and editorial reviews."
          paths={[
            {
              key: "products",
              icon: ShieldCheck,
              title: "Product reviews",
              description: "Compare policies with pros, cons, and premium estimates.",
              href: "/products",
            },
            {
              key: "authors",
              icon: Users,
              title: "Editorial team",
              description: "Meet the reviewers who fact-check our content.",
              href: "/authors",
            },
            {
              key: "guides",
              icon: BookOpen,
              title: "Buying guides",
              description: "Category playbooks built on the same review framework.",
              href: "/guides",
            },
          ]}
        />
      </InsurancePageBand>
    </div>
  );
}
