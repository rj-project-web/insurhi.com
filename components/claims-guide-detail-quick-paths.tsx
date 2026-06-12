import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, Compass } from "lucide-react";

type ClaimsGuideDetailQuickPathsProps = {
  categorySlug?: string | null;
  categoryTitle?: string | null;
};

export function ClaimsGuideDetailQuickPaths({
  categorySlug,
  categoryTitle,
}: ClaimsGuideDetailQuickPathsProps) {
  const paths = [
    {
      key: "claims",
      icon: ClipboardList,
      title: "All claim playbooks",
      description: "Browse every step-by-step claims workflow on Insurhi.",
      href: "/claims#claims-playbooks",
    },
    {
      key: "category",
      icon: Compass,
      title: categoryTitle ?? "Insurance category",
      description: "Compare products, read buying guides, and review category FAQs.",
      href: categorySlug ? `/insurance/${categorySlug}` : "/insurance",
    },
    {
      key: "guides",
      icon: BookOpen,
      title: "Buying guides",
      description: "Understand coverage limits and exclusions before you need to file.",
      href: "/guides",
    },
  ] as const;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Continue exploring
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Pair this playbook with coverage research so you know what your policy actually covers
          before an incident.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((path) => {
          const Icon = path.icon;
          return (
            <Link
              key={path.key}
              href={path.href}
              className="group flex flex-col rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300/60 hover:shadow-md"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="mt-3 font-medium text-foreground">{path.title}</span>
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
