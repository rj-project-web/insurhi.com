import Link from "next/link";
import { getProviders } from "@/lib/cms-client";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Insurance Providers",
  description: "Browse insurance providers and open profile pages for ratings, strengths, and category fit.",
  path: "/providers",
});

export default async function ProvidersPage() {
  const providers = (await getProviders()).filter((item) => item.slug);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-5">
        <h1 className="text-2xl font-semibold tracking-tight">Insurance providers</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Compare providers by service quality, category coverage, and policy support.
        </p>
      </section>

      <section className="rounded-xl border bg-card p-5">
        {providers.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {providers.map((provider) => (
              <Link
                key={provider.id}
                href={`/providers/${provider.slug}`}
                className="rounded-lg border bg-background px-4 py-3 text-sm transition-colors hover:bg-accent"
              >
                <p className="font-medium">{provider.name}</p>
                <p className="mt-1 text-muted-foreground">{provider.summary ?? "Open provider details"}</p>
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
