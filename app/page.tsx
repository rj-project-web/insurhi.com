import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { isMobileUserAgent } from "@/lib/device";
import { buildMetadata, buildWebSiteJsonLd } from "@/lib/seo";
import { insuranceCategories } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Insurance Comparison and Claims Guidance",
  description:
    "Compare insurance options, browse practical guides, and get claims assistance across major insurance categories.",
  path: "/",
});

export default async function Home() {
  const webSiteJsonLd = buildWebSiteJsonLd();
  const userAgent = (await headers()).get("user-agent") ?? "";
  const isMobile = isMobileUserAgent(userAgent);
  const heroDescription = isMobile
    ? "Compare plans and claims help on the go."
    : "Insurhi helps users compare options, learn coverage basics, and handle claims with practical guidance.";

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">Insurance clarity, made simple.</h1>
        <p className="max-w-2xl text-muted-foreground">{heroDescription}</p>
      </section>

      <AdSlot slotId="ad_top_banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Insurance Categories</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {insuranceCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/insurance/${category.slug}`}
              className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
            >
              <p className="font-medium">{category.title}</p>
            </Link>
          ))}
          <Link
            href="/resources"
            className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
          >
            <p className="font-medium">Explore more insurance resources</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
