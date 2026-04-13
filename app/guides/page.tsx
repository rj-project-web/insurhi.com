import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { getLatestArticles } from "@/lib/cms-client";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Insurance Guides and Tutorials",
  description:
    "Learn insurance fundamentals, compare policies, and understand claims with practical step-by-step guides.",
  path: "/guides",
});

export default async function GuidesPage() {
  const articles = await getLatestArticles();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
  ]);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Insurance Guides</h1>
        <p className="max-w-3xl text-muted-foreground">
          Beginner basics, side-by-side reviews, claims tactics, and common pitfalls for
          smarter insurance decisions.
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Link
              key={article.id}
              href={`/guides/${article.slug}`}
              className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
            >
              <p className="font-medium">{article.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">/{article.slug}</p>
            </Link>
          ))
        ) : (
          <>
            <article className="rounded-lg border bg-card p-4">Beginner starter guide</article>
            <article className="rounded-lg border bg-card p-4">
              Top policy comparison checklist
            </article>
            <article className="rounded-lg border bg-card p-4">Claims success playbook</article>
            <article className="rounded-lg border bg-card p-4">Avoid expensive mistakes</article>
          </>
        )}
      </div>

      <AdSlot slotId="ad_in_content_2" />

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold tracking-tight">Explore related channels</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <Link href="/insurance" className="underline underline-offset-4">
            Insurance categories
          </Link>
          <Link href="/claims" className="underline underline-offset-4">
            Claims assistance
          </Link>
        </div>
      </section>
    </div>
  );
}
