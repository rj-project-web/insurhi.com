import { permanentRedirect, notFound } from "next/navigation";
import { insuranceCategories } from "@/lib/site-data";

type ClaimsCategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return insuranceCategories.map((category) => ({ slug: category.slug }));
}

export default async function ClaimsCategoryRedirectPage({ params }: ClaimsCategoryPageProps) {
  const { slug } = await params;
  const matched = insuranceCategories.find((category) => category.slug === slug);

  if (!matched) {
    notFound();
  }

  permanentRedirect(`/insurance/${matched.slug}`);
}
