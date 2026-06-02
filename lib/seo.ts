import type { Metadata } from "next";

import { siteName } from "@/lib/site-data";

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.insurhi.com";
}

export function absoluteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}

export function buildMetadata({ title, description, path }: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: getSiteUrl(),
  };
}

const publisherOrganization = {
  "@type": "Organization" as const,
  name: siteName,
  url: getSiteUrl(),
};

export type ArticleJsonLdInput = {
  headline: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  description?: string;
  authorName?: string;
};

export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  const author =
    input.authorName ?
      { "@type": "Person" as const, name: input.authorName }
    : publisherOrganization;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    mainEntityOfPage: input.url,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    author,
    publisher: {
      ...publisherOrganization,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/favicon.ico"),
      },
    },
  };
}

type RatingDistribution = {
  star5?: number;
  star4?: number;
  star3?: number;
  star2?: number;
  star1?: number;
};

function buildAggregateRatingFromDistribution(distribution?: RatingDistribution) {
  if (!distribution) return null;

  const buckets: Array<[number, number | undefined]> = [
    [5, distribution.star5],
    [4, distribution.star4],
    [3, distribution.star3],
    [2, distribution.star2],
    [1, distribution.star1],
  ];
  let total = 0;
  let weighted = 0;

  for (const [stars, count] of buckets) {
    const safeCount = count ?? 0;
    total += safeCount;
    weighted += stars * safeCount;
  }

  if (total === 0) {
    return null;
  }

  return {
    "@type": "AggregateRating" as const,
    ratingValue: Math.round((weighted / total) * 10) / 10,
    reviewCount: total,
    bestRating: 5,
    worstRating: 1,
  };
}

export type ProductJsonLdInput = {
  name: string;
  url: string;
  description?: string;
  brand?: string;
  priceRange?: string;
  ratingDistribution?: RatingDistribution;
};

export function buildProductJsonLd(input: ProductJsonLdInput) {
  const aggregateRating = buildAggregateRatingFromDistribution(input.ratingDistribution);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
    ...(input.brand
      ? {
          brand: {
            "@type": "Brand",
            name: input.brand,
          },
        }
      : {}),
    ...(aggregateRating ? { aggregateRating } : {}),
    ...(input.priceRange
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            description: input.priceRange,
            availability: "https://schema.org/InStock",
            url: input.url,
          },
        }
      : {}),
  };
}

export type FaqJsonLdItem = {
  question: string;
  answer: string;
};

export function buildFaqPageJsonLd(items: FaqJsonLdItem[]) {
  const validItems = items.filter((item) => item.question.trim() && item.answer.trim());
  if (validItems.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: validItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export type HowToJsonLdInput = {
  name: string;
  url: string;
  steps: string[];
  description?: string;
  datePublished?: string;
  dateModified?: string;
};

export function buildHowToJsonLd(input: HowToJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    author: publisherOrganization,
    publisher: publisherOrganization,
    step: input.steps.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text,
    })),
  };
}

export type DefinedTermJsonLdInput = {
  name: string;
  url: string;
  description: string;
};

export function buildDefinedTermJsonLd(input: DefinedTermJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: input.name,
    url: input.url,
    description: input.description,
    inDefinedTermSet: absoluteUrl("/glossary"),
  };
}
