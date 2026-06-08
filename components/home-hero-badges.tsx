import Link from "next/link";
import { BadgeCheck, CalendarClock, ShieldCheck } from "lucide-react";

export function HomeHeroBadges() {
  const badges = [
    { icon: ShieldCheck, label: "100% Independent", href: "/methodology" },
    { icon: BadgeCheck, label: "Expert fact-checked", href: "/methodology" },
    { icon: CalendarClock, label: "Updated from CMS", href: "/content-map" },
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map(({ icon: Icon, label, href }) => (
        <Link
          key={label}
          href={href}
          className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/70 bg-background/90 px-3 py-1 text-xs font-medium text-blue-900 transition-colors hover:border-sky-400/80 hover:bg-blue-50/60 dark:text-blue-100"
        >
          <Icon className="h-3.5 w-3.5 text-sky-600" aria-hidden />
          {label}
        </Link>
      ))}
    </div>
  );
}
