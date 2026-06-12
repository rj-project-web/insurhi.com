import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type InsuranceBandTone = "hero" | "surface" | "muted" | "accent" | "plain";

const toneBackground: Record<InsuranceBandTone, string> = {
  hero: "bg-gradient-to-br from-blue-900/[0.08] via-sky-500/[0.06] to-sky-50/40 dark:from-blue-950/40 dark:via-sky-950/20 dark:to-background",
  surface: "bg-background",
  muted: "bg-muted/40 border-y border-border/40",
  accent: "bg-gradient-to-b from-sky-100/50 via-blue-50/30 to-muted/25 dark:from-sky-950/25 dark:via-blue-950/15 dark:to-muted/10",
  plain: "bg-background",
};

type InsurancePageBandProps = {
  id?: string;
  tone?: InsuranceBandTone;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
};

/** Full-bleed scroll band — breaks out of max-w-6xl main for alternating page rhythm. */
export function InsurancePageBand({
  id,
  tone = "surface",
  className,
  innerClassName,
  children,
}: InsurancePageBandProps) {
  return (
    <div
      className={cn(
        "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2",
        toneBackground[tone],
        className,
      )}
    >
      <div className={cn("mx-auto max-w-6xl px-4 py-8 sm:py-10", innerClassName)}>
        {id ? (
          <section id={id} className="scroll-mt-[var(--insurance-subnav-offset,7rem)]">
            {children}
          </section>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

type InsurancePanelProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Inner content panel inside a band — single card surface per block group. */
export function InsurancePanel({ id, className, children }: InsurancePanelProps) {
  return (
    <div
      id={id}
      className={cn(
        "scroll-mt-[var(--insurance-subnav-offset,7rem)] rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur-sm sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
