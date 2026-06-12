import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BookOpenText,
  Calculator,
  ClipboardList,
  FileSearch,
  FolderKanban,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { HubIndexHero } from "@/components/hub-index-hero";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand, InsurancePanel } from "@/components/insurance-page-band";
import { CATEGORY_SLUGS, categoryContentHubs } from "@/lib/category-content-hub";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Insurance Resources Hub",
  description:
    "Learning tracks, glossary definitions, comparison tools, and category-specific reference content for insurance research.",
  path: "/resources",
});

export default function ResourcesPage() {
  const resourceTracks = [
    {
      title: "Coverage learning track",
      description:
        "Understand coverage terms, deductible logic, and category-specific risk trade-offs.",
      href: "/guides",
      cta: "Browse guides",
      icon: BookOpenText,
    },
    {
      title: "Claims preparation track",
      description:
        "Review filing steps, timelines, and practical case references before incidents occur.",
      href: "/claims",
      cta: "Open claims center",
      icon: FileSearch,
    },
    {
      title: "Coverage term glossary",
      description:
        "Plain-language definitions for deductibles, replacement cost, UM/UIM, Medigap, and more.",
      href: "/glossary",
      cta: "Open glossary",
      icon: BookOpenText,
    },
    {
      title: "Comparison track",
      description: "Compare products and providers with a consistent channel-by-channel framework.",
      href: "/insurance",
      cta: "Start comparing",
      icon: ShieldCheck,
    },
  ];

  const upcomingTools = [
    "Premium and deductible scenario calculator",
    "State and regional insurance requirement references",
    "Plan comparison worksheets for family decision-making",
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
  ]);

  const stats = [
    { label: "Resource tracks", value: `${resourceTracks.length} paths`, icon: FolderKanban },
    { label: "Upcoming tools", value: `${upcomingTools.length} planned`, icon: Calculator },
    { label: "Use cases", value: "Learn · Compare · Claim", icon: Sparkles },
    { label: "Categories", value: `${CATEGORY_SLUGS.length} hubs`, icon: ShieldCheck },
  ];

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <HubIndexHero
          eyebrow="Reference & learning hub"
          title="Explore insurance resources"
          description="Practical tools, explainers, and reference content to make insurance comparisons easier and more consistent."
          stats={stats}
        />
      </InsurancePageBand>

      <InsurancePageBand tone="accent" innerClassName="py-8 sm:py-10">
        <div className="space-y-5">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Resource tracks
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Follow a structured path for learning, comparing, or preparing for claims.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {resourceTracks.map((track) => {
              const Icon = track.icon;
              return (
                <InsurancePanel key={track.title} className="flex flex-col p-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="mt-3 font-medium text-foreground">{track.title}</p>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{track.description}</p>
                  <Link
                    href={track.href}
                    className="mt-3 inline-flex items-center text-sm font-medium text-sky-800 hover:text-sky-950 dark:text-sky-400"
                  >
                    {track.cta}
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </InsurancePanel>
              );
            })}
          </div>
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <div className="space-y-5">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Browse by insurance category
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Each hub connects buying guides, product comparisons, claims playbooks, FAQs, and glossary terms.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_SLUGS.map((slug) => {
              const hub = categoryContentHubs[slug];
              return (
                <InsurancePanel key={slug} className="p-4">
                  <Link
                    href={`/insurance/${slug}`}
                    className="font-medium text-sky-800 hover:text-sky-950 dark:text-sky-400"
                  >
                    {hub.title}
                  </Link>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    <li>
                      <Link
                        href={`/guides/${hub.deepGuide.slug}`}
                        className="hover:text-foreground hover:underline"
                      >
                        {hub.deepGuide.label}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/products/${hub.flagshipProduct.slug}`}
                        className="hover:text-foreground hover:underline"
                      >
                        {hub.flagshipProduct.label}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/claims/${slug}`} className="hover:text-foreground hover:underline">
                        Claims center
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/insurance/${slug}#glossary`}
                        className="hover:text-foreground hover:underline"
                      >
                        Key terms
                      </Link>
                    </li>
                  </ul>
                </InsurancePanel>
              );
            })}
          </div>
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <InsurancePanel className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Planned tools and references
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Upcoming calculators and worksheets to support side-by-side decision-making.
              </p>
            </div>
            <Link
              href="/content-map"
              className="text-sm font-medium text-sky-800 underline-offset-4 hover:underline dark:text-sky-400"
            >
              Open content map
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {upcomingTools.map((item) => (
              <article
                key={item}
                className="rounded-xl border border-blue-100 bg-background p-4 text-sm text-muted-foreground"
              >
                <p className="inline-flex items-center gap-2 font-medium text-foreground">
                  <Calculator className="h-4 w-4 text-sky-600" aria-hidden />
                  {item}
                </p>
              </article>
            ))}
          </div>
        </InsurancePanel>
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
            description="Connect learning tracks to guides, glossary terms, and claims playbooks."
            paths={[
              {
                key: "guides",
                icon: BookOpen,
                title: "Buying guides",
                description: "Structured playbooks for smarter coverage decisions.",
                href: "/guides",
              },
              {
                key: "glossary",
                icon: BookOpenText,
                title: "Glossary",
                description: "Plain-language definitions indexed by category.",
                href: "/glossary",
              },
              {
                key: "claims",
                icon: ClipboardList,
                title: "Claims center",
                description: "Filing workflows, checklists, and case studies.",
                href: "/claims",
            },
          ]}
        />
      </InsurancePageBand>
    </div>
  );
}
