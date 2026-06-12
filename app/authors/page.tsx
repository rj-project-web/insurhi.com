import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ShieldCheck, Users } from "lucide-react";

import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand, InsurancePanel } from "@/components/insurance-page-band";
import { StaticPageHero } from "@/components/static-page-hero";
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
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <StaticPageHero
          eyebrow="Editorial team"
          title="Editors & reviewers"
          description="Every Insurhi guide, comparison, and claims walkthrough is reviewed by an editor with category-specific focus. Our reviewers check policy forms, coverage limits, pricing, and claims workflows so guidance stays accurate and independent."
        />
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        {authors.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {authors.map((author) => (
              <Link key={author.id} href={`/authors/${author.slug}`} className="group">
                <InsurancePanel className="flex h-full flex-col gap-3 p-5 transition-all group-hover:-translate-y-0.5 group-hover:border-sky-300/60 group-hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-800 to-sky-600 text-lg font-bold text-white">
                      {author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold tracking-tight text-foreground">{author.name}</p>
                      {author.role ? (
                        <p className="text-xs text-muted-foreground">{author.role}</p>
                      ) : null}
                    </div>
                  </div>
                  {author.credentials ? (
                    <p className="text-sm leading-6 text-muted-foreground">{author.credentials}</p>
                  ) : null}
                </InsurancePanel>
              </Link>
            ))}
          </div>
        ) : (
          <InsurancePanel className="p-5">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" aria-hidden />
              Reviewer profiles are being published.
            </p>
          </InsurancePanel>
        )}
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <HubQuickPaths
          description="See how our editorial team applies methodology across guides and reviews."
          paths={[
            {
              key: "methodology",
              icon: ShieldCheck,
              title: "Editorial methodology",
              description: "Coverage clarity, pricing context, and claim experience criteria.",
              href: "/methodology",
            },
            {
              key: "guides",
              icon: BookOpen,
              title: "Buying guides",
              description: "Category playbooks reviewed by our editorial team.",
              href: "/guides",
            },
            {
              key: "about",
              icon: Users,
              title: "About Insurhi",
              description: "Our mission and editorial independence.",
              href: "/about",
            },
          ]}
        />
      </InsurancePageBand>
    </div>
  );
}
