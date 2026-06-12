import type { ReactNode } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

type StaticPageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  breadcrumbHref?: string;
  children?: ReactNode;
};

export function StaticPageHero({
  eyebrow,
  title,
  description,
  breadcrumbHref,
  children,
}: StaticPageHeroProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-0 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative space-y-6">
        <p className="inline-flex flex-wrap items-center gap-1 rounded-full border border-sky-200/80 bg-background/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-sky-600" aria-hidden />
          {breadcrumbHref ? (
            <>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <Link href={breadcrumbHref} className="hover:text-foreground">
                {eyebrow}
              </Link>
            </>
          ) : (
            <span>{eyebrow}</span>
          )}
        </p>

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.12]">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {description}
            </p>
          ) : null}
        </div>

        {children}
      </div>
    </div>
  );
}
