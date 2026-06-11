import { getAuthorBySlug } from "@/lib/cms-client";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Insurhi editorial reviewer";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  return renderOgImage({
    eyebrow: "Editorial team",
    title: author?.name ?? "Insurhi Reviewer",
    subtitle: author?.role ?? "Independent insurance research and review.",
  });
}
