import Link from "next/link";
import { getProviders } from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Compare Insurance Providers 2026 | Ratings, Strengths, Coverage | Insurhi",
  description:
    "Compare insurance providers by service quality, category coverage, claim handling, and ratings. Open profile pages to review strengths and policy fit.",
  path: "/providers",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Providers", path: "/providers" },
]);

export default async function ProvidersPage() {
  const providers = (await getProviders()).filter((item) => item.slug);

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="rounded-2xl border bg-gradient-to-br from-card via-indigo-500/[0.05] to-blue-500/[0.04] p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Insurance / Providers
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Insurance providers</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Review insurers by service quality, category coverage, and claim handling. Use provider pages alongside
          product comparisons to find the right combination of price and reliability.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link
            href="/insurance"
            className="rounded-full border bg-background px-3 py-1.5 transition-colors hover:bg-accent"
          >
            Insurance categories
          </Link>
          <Link
            href="/products"
            className="rounded-full border bg-background px-3 py-1.5 transition-colors hover:bg-accent"
          >
            Insurance products
          </Link>
          <Link
            href="/methodology"
            className="rounded-full border bg-background px-3 py-1.5 transition-colors hover:bg-accent"
          >
            Review methodology
          </Link>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">All providers</h2>
          <p className="text-xs text-muted-foreground">{providers.length} entries</p>
        </div>
        {providers.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <Link
                key={provider.id}
                href={`/providers/${provider.slug}`}
                className="rounded-lg border bg-background px-4 py-3 text-sm transition-colors hover:bg-accent"
              >
                <p className="font-medium">{provider.name}</p>
                <p className="mt-1 text-muted-foreground">{provider.summary ?? "Open provider profile"}</p>
                {typeof provider.rating === "number" ? (
                  <p className="mt-1 text-xs text-muted-foreground">Rating: {provider.rating} / 5</p>
                ) : null}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No providers are available yet.</p>
        )}
      </section>
    </div>
  );
}
