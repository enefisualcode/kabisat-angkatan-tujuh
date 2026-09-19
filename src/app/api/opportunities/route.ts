import { createAdminClient } from "@/lib/supabase/admin";
import { checkSubmissionRequest, findUploadSession, readSubmissionForm, SubmissionError, submissionError } from "@/lib/opportunity-upload-sessions";
import { notifyOpportunitySubmission } from "@/lib/opportunity-notifications";

export async function POST(request: Request) {
  try {
    checkSubmissionRequest(request);
    const form = await readSubmissionForm(request);
    const session = await findUploadSession(String(form.get("submissionId")), form.get("token"));
    const { error } = await createAdminClient().rpc("complete_opportunity_submission", { p_id: session.id, p_token_hash: session.token_hash });
    if (error) {
      const current = await findUploadSession(session.id, form.get("token"));
      if (current.status !== "completed") throw new SubmissionError("Pengiriman belum selesai. Pastikan semua foto terupload lalu coba lagi.", 409);
    }
    // Notification is deliberately best-effort: the pending submission remains successful if the provider is unavailable.
    await notifyOpportunitySubmission(session.id);
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) { return submissionError(error); }
}
