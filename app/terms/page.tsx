import type { Metadata } from "next";

import { CmsRichText } from "@/components/cms-rich-text";
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
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <h1 className="text-3xl font-semibold tracking-tight">{cmsPage?.title ?? "Terms of Service"}</h1>
      {cmsPage?.content ? (
        <div className="max-w-3xl">
          <CmsRichText content={cmsPage.content} />
        </div>
      ) : (
        <p className="max-w-3xl text-muted-foreground">
          Terms placeholder. This page will contain legal terms, disclaimers, and usage conditions for
          insurhi.com.
        </p>
      )}
    </div>
  );
}
