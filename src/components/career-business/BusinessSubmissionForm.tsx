import OpportunitySubmissionForm from "./OpportunitySubmissionForm";
export default function BusinessSubmissionForm({ onSuccess }: { onSuccess: () => void }) { return <OpportunitySubmissionForm type="business" onSuccess={onSuccess} />; }
