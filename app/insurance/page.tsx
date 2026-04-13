import type { Metadata } from "next";
import Link from "next/link";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { insuranceCategories } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Insurance Categories",
  description:
    "Browse auto, life, home, pet, medicare, and renters insurance comparisons and learning resources.",
  path: "/insurance",
});

export default function InsurancePage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Insurance", path: "/insurance" },
  ]);

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <h1 className="text-3xl font-semibold tracking-tight">Insurance Channels</h1>
      <p className="max-w-3xl text-muted-foreground">
        Browse category-specific comparisons, recommended plans, FAQs, and providers.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {insuranceCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/insurance/${category.slug}`}
            className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
          >
            <p className="font-medium">{category.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
