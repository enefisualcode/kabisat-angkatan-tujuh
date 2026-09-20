import { createAdminClient } from "@/lib/supabase/admin";
import { MAX_IMAGE_BYTES, validateImageContent } from "@/lib/opportunity-validation";
import { cancelUploadSession, checkSubmissionRequest, findUploadSession, readSubmissionForm, SubmissionError, submissionError } from "@/lib/opportunity-upload-sessions";

export const maxDuration = 60;
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    checkSubmissionRequest(request);
    const form = await readSubmissionForm(request, MAX_IMAGE_BYTES + 10000);
    const session = await findUploadSession((await params).id, form.get("token"));
    if (session.status !== "open" || Date.parse(session.expires_at) < Date.now() + 120000) throw new SubmissionError("Sesi upload berakhir. Kirim ulang formulir.", 409);
    const order = String(form.get("order"));
    const file = form.get("image");
    if (!/^[0-9]$/.test(order) || !session.image_paths[Number(order)] || !(file instanceof File) || form.getAll("image").length !== 1) throw new SubmissionError("Foto atau urutan tidak valid.");
    try { await validateImageContent(file); } catch (error) { throw new SubmissionError(error instanceof Error ? error.message : "Foto tidak valid."); }
    const path = session.image_paths[Number(order)];
    const expectedType = path.endsWith(".jpg") ? "image/jpeg" : path.endsWith(".png") ? "image/png" : "image/webp";
    if (file.type !== expectedType) throw new SubmissionError("Format foto berubah. Kirim ulang formulir.");
    const client = createAdminClient();
    const result = await client.storage.from("opportunity-images").upload(path, file, { contentType: file.type, upsert: false });
    if (result.error) {
      // Retry may find the immutable slot already uploaded after an ambiguous response.
      const existing = await client.storage.from("opportunity-images").download(path);
      if (existing.error) throw new SubmissionError("Upload foto gagal. Silakan coba lagi.", 502);
    }
    const current = await findUploadSession(session.id, form.get("token"));
    if (current.status === "cancelled") { await cancelUploadSession(current); throw new SubmissionError("Upload sudah dibatalkan.", 409); }
    return Response.json({ ok: true });
  } catch (error) { return submissionError(error); }
}
