import { getProductBySlug } from "@/lib/cms-client";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Insurhi insurance product review";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const title = product?.seo?.metaTitle ?? product?.name ?? "Insurance Product Review";

  return renderOgImage({
    eyebrow: "Product review",
    title,
    subtitle: product?.oneLineVerdict ?? "Independent ratings, pricing, and claims data.",
  });
}
