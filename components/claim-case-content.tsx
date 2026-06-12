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
    </div>
  );
}

export const claimCaseSections = [
  { id: "scenario", label: "Scenario" },
  { id: "outcome", label: "Outcome" },
];
