import type { Metadata } from "next";

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
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <h1 className="text-3xl font-semibold tracking-tight">{cmsPage?.title ?? "Privacy Policy"}</h1>
      {cmsPage?.content ? (
        <div className="max-w-3xl whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
          {cmsPage.content}
        </div>
      ) : (
        <p className="max-w-3xl text-muted-foreground">
          Privacy policy placeholder. This page will be expanded with data collection, processing,
          retention, and user rights details.
        </p>
      )}
    </div>
  );
}
