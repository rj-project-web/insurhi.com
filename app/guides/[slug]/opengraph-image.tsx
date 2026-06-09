import { getArticleBySlug } from "@/lib/cms-client";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Insurhi insurance guide";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const title = article?.seo?.metaTitle ?? article?.title ?? "Insurance Guide";

  return renderOgImage({
    eyebrow: "Insurance guide",
    title,
    subtitle: "Expert fact-checked, independent guidance.",
  });
}
