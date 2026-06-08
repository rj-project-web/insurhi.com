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
import { CATEGORY_SLUGS, categoryContentHubs } from "@/lib/category-content-hub";

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

function shortenTitle(title: string, max = 64): string {
  const trimmed = title.trim();
  const colonIndex = trimmed.indexOf(":");
  if (colonIndex > 0 && colonIndex <= max) {
    return trimmed.slice(0, colonIndex);
  }
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trim()}…`;
}

function guideSubtitle(article: CmsArticle): string {
  const author = resolveAuthor(article.reviewedBy);
  if (author?.name) {
    const creds = author.credentials ? `, ${author.credentials}` : author.role ? `, ${author.role}` : "";
    return `Written by ${author.name}${creds}`;
  }
  const reviewed = formatDate(article.lastReviewedAt);
  if (reviewed) return `Fact-checked · Updated ${reviewed}`;
  const published = formatDate(article.publishedAt ?? article.updatedAt ?? article.createdAt);
  if (published) return `Published ${published}`;
  return "Editorial guide";
}

function claimsSubtitle(guide: CmsClaimsGuide): string {
  const parts: string[] = ["Claims playbook"];
  if (guide.steps?.length) parts.push(`${guide.steps.length} steps`);
  const reviewed = formatDate(guide.lastReviewedAt ?? guide.updatedAt);
  if (reviewed) parts.push(`Updated ${reviewed}`);
  return parts.join(" · ");
}

function caseSubtitle(claimCase: CmsClaimCase): string {
  const scenario = claimCase.scenario?.trim();
  if (scenario && scenario.toLowerCase() !== claimCase.title.trim().toLowerCase()) {
    if (scenario.length <= 72) return scenario;
    return `${scenario.slice(0, 69)}…`;
  }
  if (claimCase.outcome?.trim()) {
    const outcome = claimCase.outcome.trim();
    return outcome.length <= 72 ? outcome : `${outcome.slice(0, 69)}…`;
  }
  return "Case study";
}

function buildGuideItems(articles: CmsArticle[]): FeedItem[] {
  return articles.slice(0, 5).map((article) => ({
    key: `guide-${article.id}`,
    title: article.title,
    subtitle: guideSubtitle(article),
    href: `/guides/${article.slug}`,
  }));
}

function buildClaimsItems(claimsGuides: CmsClaimsGuide[], claimCases: CmsClaimCase[]): FeedItem[] {
  const items: FeedItem[] = [];
  for (let i = 0; items.length < 5; i++) {
    const guide = claimsGuides[i];
    const claimCase = claimCases[i];
    if (guide) {
      items.push({
        key: `claim-guide-${guide.id}`,
        title: shortenTitle(guide.title),
        subtitle: claimsSubtitle(guide),
        href: guide.slug ? `/claims/guides/${guide.slug}` : "/claims",
      });
    }
    if (claimCase && items.length < 5) {
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

function productMarketSubtitle(product: CmsProduct): string {
  if (product.priceRange) return product.priceRange;
  if (product.oneLineVerdict) return product.oneLineVerdict.slice(0, 72);
  return "Product review";
}

function buildMarketItems(products: CmsProduct[], providers: CmsProvider[]): FeedItem[] {
  const items: FeedItem[] = [];

  for (const slug of CATEGORY_SLUGS) {
    const flagshipSlug = categoryContentHubs[slug].flagshipProduct.slug;
    const product = products.find((item) => item.slug === flagshipSlug);
    if (product) {
      items.push({
        key: `product-${product.id}`,
        title: categoryContentHubs[slug].flagshipProduct.label,
        subtitle: productMarketSubtitle(product),
        href: `/products/${product.slug}`,
      });
    }
  }

  if (items.length < 5) {
    for (const provider of providers) {
      if (!provider.slug || items.length >= 5) break;
      if (items.some((item) => item.href === `/providers/${provider.slug}`)) continue;
      items.push({
        key: `provider-${provider.id}`,
        title: provider.name,
        subtitle:
          provider.summary?.slice(0, 72) ??
          (provider.rating ? `Service quality · ${provider.rating}/5` : "Provider profile"),
        href: `/providers/${provider.slug}`,
      });
    }
  }

  return items.slice(0, 5);
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
    <article className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-500/25 dark:bg-card">
      <p className="flex items-center gap-2 text-sm font-semibold text-blue-900 dark:text-blue-100">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        {title}
      </p>
      {items.length ? (
        <ul className="mt-4 space-y-4">
          {items.map((item) => (
            <li key={item.key}>
              <Link href={item.href} className="group block">
                <p className="text-sm font-medium leading-snug text-foreground group-hover:text-sky-800 group-hover:underline group-hover:underline-offset-4 dark:group-hover:text-sky-400">
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
    <section aria-label="Editorial updates" className="grid gap-4 lg:grid-cols-3">
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
    </section>
  );
}
