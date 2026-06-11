import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

import { EditorialDisclosure } from "@/components/editorial-disclosure";
import { getGlossaryTermBySlug, getGlossaryTerms } from "@/lib/cms-client";
import { glossaryResourceLinks } from "@/lib/glossary-links";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildDefinedTermJsonLd,
  buildMetadata,
} from "@/lib/seo";

type GlossaryTermPageProps = {
  params: Promise<{ slug: string }>;
};

function categorySlug(value: unknown): string | null {
  if (!value || typeof value === "object") {
    return (value as { slug?: string }).slug ?? null;
  }
  return null;
}

function categoryTitle(value: unknown): string | null {
  if (!value || typeof value === "object") {
    return (value as { title?: string }).title ?? null;
  }
  return null;
}

export async function generateStaticParams() {
  const terms = await getGlossaryTerms();
  return terms.map((term) => ({ slug: term.slug }));
}

export async function generateMetadata({ params }: GlossaryTermPageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = await getGlossaryTermBySlug(slug);

  if (!term) {
    return buildMetadata({
      title: "Glossary Term",
      description: "Insurance glossary definition.",
      path: "/glossary",
    });
  }

  return buildMetadata({
    title: `${term.term} | Insurance Glossary`,
    description: term.definition.slice(0, 160),
    path: `/glossary/${term.slug}`,
    ogImagePath: null,
  });
}

export default async function GlossaryTermPage({ params }: GlossaryTermPageProps) {
  const { slug } = await params;
  const term = await getGlossaryTermBySlug(slug);

  if (!term) {
    notFound();
  }

  const allTerms = await getGlossaryTerms();
  const relatedSlugs = (term.relatedSlugs ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const relatedTerms = allTerms.filter((item) => relatedSlugs.includes(item.slug));
  const resources = glossaryResourceLinks[term.slug];
  const catSlug = categorySlug(term.category);
  const catTitle = categoryTitle(term.category);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Glossary", path: "/glossary" },
    { name: term.term, path: `/glossary/${term.slug}` },
  ]);
  const definedTermJsonLd = buildDefinedTermJsonLd({
    name: term.term,
    url: absoluteUrl(`/glossary/${term.slug}`),
    description: term.definition,
  });

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermJsonLd) }}
      />
      <section className="space-y-4 rounded-2xl border bg-gradient-to-br from-violet-500/[0.08] via-indigo-500/[0.06] to-card p-6 lg:p-8">
        <p className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="mr-1 h-3.5 w-3.5 text-violet-600" />
          Glossary / {term.slug}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">{term.term}</h1>
        {catSlug && catTitle ? (
          <p className="text-sm text-muted-foreground">
            Related category:{" "}
            <Link href={`/insurance/${catSlug}`} className="font-medium text-primary underline-offset-4 hover:underline">
              {catTitle}
            </Link>
          </p>
        ) : null}
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <BookOpen className="h-4 w-4 text-violet-600" />
          Definition
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{term.definition}</p>
      </section>

      {resources?.guides?.length || resources?.claims?.length || resources?.insurance ? (
        <section className="space-y-3 rounded-xl border bg-gradient-to-br from-card to-blue-500/[0.04] p-5">
          <h2 className="text-lg font-semibold tracking-tight">Related reading</h2>
          <div className="flex flex-col gap-2 text-sm">
            {resources.insurance ? (
              <Link
                href={`/insurance/${resources.insurance}`}
                className="inline-flex items-center font-medium text-primary underline-offset-4 hover:underline"
              >
                Browse {resources.insurance} insurance hub
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            ) : null}
            {resources.guides?.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="inline-flex items-center text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {guide.label}
              </Link>
            ))}
            {resources.claims?.map((guide) => (
              <Link
                key={guide.slug}
                href={`/claims/guides/${guide.slug}`}
                className="inline-flex items-center text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {guide.label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {relatedTerms.length > 0 ? (
        <section className="space-y-3 rounded-xl border p-5">
          <h2 className="text-lg font-semibold tracking-tight">Related terms</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {relatedTerms.map((related) => (
              <Link
                key={related.id}
                href={`/glossary/${related.slug}`}
                className="rounded-lg border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                {related.term}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <EditorialDisclosure variant="compact" />

      <section className="rounded-lg border bg-card p-4">
        <Link href="/glossary" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          ← Back to glossary index
        </Link>
      </section>
    </div>
  );
}
