import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { FileText, Home, Map } from "lucide-react";

import { CmsRichText, extractCmsText } from "@/components/cms-rich-text";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand, InsurancePanel } from "@/components/insurance-page-band";
import { StaticPageHero } from "@/components/static-page-hero";
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
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <StaticPageHero
          eyebrow="CMS page"
          title={page.title}
          description={`Published from CMS · slug: ${slug}`}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <InsurancePanel className="p-6 sm:p-8">
          <div className="max-w-3xl text-foreground/90">
            <CmsRichText content={page.content} />
          </div>
        </InsurancePanel>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
          title="Continue exploring"
          description="Internal navigation for CMS QA and site browsing."
          paths={[
            {
              key: "content-map",
              icon: Map,
              title: "Content map",
              description: "Index of CMS collections and public URLs.",
              href: "/content-map",
            },
            {
              key: "about",
              icon: FileText,
              title: "About",
              description: "Editorial mission and site overview.",
              href: "/about",
            },
            {
              key: "home",
              icon: Home,
              title: "Home",
              description: "Return to the main insurance hub.",
              href: "/",
            },
          ]}
        />
      </InsurancePageBand>
    </div>
  );
}
