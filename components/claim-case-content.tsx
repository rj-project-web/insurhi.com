import { InsurancePanel } from "@/components/insurance-page-band";

type ClaimCaseContentProps = {
  scenario: string;
  outcome: string;
};

export function ClaimCaseContent({ scenario, outcome }: ClaimCaseContentProps) {
  const outcomeDiffers = outcome.trim() !== scenario.trim();

  return (
    <div className="space-y-6">
      <InsurancePanel id="scenario" className="p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Scenario</h2>
        <p className="mt-4 text-base leading-8 text-muted-foreground">{scenario}</p>
      </InsurancePanel>

      <InsurancePanel id="outcome" className="p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Outcome</h2>
        <p className="mt-4 text-base leading-8 text-muted-foreground">
          {outcomeDiffers ? outcome : "Outcome details are being expanded in the CMS."}
        </p>
      </InsurancePanel>

      <InsurancePanel id="claim-lessons" className="p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">What this case teaches</h2>
        <p className="mt-4 text-base leading-8 text-muted-foreground">
          Use this case as a preparation checklist before filing a similar insurance claim. The
          most important signals are prompt notice, complete documentation, a clear chronology, and
          written follow-up when the adjuster requests additional proof.
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {[
            "Save photos, invoices, repair estimates, and communication logs.",
            "Confirm the policy section that applies before accepting a settlement.",
            "Ask for denial or delay reasons in writing if the claim stalls.",
            "Compare the outcome with related claim playbooks before escalating.",
          ].map((item) => (
            <li key={item} className="rounded-xl border border-border/70 bg-background/90 px-3 py-2.5">
              {item}
            </li>
          ))}
        </ul>
      </InsurancePanel>
    </div>
  );
}

export const claimCaseSections = [
  { id: "scenario", label: "Scenario" },
  { id: "outcome", label: "Outcome" },
  { id: "claim-lessons", label: "Lessons" },
];
