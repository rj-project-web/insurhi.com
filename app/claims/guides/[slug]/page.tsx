import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import { getClaimsGuideBySlug, getClaimsGuidesList } from "@/lib/cms-client";
import { absoluteUrl, buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

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
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    url: absoluteUrl(`/claims/guides/${slug}`),
    step:
      guide.steps?.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        text: step.step,
      })) ?? [],
  };

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
      <section className="space-y-3">
        <p className="text-sm text-muted-foreground">Claims / Guide / {slug}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{guide.title}</h1>
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

      <section className="space-y-3">
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

      <section className="space-y-3">
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

      <AdSlot slotId="ad_in_content_1" />

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
