import type { Metadata } from "next";

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
        <div className="max-w-3xl whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
          {cmsPage.content}
        </div>
      ) : (
        <p className="max-w-3xl text-muted-foreground">
          Insurhi provides practical insurance education and comparison guidance for users across
          North America, Europe, and Australia.
        </p>
      )}
      {cmsPage?.seo?.metaTitle || cmsPage?.seo?.metaDescription ? (
        <section className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
          <h2 className="text-base font-semibold tracking-tight text-foreground">CMS SEO</h2>
          {cmsPage.seo?.metaTitle ? <p className="mt-2">Meta title: {cmsPage.seo.metaTitle}</p> : null}
          {cmsPage.seo?.metaDescription ? (
            <p className="mt-2">Meta description: {cmsPage.seo.metaDescription}</p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
