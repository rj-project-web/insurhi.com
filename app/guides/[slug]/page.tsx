import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CmsRichText, extractCmsText } from "@/components/cms-rich-text";
import { EditorialDisclosure } from "@/components/editorial-disclosure";
import { GuideArticleHero } from "@/components/guide-article-hero";
import { GuideArticleSidebar } from "@/components/guide-article-sidebar";
import { GuideKeyTakeaways } from "@/components/guide-key-takeaways";
import { GuideQuickPaths } from "@/components/guide-quick-paths";
import { InsurancePageBand, InsurancePanel } from "@/components/insurance-page-band";
import { RelatedContentPanel } from "@/components/related-content-panel";
import { getArticleBySlug, getArticlesList } from "@/lib/cms-client";
import {
  estimateReadMinutes,
  extractCmsHeadings,
  getArticleLede,
  getArticleListItems,
} from "@/lib/cms-content-utils";
import { getRelatedContentForGuide } from "@/lib/content-links";
import {
  absoluteUrl,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildMetadata,
} from "@/lib/seo";

type GuideDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function inferInsuranceCategoryPath(slug: string, title: string): string {
  const text = `${slug} ${title}`.toLowerCase();
  if (text.includes("auto") || text.includes("car")) return "/insurance/auto";
  if (text.includes("life")) return "/insurance/life";
  if (text.includes("home")) return "/insurance/home";
  if (text.includes("pet")) return "/insurance/pet";
  if (text.includes("medicare") || text.includes("medigap")) return "/insurance/medicare";
  if (text.includes("renters") || text.includes("renter")) return "/insurance/renters";
  return "/insurance";
}

function categorySlugFromArticle(category: unknown): string | null {
  if (!category) return null;
  if (typeof category === "string") return category;
  if (typeof category === "object") return (category as { slug?: string }).slug ?? null;
  return null;
}

function categoryTitleFromArticle(category: unknown): string | null {
  if (!category || typeof category !== "object") return null;
  return (category as { title?: string }).title ?? null;
}

export async function generateStaticParams() {
  const articles = await getArticlesList();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: GuideDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return buildMetadata({
      title: "Insurance Guide",
      description: "Insurance learning resource.",
      path: "/guides",
    });
  }

  return buildMetadata({
    title: article.seo?.metaTitle ?? article.title,
    description:
      article.seo?.metaDescription ??
      `Read ${article.title} to understand key insurance decisions and next actions.`,
    path: `/guides/${article.slug}`,
    ogImagePath: null,
  });
}

export default async function GuideDetailPage({ params }: GuideDetailPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: article.title, path: `/guides/${article.slug}` },
  ]);
  const reviewerAuthor =
    typeof article.reviewedBy === "object" && article.reviewedBy?.name ? article.reviewedBy : undefined;
  const articleJsonLd = buildArticleJsonLd({
    headline: article.title,
    url: absoluteUrl(`/guides/${article.slug}`),
    datePublished: article.publishedAt ?? article.createdAt,
    dateModified: article.lastReviewedAt ?? article.updatedAt ?? article.publishedAt ?? article.createdAt,
    description: article.seo?.metaDescription,
    authorName: reviewerAuthor?.name,
    authorUrl: reviewerAuthor?.slug ? absoluteUrl(`/authors/${reviewerAuthor.slug}`) : undefined,
    authorJobTitle: reviewerAuthor?.role,
  });

  const categorySlug = categorySlugFromArticle(article.category);
  const categoryTitle = categoryTitleFromArticle(article.category);
  const categoryPath = inferInsuranceCategoryPath(article.slug, article.title);
  const relatedContent = getRelatedContentForGuide(article.slug, article.category);

  const lede = getArticleLede(article.body) ?? extractCmsText(article.body).slice(0, 220);
  const summary = article.seo?.metaDescription ?? lede;
  const headings = extractCmsHeadings(article.body);
  const keyTakeaways = getArticleListItems(article.body, 3);
  const readMinutes = estimateReadMinutes(article.body);

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <GuideArticleHero
          title={article.title}
          summary={summary}
          categorySlug={categorySlug}
          categoryTitle={categoryTitle}
          readMinutes={readMinutes}
          updatedAt={article.updatedAt}
          publishedAt={article.publishedAt}
          createdAt={article.createdAt}
          reviewedBy={article.reviewedBy}
          lastReviewedAt={article.lastReviewedAt}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 space-y-6">
            <GuideKeyTakeaways items={keyTakeaways} />

            <InsurancePanel className="p-6 sm:p-8">
              {article.body ? (
                <CmsRichText
                  content={article.body}
                  className="text-base leading-7 text-foreground/90 [&_p:first-of-type]:text-lg [&_p:first-of-type]:leading-8 [&_p:first-of-type]:text-muted-foreground"
                />
              ) : (
                <p className="text-muted-foreground">
                  This article has no published body content yet.
                </p>
              )}
            </InsurancePanel>
          </div>

          <GuideArticleSidebar
            headings={headings}
            categorySlug={categorySlug}
            categoryTitle={categoryTitle}
          />
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <div className="space-y-8">
          <EditorialDisclosure />
          <RelatedContentPanel bundle={relatedContent} />
          <GuideQuickPaths
            categorySlug={categorySlug}
            categoryTitle={categoryTitle}
            fallbackCategoryPath={categoryPath}
          />
        </div>
      </InsurancePageBand>
    </div>
  );
}
