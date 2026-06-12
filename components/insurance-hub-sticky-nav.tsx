"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  CircleHelp,
  ClipboardCheck,
  Compass,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks: Array<{ href: string; id: string; label: string; icon: LucideIcon }> = [
  { href: "#topic-cluster", id: "topic-cluster", label: "Overview", icon: Compass },
  { href: "#buying-guides", id: "buying-guides", label: "Guides", icon: BookOpen },
  { href: "#compare", id: "compare", label: "Compare", icon: ClipboardCheck },
  { href: "#claims-guides", id: "claims-guides", label: "Claims", icon: FileText },
  { href: "#faqs", id: "faqs", label: "FAQs", icon: CircleHelp },
];

const SECTION_IDS = navLinks.map((link) => link.id);
const BODY_PINNED_CLASS = "insurance-subnav-pinned";

export function InsuranceHubStickyNav() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const headerOffsetRef = useRef(76);
  const barHeightRef = useRef(56);
  const isPinnedRef = useRef(false);

  const [activeId, setActiveId] = useState(SECTION_IDS[0]);
  const [isPinned, setIsPinned] = useState(false);
  const [barHeight, setBarHeight] = useState(56);
  const [headerOffset, setHeaderOffset] = useState(76);

  useEffect(() => {
    const measureLayout = () => {
      const header = document.querySelector("header");
      if (header) {
        headerOffsetRef.current = Math.round(header.getBoundingClientRect().height);
        setHeaderOffset(headerOffsetRef.current);
      }
      if (barRef.current) {
        barHeightRef.current = barRef.current.offsetHeight;
        setBarHeight(barHeightRef.current);
      }
      const offset = isPinnedRef.current
        ? barHeightRef.current + 8
        : headerOffsetRef.current + barHeightRef.current + 8;
      document.documentElement.style.setProperty("--insurance-subnav-offset", `${offset}px`);
    };

    const resolveActiveSection = () => {
      const anchorLine = isPinnedRef.current
        ? barHeightRef.current + 12
        : headerOffsetRef.current + barHeightRef.current + 12;

      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;

      if (nearBottom) {
        return SECTION_IDS[SECTION_IDS.length - 1];
      }

      let current = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= anchorLine) {
          current = id;
        }
      }
      return current;
    };

    const setPinned = (pinned: boolean) => {
      isPinnedRef.current = pinned;
      setIsPinned(pinned);
      document.body.classList.toggle(BODY_PINNED_CLASS, pinned);
      measureLayout();
    };

    measureLayout();

    const header = document.querySelector("header");
    const ro = new ResizeObserver(measureLayout);
    if (header) ro.observe(header);
    if (barRef.current) ro.observe(barRef.current);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const sentinelTop = sentinelRef.current?.getBoundingClientRect().top ?? Infinity;
        setPinned(sentinelTop <= headerOffsetRef.current);

        const nextActive = resolveActiveSection();
        setActiveId((prev) => (prev === nextActive ? prev : nextActive));

        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measureLayout);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measureLayout);
      document.body.classList.remove(BODY_PINNED_CLASS);
    };
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-0 w-full" />
      {isPinned ? <div aria-hidden style={{ height: barHeight }} /> : null}
      <div
        ref={barRef}
        className={cn(
          "z-50 w-full border-b border-sky-200/70 bg-background/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/85",
          isPinned ? "fixed inset-x-0 top-0" : "sticky",
        )}
        style={isPinned ? undefined : { top: headerOffset }}
      >
        <nav aria-label="Page sections" className="py-2.5 sm:py-3">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:gap-4">
            {isPinned ? (
              <Link href="/" className="flex shrink-0 items-center">
                <Image
                  src="/insurhi-logo.png"
                  alt="Insurhi logo"
                  width={525}
                  height={154}
                  className="h-9 w-auto sm:h-10"
                />
              </Link>
            ) : (
              <p className="shrink-0 text-xs font-semibold uppercase tracking-wider text-sky-700">
                On this page
              </p>
            )}

            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-start gap-2 sm:justify-end">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeId === link.id;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-200 sm:px-3.5 sm:py-2",
                      isActive
                        ? "border-sky-600/40 bg-sky-600 text-white shadow-sm"
                        : "border-border/70 bg-muted/40 text-muted-foreground hover:border-sky-400/40 hover:bg-sky-50 hover:text-sky-900",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
