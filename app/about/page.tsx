import type { Metadata } from "next";

import { CmsRichText } from "@/components/cms-rich-text";
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

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <h1 className="text-3xl font-semibold tracking-tight">{cmsPage?.title ?? "About Us"}</h1>
      {cmsPage?.content ? (
        <div className="max-w-3xl">
          <CmsRichText content={cmsPage.content} />
        </div>
      ) : (
        <p className="max-w-3xl text-muted-foreground">
          Insurhi provides practical insurance education and comparison guidance for users across
          North America, Europe, and Australia.
        </p>
      )}
    </div>
  );
}
