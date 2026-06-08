import Link from "next/link";
import { BadgeCheck, CalendarClock, ShieldCheck } from "lucide-react";

export function HomeHeroBadges() {
  const badges = [
    { icon: ShieldCheck, label: "100% Independent", href: "/methodology" },
    { icon: BadgeCheck, label: "Expert fact-checked", href: "/methodology" },
    { icon: CalendarClock, label: "Updated daily", href: "/content-map" },
  ] as const;

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs font-medium text-blue-900 dark:text-blue-100">
      {badges.map(({ icon: Icon, label, href }, index) => (
        <span key={label} className="inline-flex items-center gap-2">
          {index > 0 ? (
            <span className="hidden text-blue-300 sm:inline dark:text-blue-600" aria-hidden>
              |
            </span>
          ) : null}
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-sky-700 dark:hover:text-sky-400"
          >
            <Icon className="h-3.5 w-3.5 text-sky-600" aria-hidden />
            {label}
          </Link>
        </span>
      ))}
    </div>
  );
}
