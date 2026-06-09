import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Users } from "lucide-react";

import { getAuthors } from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Editorial team & reviewers",
  description:
    "Meet the Insurhi editors who research, fact-check, and review our insurance guides, product comparisons, and claims help.",
  path: "/authors",
});

export default async function AuthorsPage() {
  const authors = await getAuthors();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Editorial team", path: "/authors" },
  ]);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="space-y-4 rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-800/[0.06] via-sky-500/[0.03] to-card p-6 lg:p-8">
        <p className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="mr-1 h-3.5 w-3.5 text-cyan-600" />
          Editorial team
        </p>
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">Editors & reviewers</h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
          Every Insurhi guide, comparison, and claims walkthrough is reviewed by an editor with
          category-specific focus. Our reviewers check policy forms, coverage limits, pricing, and
          claims workflows so guidance stays accurate and independent.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => (
          <Link
            key={author.id}
            href={`/authors/${author.slug}`}
            className="flex flex-col gap-3 rounded-2xl border bg-background p-5 transition-colors hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-800 to-cyan-600 text-lg font-bold text-white">
                {author.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold tracking-tight">{author.name}</p>
                {author.role ? <p className="text-xs text-muted-foreground">{author.role}</p> : null}
              </div>
            </div>
            {author.credentials ? (
              <p className="text-sm leading-6 text-muted-foreground">{author.credentials}</p>
            ) : null}
          </Link>
        ))}
      </section>

      {authors.length === 0 ? (
        <p className="flex items-center gap-2 rounded-xl border bg-background p-4 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          Reviewer profiles are being published.
        </p>
      ) : null}
    </div>
  );
}
