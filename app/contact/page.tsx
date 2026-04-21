import type { Metadata } from "next";

import { getPageBySlug } from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("contact");
  const title = page?.seo?.metaTitle ?? "Contact";
  const description =
    page?.seo?.metaDescription ??
    "Contact channel for editorial, support, and partnership inquiries.";

  return buildMetadata({
    title,
    description,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const cmsPage = await getPageBySlug("contact");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <h1 className="text-3xl font-semibold tracking-tight">{cmsPage?.title ?? "Contact"}</h1>
      {cmsPage?.content ? (
        <div className="max-w-3xl whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
          {cmsPage.content}
        </div>
      ) : (
        <p className="max-w-3xl text-muted-foreground">
          Contact channel placeholder for editorial, support, and partnership inquiries.
        </p>
      )}
    </div>
  );
}
