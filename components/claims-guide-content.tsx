import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Clock,
  FileCheck2,
  FilePlus2,
  MessageSquare,
} from "lucide-react";

import { InsurancePanel } from "@/components/insurance-page-band";
import type { CmsClaimsGuide } from "@/lib/cms-client";

type ClaimsGuideContentProps = {
  guide: CmsClaimsGuide;
};

export function ClaimsGuideContent({ guide }: ClaimsGuideContentProps) {
  return (
    <div className="space-y-6">
      {guide.steps?.length ? (
        <InsurancePanel id="claim-steps" className="p-6 sm:p-8">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                Workflow
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Claim steps
              </h2>
              <p className="text-sm text-muted-foreground">
                Follow these in order from pre-authorization through appeal-ready documentation.
              </p>
            </div>
            <ol className="space-y-3">
              {guide.steps.map((step, index) => (
                <li
                  key={`${guide.id}-step-${index}`}
                  className="flex gap-4 rounded-xl border border-border/70 bg-background/90 p-4"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm leading-6 text-foreground sm:text-base">{step.step}</p>
                </li>
              ))}
            </ol>
          </div>
        </InsurancePanel>
      ) : null}

      {guide.documentChecklist?.length ? (
        <InsurancePanel id="document-checklist" className="p-6 sm:p-8">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                Preparation
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Document checklist
              </h2>
              <p className="text-sm text-muted-foreground">
                Gather these before filing to reduce back-and-forth with the adjuster.
              </p>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {guide.documentChecklist.map((item, index) => (
                <li
                  key={`${guide.id}-doc-${index}`}
                  className="flex gap-2.5 rounded-xl border border-border/70 bg-background/90 px-3 py-3 text-sm leading-6 text-foreground"
                >
                  <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" aria-hidden />
                  {item.item}
                </li>
              ))}
            </ul>
          </div>
        </InsurancePanel>
      ) : null}

      {guide.denialReasons?.length ? (
        <section
          id="denial-reasons"
          className="space-y-4 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-50/60 to-background p-6 shadow-sm dark:from-amber-500/10 sm:p-8 scroll-mt-[var(--insurance-subnav-offset,7rem)]"
        >
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              Risk watchlist
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Common reasons claims get denied
            </h2>
            <p className="text-sm text-muted-foreground">
              These show up most often in adjuster decisions for this claim type. Knowing them in
              advance usually changes how you document the loss.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {guide.denialReasons.map((row, index) => (
              <article
                key={`${guide.id}-denial-${index}`}
                className="rounded-xl border border-border/70 bg-background/95 p-4"
              >
                <p className="text-sm font-semibold text-foreground">{row.reason}</p>
                {row.explanation ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{row.explanation}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {guide.delayCauses?.length ? (
        <section
          id="delay-causes"
          className="space-y-4 rounded-2xl border border-sky-200/70 bg-gradient-to-br from-sky-50/70 to-background p-6 shadow-sm dark:from-sky-950/20 sm:p-8 scroll-mt-[var(--insurance-subnav-offset,7rem)]"
        >
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              <Clock className="h-4 w-4" />
              Timeline
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              What slows a claim down
            </h2>
            <p className="text-sm text-muted-foreground">
              Most delays come from these causes — often fixable with a single phone call or
              follow-up email.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {guide.delayCauses.map((row, index) => (
              <article
                key={`${guide.id}-delay-${index}`}
                className="rounded-xl border border-border/70 bg-background/95 p-4"
              >
                <p className="text-sm font-semibold text-foreground">{row.cause}</p>
                {row.explanation ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{row.explanation}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {guide.supplementalDocuments?.length ? (
        <InsurancePanel id="supplemental-documents" className="p-6 sm:p-8">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                <FilePlus2 className="h-4 w-4" />
                Be ready
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Supplemental documents you may be asked for
              </h2>
              <p className="text-sm text-muted-foreground">
                Adjusters routinely request additional records during review. Being ready keeps a
                claim from stalling.
              </p>
            </div>
            <div className="space-y-3">
              {guide.supplementalDocuments.map((row, index) => (
                <article
                  key={`${guide.id}-supp-${index}`}
                  className="rounded-xl border border-border/70 bg-background/90 p-4"
                >
                  <p className="text-sm font-semibold text-foreground">{row.scenario}</p>
                  {row.documents ? (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{row.documents}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </InsurancePanel>
      ) : null}

      {guide.nextActions?.length ? (
        <InsurancePanel id="next-actions" className="p-6 sm:p-8">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                <ArrowRight className="h-4 w-4" />
                Escalation
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                If your claim is denied, delayed, or short-paid
              </h2>
              <p className="text-sm text-muted-foreground">
                Concrete next steps for readers who hit a wall. Each one is a recognized consumer
                right or documented escalation path.
              </p>
            </div>
            <ol className="space-y-3">
              {guide.nextActions.map((row, index) => (
                <li
                  key={`${guide.id}-next-${index}`}
                  className="flex gap-3 rounded-xl border border-border/70 bg-background/90 px-4 py-3 text-sm leading-6 text-foreground sm:text-base"
                >
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                    {index + 1}
                  </span>
                  {row.action}
                </li>
              ))}
            </ol>
          </div>
        </InsurancePanel>
      ) : null}

      {guide.communicationNotes?.length ? (
        <InsurancePanel id="communication-notes" className="p-6 sm:p-8">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                <MessageSquare className="h-4 w-4" />
                Paper trail
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Talking to the carrier and your state regulator
              </h2>
              <p className="text-sm text-muted-foreground">
                How you communicate matters. These notes help you keep a written paper trail and use
                language carriers and state DOIs recognize.
              </p>
            </div>
            <ul className="space-y-2.5">
              {guide.communicationNotes.map((row, index) => (
                <li
                  key={`${guide.id}-comm-${index}`}
                  className="flex gap-2.5 rounded-xl border border-border/70 bg-background/90 px-3 py-3 text-sm leading-6 text-foreground"
                >
                  <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" aria-hidden />
                  {row.note}
                </li>
              ))}
            </ul>
          </div>
        </InsurancePanel>
      ) : null}
    </div>
  );
}
