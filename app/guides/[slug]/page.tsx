import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";

import { CmsRichText } from "@/components/cms-rich-text";
import { getArticleBySlug, getArticlesList } from "@/lib/cms-client";
import { absoluteUrl, buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

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

function getArticleParagraphs(article: Awaited<ReturnType<typeof getArticleBySlug>>) {
  const nodes = article?.body?.root?.children ?? [];

  return nodes
    .filter((node) => node.type === "paragraph")
    .map((node) =>
      (node.children ?? [])
        .map((child) => child.text ?? "")
        .join("")
        .trim(),
    )
    .filter(Boolean);
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
  const paragraphs = getArticleParagraphs(article);
  const keyPoints = paragraphs.slice(0, 3);
  const categoryPath = inferInsuranceCategoryPath(article.slug, article.title);

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
      <section className="space-y-4 rounded-2xl border bg-gradient-to-br from-indigo-500/[0.08] via-blue-500/[0.06] to-card p-6 lg:p-8">
        <p className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="mr-1 h-3.5 w-3.5 text-cyan-600" />
          Guides / {article.slug}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">{article.title}</h1>
      </section>

      {keyPoints.length > 0 ? (
        <section className="rounded-xl border bg-gradient-to-r from-cyan-500/[0.08] to-blue-500/[0.04] p-5">
          <h2 className="text-lg font-semibold tracking-tight">Key takeaways</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {keyPoints.map((point, index) => (
              <li key={`${article.id}-takeaway-${index}`} className="rounded-md border bg-background px-3 py-2">
                {point}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-4 rounded-lg border bg-gradient-to-br from-card to-indigo-500/[0.03] p-5">
        {article.body ? (
          <CmsRichText
            content={article.body}
            className="leading-7 text-foreground/90 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_p]:text-base [&_ul]:text-base [&_ol]:text-base"
          />
        ) : (
          <p className="text-muted-foreground">
            This article has no published body content yet.
          </p>
        )}
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold tracking-tight">Continue exploring</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <Link href={categoryPath} className="underline underline-offset-4">
            Related insurance category
          </Link>
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
