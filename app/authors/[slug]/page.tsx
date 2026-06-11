import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ClipboardCheck, ShieldCheck, Sparkles } from "lucide-react";

import type { CmsAuthor } from "@/lib/cms-client";
import {
  getArticlesList,
  getAuthorBySlug,
  getAuthors,
  getClaimsGuidesList,
  getProducts,
} from "@/lib/cms-client";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildMetadata,
  buildPersonJsonLd,
} from "@/lib/seo";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

function reviewedBySlug(reviewedBy?: string | { slug?: string } | null): string | undefined {
  if (!reviewedBy || typeof reviewedBy === "string") return undefined;
  return reviewedBy.slug;
}

export async function generateStaticParams() {
  const authors = await getAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return buildMetadata({
      title: "Editorial team",
      description: "Meet the Insurhi editorial reviewers.",
      path: "/authors",
    });
  }

  return buildMetadata({
    title: `${author.name} — Insurhi reviewer`,
    description:
      author.credentials ??
      `${author.name} reviews Insurhi insurance guides, product comparisons, and claims help.`,
    path: `/authors/${author.slug}`,
    ogImagePath: null,
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const [articles, claimsGuides, products] = await Promise.all([
    getArticlesList(),
    getClaimsGuidesList(),
    getProducts(),
  ]);

  const reviewedGuides = articles.filter((item) => reviewedBySlug(item.reviewedBy) === author.slug);
  const reviewedClaims = claimsGuides.filter(
    (item) => Boolean(item.slug) && reviewedBySlug(item.reviewedBy) === author.slug,
  );
  const reviewedProducts = products.filter(
    (item) => reviewedBySlug(item.reviewedBy) === author.slug,
  );

  const authorUrl = absoluteUrl(`/authors/${author.slug}`);
  const personJsonLd = buildPersonJsonLd({
    name: author.name,
    url: authorUrl,
    jobTitle: author.role,
    description: author.credentials,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Editorial team", path: "/authors" },
    { name: author.name, path: `/authors/${author.slug}` },
  ]);

  const totalReviewed = reviewedGuides.length + reviewedClaims.length + reviewedProducts.length;

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="space-y-4 rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-800/[0.06] via-sky-500/[0.03] to-card p-6 lg:p-8">
        <p className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="mr-1 h-3.5 w-3.5 text-cyan-600" />
          Editorial team
        </p>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-800 to-cyan-600 text-2xl font-bold text-white">
            {author.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{author.name}</h1>
            {author.role ? <p className="text-sm text-muted-foreground">{author.role}</p> : null}
          </div>
        </div>
        {author.credentials ? (
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">{author.credentials}</p>
        ) : null}
        <p className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-600" />
            {totalReviewed} pieces reviewed
          </span>
          <Link href="/methodology" className="underline-offset-4 hover:underline">
            Editorial methodology
          </Link>
        </p>
      </section>

      {reviewedGuides.length > 0 ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <BookOpen className="h-5 w-5 text-cyan-600" />
            Guides reviewed
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {reviewedGuides.map((guide) => (
              <li key={guide.id} className="rounded-xl border bg-background p-4 transition-colors hover:bg-accent">
                <Link href={`/guides/${guide.slug}`} className="font-medium">
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {reviewedProducts.length > 0 ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <ShieldCheck className="h-5 w-5 text-cyan-600" />
            Product reviews
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {reviewedProducts.map((product) => (
              <li key={product.id} className="rounded-xl border bg-background p-4 transition-colors hover:bg-accent">
                <Link href={`/products/${product.slug}`} className="font-medium">
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {reviewedClaims.length > 0 ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <ClipboardCheck className="h-5 w-5 text-cyan-600" />
            Claims guides reviewed
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {reviewedClaims.map((guide) => (
              <li key={guide.id} className="rounded-xl border bg-background p-4 transition-colors hover:bg-accent">
                <Link href={`/claims/guides/${guide.slug}`} className="font-medium">
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {totalReviewed === 0 ? (
        <p className="rounded-xl border bg-background p-4 text-sm text-muted-foreground">
          Reviewed content from {author.name} will appear here as it is published.
        </p>
      ) : null}

      <AuthorsFooterNav current={author} />
    </div>
  );
}

async function AuthorsFooterNav({ current }: { current: CmsAuthor }) {
  const authors = await getAuthors();
  const others = authors.filter((author) => author.slug !== current.slug);
  if (others.length === 0) return null;

  return (
    <section className="space-y-3 border-t pt-6">
      <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">More reviewers</h2>
      <div className="flex flex-wrap gap-2">
        {others.map((author) => (
          <Link
            key={author.id}
            href={`/authors/${author.slug}`}
            className="rounded-full border bg-background px-3 py-1 text-sm transition-colors hover:bg-accent"
          >
            {author.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
