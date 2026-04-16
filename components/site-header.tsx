import Link from "next/link";
import Image from "next/image";

import { siteName, topNavItems } from "@/lib/site-data";

export function SiteHeader() {
  const mobileNavItems = topNavItems.filter(
    (item) => item.label !== "Claims Help" && item.label !== "About",
  );

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/insurhi-logo.png"
            alt={`${siteName} logo`}
            width={56}
            height={56}
            className="h-12 w-12 rounded-md object-cover md:h-14 md:w-14"
            priority
          />
          <span className="text-2xl font-semibold tracking-tight md:text-[1.9rem]">{siteName}</span>
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
