import { getGlossaryTermBySlug } from "@/lib/cms-client";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Insurhi insurance glossary term";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

function shorten(text: string, max = 110): string {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = await getGlossaryTermBySlug(slug);

  return renderOgImage({
    eyebrow: "Insurance glossary",
    title: term?.term ?? "Insurance Term",
    subtitle: term?.definition ? shorten(term.definition) : "Plain-English insurance definitions.",
  });
}
