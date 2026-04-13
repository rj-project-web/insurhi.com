import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { getClaimCases, getClaimsGuides } from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Insurance Claims Assistance",
  description:
    "Find insurance claim steps, required document checklists, and real claim case examples.",
  path: "/claims",
});

export default async function ClaimsPage() {
  const [guides, claimCases] = await Promise.all([getClaimsGuides(), getClaimCases()]);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Claims", path: "/claims" },
  ]);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Claims Assistance</h1>
        <p className="max-w-3xl text-muted-foreground">
          Follow claim steps, gather required documents, and review real-world claim cases
          before you submit.
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        {guides.length > 0 ? (
          guides.map((guide) => (
            <Link
              key={guide.id}
              href={guide.slug ? `/claims/guides/${guide.slug}` : "/claims"}
              className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
            >
              <p className="font-medium">{guide.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Steps: {guide.steps?.length ?? 0} | Checklist items:{" "}
                {guide.documentChecklist?.length ?? 0}
              </p>
            </Link>
          ))
        ) : (
          <>
            <article className="rounded-lg border bg-card p-4">Step-by-step claim flow</article>
            <article className="rounded-lg border bg-card p-4">Online filing entry points</article>
            <article className="rounded-lg border bg-card p-4">
              Required document checklists
            </article>
            <article className="rounded-lg border bg-card p-4">Claim case library</article>
          </>
        )}
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Claim Cases</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {claimCases.length > 0 ? (
            claimCases.map((claimCase) => (
              <Link
                key={claimCase.id}
                href={`/claims/cases/${claimCase.id}`}
                className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
              >
                <p className="font-medium">{claimCase.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{claimCase.scenario}</p>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              CMS claim case content will appear here after publishing.
            </p>
          )}
        </div>
      </section>

      <AdSlot slotId="ad_bottom_banner" />

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold tracking-tight">Explore related channels</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <Link href="/insurance" className="underline underline-offset-4">
            Insurance categories
          </Link>
          <Link href="/guides" className="underline underline-offset-4">
            Insurance guides
          </Link>
        </div>
      </section>
    </div>
  );
}
