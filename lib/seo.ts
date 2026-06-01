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
};

export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    mainEntityOfPage: input.url,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    author: publisherOrganization,
    publisher: {
      ...publisherOrganization,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/favicon.ico"),
      },
    },
  };
}

export type ProductJsonLdInput = {
  name: string;
  url: string;
  description?: string;
  brand?: string;
};

export function buildProductJsonLd(input: ProductJsonLdInput) {
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
};

export function buildHowToJsonLd(input: HowToJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
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
