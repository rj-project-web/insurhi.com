type PayloadList<T> = {
  docs: T[];
};

export type CmsSeoGroup = {
  metaTitle?: string;
  metaDescription?: string;
};

export type CmsCategory = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  seo?: CmsSeoGroup;
};

export type CmsFaqItem = {
  id: string;
  question: string;
  answer: string;
  category?: string | CmsCategory;
};

export type CmsProvider = {
  id: string;
  name: string;
  slug: string;
  rating?: number;
  coverageRegions?: string[];
  categories?: (string | CmsCategory)[];
  seo?: CmsSeoGroup;
};

export type CmsProduct = {
  id: string;
  name: string;
  slug: string;
  coverageAmount?: string;
  deductible?: string;
  priceRange?: string;
  recommendedFor?: string;
  category?: string | CmsCategory;
  provider?: string | CmsProvider;
  seo?: CmsSeoGroup;
};

export type CmsPage = {
  id: string;
  title: string;
  slug: string;
  content: string;
  seo?: CmsSeoGroup;
};

export type CmsArticle = {
  id: string;
  title: string;
  slug: string;
  seo?: CmsSeoGroup;
  body?: {
    root?: {
      children?: Array<{
        type?: string;
        children?: Array<{
          text?: string;
        }>;
      }>;
    };
  };
};

export type CmsClaimsGuide = {
  id: string;
  title: string;
  slug?: string;
  onlineClaimUrl?: string;
  steps?: Array<{ step: string }>;
  documentChecklist?: Array<{ item: string }>;
};

export type CmsClaimCase = {
  id: string;
  title: string;
  scenario: string;
  outcome: string;
};

/** Align with insurhi-cms-admin default dev port (see `scripts/dev-all.sh`). */
const CMS_BASE_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "http://localhost:3000";
const FETCH_OPTIONS = { next: { revalidate: 300 } };
const CMS_REQUEST_TIMEOUT_MS = 1500;
/** Article lists must reflect CMS edits quickly on Vercel (avoid 5m ISR stale list). */
const CMS_ARTICLES_TIMEOUT_MS = 8000;

async function fetchCollection<T>(path: string): Promise<T[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CMS_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${CMS_BASE_URL}${path}`, {
      ...FETCH_OPTIONS,
      signal: controller.signal,
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as PayloadList<T>;
    return data.docs ?? [];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function getCategoryBySlug(slug: string) {
  const docs = await fetchCollection<CmsCategory>(
    `/api/categories?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
  );

  return docs[0] ?? null;
}

export async function getFaqsByCategory(categoryId: string) {
  return fetchCollection<CmsFaqItem>(
    `/api/faq-items?where[category][equals]=${encodeURIComponent(categoryId)}&limit=6`,
  );
}

export async function getProvidersByCategory(categoryId: string) {
  return fetchCollection<CmsProvider>(
    `/api/providers?where[categories][in]=${encodeURIComponent(categoryId)}&limit=6`,
  );
}

export async function getProductsByCategory(categoryId: string) {
  return fetchCollection<CmsProduct>(
    `/api/products?where[category][equals]=${encodeURIComponent(categoryId)}&depth=1&limit=20`,
  );
}

export async function getCategories() {
  return fetchCollection<CmsCategory>("/api/categories?limit=50&sort=title");
}

export async function getProviders() {
  return fetchCollection<CmsProvider>("/api/providers?limit=100&sort=name");
}

export async function getAllPages() {
  return fetchCollection<CmsPage>("/api/pages?limit=100&sort=title");
}

export async function getPageBySlug(slug: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CMS_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${CMS_BASE_URL}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
      {
        cache: "no-store",
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as PayloadList<CmsPage>;
    return data.docs?.[0] ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getProviderBySlug(slug: string) {
  const docs = await fetchCollection<CmsProvider>(
    `/api/providers?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1`,
  );

  return docs[0] ?? null;
}

export async function getProductBySlug(slug: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CMS_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${CMS_BASE_URL}/api/products?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1`,
      {
        cache: "no-store",
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as PayloadList<CmsProduct>;
    return data.docs?.[0] ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchArticlesListFromCms(limit: number): Promise<CmsArticle[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CMS_ARTICLES_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${CMS_BASE_URL}/api/articles?sort=-publishedAt&limit=${encodeURIComponent(String(limit))}`,
      {
        cache: "no-store",
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as PayloadList<CmsArticle>;
    return data.docs ?? [];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function getLatestArticles() {
  return fetchArticlesListFromCms(8);
}

export async function getArticlesList() {
  return fetchArticlesListFromCms(100);
}

export async function getArticleBySlug(slug: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CMS_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${CMS_BASE_URL}/api/articles?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
      {
        cache: "no-store",
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as PayloadList<CmsArticle>;
    return data.docs?.[0] ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getClaimsGuides() {
  return fetchCollection<CmsClaimsGuide>("/api/claims-guides?limit=6");
}

export async function getClaimsGuidesList() {
  return fetchCollection<CmsClaimsGuide>("/api/claims-guides?limit=100&sort=title");
}

export async function getClaimCasesList() {
  return fetchCollection<CmsClaimCase>("/api/claim-cases?limit=100");
}

export async function getFaqItems() {
  return fetchCollection<CmsFaqItem>("/api/faq-items?limit=200&depth=1");
}

export async function getProducts() {
  return fetchCollection<CmsProduct>("/api/products?limit=200&sort=name&depth=1");
}

export async function getClaimsGuideBySlug(slug: string) {
  const docs = await fetchCollection<CmsClaimsGuide>(
    `/api/claims-guides?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
  );

  return docs[0] ?? null;
}

export async function getClaimCases() {
  return fetchCollection<CmsClaimCase>("/api/claim-cases?limit=6");
}

export async function getClaimCaseById(id: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CMS_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${CMS_BASE_URL}/api/claim-cases/${encodeURIComponent(id)}`, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const raw = (await response.json()) as {
      id?: number | string;
      title?: unknown;
      scenario?: unknown;
      outcome?: unknown;
    };

    return {
      id: String(raw.id ?? id),
      title: String(raw.title ?? ""),
      scenario: String(raw.scenario ?? ""),
      outcome: String(raw.outcome ?? ""),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
