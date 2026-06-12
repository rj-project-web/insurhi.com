import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";

import { GlossaryTermCard } from "@/components/glossary-term-card";
import { InsurancePanel } from "@/components/insurance-page-band";
import type { CmsGlossaryTerm } from "@/lib/cms-client";
import type { glossaryResourceLinks } from "@/lib/glossary-links";

type GlossaryResources = (typeof glossaryResourceLinks)[string];

type GlossaryTermContentProps = {
  definition: string;
  resources?: GlossaryResources;
  relatedTerms: CmsGlossaryTerm[];
};

export function GlossaryTermContent({
  definition,
  resources,
  relatedTerms,
}: GlossaryTermContentProps) {
  return (
    <div className="space-y-6">
      <InsurancePanel id="definition" className="p-6 sm:p-8">
        <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
          <BookOpenText className="h-5 w-5 text-sky-600" aria-hidden />
          Definition
        </h2>
        <p className="mt-4 text-base leading-8 text-muted-foreground">{definition}</p>
      </InsurancePanel>

      {resources?.guides?.length || resources?.claims?.length || resources?.insurance ? (
        <InsurancePanel id="related-reading" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Related reading</h2>
          <div className="mt-4 flex flex-col gap-2">
            {resources.insurance ? (
              <Link
                href={`/insurance/${resources.insurance}`}
                className="group inline-flex items-center font-medium text-sky-800 hover:text-sky-950"
              >
                Browse {resources.insurance} insurance hub
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ) : null}
            {resources.guides?.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group inline-flex items-center text-muted-foreground hover:text-foreground"
              >
                {guide.label}
                <ArrowRight className="ml-1 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
            {resources.claims?.map((guide) => (
              <Link
                key={guide.slug}
                href={`/claims/guides/${guide.slug}`}
                className="group inline-flex items-center text-muted-foreground hover:text-foreground"
              >
                {guide.label}
                <ArrowRight className="ml-1 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </InsurancePanel>
      ) : null}

      {relatedTerms.length > 0 ? (
        <InsurancePanel id="related-terms" className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Related terms</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {relatedTerms.map((related) => (
              <GlossaryTermCard key={related.id} term={related} />
            ))}
          </div>
        </InsurancePanel>
      ) : null}
    </div>
  );
}

export function getGlossaryTermSections(input: {
  resources?: GlossaryResources;
  relatedTerms: CmsGlossaryTerm[];
}) {
  const sections = [{ id: "definition", label: "Definition" }];
  if (input.resources?.guides?.length || input.resources?.claims?.length || input.resources?.insurance) {
    sections.push({ id: "related-reading", label: "Related reading" });
  }
  if (input.relatedTerms.length) sections.push({ id: "related-terms", label: "Related terms" });
  return sections;
}
