import { randomBytes, randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { consumeLimit } from "@/lib/opportunity-security";
import { validateImageTypes, validateSubmission } from "@/lib/opportunity-validation";
import { checkSubmissionRequest, cleanupExpiredUploads, hashUploadToken, readSubmissionForm, SubmissionError, submissionError } from "@/lib/opportunity-upload-sessions";

export async function POST(request: Request) {
  try {
    checkSubmissionRequest(request);
    const form = await readSubmissionForm(request);
    let payload, types: unknown;
    try { payload = validateSubmission(form); types = JSON.parse(String(form.get("imageTypes") || "[]")); validateImageTypes(types); }
    catch (error) { throw new SubmissionError(error instanceof Error ? error.message : "Formulir tidak valid."); }
    if (!(await consumeLimit(request.headers, "submit"))) throw new SubmissionError("Terlalu banyak pengiriman. Coba lagi dalam 15 menit.", 429);
    try { await cleanupExpiredUploads(); } catch { console.error("Expired upload cleanup needs retry"); }
    const id = randomUUID(), token = randomBytes(32).toString("hex");
    const paths = (types as string[]).map(type => `${id}/${randomUUID()}.${type === "image/jpeg" ? "jpg" : type === "image/png" ? "png" : "webp"}`);
    const { error } = await createAdminClient().from("opportunity_upload_sessions").insert({ id, token_hash: hashUploadToken(token), payload, image_paths: paths });
    if (error) throw new SubmissionError("Pengiriman belum dapat dimulai.", 503);
    return Response.json({ id, token }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return submissionError(error); }
}
