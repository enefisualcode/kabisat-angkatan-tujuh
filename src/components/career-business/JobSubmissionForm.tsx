import OpportunitySubmissionForm from "./OpportunitySubmissionForm";
export default function JobSubmissionForm({ onSuccess }: { onSuccess: () => void }) { return <OpportunitySubmissionForm type="job" onSuccess={onSuccess} />; }
