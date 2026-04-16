import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdsenseScript } from "@/components/adsense-script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteUrl } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  icons: {
    icon: "/insurhi-logo.png",
    apple: "/insurhi-logo.png",
  },
  title: {
    default: "Insurhi",
    template: `%s | Insurhi`,
  },
  description: "Insurance guides, comparisons, and claims help.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Insurhi",
    description: "Insurance guides, comparisons, and claims help.",
    url: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AdsenseScript />
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
