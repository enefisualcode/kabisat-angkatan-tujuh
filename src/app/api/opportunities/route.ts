import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { consumeLimit } from "@/lib/opportunity-security";
import { validateImageContent, validateSubmission, MAX_IMAGE_BYTES } from "@/lib/opportunity-validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Origin tidak valid." }, { status: 403 });
  if (!process.env.SUPABASE_SECRET_KEY) return Response.json({ error: "Pengiriman belum tersedia. Silakan hubungi pengurus." }, { status: 503 });
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data")) return Response.json({ error: "Format formulir tidak valid." }, { status: 415 });
  try {
    if (!(await consumeLimit(request.headers, "submit"))) return Response.json({ error: "Terlalu banyak pengiriman. Coba lagi dalam 15 menit." }, { status: 429 });
    // Bound streamed bodies too, not just client-supplied Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return Response.json({ error: "Formulir kosong." }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_IMAGE_BYTES + 100000) { await reader.cancel(); return Response.json({ error: "Formulir terlalu besar. Gambar maksimal 3 MB." }, { status: 413 }); }
      chunks.push(value);
    }
    let form: FormData;
    let row;
    let file: File | null;
    try {
      form = await new Response(Buffer.concat(chunks), { headers: { "content-type": request.headers.get("content-type")! } }).formData();
      row = validateSubmission(form);
      const image = form.get("image");
      if (image !== null && !(image instanceof File)) throw new Error("Gambar tidak valid.");
      file = image instanceof File && image.size ? image : null;
      if (file) await validateImageContent(file);
    } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Formulir tidak valid." }, { status: 400 }); }
    const client = createAdminClient();
    const id = randomUUID();
    const path = file ? `${id}/${randomUUID()}.${file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp"}` : null;
    if (file && path) {
      const { error } = await client.storage.from("opportunity-images").upload(path, file, { contentType: file.type, upsert: false });
      if (error) return Response.json({ error: "Upload gagal. Silakan coba lagi." }, { status: 502 });
    }
    const { error } = await client.from("opportunities").insert({ ...row, id, image_url: path, status: "pending", published_at: null });
    if (error) {
      if (path) {
        // Verify absence before cleanup: an ambiguous network response could hide a committed insert.
        const lookup = await client.from("opportunities").select("id").eq("id", id).maybeSingle();
        if (lookup.data) return Response.json({ ok: true }, { status: 201 });
        if (!lookup.error) {
          const cleanup = await client.storage.from("opportunity-images").remove([path]);
          if (cleanup.error) console.error("Opportunity image cleanup failed", { path });
        } else console.error("Opportunity insert outcome unknown; inspect image", { path });
      }
      return Response.json({ error: "Pengiriman belum dapat dikonfirmasi. Hubungi pengurus sebelum mengirim ulang." }, { status: 502 });
    }
    return Response.json({ ok: true }, { status: 201 });
  } catch { return Response.json({ error: "Layanan sedang tidak tersedia. Silakan coba lagi nanti." }, { status: 503 }); }
}
