import Link from "next/link";
import { BookOpenText, Building2, FileCheck2 } from "lucide-react";

import type {
  CmsArticle,
  CmsClaimCase,
  CmsClaimsGuide,
  CmsProduct,
  CmsProvider,
} from "@/lib/cms-client";
import type { CmsAuthorRef } from "@/components/editorial-disclosure";

type FeedItem = {
  key: string;
  title: string;
  subtitle: string;
  href: string;
};

type HomeLatestFeedProps = {
  articles: CmsArticle[];
  claimsGuides: CmsClaimsGuide[];
  claimCases: CmsClaimCase[];
  products: CmsProduct[];
  providers: CmsProvider[];
};

function formatDate(input?: string): string | null {
  if (!input) return null;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function resolveAuthor(reviewedBy?: string | CmsAuthorRef | null): CmsAuthorRef | null {
  if (!reviewedBy || typeof reviewedBy === "string") return null;
  return reviewedBy;
}

function guideSubtitle(article: CmsArticle): string {
  const author = resolveAuthor(article.reviewedBy);
  if (author?.name) {
    const creds = author.credentials ? `, ${author.credentials}` : author.role ? `, ${author.role}` : "";
    return `Reviewed by ${author.name}${creds}`;
  }
  const reviewed = formatDate(article.lastReviewedAt);
  if (reviewed) return `Last reviewed ${reviewed}`;
  const published = formatDate(article.publishedAt ?? article.updatedAt ?? article.createdAt);
  if (published) return `Published ${published}`;
  return "Editorial guide";
}

function claimsSubtitle(guide: CmsClaimsGuide): string {
  const parts: string[] = [];
  if (guide.steps?.length) parts.push(`${guide.steps.length} steps`);
  if (guide.documentChecklist?.length) parts.push(`${guide.documentChecklist.length} checklist items`);
  const reviewed = formatDate(guide.lastReviewedAt ?? guide.updatedAt);
  if (reviewed) parts.push(`Updated ${reviewed}`);
  return parts.length ? parts.join(" · ") : "Claims playbook";
}

function caseSubtitle(claimCase: CmsClaimCase): string {
  const excerpt = claimCase.scenario?.trim();
  if (excerpt && excerpt.length <= 72) return excerpt;
  if (excerpt) return `${excerpt.slice(0, 69)}…`;
  return "Case study";
}

function buildGuideItems(articles: CmsArticle[]): FeedItem[] {
  return articles.slice(0, 6).map((article) => ({
    key: `guide-${article.id}`,
    title: article.title,
    subtitle: guideSubtitle(article),
    href: `/guides/${article.slug}`,
  }));
}

function buildClaimsItems(claimsGuides: CmsClaimsGuide[], claimCases: CmsClaimCase[]): FeedItem[] {
  const items: FeedItem[] = [];
  for (let i = 0; items.length < 6; i++) {
    const guide = claimsGuides[i];
    const claimCase = claimCases[i];
    if (guide) {
      items.push({
        key: `claim-guide-${guide.id}`,
        title: guide.title,
        subtitle: claimsSubtitle(guide),
        href: guide.slug ? `/claims/guides/${guide.slug}` : "/claims",
      });
    }
    if (claimCase && items.length < 6) {
      items.push({
        key: `claim-case-${claimCase.id}`,
        title: claimCase.title,
        subtitle: caseSubtitle(claimCase),
        href: `/claims/cases/${claimCase.id}`,
      });
    }
    if (!guide && !claimCase) break;
  }
  return items;
}

function buildMarketItems(products: CmsProduct[], providers: CmsProvider[]): FeedItem[] {
  const productItems = products
    .filter((item) => item.slug)
    .map((product) => ({
      key: `product-${product.id}`,
      title: product.name,
      subtitle:
        product.priceRange ??
        product.oneLineVerdict?.slice(0, 72) ??
        product.coverageAmount ??
        "Product review",
      href: `/products/${product.slug}`,
      sortKey: product.updatedAt ?? product.createdAt ?? "",
    }));

  const providerItems = providers
    .filter((item) => item.slug)
    .map((provider) => ({
      key: `provider-${provider.id}`,
      title: provider.name,
      subtitle:
        provider.summary?.slice(0, 72) ??
        (provider.rating ? `Editorial rating ${provider.rating}/5` : "Provider profile"),
      href: `/providers/${provider.slug}`,
      sortKey: "",
    }));

  return [...productItems, ...providerItems]
    .slice(0, 6)
    .map(({ key, title, subtitle, href }) => ({ key, title, subtitle, href }));
}

function FeedColumn({
  title,
  icon: Icon,
  items,
  emptyMessage,
  viewAllHref,
  viewAllLabel,
}: {
  title: string;
  icon: typeof BookOpenText;
  items: FeedItem[];
  emptyMessage: string;
  viewAllHref: string;
  viewAllLabel: string;
}) {
  return (
    <article className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/50 p-4 dark:border-blue-500/25 dark:from-card dark:to-blue-950/20">
      <p className="flex items-center gap-2 text-sm font-semibold text-blue-900 dark:text-blue-100">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        {title}
      </p>
      {items.length ? (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="group block rounded-lg px-1 py-0.5 transition-colors hover:bg-blue-50/80 dark:hover:bg-blue-950/30"
              >
                <p className="text-sm font-medium leading-snug text-foreground group-hover:underline group-hover:underline-offset-4">
                  {item.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.subtitle}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>
      )}
      <Link
        href={viewAllHref}
        className="mt-4 inline-block text-xs font-medium text-sky-800 underline-offset-4 hover:underline dark:text-sky-400"
      >
        {viewAllLabel}
      </Link>
    </article>
  );
}

export function HomeLatestFeed({
  articles,
  claimsGuides,
  claimCases,
  products,
  providers,
}: HomeLatestFeedProps) {
  const guideItems = buildGuideItems(articles);
  const claimsItems = buildClaimsItems(claimsGuides, claimCases);
  const marketItems = buildMarketItems(products, providers);

  return (
    <section
      aria-labelledby="latest-feed-heading"
      className="relative overflow-hidden rounded-2xl border bg-card/90 p-4 lg:p-5"
      style={{ backgroundImage: "url('/home-latest-bg.svg')" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/75 via-blue-50/50 to-sky-50/55 dark:from-slate-950/70 dark:via-blue-950/30 dark:to-sky-950/25" />
      <div className="relative space-y-4">
        <h2
          id="latest-feed-heading"
          className="text-2xl font-semibold tracking-tight text-blue-950 dark:text-blue-50"
        >
          Latest from the editorial desk
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Guides, claims playbooks, and product data pulled live from the CMS — refreshed on each visit.
        </p>
        <div className="grid gap-3 lg:grid-cols-3">
          <FeedColumn
            title="Expert guides"
            icon={BookOpenText}
            items={guideItems}
            emptyMessage="Guides will appear here once published."
            viewAllHref="/guides"
            viewAllLabel="View all guides"
          />
          <FeedColumn
            title="Claims spotlight"
            icon={FileCheck2}
            items={claimsItems}
            emptyMessage="Claims content will appear here once published."
            viewAllHref="/claims"
            viewAllLabel="Open claims center"
          />
          <FeedColumn
            title="Market data"
            icon={Building2}
            items={marketItems}
            emptyMessage="Products and providers will appear here once published."
            viewAllHref="/products"
            viewAllLabel="Browse products"
          />
        </div>
      </div>
    </section>
  );
}
