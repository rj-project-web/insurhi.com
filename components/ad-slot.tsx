type AdSlotProps = {
  slotId:
    | "ad_top_banner"
    | "ad_in_content_1"
    | "ad_in_content_2"
    | "ad_sidebar_sticky"
    | "ad_bottom_banner";
  className?: string;
};

export function AdSlot({ slotId, className }: AdSlotProps) {
  return (
    <div
      className={`rounded-lg border border-dashed border-border bg-muted/40 px-4 py-6 text-center text-xs text-muted-foreground ${className ?? ""}`}
    >
      Ad placeholder: {slotId}
    </div>
  );
}
