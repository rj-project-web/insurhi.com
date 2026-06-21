import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";

import { GlossaryTermCard } from "@/components/glossary-term-card";
import { InsurancePanel } from "@/components/insurance-page-band";
import type { CmsGlossaryTerm } from "@/lib/cms-client";
import type { glossaryResourceLinks } from "@/lib/glossary-links";

type GlossaryResources = (typeof glossaryResourceLinks)[string];

type GlossaryTermContentProps = {
  term: string;
  definition: string;
  categoryTitle?: string | null;
  resources?: GlossaryResources;
  relatedTerms: CmsGlossaryTerm[];
};

export function buildGlossaryFaqs(input: { term: string; definition: string; categoryTitle?: string | null }) {
  const categoryText = input.categoryTitle ? ` in ${input.categoryTitle.toLowerCase()}` : "";
  return [
    {
      question: `What does ${input.term} mean${categoryText}?`,
      answer: input.definition,
    },
    {
      question: `Why does ${input.term} matter?`,
      answer: `${input.term} can affect what is covered, how much you pay out of pocket, and what evidence you need when comparing policies or filing a claim.`,
    },
    {
      question: `What should I check before buying coverage involving ${input.term}?`,
      answer: `Check the policy wording, limits, exclusions, waiting periods, deductibles, and claim documentation rules tied to ${input.term}.`,
    },
  ];
}

export function GlossaryTermContent({
  term,
  definition,
  categoryTitle,
  resources,
  relatedTerms,
}: GlossaryTermContentProps) {
  const categoryText = categoryTitle ? `${categoryTitle.toLowerCase()} ` : "";
  const relatedNames = relatedTerms.slice(0, 3).map((item) => item.term);
  const glossaryFaqs = buildGlossaryFaqs({ term, definition, categoryTitle });

  return (
    <div className="space-y-6">
      <InsurancePanel id="quick-answer" className="p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Quick answer</p>
        <h2 className="mt-2 flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
          <BookOpenText className="h-5 w-5 text-sky-600" aria-hidden />
          What does {term} mean?
        </h2>
        <p className="mt-4 text-base leading-8 text-muted-foreground">{definition}</p>
      </InsurancePanel>

      <InsurancePanel id="definition" className="p-6 sm:p-8">
        <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
          <BookOpenText className="h-5 w-5 text-sky-600" aria-hidden />
          How it works
        </h2>
        <p className="mt-4 text-base leading-8 text-muted-foreground">
          In {categoryText}policies, {term.toLowerCase()} is usually defined in the contract rather
          than in marketing copy. Read the exact wording, then check whether the term changes your
          deductible, covered causes of loss, documentation burden, or claim payout.
        </p>
      </InsurancePanel>

      <InsurancePanel id="example" className="p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Example and common mistake</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-background/90 p-4">
            <h3 className="font-semibold text-foreground">Example</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Before choosing a policy, compare how {term.toLowerCase()} appears in the declarations
              page, coverage form, and exclusions. Small wording differences can change the claim
              result.
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/90 p-4">
            <h3 className="font-semibold text-foreground">Common mistake</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Do not assume {term.toLowerCase()} means the same thing across carriers. Confirm the
              limit, trigger, waiting period, or proof requirements before relying on a quote.
            </p>
          </div>
        </div>
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

      <InsurancePanel id="term-faqs" className="p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Common questions</h2>
        <div className="mt-4 space-y-4">
          {glossaryFaqs.map((item) => (
            <div key={item.question} className="rounded-xl border border-border/70 bg-background/90 p-4">
              <h3 className="font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </div>
          ))}
          {relatedNames.length > 0 ? (
            <p className="text-sm leading-6 text-muted-foreground">
              Related concepts to compare: {relatedNames.join(", ")}.
            </p>
          ) : null}
        </div>
      </InsurancePanel>
    </div>
  );
}

export function getGlossaryTermSections(input: {
  resources?: GlossaryResources;
  relatedTerms: CmsGlossaryTerm[];
}) {
  const sections = [
    { id: "quick-answer", label: "Quick answer" },
    { id: "definition", label: "How it works" },
    { id: "example", label: "Example" },
  ];
  if (input.resources?.guides?.length || input.resources?.claims?.length || input.resources?.insurance) {
    sections.push({ id: "related-reading", label: "Related reading" });
  }
  if (input.relatedTerms.length) sections.push({ id: "related-terms", label: "Related terms" });
  sections.push({ id: "term-faqs", label: "FAQs" });
  return sections;
}
