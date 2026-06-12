import { CheckCircle2, Lightbulb } from "lucide-react";

type ClaimsGuideHighlightsProps = {
  items: string[];
};

export function ClaimsGuideHighlights({ items }: ClaimsGuideHighlightsProps) {
  if (!items.length) return null;

  return (
    <section className="rounded-2xl border border-sky-200/60 bg-gradient-to-r from-sky-50/90 via-blue-50/50 to-background p-5 shadow-sm dark:from-blue-950/30 dark:via-sky-950/20">
      <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
        <Lightbulb className="h-5 w-5 text-sky-600" />
        Start here
      </h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item, index) => (
          <li
            key={`highlight-${index}`}
            className="flex gap-2.5 rounded-xl border border-border/60 bg-background/90 px-3 py-2.5 text-sm leading-6 text-muted-foreground"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
