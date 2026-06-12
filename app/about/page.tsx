import type { Metadata } from "next";
import { BookOpen, Mail, ShieldCheck } from "lucide-react";

import { CmsRichText } from "@/components/cms-rich-text";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand, InsurancePanel } from "@/components/insurance-page-band";
import { StaticPageHero } from "@/components/static-page-hero";
import { getPageBySlug } from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("about");
  const title = page?.seo?.metaTitle ?? "About Us";
  const description =
    page?.seo?.metaDescription ??
    "Insurhi provides practical insurance education and comparison guidance for users across North America, Europe, and Australia.";

  return buildMetadata({
    title,
    description,
    path: "/about",
  });
}

export default async function AboutPage() {
  const cmsPage = await getPageBySlug("about");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  const fallbackDescription =
    "Insurhi provides practical insurance education and comparison guidance for users across North America, Europe, and Australia.";

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <StaticPageHero
          eyebrow="About"
          title={cmsPage?.title ?? "About Insurhi"}
          description={cmsPage?.seo?.metaDescription ?? fallbackDescription}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <InsurancePanel className="p-6 sm:p-8">
          {cmsPage?.content ? (
            <div className="max-w-3xl">
              <CmsRichText content={cmsPage.content} />
            </div>
          ) : (
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">{fallbackDescription}</p>
          )}
        </InsurancePanel>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
          description="Learn how we research coverage, meet the editorial team, or reach out with questions."
          paths={[
            {
              key: "methodology",
              icon: ShieldCheck,
              title: "Editorial methodology",
              description: "How we review products, providers, and claims guidance.",
              href: "/methodology",
            },
            {
              key: "authors",
              icon: BookOpen,
              title: "Editorial team",
              description: "Meet the reviewers behind our guides and comparisons.",
              href: "/authors",
            },
            {
              key: "contact",
              icon: Mail,
              title: "Contact",
              description: "Editorial corrections, support, and partnership inquiries.",
              href: "/contact",
            },
          ]}
        />
      </InsurancePageBand>
    </div>
  );
}
