import { createAdminClient } from "@/lib/supabase/admin";
import { checkSubmissionRequest, findUploadSession, readSubmissionForm, SubmissionError, submissionError } from "@/lib/opportunity-upload-sessions";

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
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) { return submissionError(error); }
}
