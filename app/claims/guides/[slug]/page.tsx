import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Clock,
  FilePlus2,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import { EditorialDisclosure, EditorialMetadata } from "@/components/editorial-disclosure";
import { RelatedContentPanel } from "@/components/related-content-panel";
import { getClaimsGuideBySlug, getClaimsGuidesList } from "@/lib/cms-client";
import { getRelatedContentForClaimsGuide } from "@/lib/content-links";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildHowToJsonLd,
  buildMetadata,
} from "@/lib/seo";

type ClaimsGuideDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const guides = await getClaimsGuidesList();
  return guides
    .filter((guide) => Boolean(guide.slug))
    .map((guide) => ({ slug: guide.slug as string }));
}

export async function generateMetadata({
  params,
}: ClaimsGuideDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getClaimsGuideBySlug(slug);

  if (!guide) {
    return buildMetadata({
      title: "Claims Guide",
      description: "Insurance claims walkthrough.",
      path: "/claims",
    });
  }

  return buildMetadata({
    title: guide.title,
    description: `Follow ${guide.title} with claim steps and required document checklist.`,
    path: `/claims/guides/${slug}`,
  });
}

export default async function ClaimsGuideDetailPage({ params }: ClaimsGuideDetailPageProps) {
  const { slug } = await params;
  const guide = await getClaimsGuideBySlug(slug);

  if (!guide) {
    notFound();
  }
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Claims", path: "/claims" },
    { name: guide.title, path: `/claims/guides/${slug}` },
  ]);
  const howToJsonLd = buildHowToJsonLd({
    name: guide.title,
    url: absoluteUrl(`/claims/guides/${slug}`),
    description: `Follow ${guide.title} with claim steps and required document checklist.`,
    steps: (guide.steps ?? []).map((step) => step.step).filter(Boolean),
    datePublished: guide.createdAt,
    dateModified: guide.updatedAt ?? guide.createdAt,
  });
  const relatedContent = getRelatedContentForClaimsGuide(slug, guide.category);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <section className="space-y-4 rounded-2xl border bg-gradient-to-br from-teal-500/[0.08] via-cyan-500/[0.06] to-card p-6 lg:p-8">
        <p className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="mr-1 h-3.5 w-3.5 text-cyan-600" />
          Claims / Guide / {slug}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">{guide.title}</h1>
        <EditorialMetadata
          updatedAt={guide.updatedAt}
          createdAt={guide.createdAt}
          reviewedBy={guide.reviewedBy}
          lastReviewedAt={guide.lastReviewedAt}
        />
        <div className="rounded-lg border bg-background/90 p-3 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <ClipboardList className="h-4 w-4 text-cyan-600" />
            Step-by-step claim workflow with document checklist
          </p>
        </div>
        {guide.onlineClaimUrl ? (
          <p className="text-sm">
            <a
              href={guide.onlineClaimUrl}
              className="font-medium text-primary underline underline-offset-4"
              target="_blank"
              rel="noreferrer noopener"
            >
              Online claim filing (CMS)
            </a>
          </p>
        ) : null}
      </section>

      <section className="space-y-3 rounded-xl border bg-gradient-to-br from-card to-teal-500/[0.03] p-5">
        <h2 className="text-xl font-semibold tracking-tight">Claim steps</h2>
        {guide.steps?.length ? (
          <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
            {guide.steps.map((step, index) => (
              <li key={`${guide.id}-${index}`}>{step.step}</li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">No steps are published yet.</p>
        )}
      </section>

      <section className="space-y-3 rounded-xl border bg-gradient-to-br from-card to-cyan-500/[0.03] p-5">
        <h2 className="text-xl font-semibold tracking-tight">Document checklist</h2>
        {guide.documentChecklist?.length ? (
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            {guide.documentChecklist.map((item, index) => (
              <li key={`${guide.id}-doc-${index}`}>{item.item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No checklist has been published yet.</p>
        )}
      </section>

      {guide.denialReasons && guide.denialReasons.length > 0 ? (
        <section className="space-y-3 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-50/50 to-card p-5 dark:from-amber-500/10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            <h2 className="text-xl font-semibold tracking-tight">Common reasons claims get denied</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            These show up most often in adjuster decisions for this claim type. Knowing them in advance
            usually changes how you document the loss.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {guide.denialReasons.map((row, index) => (
              <article
                key={`${guide.id}-denial-${index}`}
                className="rounded-lg border border-border/70 bg-background p-3"
              >
                <p className="text-sm font-semibold text-foreground">{row.reason}</p>
                {row.explanation ? (
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{row.explanation}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {guide.delayCauses && guide.delayCauses.length > 0 ? (
        <section className="space-y-3 rounded-xl border border-sky-500/30 bg-gradient-to-br from-sky-500/[0.04] to-card p-5">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-sky-600 dark:text-sky-300" />
            <h2 className="text-xl font-semibold tracking-tight">What slows a claim down</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Claims that should close in days sometimes take weeks. Most delays come from these causes—
            often fixable with a single phone call or follow-up email.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {guide.delayCauses.map((row, index) => (
              <article
                key={`${guide.id}-delay-${index}`}
                className="rounded-lg border border-border/70 bg-background p-3"
              >
                <p className="text-sm font-semibold text-foreground">{row.cause}</p>
                {row.explanation ? (
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{row.explanation}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {guide.supplementalDocuments && guide.supplementalDocuments.length > 0 ? (
        <section className="space-y-3 rounded-xl border bg-gradient-to-br from-card to-indigo-500/[0.04] p-5">
          <div className="flex items-center gap-2">
            <FilePlus2 className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
            <h2 className="text-xl font-semibold tracking-tight">Supplemental documents you may be asked for</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Adjusters routinely request additional records during review. Being ready for these
            scenarios can keep a claim from stalling.
          </p>
          <div className="space-y-2.5">
            {guide.supplementalDocuments.map((row, index) => (
              <article
                key={`${guide.id}-supp-${index}`}
                className="rounded-lg border border-border/70 bg-background p-3"
              >
                <p className="text-sm font-semibold text-foreground">{row.scenario}</p>
                {row.documents ? (
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{row.documents}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {guide.nextActions && guide.nextActions.length > 0 ? (
        <section className="space-y-3 rounded-xl border bg-gradient-to-br from-card to-emerald-500/[0.04] p-5">
          <div className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            <h2 className="text-xl font-semibold tracking-tight">If your claim is denied, delayed, or short-paid</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Concrete next steps for readers who hit a wall. Each one is a recognized consumer right or
            documented escalation path.
          </p>
          <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
            {guide.nextActions.map((row, index) => (
              <li key={`${guide.id}-next-${index}`}>
                <span className="text-foreground">{row.action}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {guide.communicationNotes && guide.communicationNotes.length > 0 ? (
        <section className="space-y-3 rounded-xl border bg-gradient-to-br from-card to-violet-500/[0.04] p-5">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-violet-600 dark:text-violet-300" />
            <h2 className="text-xl font-semibold tracking-tight">Talking to the carrier and your state regulator</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            How you communicate matters. These notes help readers keep a written paper trail and use the
            language carriers and state DOIs recognize.
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            {guide.communicationNotes.map((row, index) => (
              <li key={`${guide.id}-comm-${index}`}>
                <span className="text-foreground">{row.note}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <EditorialDisclosure />

      <RelatedContentPanel bundle={relatedContent} title="Before and after you file" />

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold tracking-tight">Continue exploring</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <Link href="/claims" className="underline underline-offset-4">
            Back to claims
          </Link>
          <Link href="/guides" className="underline underline-offset-4">
            Insurance guides
          </Link>
        </div>
      </section>
    </div>
  );
}
