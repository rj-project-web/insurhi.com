import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import { getClaimCaseById, getClaimCases } from "@/lib/cms-client";
import { absoluteUrl, buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type ClaimCaseDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const claimCases = await getClaimCases();
  return claimCases.map((claimCase) => ({ id: claimCase.id }));
}

export async function generateMetadata({ params }: ClaimCaseDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const claimCase = await getClaimCaseById(id);

  if (!claimCase) {
    return buildMetadata({
      title: "Claim Case",
      description: "Insurance claim case example.",
      path: "/claims",
    });
  }

  return buildMetadata({
    title: claimCase.title,
    description: claimCase.scenario,
    path: `/claims/cases/${claimCase.id}`,
  });
}

export default async function ClaimCaseDetailPage({ params }: ClaimCaseDetailPageProps) {
  const { id } = await params;
  const claimCase = await getClaimCaseById(id);

  if (!claimCase) {
    notFound();
  }
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Claims", path: "/claims" },
    { name: claimCase.title, path: `/claims/cases/${claimCase.id}` },
  ]);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: claimCase.title,
    mainEntityOfPage: absoluteUrl(`/claims/cases/${claimCase.id}`),
    url: absoluteUrl(`/claims/cases/${claimCase.id}`),
  };

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <section className="space-y-3">
        <p className="text-sm text-muted-foreground">Claims / Case / {claimCase.id}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{claimCase.title}</h1>
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-xl font-semibold tracking-tight">Scenario</h2>
        <p className="text-sm text-muted-foreground">{claimCase.scenario}</p>
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-xl font-semibold tracking-tight">Outcome</h2>
        <p className="text-sm text-muted-foreground">{claimCase.outcome}</p>
      </section>

      <AdSlot slotId="ad_in_content_2" />

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
