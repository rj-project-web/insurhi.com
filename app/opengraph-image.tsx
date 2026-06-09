import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Insurhi — independent insurance guides, comparisons, and claims help";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Independent & expert fact-checked",
    title: "Insurance guides, comparisons & claims help",
    subtitle: "Research-backed coverage decisions you can trust.",
  });
}
