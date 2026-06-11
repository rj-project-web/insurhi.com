import { getClaimsGuideBySlug } from "@/lib/cms-client";
import { buildClaimsGuidePageTitle } from "@/lib/page-titles";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Insurhi insurance claims guide";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getClaimsGuideBySlug(slug);

  return renderOgImage({
    eyebrow: "Claims guide",
    title: guide ? buildClaimsGuidePageTitle(guide.title) : "Insurance Claims Guide",
    subtitle: "Step-by-step claim filing, documents, and timelines.",
  });
}
