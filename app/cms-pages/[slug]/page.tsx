import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CmsRichText, extractCmsText } from "@/components/cms-rich-text";
import { getAllPages, getPageBySlug } from "@/lib/cms-client";
import { CMS_PAGE_FIXED_PATHS, isFixedCmsPageSlug } from "@/lib/cms-page-routes";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type CmsPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages.filter((page) => !isFixedCmsPageSlug(page.slug)).map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: CmsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return buildMetadata({
      title: "Page",
      description: "Site page content from the CMS.",
      path: "/",
    });
  }

  return buildMetadata({
    title: page.seo?.metaTitle ?? page.title,
    description: page.seo?.metaDescription ?? extractCmsText(page.content).slice(0, 160),
    path: `/cms-pages/${slug}`,
  });
}

export default async function CmsDynamicPage({ params }: CmsPageProps) {
  const { slug } = await params;

  if (isFixedCmsPageSlug(slug)) {
    redirect(CMS_PAGE_FIXED_PATHS[slug]);
  }

  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "CMS pages", path: "/content-map" },
    { name: page.title, path: `/cms-pages/${slug}` },
  ]);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="space-y-3">
        <p className="text-sm text-muted-foreground">CMS page / {slug}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1>
      </section>

      <section className="max-w-3xl text-foreground/90">
        <CmsRichText content={page.content} />
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold tracking-tight">Continue exploring</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <Link href="/content-map" className="underline underline-offset-4">
            Content map
          </Link>
          <Link href="/" className="underline underline-offset-4">
            Home
          </Link>
        </div>
      </section>
    </div>
  );
}
