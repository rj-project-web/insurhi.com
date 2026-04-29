import type { Metadata } from "next";
import { CmsRichText, extractCmsText } from "@/components/cms-rich-text";
import { getPageBySlug } from "@/lib/cms-client";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("methodology");

  return buildMetadata({
    title: cmsPage?.seo?.metaTitle ?? "Methodology",
    description:
      cmsPage?.seo?.metaDescription ??
      (cmsPage ? extractCmsText(cmsPage.content).slice(0, 160) : "How Insurhi evaluates insurance content and comparisons."),
    path: "/methodology",
  });
}

export default async function MethodologyPage() {
  const cmsPage = await getPageBySlug("methodology");

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-5">
        <h1 className="text-2xl font-semibold tracking-tight">{cmsPage?.title ?? "Methodology"}</h1>
      </section>

      <section className="rounded-xl border bg-card p-5">
        {cmsPage?.content ? (
          <CmsRichText content={cmsPage.content} />
        ) : (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              We review insurance products and providers using a consistent framework across coverage clarity,
              pricing transparency, claims experience, and consumer suitability.
            </p>
            <p>
              Ratings and summaries are informational and should be validated against official policy wording and
              local regulatory guidance before purchase decisions.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
