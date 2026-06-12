import type { CmsClaimsGuide } from "@/lib/cms-client";

export type ClaimsGuideSection = {
  id: string;
  label: string;
};

export function getClaimsGuideSections(guide: CmsClaimsGuide): ClaimsGuideSection[] {
  const sections: ClaimsGuideSection[] = [];

  if (guide.steps?.length) {
    sections.push({ id: "claim-steps", label: "Claim steps" });
  }
  if (guide.documentChecklist?.length) {
    sections.push({ id: "document-checklist", label: "Document checklist" });
  }
  if (guide.denialReasons?.length) {
    sections.push({ id: "denial-reasons", label: "Denial risks" });
  }
  if (guide.delayCauses?.length) {
    sections.push({ id: "delay-causes", label: "Delay causes" });
  }
  if (guide.supplementalDocuments?.length) {
    sections.push({ id: "supplemental-documents", label: "Supplemental docs" });
  }
  if (guide.nextActions?.length) {
    sections.push({ id: "next-actions", label: "If denied or delayed" });
  }
  if (guide.communicationNotes?.length) {
    sections.push({ id: "communication-notes", label: "Communication tips" });
  }

  return sections;
}

export function estimateClaimsGuideReadMinutes(guide: CmsClaimsGuide): number {
  const chunks: string[] = [guide.title];

  for (const step of guide.steps ?? []) {
    if (step.step) chunks.push(step.step);
  }
  for (const item of guide.documentChecklist ?? []) {
    if (item.item) chunks.push(item.item);
  }
  for (const row of guide.denialReasons ?? []) {
    if (row.reason) chunks.push(row.reason);
    if (row.explanation) chunks.push(row.explanation);
  }
  for (const row of guide.delayCauses ?? []) {
    if (row.cause) chunks.push(row.cause);
    if (row.explanation) chunks.push(row.explanation);
  }
  for (const row of guide.supplementalDocuments ?? []) {
    if (row.scenario) chunks.push(row.scenario);
    if (row.documents) chunks.push(row.documents);
  }
  for (const row of guide.nextActions ?? []) {
    if (row.action) chunks.push(row.action);
  }
  for (const row of guide.communicationNotes ?? []) {
    if (row.note) chunks.push(row.note);
  }

  const words = chunks.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(4, Math.round(words / 200));
}

export function buildClaimsGuideSummary(guide: CmsClaimsGuide): string {
  const stepCount = guide.steps?.length ?? 0;
  const checklistCount = guide.documentChecklist?.length ?? 0;
  const categoryTitle =
    guide.category && typeof guide.category === "object"
      ? (guide.category.title ?? "insurance")
      : "insurance";

  if (stepCount > 0 && checklistCount > 0) {
    return `A ${stepCount}-step ${categoryTitle.toLowerCase()} claim playbook with a ${checklistCount}-item document checklist, plus denial and delay patterns to avoid before you file.`;
  }

  return `Step-by-step ${categoryTitle.toLowerCase()} claim workflow with required documents and escalation guidance.`;
}

export function getClaimsGuideHighlights(guide: CmsClaimsGuide, limit = 3): string[] {
  const highlights: string[] = [];

  for (const step of guide.steps ?? []) {
    if (step.step) highlights.push(step.step);
    if (highlights.length >= limit) return highlights;
  }

  for (const item of guide.documentChecklist ?? []) {
    if (item.item) highlights.push(item.item);
    if (highlights.length >= limit) return highlights;
  }

  return highlights;
}
