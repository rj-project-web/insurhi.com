import { getCategoryBySlug } from "@/lib/cms-client";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { insuranceCategories } from "@/lib/site-data";

export const alt = "Insurhi insurance category hub";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

function titleCase(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const fallback = insuranceCategories.find((item) => item.slug === slug);
  const name = category?.title ?? fallback?.title ?? titleCase(slug);

  return renderOgImage({
    eyebrow: "Insurance hub",
    title: name,
    subtitle: "Compare products, providers, claims, and key terms.",
  });
}
