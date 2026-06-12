import {
  Car,
  Cross,
  DollarSign,
  FileCheck2,
  HeartPulse,
  Home,
  KeyRound,
  Layers,
  PawPrint,
  SearchCheck,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

type CategoryVisualMeta = {
  icon: LucideIcon;
  tint: string;
  ring: string;
};

const categoryVisuals: Record<string, CategoryVisualMeta> = {
  auto: { icon: Car, tint: "from-sky-100 to-blue-50", ring: "bg-sky-500" },
  home: { icon: Home, tint: "from-blue-100 to-sky-50", ring: "bg-blue-600" },
  life: { icon: HeartPulse, tint: "from-cyan-100 to-blue-50", ring: "bg-cyan-600" },
  medicare: { icon: Cross, tint: "from-blue-100 to-cyan-50", ring: "bg-blue-700" },
  pet: { icon: PawPrint, tint: "from-sky-100 to-cyan-50", ring: "bg-sky-600" },
  renters: { icon: KeyRound, tint: "from-blue-50 to-sky-100", ring: "bg-cyan-700" },
};

function visualFor(slug?: string): CategoryVisualMeta {
  return categoryVisuals[slug ?? ""] ?? {
    icon: ShieldCheck,
    tint: "from-blue-100 to-sky-50",
    ring: "bg-blue-600",
  };
}

export function CategoryIconBadge({
  slug,
  label,
  size = "md",
}: {
  slug?: string;
  label?: string;
  size?: "md" | "lg";
}) {
  const visual = visualFor(slug);
  const Icon = visual.icon;
  const sizeClass =
    size === "lg"
      ? "h-20 w-20 rounded-3xl [&_svg]:h-10 [&_svg]:w-10"
      : "h-11 w-11 rounded-2xl";

  return (
    <span
      className={`inline-flex ${sizeClass} shrink-0 items-center justify-center bg-gradient-to-br ${visual.tint} text-blue-900 ring-1 ring-blue-200/70 dark:from-blue-950/40 dark:to-sky-950/20 dark:text-blue-100 dark:ring-blue-500/25`}
      aria-label={label}
    >
      <Icon className={size === "lg" ? "h-10 w-10" : "h-5 w-5"} aria-hidden />
    </span>
  );
}

export function InsuranceJourneyVisual() {
  const steps = [
    { label: "Choose", icon: ShieldCheck },
    { label: "Compare", icon: FileCheck2 },
    { label: "Claim-ready", icon: KeyRound },
  ];

  return (
    <section
      aria-label="Insurance research flow"
      className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 p-5 text-white shadow-sm"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-8 h-36 w-36 rounded-full bg-white/15 blur-3xl" />
      <div className="relative grid gap-4 md:grid-cols-[1fr_1.4fr] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
            Visual research map
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            One visual path for every coverage line
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {steps.map(({ label, icon: Icon }, index) => (
            <div key={label} className="rounded-2xl border border-white/20 bg-white/12 p-4 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-900">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-3xl font-semibold text-white/20">0{index + 1}</span>
              </div>
              <p className="mt-4 text-sm font-semibold">{label}</p>
              <div className="mt-3 h-1.5 rounded-full bg-white/20">
                <div className="h-full rounded-full bg-sky-200" style={{ width: `${55 + index * 20}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InsuranceVisualHero({ slug, title }: { slug?: string; title: string }) {
  const visual = visualFor(slug);
  const Icon = visual.icon;

  return (
    <div
      className={`relative min-h-64 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br ${visual.tint} p-5 shadow-sm dark:border-blue-500/25 dark:from-blue-950/35 dark:to-sky-950/20`}
      aria-label={`${title} visual summary`}
    >
      <div className={`absolute right-6 top-6 h-24 w-24 rounded-full ${visual.ring} opacity-20 blur-2xl`} />
      <div className="relative flex h-full flex-col justify-between gap-8">
        <div className="flex items-center justify-between">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-900 shadow-sm dark:bg-blue-950 dark:text-blue-100">
            <Icon className="h-7 w-7" aria-hidden />
          </span>
          <span className="rounded-full border border-blue-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-blue-900 dark:border-blue-500/25 dark:bg-blue-950/50 dark:text-blue-100">
            Coverage hub
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {["Guide", "Compare", "Claim"].map((item, index) => (
            <div key={item} className="rounded-xl border border-white/80 bg-white/75 p-3 dark:border-blue-500/20 dark:bg-blue-950/35">
              <div className="h-1.5 rounded-full bg-blue-100 dark:bg-blue-900">
                <div className="h-full rounded-full bg-sky-600" style={{ width: `${45 + index * 22}%` }} />
              </div>
              <p className="mt-3 text-xs font-semibold text-blue-950 dark:text-blue-100">{item}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/80 bg-white/75 p-4 dark:border-blue-500/20 dark:bg-blue-950/35">
          <p className="text-sm font-semibold text-blue-950 dark:text-blue-100">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">Visual summary: learn, compare, prepare.</p>
        </div>
      </div>
    </div>
  );
}

export function InsuranceCategoryPoster({
  slug,
  title,
  description,
}: {
  slug?: string;
  title: string;
  description: string;
}) {
  const visual = visualFor(slug);
  const Icon = visual.icon;

  return (
    <div
      className={`relative min-h-44 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br ${visual.tint} p-4 shadow-sm dark:border-blue-500/25 dark:from-blue-950/35 dark:to-sky-950/20`}
    >
      <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full ${visual.ring} opacity-20 blur-2xl`} />
      <div className="relative flex h-full flex-col justify-between gap-6">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-900 shadow-sm dark:bg-blue-950 dark:text-blue-100">
            <Icon className="h-7 w-7" aria-hidden />
          </span>
          <span className="rounded-full border border-blue-200/70 bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-900 dark:border-blue-500/25 dark:bg-blue-950/50 dark:text-blue-100">
            Hub
          </span>
        </div>
        <div>
          <p className="font-semibold text-blue-950 dark:text-blue-50">{title}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[62, 78, 48].map((width, index) => (
            <div key={index} className="h-1.5 rounded-full bg-white/70 dark:bg-blue-950/50">
              <div className="h-full rounded-full bg-sky-600" style={{ width: `${width}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InsuranceVisualDashboard({
  slug,
  title,
  productCount,
  providerCount,
  guideCount,
  claimsCount,
}: {
  slug?: string;
  title: string;
  productCount: number;
  providerCount: number;
  guideCount: number;
  claimsCount: number;
}) {
  const visual = visualFor(slug);
  const Icon = visual.icon;
  const metrics = [
    { label: "Products", value: productCount, icon: Layers, width: 76 },
    { label: "Providers", value: providerCount, icon: SearchCheck, width: 64 },
    { label: "Guides", value: guideCount, icon: ShieldCheck, width: 58 },
    { label: "Claims", value: claimsCount, icon: FileCheck2, width: 70 },
  ];

  return (
    <section
      aria-label={`${title} visual dashboard`}
      className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 p-5 text-white shadow-sm"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
      <div className="relative grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div className="space-y-4">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-blue-900 shadow-sm">
            <Icon className="h-8 w-8" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
              Visual dashboard
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title} at a glance</h2>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {metrics.map(({ label, value, icon: MetricIcon, width }) => (
            <div key={label} className="rounded-2xl border border-white/20 bg-white/12 p-4 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-900">
                  <MetricIcon className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-2xl font-semibold">{value}</span>
              </div>
              <p className="mt-3 text-sm font-medium">{label}</p>
              <div className="mt-3 h-1.5 rounded-full bg-white/20">
                <div className="h-full rounded-full bg-sky-200" style={{ width: `${width}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InsuranceScenarioGallery({
  scenarios,
}: {
  scenarios: string[];
}) {
  const icons = [SearchCheck, DollarSign, FileCheck2];

  return (
    <section aria-label="Common insurance scenarios" className="grid gap-3 md:grid-cols-3">
      {scenarios.map((scenario, index) => {
        const Icon = icons[index % icons.length];
        return (
          <article
            key={scenario}
            className="relative min-h-36 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/70 p-4 shadow-sm dark:border-blue-500/25 dark:from-card dark:to-blue-950/20"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-300/20 blur-2xl" />
            <div className="relative">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-100">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-5 text-sm font-medium leading-6 text-blue-950 dark:text-blue-50">
                {scenario}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
