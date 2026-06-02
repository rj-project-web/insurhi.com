import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";

import { getGlossaryTerms } from "@/lib/cms-client";
import { CATEGORY_SLUGS, categoryContentHubs } from "@/lib/category-content-hub";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Insurance Glossary | Key Terms Explained",
  description:
    "Plain-language definitions for insurance terms: deductibles, replacement cost, UM/UIM, Medigap plans, pet exclusions, and more.",
  path: "/glossary",
});

function categorySlug(value: unknown): string | null {
  if (!value || typeof value === "object") {
    const slug = (value as { slug?: string }).slug;
    return slug ?? null;
  }
  return null;
}

export default async function GlossaryPage() {
  const terms = await getGlossaryTerms();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Glossary", path: "/glossary" },
  ]);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="space-y-4 rounded-2xl border bg-gradient-to-br from-violet-500/[0.08] via-indigo-500/[0.06] to-card p-6 lg:p-8">
        <p className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="mr-1 h-3.5 w-3.5 text-violet-600" />
          Reference library
        </p>
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">Insurance Glossary</h1>
        <p className="max-w-3xl text-muted-foreground">
          Short, practical definitions for terms you will see in policies, claims letters, and
          comparison guides. Each entry links to related guides and category hubs.
        </p>
        <p className="text-sm text-muted-foreground">{terms.length} terms indexed</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {CATEGORY_SLUGS.map((slug) => (
            <Link
              key={slug}
              href={`/insurance/${slug}#glossary`}
              className="rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {categoryContentHubs[slug].title}
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {terms.map((term) => (
          <Link
            key={term.id}
            href={`/glossary/${term.slug}`}
            className="rounded-xl border bg-gradient-to-br from-card to-violet-500/[0.03] p-4 transition-colors hover:bg-accent"
          >
            <p className="flex items-center gap-2 font-medium">
              <BookOpen className="h-4 w-4 text-violet-600" />
              {term.term}
            </p>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{term.definition}</p>
            {categorySlug(term.category) ? (
              <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                {categorySlug(term.category)}
              </p>
            ) : null}
          </Link>
        ))}
      </div>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold tracking-tight">Continue exploring</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <Link href="/guides" className="underline underline-offset-4">
            Insurance guides
          </Link>
          <Link href="/claims" className="underline underline-offset-4">
            Claims center
          </Link>
          <Link href="/insurance" className="underline underline-offset-4">
            Compare by category
          </Link>
        </div>
      </section>
    </div>
  );
}
