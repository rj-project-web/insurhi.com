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

export type CmsAuthor = {
  id: string;
  name: string;
  slug: string;
  role?: string;
  credentials?: string;
  updatedAt?: string;
  createdAt?: string;
};

export type CmsFaqItem = {
  id: string;
  question: string;
  answer: string;
  category?: string | CmsCategory;
  updatedAt?: string;
  createdAt?: string;
};

const FAQ_CATEGORY_LIMIT = 12;

function sortFaqsByRecent<T extends { updatedAt?: string; createdAt?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
    const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
    return bTime - aTime;
  });
}

export type CmsGlossaryTerm = {
  id: string;
  term: string;
  slug: string;
  definition: string;
  category?: string | CmsCategory;
  relatedSlugs?: string;
  updatedAt?: string;
  createdAt?: string;
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
  updatedAt?: string;
  createdAt?: string;
};

export type CmsProduct = {
  id: string;
  name: string;
  slug: string;
  updatedAt?: string;
  createdAt?: string;
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
  reviewedBy?: string | CmsAuthor;
  lastReviewedAt?: string;
};

export type CmsPage = {
  id: string;
  title: string;
  slug: string;
  content: unknown;
  seo?: CmsSeoGroup;
  updatedAt?: string;
  createdAt?: string;
};

export type CmsArticle = {
  id: string;
  title: string;
  slug: string;
  category?: string | CmsCategory;
  publishedAt?: string;
  updatedAt?: string;
  createdAt?: string;
  reviewedBy?: string | CmsAuthor;
  lastReviewedAt?: string;
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
  denialReasons?: Array<{ reason: string; explanation?: string }>;
  delayCauses?: Array<{ cause: string; explanation?: string }>;
  supplementalDocuments?: Array<{ scenario: string; documents?: string }>;
  nextActions?: Array<{ action: string }>;
  communicationNotes?: Array<{ note: string }>;
  updatedAt?: string;
  createdAt?: string;
  reviewedBy?: string | CmsAuthor;
  lastReviewedAt?: string;
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
  meta?: {
    exportedAt?: string;
    source?: string;
  };
  categories: CmsCategory[];
  providers: CmsProvider[];
  products: CmsProduct[];
  articles: CmsArticle[];
  faqItems: CmsFaqItem[];
  glossaryTerms: CmsGlossaryTerm[];
  authors: CmsAuthor[];
  claimsGuides: CmsClaimsGuide[];
  claimCases: CmsClaimCase[];
  pages: CmsPage[];
};

let cachedContentSnapshotPromise: Promise<CmsContentSnapshot | null> | null = null;

const EMPTY_STATIC_SNAPSHOT: CmsContentSnapshot = {
  meta: undefined,
  categories: [],
  providers: [],
  products: [],
  articles: [],
  faqItems: [],
  glossaryTerms: [],
  authors: [],
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
          meta: parsed.meta,
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
          glossaryTerms: toSnapshotArray<CmsGlossaryTerm>(parsed.glossaryTerms).map((item) => ({
            ...item,
            id: toStringId(item.id),
          })),
          authors: toSnapshotArray<CmsAuthor>(parsed.authors).map((item) => ({
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

export async function getAuthors() {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.authors.slice().sort((a, b) => a.name.localeCompare(b.name));
  }

  return fetchCollection<CmsAuthor>("/api/authors?limit=100&sort=name");
}

export async function getAuthorBySlug(slug: string) {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.authors.find((item) => item.slug === slug) ?? null;
  }

  const docs = await fetchCollection<CmsAuthor>(
    `/api/authors?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
  );

  return docs[0] ?? null;
}

export async function getFaqsByCategory(categoryId: string) {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return sortFaqsByRecent(
      snapshot.faqItems.filter((item) => {
        if (!item.category) return false;
        if (typeof item.category === "string") {
          return toStringId(item.category) === categoryId;
        }

        return toStringId(item.category.id) === categoryId;
      }),
    ).slice(0, FAQ_CATEGORY_LIMIT);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CMS_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${CMS_BASE_URL}/api/faq-items?where[category][equals]=${encodeURIComponent(categoryId)}&limit=${FAQ_CATEGORY_LIMIT}&sort=-updatedAt&depth=1`,
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
      `${CMS_BASE_URL}/api/articles?sort=-publishedAt&limit=${encodeURIComponent(String(limit))}&depth=1`,
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

export async function getContentSnapshotMeta(): Promise<{ exportedAt?: string; source?: string } | null> {
  const snapshot = await getStaticContentSnapshot();
  return snapshot?.meta ?? null;
}

export async function getFaqItems() {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.faqItems;
  }

  return fetchCollection<CmsFaqItem>("/api/faq-items?limit=200&depth=1");
}

export async function getGlossaryTerms() {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.glossaryTerms.slice().sort((a, b) => a.term.localeCompare(b.term));
  }

  return fetchCollection<CmsGlossaryTerm>("/api/glossary-terms?limit=200&sort=term&depth=1");
}

export async function getGlossaryTermBySlug(slug: string) {
  const snapshot = await getStaticContentSnapshot();
  if (snapshot) {
    return snapshot.glossaryTerms.find((item) => item.slug === slug) ?? null;
  }

  const docs = await fetchCollection<CmsGlossaryTerm>(
    `/api/glossary-terms?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1`,
  );

  return docs[0] ?? null;
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
