import "server-only";
import { createHash } from "node:crypto";
import { createAdminClient } from "./supabase/admin";
import type { UploadSessionRow } from "@/types/database";

export class SubmissionError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function checkSubmissionRequest(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) throw new SubmissionError("Origin tidak valid.", 403);
  if (!process.env.SUPABASE_SECRET_KEY) throw new SubmissionError("Pengiriman belum tersedia.", 503);
}
export function submissionError(error: unknown) {
  return Response.json({ error: error instanceof SubmissionError ? error.message : "Layanan belum tersedia. Silakan coba lagi." }, { status: error instanceof SubmissionError ? error.status : 503 });
}
export async function readSubmissionForm(request: Request, maxBytes = 100000) {
  const type = request.headers.get("content-type") || "";
  if (!type.startsWith("multipart/form-data")) throw new SubmissionError("Format formulir tidak valid.", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new SubmissionError("Formulir kosong.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) { await reader.cancel(); throw new SubmissionError("Request terlalu besar. Maksimal 3 MB per foto.", 413); }
    chunks.push(value);
  }
  try { return await new Response(Buffer.concat(chunks), { headers: { "content-type": type } }).formData(); }
  catch { throw new SubmissionError("Formulir tidak valid."); }
}
export function hashUploadToken(token: string) { return createHash("sha256").update(token).digest("hex"); }
export async function findUploadSession(id: string, token: FormDataEntryValue | null): Promise<UploadSessionRow> {
  if (!/^[0-9a-f-]{36}$/i.test(id) || typeof token !== "string" || !/^[0-9a-f]{64}$/.test(token)) throw new SubmissionError("Sesi upload tidak valid.", 403);
  const { data, error } = await createAdminClient().from("opportunity_upload_sessions").select("*").eq("id", id).eq("token_hash", hashUploadToken(token)).maybeSingle();
  if (error) throw new SubmissionError("Sesi upload belum dapat dibaca.", 503);
  if (!data) throw new SubmissionError("Sesi upload tidak ditemukan.", 403);
  return data;
}

export async function cancelUploadSession(session: UploadSessionRow) {
  const client = createAdminClient();
  // Same row lock as finalization: completed sessions can never have their files cleaned.
  const claim = await client.from("opportunity_upload_sessions").update({ status: "cancelled" }).eq("id", session.id).neq("status", "completed").select("image_paths").maybeSingle();
  if (claim.error) throw new SubmissionError("Pembatalan belum dapat dikonfirmasi. File sementara tercatat untuk cleanup.", 503);
  if (!claim.data) return;
  if (claim.data.image_paths.length) {
    const { error } = await client.storage.from("opportunity-images").remove(claim.data.image_paths);
    if (error) { console.error("Upload cleanup requires retry", { id: session.id }); throw new SubmissionError("Sebagian file belum dapat dibersihkan; sesi tercatat untuk cleanup berikutnya.", 503); }
  }
  // Retain manifest until expiry; an in-flight upload also checks cancelled state.
}

export async function cleanupExpiredUploads() {
  const client = createAdminClient();
  // Grace period exceeds the per-file route's maxDuration, avoiding upload/cleanup races.
  const cutoff = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { data, error } = await client.from("opportunity_upload_sessions").select("*").lt("expires_at", cutoff).order("expires_at").limit(20);
  if (error) throw error;
  for (const session of data) {
    if (session.status !== "completed") await cancelUploadSession(session);
    const result = await client.from("opportunity_upload_sessions").delete().eq("id", session.id).lt("expires_at", cutoff);
    if (result.error) throw result.error;
  }
}
