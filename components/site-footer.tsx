import Link from "next/link";
import Image from "next/image";

import { legalLinks, siteName } from "@/lib/site-data";

const resourceLinks = [
  { href: "/guides", label: "Expert guides" },
  { href: "/claims", label: "Claims support" },
  { href: "/glossary", label: "Insurance glossary" },
  { href: "/products", label: "Market data" },
];

const companyLinks = [
  { href: "/methodology", label: "Our methodology" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact us" },
  ...legalLinks,
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-3">
            <Link href="/" className="inline-flex">
              <Image
                src="/insurhi-logo.png"
                alt="Insurhi logo"
                width={525}
                height={154}
                className="h-10 w-auto"
              />
            </Link>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Insurhi provides honest, research-backed insurance guidance. We simplify complex
              coverage decisions through transparent methodology and expert analysis.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Resources</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {resourceLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {companyLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-xs leading-5 text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {siteName}. All rights reserved. Insurance coverage and
            rates are subject to underwriting approval and regional availability.
          </p>
          <p className="mt-2">
            <Link href="/content-map" className="hover:text-foreground hover:underline">
              Content map
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
