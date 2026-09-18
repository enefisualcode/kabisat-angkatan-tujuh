import { cancelUploadSession, checkSubmissionRequest, findUploadSession, readSubmissionForm, submissionError } from "@/lib/opportunity-upload-sessions";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    checkSubmissionRequest(request);
    const form = await readSubmissionForm(request);
    await cancelUploadSession(await findUploadSession((await params).id, form.get("token")));
    return Response.json({ ok: true });
  } catch (error) { return submissionError(error); }
}
