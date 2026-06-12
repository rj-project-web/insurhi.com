import Link from "next/link";
import { FileSearch, Sparkles } from "lucide-react";

type ClaimCaseHeroProps = {
  title: string;
  id: string;
  scenario: string;
};

export function ClaimCaseHero({ title, id, scenario }: ClaimCaseHeroProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-0 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative space-y-6">
        <p className="inline-flex flex-wrap items-center gap-1 rounded-full border border-sky-200/80 bg-background/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-sky-600" />
          <Link href="/claims" className="hover:text-foreground">
            Claims
          </Link>
          <span>/</span>
          <span>Case #{id}</span>
        </p>

        <div className="space-y-4">
          <p className="inline-flex items-center rounded-full border border-sky-200/70 bg-sky-50/80 px-3 py-1 text-xs font-medium text-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
            Case study
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.12]">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {scenario}
          </p>
        </div>

        <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <FileSearch className="h-4 w-4 text-sky-600" aria-hidden />
          Real-world claim scenario and documented outcome
        </p>
      </div>
    </div>
  );
}
