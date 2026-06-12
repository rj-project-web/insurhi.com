import type { Metadata } from "next";
import { Clock3, Handshake, Headset, Mail, ShieldCheck } from "lucide-react";

import { CmsRichText } from "@/components/cms-rich-text";
import { HubQuickPaths } from "@/components/hub-quick-paths";
import { InsurancePageBand, InsurancePanel } from "@/components/insurance-page-band";
import { StaticPageHero } from "@/components/static-page-hero";
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

const contactChannels = [
  {
    title: "Editorial",
    description: "Content corrections, source updates, and fact-check requests.",
    icon: Mail,
    tone: "text-sky-600",
  },
  {
    title: "Support",
    description: "Website issues, broken links, and account or access related questions.",
    icon: Headset,
    tone: "text-sky-700",
  },
  {
    title: "Partnerships",
    description: "Business collaboration, media requests, and data licensing discussions.",
    icon: Handshake,
    tone: "text-blue-700",
  },
];

export default async function ContactPage() {
  const cmsPage = await getPageBySlug("contact");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <div className="-mx-4 -my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <InsurancePageBand tone="hero" innerClassName="py-10 sm:py-12 lg:py-14">
        <StaticPageHero
          eyebrow="Contact"
          title={cmsPage?.title ?? "Contact Insurhi"}
          description="Reach our team for editorial questions, product feedback, and partnership opportunities. We route each request to the right owner and reply with clear next steps."
        />
      </InsurancePageBand>

      <InsurancePageBand tone="accent" innerClassName="py-8 sm:py-10">
        <div className="grid gap-3 md:grid-cols-3">
          {contactChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <InsurancePanel key={channel.title} className="p-5">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Icon className={`h-4 w-4 ${channel.tone}`} aria-hidden />
                  {channel.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{channel.description}</p>
              </InsurancePanel>
            );
          })}
        </div>
      </InsurancePageBand>

      <InsurancePageBand tone="surface" innerClassName="py-8 sm:py-10">
        <InsurancePanel className="p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Contact details</h2>
          {cmsPage?.content ? (
            <div className="mt-4 max-w-3xl">
              <CmsRichText content={cmsPage.content} />
            </div>
          ) : (
            <p className="mt-4 max-w-3xl text-muted-foreground">
              Contact channel placeholder for editorial, support, and partnership inquiries.
            </p>
          )}
        </InsurancePanel>
      </InsurancePageBand>

      <InsurancePageBand tone="muted" innerClassName="py-8 sm:py-10">
        <div className="space-y-8">
          <InsurancePanel className="p-5">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Response expectations
            </h2>
            <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
              <Clock3 className="mt-0.5 h-4 w-4 text-sky-600" aria-hidden />
              <p>
                Most requests receive a first response within 1–2 business days. Complex partnership or
                data inquiries may require additional review.
              </p>
            </div>
          </InsurancePanel>

          <HubQuickPaths
            description="While you wait, explore our editorial standards and research channels."
            paths={[
              {
                key: "methodology",
                icon: ShieldCheck,
                title: "Editorial methodology",
                description: "How we review products, providers, and claims guidance.",
                href: "/methodology",
              },
              {
                key: "about",
                icon: Mail,
                title: "About Insurhi",
                description: "Our mission and editorial independence.",
                href: "/about",
              },
              {
                key: "guides",
                icon: Headset,
                title: "Buying guides",
                description: "Self-serve answers for common coverage questions.",
                href: "/guides",
              },
            ]}
          />
        </div>
      </InsurancePageBand>
    </div>
  );
}
