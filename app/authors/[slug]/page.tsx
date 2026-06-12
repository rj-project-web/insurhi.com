import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ClipboardCheck, ShieldCheck, Users } from "lucide-react";

import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand, InsurancePanel } from "@/components/insurance-page-band";
import { StaticPageHero } from "@/components/static-page-hero";
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

function ReviewedSection({
  id,
  title,
  icon: Icon,
  items,
}: {
  id: string;
  title: string;
  icon: typeof BookOpen;
  items: Array<{ id: string; label: string; href: string }>;
}) {
  if (items.length === 0) return null;

  return (
    <InsurancePanel id={id} className="p-6 sm:p-8">
      <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
        <Icon className="h-5 w-5 text-sky-600" aria-hidden />
        {title}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="block rounded-xl border bg-background p-4 font-medium transition-colors hover:border-sky-300/60 hover:bg-accent"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </InsurancePanel>
  );
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) notFound();

  const [articles, claimsGuides, products, allAuthors] = await Promise.all([
    getArticlesList(),
    getClaimsGuidesList(),
    getProducts(),
    getAuthors(),
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
  const others = allAuthors.filter((item) => item.slug !== author.slug);

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <StaticPageHero eyebrow="Editorial team" title={author.name} description={author.credentials ?? undefined}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-800 to-sky-600 text-2xl font-bold text-white">
              {author.name.charAt(0)}
            </div>
            <div className="space-y-1">
              {author.role ? <p className="text-sm text-muted-foreground">{author.role}</p> : null}
              <p className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-sky-600" aria-hidden />
                  {totalReviewed} pieces reviewed
                </span>
                <Link href="/methodology" className="text-sky-800 underline-offset-4 hover:underline dark:text-sky-400">
                  Editorial methodology
                </Link>
              </p>
            </div>
          </div>
        </StaticPageHero>
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <div className="space-y-6">
          <ReviewedSection
            id="guides-reviewed"
            title="Guides reviewed"
            icon={BookOpen}
            items={reviewedGuides.map((guide) => ({
              id: guide.id,
              label: guide.title,
              href: `/guides/${guide.slug}`,
            }))}
          />
          <ReviewedSection
            id="products-reviewed"
            title="Product reviews"
            icon={ShieldCheck}
            items={reviewedProducts.map((product) => ({
              id: product.id,
              label: product.name,
              href: `/products/${product.slug}`,
            }))}
          />
          <ReviewedSection
            id="claims-reviewed"
            title="Claims guides reviewed"
            icon={ClipboardCheck}
            items={reviewedClaims.map((guide) => ({
              id: guide.id,
              label: guide.title,
              href: `/claims/guides/${guide.slug}`,
            }))}
          />

          {totalReviewed === 0 ? (
            <InsurancePanel className="p-5">
              <p className="text-sm text-muted-foreground">
                Reviewed content from {author.name} will appear here as it is published.
              </p>
            </InsurancePanel>
          ) : null}
        </div>
      </InsurancePageBand>

      {others.length > 0 ? (
        <InsurancePageBand tone="accent" innerClassName="py-8 sm:py-10">
          <InsurancePanel className="p-6">
            <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">More reviewers</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {others.map((item) => (
                <Link
                  key={item.id}
                  href={`/authors/${item.slug}`}
                  className="rounded-full border bg-background px-3 py-1 text-sm transition-colors hover:bg-accent"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </InsurancePanel>
        </InsurancePageBand>
      ) : null}

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
          description="Explore more editorial content and research standards."
          paths={[
            {
              key: "authors",
              icon: Users,
              title: "All reviewers",
              description: "Browse the full editorial team directory.",
              href: "/authors",
            },
            {
              key: "methodology",
              icon: ShieldCheck,
              title: "Editorial methodology",
              description: "How we score coverage, pricing, and claims quality.",
              href: "/methodology",
            },
            {
              key: "guides",
              icon: BookOpen,
              title: "Buying guides",
              description: "Category playbooks reviewed by our team.",
              href: "/guides",
            },
          ]}
        />
      </InsurancePageBand>
    </div>
  );
}
