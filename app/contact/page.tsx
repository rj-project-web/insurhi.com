import type { Metadata } from "next";
import { Clock3, Handshake, Headset, Mail } from "lucide-react";

import { CmsRichText } from "@/components/cms-rich-text";
import { getPageBySlug } from "@/lib/cms-client";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("contact");
  const title = page?.seo?.metaTitle ?? "Contact";
  const description =
    page?.seo?.metaDescription ??
    "Contact channel for editorial, support, and partnership inquiries.";

  return buildMetadata({
    title,
    description,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const cmsPage = await getPageBySlug("contact");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section
        className="relative overflow-hidden rounded-2xl border bg-card p-6 lg:p-8"
        style={{ backgroundImage: "url('/home-latest-bg.svg')" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/[0.08] via-cyan-500/[0.05] to-card" />
        <div className="relative space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">{cmsPage?.title ?? "Contact"}</h1>
          <p className="max-w-3xl text-muted-foreground">
            Reach our team for editorial questions, product feedback, and partnership opportunities.
            We route each request to the right owner and reply with clear next steps.
          </p>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border bg-gradient-to-br from-card to-blue-500/[0.03] p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Mail className="h-4 w-4 text-blue-600" />
            Editorial
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Content corrections, source updates, and fact-check requests.
          </p>
        </article>
        <article className="rounded-xl border bg-gradient-to-br from-card to-cyan-500/[0.03] p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Headset className="h-4 w-4 text-cyan-600" />
            Support
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Website issues, broken links, and account or access related questions.
          </p>
        </article>
        <article className="rounded-xl border bg-gradient-to-br from-card to-indigo-500/[0.03] p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Handshake className="h-4 w-4 text-indigo-600" />
            Partnerships
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Business collaboration, media requests, and data licensing discussions.
          </p>
        </article>
      </section>

      {cmsPage?.content ? (
        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold tracking-tight">Contact details</h2>
          <div className="mt-3 max-w-3xl">
            <CmsRichText content={cmsPage.content} />
          </div>
        </section>
      ) : (
        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold tracking-tight">Contact details</h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Contact channel placeholder for editorial, support, and partnership inquiries.
          </p>
        </section>
      )}

      <section className="rounded-xl border bg-gradient-to-br from-card to-emerald-500/[0.03] p-5">
        <h2 className="text-lg font-semibold tracking-tight">Response expectations</h2>
        <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
          <Clock3 className="mt-0.5 h-4 w-4 text-emerald-600" />
          <p>
            Most requests receive a first response within 1-2 business days. Complex partnership or
            data inquiries may require additional review.
          </p>
        </div>
      </section>
    </div>
  );
}
