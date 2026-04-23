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
  summary?: string;
  bestFor?: string | string[] | Array<{ item?: string }>;
  rating?: number;
  coverageRegions?: string[];
  categories?: (string | CmsCategory)[];
  seo?: CmsSeoGroup;
};

export type CmsProduct = {
  id: string;
  name: string;
  slug: string;
  oneLineVerdict?: string;
  editorConclusion?: string;
  coverageAmount?: string;
  coverageDetails?: unknown;
  deductible?: string;
  priceRange?: string;
  pricingRangeSummary?: string;
  premiumEstimateRows?: Array<{
    ageBand?: string;
    region?: string;
    profile?: string;
    estimatedPremium?: string;
    note?: string;
  }>;
  pros?: Array<{ item?: string }>;
  cons?: Array<{ item?: string }>;
  bestFor?: Array<{ item?: string }>;
  notFor?: Array<{ item?: string }>;
  recommendedFor?: string;
  claimsTurnaround?: {
    avgDays?: number;
    p90Days?: number;
    dataSource?: string;
    lastUpdated?: string;
  };
  competitorComparisons?: Array<{
    competitorName?: string;
    priceBand?: string;
    coverageScore?: number;
    claimsScore?: number;
    summary?: string;
  }>;
  ratingDistribution?: {
    star5?: number;
    star4?: number;
    star3?: number;
    star2?: number;
    star1?: number;
  };
  reviewHighlights?: unknown;
  faqItems?: Array<{
    question?: string;
    answer?: unknown;
  }>;
  methodology?: unknown;
  sources?: Array<{
    sourceName?: string;
    url?: string;
    publishedAt?: string;
  }>;
  category?: string | CmsCategory;
  provider?: string | CmsProvider;
  seo?: CmsSeoGroup;
};

export type CmsPage = {
  id: string;
  title: string;
  slug: string;
  content: unknown;
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
  category?: string | CmsCategory;
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
const CMS_CONTENT_SOURCE = (process.env.CMS_CONTENT_SOURCE ?? "api").trim().toLowerCase();

type CmsContentSnapshot = {
  categories: CmsCategory[];
  providers: CmsProvider[];
  products: CmsProduct[];
  articles: CmsArticle[];
  faqItems: CmsFaqItem[];
  claimsGuides: CmsClaimsGuide[];
  claimCases: CmsClaimCase[];
  pages: CmsPage[];
};

let cachedContentSnapshotPromise: Promise<CmsContentSnapshot | null> | null = null;

const EMPTY_STATIC_SNAPSHOT: CmsContentSnapshot = {
  categories: [],
  providers: [],
  products: [],
  articles: [],
  faqItems: [],
  claimsGuides: [],
  claimCases: [],
  pages: [],
};

function toSnapshotArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function toStringId(id: unknown): string {
  return String(id ?? "");
}

async function getStaticContentSnapshot(): Promise<CmsContentSnapshot | null> {
  if (CMS_CONTENT_SOURCE !== "static") {
    return null;
  }

  if (!cachedContentSnapshotPromise) {
    cachedContentSnapshotPromise = (async () => {
      try {
        const { readFile } = await import("node:fs/promises");
        const path = await import("node:path");
        const snapshotPath =
          process.env.CMS_CONTENT_FILE_PATH ??
          path.join(
            /* turbopackIgnore: fixed subfolder path for static snapshot */
            process.cwd(),
            "content",
            "cms-content.json",
          );
        const raw = await readFile(snapshotPath, "utf8");
        const parsed = JSON.parse(raw) as Partial<CmsContentSnapshot>;

        return {
          categories: toSnapshotArray<CmsCategory>(parsed.categories).map((item) => ({
            ...item,
            id: toStringId(item.id),
          })),
          providers: toSnapshotArray<CmsProvider>(parsed.providers).map((item) => ({
            ...item,
            id: toStringId(item.id),
          })),
          products: toSnapshotArray<CmsProduct>(parsed.products).map((item) => ({
            ...item,
            id: toStringId(item.id),
          })),
          articles: toSnapshotArray<CmsArticle>(parsed.articles).map((item) => ({
            ...item,
            id: toStringId(item.id),
          })),
          faqItems: toSnapshotArray<CmsFaqItem>(parsed.faqItems).map((item) => ({
            ...item,
            id: toStringId(item.id),
          })),
          claimsGuides: toSnapshotArray<CmsClaimsGuide>(parsed.claimsGuides).map((item) => ({
            ...item,
            id: toStringId(item.id),
          })),
          claimCases: toSnapshotArray<CmsClaimCase>(parsed.claimCases).map((item) => ({
            ...item,
            id: toStringId(item.id),
          })),
          pages: toSnapshotArray<CmsPage>(parsed.pages).map((item) => ({
            ...item,
            id: toStringId(item.id),
          })),
        };
      } catch (error) {
        // In static mode, never silently fall back to live API.
        // Return empty snapshot and emit a server log for observability.
        console.error("Failed to load static CMS snapshot:", error);
        return EMPTY_STATIC_SNAPSHOT;
      }
    })();
  }

  return cachedContentSnapshotPromise;
}

async function getClaimCaseFromSnapshotFile(id: string): Promise<CmsClaimCase | null> {
  try {
    const { readFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const snapshotPath =
      process.env.CMS_CONTENT_FILE_PATH ??
      path.join(
        /* turbopackIgnore: fixed subfolder path for static snapshot */
        process.cwd(),
        "content",
        "cms-content.json",
      );
    const raw = await readFile(snapshotPath, "utf8");
    const parsed = JSON.parse(raw) as { claimCases?: CmsClaimCase[] };
    const claimCases = toSnapshotArray<CmsClaimCase>(parsed.claimCases);
    return claimCases.find((item) => toStringId(item.id) === id) ?? null;
  } catch {
    return null;
  }
}

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
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.categories.find((item) => item.slug === slug) ?? null;
  }

  const docs = await fetchCollection<CmsCategory>(
    `/api/categories?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
  );

  return docs[0] ?? null;
}

export async function getFaqsByCategory(categoryId: string) {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.faqItems
      .filter((item) => {
        if (!item.category) return false;
        if (typeof item.category === "string") {
          return toStringId(item.category) === categoryId;
        }

        return toStringId(item.category.id) === categoryId;
      })
      .slice(0, 6);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CMS_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${CMS_BASE_URL}/api/faq-items?where[category][equals]=${encodeURIComponent(categoryId)}&limit=6&depth=1`,
      {
        cache: "no-store",
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as PayloadList<CmsFaqItem>;
    return data.docs ?? [];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function getProvidersByCategory(categoryId: string) {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.providers
      .filter((provider) =>
        (provider.categories ?? []).some((category) =>
          typeof category === "string"
            ? toStringId(category) === categoryId
            : toStringId(category.id) === categoryId,
        ),
      )
      .slice(0, 6);
  }

  return fetchCollection<CmsProvider>(
    `/api/providers?where[categories][in]=${encodeURIComponent(categoryId)}&limit=6`,
  );
}

export async function getProductsByCategory(categoryId: string) {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.products
      .filter((item) => {
        if (!item.category) return false;
        if (typeof item.category === "string") {
          return toStringId(item.category) === categoryId;
        }

        return toStringId(item.category.id) === categoryId;
      })
      .slice(0, 20);
  }

  return fetchCollection<CmsProduct>(
    `/api/products?where[category][equals]=${encodeURIComponent(categoryId)}&depth=1&limit=20`,
  );
}

export async function getCategories() {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.categories;
  }

  return fetchCollection<CmsCategory>("/api/categories?limit=50&sort=title");
}

