import Link from "next/link";
import { ArrowRight, BookOpen, FileCheck2, Shield } from "lucide-react";

type GuideQuickPathsProps = {
  categorySlug?: string | null;
  categoryTitle?: string | null;
  fallbackCategoryPath: string;
};

const paths = [
  {
    key: "category",
    icon: Shield,
    title: "Insurance category",
    description: "Browse guides, products, and FAQs in one hub.",
  },
  {
    key: "guides",
    icon: BookOpen,
    title: "More guides",
    description: "Continue learning with related buying playbooks.",
    href: "/guides",
  },
  {
    key: "claims",
    icon: FileCheck2,
    title: "Claims assistance",
    description: "Step-by-step workflows and document checklists.",
    href: "/claims",
  },
] as const;

export function GuideQuickPaths({
  categorySlug,
  categoryTitle,
  fallbackCategoryPath,
}: GuideQuickPathsProps) {
  const categoryHref = categorySlug ? `/insurance/${categorySlug}` : fallbackCategoryPath;
  const categoryLabel = categoryTitle ?? "Insurance categories";

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Continue exploring
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Jump to the next step in your research — compare options, read more guides, or prepare
          for a claim.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((path) => {
          const Icon = path.icon;
          const href = path.key === "category" ? categoryHref : path.href;
          const title = path.key === "category" ? categoryLabel : path.title;

          return (
            <Link
              key={path.key}
              href={href}
              className="group flex flex-col rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300/60 hover:shadow-md"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="mt-3 font-medium text-foreground">{title}</span>
              <span className="mt-1 flex-1 text-sm text-muted-foreground">{path.description}</span>
              <span className="mt-3 inline-flex items-center text-sm font-medium text-sky-700 group-hover:text-sky-900">
                Open
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
