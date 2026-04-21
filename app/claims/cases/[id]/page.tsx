import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";

import { getClaimCaseById, getClaimCasesList } from "@/lib/cms-client";
import { absoluteUrl, buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type ClaimCaseDetailPageProps = {
  params: Promise<{ id: string }>;
};

/** CMS edits must show immediately; avoid SSG snapshot + long-lived fetch cache. */
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const claimCases = await getClaimCasesList();
  return claimCases.map((claimCase) => ({ id: String(claimCase.id) }));
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
      <section className="space-y-4 rounded-2xl border bg-gradient-to-br from-indigo-500/[0.07] via-blue-500/[0.05] to-card p-6 lg:p-8">
        <p className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="mr-1 h-3.5 w-3.5 text-blue-600" />
          Claims / Case / {claimCase.id}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">{claimCase.title}</h1>
      </section>

      <section className="space-y-3 rounded-lg border bg-gradient-to-br from-card to-indigo-500/[0.03] p-4">
        <h2 className="text-xl font-semibold tracking-tight">Scenario</h2>
        <p className="text-sm text-muted-foreground">{claimCase.scenario}</p>
      </section>

      <section className="space-y-3 rounded-lg border bg-gradient-to-br from-card to-blue-500/[0.03] p-4">
        <h2 className="text-xl font-semibold tracking-tight">Outcome</h2>
        <p className="text-sm text-muted-foreground">{claimCase.outcome}</p>
      </section>

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
