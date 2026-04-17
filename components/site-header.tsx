import Link from "next/link";
import Image from "next/image";

import { topNavItems } from "@/lib/site-data";

export function SiteHeader() {
  const mobileNavItems = topNavItems.filter(
    (item) => item.label !== "Claims Help" && item.label !== "About",
  );

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/insurhi-logo.png"
            alt="Insurhi logo"
            width={525}
            height={154}
            className="h-12 w-auto md:h-14"
            priority
          />
        </Link>
        <nav className="flex items-center gap-3 text-sm text-muted-foreground md:gap-4">
          {mobileNavItems.map((item) => (
            <Link
              key={`mobile-${item.href}`}
              href={item.href}
              className="transition-colors hover:text-foreground md:hidden"
            >
              {item.label}
            </Link>
          ))}
          {topNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden transition-colors hover:text-foreground md:inline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
