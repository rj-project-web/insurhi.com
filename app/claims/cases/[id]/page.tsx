import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookOpen, ClipboardList, FileSearch } from "lucide-react";

import { claimCaseSections, ClaimCaseContent } from "@/components/claim-case-content";
import { ClaimCaseHero } from "@/components/claim-case-hero";
import { DetailPageSidebar } from "@/components/detail-page-sidebar";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand } from "@/components/insurance-page-band";
import { getClaimCaseById, getClaimCasesList } from "@/lib/cms-client";
import { absoluteUrl, buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type ClaimCaseDetailPageProps = {
  params: Promise<{ id: string }>;
};

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

  if (!claimCase) notFound();

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
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <ClaimCaseHero
          title={claimCase.title}
          id={String(claimCase.id)}
          scenario={claimCase.scenario}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            <ClaimCaseContent scenario={claimCase.scenario} outcome={claimCase.outcome} />
          </div>
          <DetailPageSidebar
            sections={claimCaseSections}
            hubLinks={[
              { href: "/claims#claims-playbooks", label: "Claim playbooks" },
              { href: "/claims", label: "Claims center" },
              { href: "/guides", label: "Buying guides" },
            ]}
          />
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
          description="Use this case alongside step-by-step playbooks and buying guides."
          paths={[
            {
              key: "claims",
              icon: ClipboardList,
              title: "Claims playbooks",
              description: "Step-by-step filing workflows and checklists.",
              href: "/claims#claims-playbooks",
            },
            {
              key: "guides",
              icon: BookOpen,
              title: "Buying guides",
              description: "Understand coverage before an incident happens.",
              href: "/guides",
            },
            {
              key: "cases",
              icon: FileSearch,
              title: "All case examples",
              description: "Return to the claims center case library.",
              href: "/claims",
            },
          ]}
        />
      </InsurancePageBand>
    </div>
  );
}
