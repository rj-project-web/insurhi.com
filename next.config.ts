import type { NextConfig } from "next";
import { guideSlugRedirects } from "./lib/content-slug-redirects";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  outputFileTracingIncludes: {
    "/**/*": ["./content/cms-content.json"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return guideSlugRedirects.map(({ source, destination }) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
