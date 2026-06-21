import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * RSC prefetch requests (?_rsc=...) are internal Next.js flight payloads, not
 * standalone pages. Mark them noindex so crawlers do not treat them as duplicates.
 */
export function proxy(request: NextRequest) {
  if (!request.nextUrl.searchParams.has("_rsc")) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
