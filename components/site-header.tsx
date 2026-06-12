import Link from "next/link";
import Image from "next/image";

import { topNavItems } from "@/lib/site-data";

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
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
        <nav className="flex items-center gap-3 text-sm text-muted-foreground md:gap-5">
          {topNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
