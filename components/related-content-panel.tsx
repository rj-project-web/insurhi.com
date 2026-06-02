import Link from "next/link";
import { ArrowRight, Link2 } from "lucide-react";

import type { RelatedContentBundle } from "@/lib/content-links";

type RelatedContentPanelProps = {
  bundle: RelatedContentBundle;
  title?: string;
  className?: string;
};

export function RelatedContentPanel({
  bundle,
  title = "Related reading",
  className,
}: RelatedContentPanelProps) {
  if (!bundle.groups.length) return null;

  return (
    <section
      className={
        className ??
        "space-y-4 rounded-xl border bg-gradient-to-br from-card via-blue-500/[0.03] to-cyan-500/[0.04] p-5"
      }
    >
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-cyan-600" />
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {bundle.groups.map((group) => (
          <div key={group.title} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {group.title}
            </p>
            <ul className="space-y-1.5">
              {group.links.map((link) => (
                <li key={`${group.title}-${link.href}`}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {link.label}
                    <ArrowRight className="ml-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
