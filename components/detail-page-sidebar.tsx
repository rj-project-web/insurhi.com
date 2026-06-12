import Link from "next/link";
import { ArrowRight, Compass, ListTree } from "lucide-react";

import type { DetailSection } from "@/lib/detail-page-utils";

type HubLink = {
  href: string;
  label: string;
};

type DetailPageSidebarProps = {
  sections: DetailSection[];
  categorySlug?: string | null;
  categoryTitle?: string | null;
  hubLinks?: HubLink[];
};

const defaultHubLinks = (categorySlug: string, categoryTitle: string): HubLink[] => [
  { href: `/insurance/${categorySlug}`, label: `Browse ${categoryTitle.toLowerCase()}` },
  { href: `/insurance/${categorySlug}#compare`, label: "Compare products" },
  { href: `/claims#claims-playbooks`, label: "Claims playbooks" },
];

export function DetailPageSidebar({
  sections,
  categorySlug,
  categoryTitle,
  hubLinks,
}: DetailPageSidebarProps) {
  const links =
    hubLinks ??
    (categorySlug && categoryTitle ? defaultHubLinks(categorySlug, categoryTitle) : []);

  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      {sections.length > 0 ? (
        <nav
          aria-label="On this page"
          className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm"
        >
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700">
            <ListTree className="h-4 w-4" />
            On this page
          </p>
          <ol className="mt-3 space-y-1.5">
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  href={`#${section.id}`}
                  className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-sky-50 hover:text-sky-900"
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      {categorySlug && categoryTitle && links.length > 0 ? (
        <div className="rounded-2xl border border-sky-200/60 bg-gradient-to-br from-sky-50/80 to-blue-50/40 p-4 dark:from-blue-950/30 dark:to-sky-950/20">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700">
            <Compass className="h-4 w-4" />
            Category hub
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">{categoryTitle}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group inline-flex items-center text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                  <ArrowRight className="ml-1 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
