type PayloadList<T> = {
  docs: T[];
};

export type CmsCategory = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
};

export type CmsFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type CmsProvider = {
  id: string;
  name: string;
  rating?: number;
};

export type CmsArticle = {
  id: string;
  title: string;
  slug: string;
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

const CMS_BASE_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "http://localhost:3001";
const FETCH_OPTIONS = { next: { revalidate: 300 } };
const CMS_REQUEST_TIMEOUT_MS = 1500;

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

export async function getLatestArticles() {
  return fetchCollection<CmsArticle>("/api/articles?sort=-publishedAt&limit=8");
}

export async function getArticleBySlug(slug: string) {
  const docs = await fetchCollection<CmsArticle>(
    `/api/articles?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
  );

  return docs[0] ?? null;
}

export async function getClaimsGuides() {
  return fetchCollection<CmsClaimsGuide>("/api/claims-guides?limit=6");
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
      ...FETCH_OPTIONS,
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as CmsClaimCase;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