export async function getProviders() {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.providers;
  }

  return fetchCollection<CmsProvider>("/api/providers?limit=100&sort=name");
}

export async function getAllPages() {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.pages;
  }

  return fetchCollection<CmsPage>("/api/pages?limit=100&sort=title");
}

export async function getPageBySlug(slug: string) {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.pages.find((item) => item.slug === slug) ?? null;
  }

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
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.providers.find((item) => item.slug === slug) ?? null;
  }

  const docs = await fetchCollection<CmsProvider>(
    `/api/providers?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1`,
  );

  return docs[0] ?? null;
}

export async function getProductBySlug(slug: string) {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.products.find((item) => item.slug === slug) ?? null;
  }

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
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.articles.slice(0, 8);
  }

  return fetchArticlesListFromCms(8);
}

export async function getArticlesList() {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.articles;
  }

  return fetchArticlesListFromCms(100);
}

export async function getArticleBySlug(slug: string) {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.articles.find((item) => item.slug === slug) ?? null;
  }

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
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.claimsGuides.slice(0, 6);
  }

  return fetchCollection<CmsClaimsGuide>("/api/claims-guides?limit=6");
}

export async function getClaimsGuidesList() {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.claimsGuides;
  }

  return fetchCollection<CmsClaimsGuide>("/api/claims-guides?limit=100&sort=title");
}

export async function getClaimCasesList() {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.claimCases;
  }

  return fetchCollection<CmsClaimCase>("/api/claim-cases?limit=100");
}

export async function getFaqItems() {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.faqItems;
  }

  return fetchCollection<CmsFaqItem>("/api/faq-items?limit=200&depth=1");
}

export async function getProducts() {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.products;
  }

  return fetchCollection<CmsProduct>("/api/products?limit=200&sort=name&depth=1");
}

export async function getClaimsGuideBySlug(slug: string) {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.claimsGuides.find((item) => item.slug === slug) ?? null;
  }

  const docs = await fetchCollection<CmsClaimsGuide>(
    `/api/claims-guides?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
  );

  return docs[0] ?? null;
}

export async function getClaimCases() {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.claimCases.slice(0, 6);
  }

  return fetchCollection<CmsClaimCase>("/api/claim-cases?limit=6");
}

export async function getClaimCaseById(id: string) {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.claimCases.find((item) => toStringId(item.id) === id) ?? null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CMS_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${CMS_BASE_URL}/api/claim-cases/${encodeURIComponent(id)}`, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return getClaimCaseFromSnapshotFile(id);
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
    return getClaimCaseFromSnapshotFile(id);
  } finally {
    clearTimeout(timeout);
  }
}
