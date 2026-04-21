import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenCheck, Clock3, Sparkles } from "lucide-react";
import { getLatestArticles } from "@/lib/cms-client";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";

/** Always merge latest CMS article list (avoid deploy-time-only or ISR-stale /guides). */
export const dynamic = "force-dynamic";

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
      <section className="space-y-4 rounded-2xl border bg-gradient-to-br from-indigo-500/[0.08] via-blue-500/[0.06] to-card p-6 lg:p-8">
        <p className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="mr-1 h-3.5 w-3.5 text-cyan-600" />
          Editorial guides library
        </p>
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">Insurance Guides</h1>
        <p className="max-w-3xl text-muted-foreground">
          Beginner basics, side-by-side reviews, claims tactics, and common pitfalls for smarter
          insurance decisions.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:max-w-2xl">
          <article className="rounded-lg border bg-background/90 p-3">
            <p className="flex items-center gap-2 text-sm font-medium">
              <BookOpenCheck className="h-4 w-4 text-blue-600" />
              Structured buying playbooks
            </p>
          </article>
          <article className="rounded-lg border bg-background/90 p-3">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Clock3 className="h-4 w-4 text-cyan-600" />
              Updated with latest CMS snapshot
            </p>
          </article>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Link
              key={article.id}
              href={`/guides/${article.slug}`}
              className="rounded-xl border bg-gradient-to-br from-card to-indigo-500/[0.03] p-4 transition-colors hover:bg-accent"
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
