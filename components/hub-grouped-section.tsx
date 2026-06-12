import Link from "next/link";
import type { ReactNode } from "react";

type HubGroupedSectionProps = {
  idPrefix: string;
  slug: string;
  title: string;
  items: unknown[];
  totalCount: number;
  itemNoun: string;
  gridClassName?: string;
  hubHref: string;
  hubLinkLabel: string;
  children: ReactNode;
};

export function HubGroupedSection({
  idPrefix,
  slug,
  title,
  items,
  totalCount,
  itemNoun,
  gridClassName = "grid gap-4 sm:grid-cols-2",
  hubHref,
  hubLinkLabel,
  children,
}: HubGroupedSectionProps) {
  const remaining = totalCount - items.length;

  return (
    <section aria-labelledby={`${idPrefix}-${slug}`} className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 id={`${idPrefix}-${slug}`} className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Showing {items.length} of {totalCount} {itemNoun}
            {totalCount === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href={hubHref}
          className="text-sm font-medium text-sky-800 underline-offset-4 hover:underline dark:text-sky-400"
        >
          {remaining > 0 ? `View all ${totalCount} · ${hubLinkLabel}` : hubLinkLabel}
        </Link>
      </div>
      <div className={gridClassName}>{children}</div>
    </section>
  );
}
