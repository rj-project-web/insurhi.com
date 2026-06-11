import { getProviderBySlug } from "@/lib/cms-client";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Insurhi insurance provider review";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);

  return renderOgImage({
    eyebrow: "Provider review",
    title: provider?.name ?? "Insurance Provider",
    subtitle: provider?.summary ?? "Independent ratings, coverage, and claims insights.",
  });
}
