import Link from "next/link";
import { getProducts } from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Compare Insurance Products 2026 | Coverage, Pricing, Claims | Insurhi",
  description:
    "Browse insurance products with coverage highlights, pricing bands, claim quality, and provider details. Compare options before requesting full quotes.",
  path: "/products",
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
]);

export default async function ProductsPage() {
  const products = (await getProducts()).filter((item) => item.slug);

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="rounded-2xl border bg-gradient-to-br from-card via-blue-500/[0.04] to-cyan-500/[0.04] p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Insurance / Products
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Insurance products</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Compare published insurance products by coverage scope, pricing bands, and provider service quality.
          Each detail page includes structured pros/cons, premium estimates, and FAQ.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link
            href="/insurance"
            className="rounded-full border bg-background px-3 py-1.5 transition-colors hover:bg-accent"
          >
            Insurance categories
          </Link>
          <Link
            href="/providers"
            className="rounded-full border bg-background px-3 py-1.5 transition-colors hover:bg-accent"
          >
            Insurance providers
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
          <h2 className="text-lg font-semibold tracking-tight">All products</h2>
          <p className="text-xs text-muted-foreground">{products.length} entries</p>
        </div>
        {products.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="rounded-lg border bg-background px-4 py-3 text-sm transition-colors hover:bg-accent"
              >
                <p className="font-medium">{product.name}</p>
                <p className="mt-1 text-muted-foreground">
                  {product.priceRange ?? product.coverageAmount ?? "Open product details"}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No products are available yet.</p>
        )}
      </section>
    </div>
  );
}
