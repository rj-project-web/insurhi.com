import Link from "next/link";
import { getProducts } from "@/lib/cms-client";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Insurance Products",
  description: "Browse insurance products by coverage highlights, pricing bands, and provider details.",
  path: "/products",
});

export default async function ProductsPage() {
  const products = (await getProducts()).filter((item) => item.slug);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-5">
        <h1 className="text-2xl font-semibold tracking-tight">Insurance products</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse all published products and open each detail page for full comparison data.
        </p>
      </section>

      <section className="rounded-xl border bg-card p-5">
        {products.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="rounded-lg border bg-background px-4 py-3 text-sm transition-colors hover:bg-accent"
              >
                <p className="font-medium">{product.name}</p>
                <p className="mt-1 text-muted-foreground">
                  {product.priceRange ?? product.coverageAmount ?? "Open details"}
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
