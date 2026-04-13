import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import { getArticleBySlug, getLatestArticles } from "@/lib/cms-client";
import { absoluteUrl, buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type GuideDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = await getLatestArticles();
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
    title: article.title,
    description: `Read ${article.title} to understand key insurance decisions and next actions.`,
    path: `/guides/${article.slug}`,
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
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    mainEntityOfPage: absoluteUrl(`/guides/${article.slug}`),
    url: absoluteUrl(`/guides/${article.slug}`),
  };

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <section className="space-y-3">
        <p className="text-sm text-muted-foreground">Guides / {article.slug}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{article.title}</h1>
        <p className="max-w-3xl text-muted-foreground">
          Full article rendering will be connected to rich text content in the next pass.
          This route is now ready for SEO and internal linking.
        </p>
      </section>

      <AdSlot slotId="ad_in_content_1" />

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold tracking-tight">Continue exploring</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <Link href="/guides" className="underline underline-offset-4">
            Back to guides
          </Link>
          <Link href="/claims" className="underline underline-offset-4">
            Claims assistance
          </Link>
          <Link href="/insurance" className="underline underline-offset-4">
            Insurance categories
          </Link>
        </div>
      </section>
    </div>
  );
}
