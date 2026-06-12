import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CategoryIconBadge } from "@/components/insurance-visuals";

export type HubCategoryItem = {
  slug: string;
  title: string;
  meta: string;
  href: string;
  linkLabel: string;
};

type HubCategoryGridProps = {
  heading: string;
  description: string;
  items: HubCategoryItem[];
};

export function HubCategoryGrid({ heading, description, items }: HubCategoryGridProps) {
  return (
    <section aria-labelledby="hub-category-heading" className="space-y-5">
      <div className="space-y-2">
        <h2
          id="hub-category-heading"
          className="text-2xl font-semibold tracking-tight text-blue-950 dark:text-blue-50"
        >
          {heading}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className="group rounded-2xl border border-blue-100 bg-background/90 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300/70 hover:shadow-md dark:border-blue-500/20"
          >
            <div className="flex items-start gap-3">
              <CategoryIconBadge slug={item.slug} label={item.title} />
              <div className="min-w-0">
                <p className="font-semibold text-blue-900 dark:text-blue-100">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.meta}</p>
              </div>
            </div>
            <p className="mt-3 inline-flex items-center text-sm font-medium text-sky-800 dark:text-sky-400">
              {item.linkLabel}
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
