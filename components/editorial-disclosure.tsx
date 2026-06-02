import Link from "next/link";
import { Info, ShieldAlert } from "lucide-react";

export type CmsAuthorRef = {
  name?: string;
  slug?: string;
  role?: string;
  credentials?: string;
};

type LastUpdatedProps = {
  updatedAt?: string;
  createdAt?: string;
  publishedAt?: string;
  className?: string;
};

export type EditorialMetadataProps = LastUpdatedProps & {
  reviewedBy?: string | CmsAuthorRef | null;
  lastReviewedAt?: string;
};

function formatDate(input?: string): string | null {
  if (!input) return null;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function resolveAuthor(reviewedBy?: string | CmsAuthorRef | null): CmsAuthorRef | null {
  if (!reviewedBy || typeof reviewedBy === "string") return null;
  return reviewedBy;
}

export function EditorialMetadata({
  updatedAt,
  createdAt,
  publishedAt,
  reviewedBy,
  lastReviewedAt,
  className,
}: EditorialMetadataProps) {
  const updated = formatDate(updatedAt);
  const published = formatDate(publishedAt ?? createdAt);
  const reviewed = formatDate(lastReviewedAt);
  const author = resolveAuthor(reviewedBy);

  if (!updated && !published && !reviewed && !author?.name) return null;

  return (
    <p
      className={
        className ??
        "inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"
      }
    >
      {author?.name ? (
        <span>
          Reviewed by{" "}
          <span className="font-medium text-foreground">{author.name}</span>
          {author.role ? ` (${author.role})` : ""}
        </span>
      ) : null}
      {reviewed ? <span>Last reviewed: {reviewed}</span> : null}
      {published ? <span>Published: {published}</span> : null}
      {updated ? <span>Last updated: {updated}</span> : null}
      <Link href="/methodology" className="underline-offset-4 hover:underline">
        Editorial methodology
      </Link>
    </p>
  );
}

/** @deprecated Use EditorialMetadata */
export function LastUpdated(props: LastUpdatedProps) {
  return <EditorialMetadata {...props} />;
}

type EditorialDisclosureProps = {
  variant?: "compact" | "full";
  className?: string;
};

export function EditorialDisclosure({
  variant = "full",
  className,
}: EditorialDisclosureProps) {
  if (variant === "compact") {
    return (
      <p
        className={
          className ??
          "rounded-md border border-amber-500/30 bg-amber-50/60 px-3 py-2 text-xs text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200"
        }
      >
        <ShieldAlert className="mr-1 inline h-3.5 w-3.5" />
        Insurhi content is informational only and not legal, financial, or
        insurance advice. Always read the full policy wording and consult a
        licensed agent before purchase.
      </p>
    );
  }

  return (
    <section
      className={
        className ??
        "rounded-xl border border-amber-500/30 bg-amber-50/60 p-4 text-sm text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200"
      }
    >
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Info className="h-4 w-4" />
        Editorial disclosure
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5">
        <li>
          Insurhi content is informational only and is not legal, financial, or
          insurance advice.
        </li>
        <li>
          Always read the full policy wording and confirm coverage, exclusions,
          and pricing with a licensed insurer or agent before purchase.
        </li>
        <li>
          Rankings and product comparisons are independent. We do not accept
          payment for placement; affiliate relationships, when present, are
          clearly disclosed.
        </li>
        <li>
          Found an error? Please email <span className="font-medium">editorial@insurhi.com</span>
          {" "}so we can review and correct within 48 hours.
        </li>
      </ul>
      <p className="mt-2 text-xs">
        <Link href="/methodology" className="font-medium underline underline-offset-4">
          See our review methodology
        </Link>
      </p>
    </section>
  );
}
