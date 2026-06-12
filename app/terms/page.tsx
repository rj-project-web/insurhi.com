import type { Metadata } from "next";
import { FileText, Home, ShieldCheck } from "lucide-react";

import { CmsRichText } from "@/components/cms-rich-text";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand, InsurancePanel } from "@/components/insurance-page-band";
import { StaticPageHero } from "@/components/static-page-hero";
import { getPageBySlug } from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("terms");
  const title = page?.seo?.metaTitle ?? "Terms of Service";
  const description =
    page?.seo?.metaDescription ??
    "Legal terms, disclaimers, and usage conditions for insurhi.com.";

  return buildMetadata({
    title,
    description,
    path: "/terms",
  });
}

export default async function TermsPage() {
  const cmsPage = await getPageBySlug("terms");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Terms of Service", path: "/terms" },
  ]);

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <StaticPageHero
          eyebrow="Legal"
          title={cmsPage?.title ?? "Terms of Service"}
          description="Legal terms, disclaimers, and usage conditions for insurhi.com."
        />
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <InsurancePanel className="p-6 sm:p-8">
          {cmsPage?.content ? (
            <div className="max-w-3xl">
              <CmsRichText content={cmsPage.content} />
            </div>
          ) : (
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">
              Terms placeholder. This page will contain legal terms, disclaimers, and usage conditions
              for insurhi.com.
            </p>
          )}
        </InsurancePanel>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
          title="Related policies"
          description="Review privacy practices and return to the main site."
          paths={[
            {
              key: "privacy",
              icon: ShieldCheck,
              title: "Privacy policy",
              description: "How we collect, process, and retain personal data.",
              href: "/privacy-policy",
            },
            {
              key: "about",
              icon: FileText,
              title: "About Insurhi",
              description: "Editorial mission and site overview.",
              href: "/about",
            },
            {
              key: "home",
              icon: Home,
              title: "Home",
              description: "Return to insurance comparisons and guides.",
              href: "/",
            },
          ]}
        />
      </InsurancePageBand>
    </div>
  );
}
