import type { Metadata } from "next";
import { FileText, Home, ShieldCheck } from "lucide-react";

import { CmsRichText } from "@/components/cms-rich-text";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand, InsurancePanel } from "@/components/insurance-page-band";
import { StaticPageHero } from "@/components/static-page-hero";
import { getPageBySlug } from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("privacy-policy");
  const title = page?.seo?.metaTitle ?? "Privacy Policy";
  const description =
    page?.seo?.metaDescription ??
    "How Insurhi collects, processes, and retains personal data, and the rights available to you.";

  return buildMetadata({
    title,
    description,
    path: "/privacy-policy",
  });
}

export default async function PrivacyPolicyPage() {
  const cmsPage = await getPageBySlug("privacy-policy");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy-policy" },
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
          title={cmsPage?.title ?? "Privacy Policy"}
          description="How Insurhi collects, processes, and retains personal data, and the rights available to you."
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
              Privacy policy placeholder. This page will be expanded with data collection, processing,
              retention, and user rights details.
            </p>
          )}
        </InsurancePanel>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
          title="Related policies"
          description="Review terms of service and return to the main site."
          paths={[
            {
              key: "terms",
              icon: FileText,
              title: "Terms of service",
              description: "Legal terms, disclaimers, and usage conditions.",
              href: "/terms",
            },
            {
              key: "contact",
              icon: ShieldCheck,
              title: "Contact",
              description: "Privacy-related inquiries and data requests.",
              href: "/contact",
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
