import Link from "next/link";

import { legalLinks, siteName } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>{new Date().getFullYear()} {siteName}. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/content-map" className="hover:text-foreground">
            Content map
          </Link>
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact
          </Link>
          {legalLinks.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
