"use client";
import { useRef, useState, type FormEvent } from "react";
import type { OpportunityType } from "@/types/opportunity";
import { EMPLOYMENT_TYPES, validateSubmission, validateImageContent } from "@/lib/opportunity-validation";
import ImageUploadPreview from "./ImageUploadPreview";

export default function OpportunitySubmissionForm({ type, onSuccess }: { type: OpportunityType; onSuccess: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setError(""); setBusy(true);
    const data = new FormData(event.currentTarget);
    try {
      validateSubmission(data);
      const file = data.get("image");
      if (file instanceof File && file.size) await validateImageContent(file);
      const response = await fetch("/api/opportunities", { method: "POST", body: data });
      const result = await response.json().catch(() => ({ error: "Pengiriman gagal. Periksa ukuran gambar dan koneksi." }));
      if (!response.ok) throw new Error(result.error || "Pengiriman gagal.");
      setSubmitted(true);
    } catch (error) { setError(error instanceof Error ? error.message : "Koneksi terputus. Silakan coba lagi."); }
    finally { setBusy(false); inFlight.current = false; }
  }
  if (submitted) return <div role="status" className="rounded-2xl bg-gold/10 p-6 text-center"><h3 className="text-xl font-bold">Informasi berhasil dikirim</h3><p className="mt-3 text-sm">Posting menunggu tinjauan pengurus dan akan tampil setelah disetujui.</p><button onClick={onSuccess} className="mt-6 rounded-full bg-navy px-5 py-3 text-cream">Tutup</button></div>;
  return <form onSubmit={submit} className="space-y-4" aria-busy={busy}>
    <input type="hidden" name="type" value={type} />
    <fieldset disabled={busy} className="space-y-4 disabled:opacity-60">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={type === "job" ? "Judul posisi" : "Nama usaha"} name="title" required />
        {type === "job" ? <><Field label="Nama perusahaan" name="company" required /><label className="block text-sm font-semibold">Jenis pekerjaan<select name="employmentType" required className={inputClass}><option value="">Pilih jenis</option>{EMPLOYMENT_TYPES.map(value => <option key={value}>{value}</option>)}</select></label></> : <><Field label="Nama pemilik" name="ownerName" required /><Field label="Kategori usaha" name="category" required maxLength={80} /></>}
        <Field label="Lokasi" name="location" required />
      </div>
      <TextArea label="Deskripsi" name="description" />
      {type === "job" && <TextArea label="Persyaratan (satu per baris)" name="requirements" />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="WhatsApp (contoh 62812...)" name="whatsapp" type="tel" required maxLength={30} />
        <Field label="Nama pengirim (ditampilkan pada lowongan)" name="submittedBy" required />
        {type === "job" ? <><Field label="Deadline (opsional)" name="deadline" type="date" /><Field label="Link lamaran (opsional)" name="applicationUrl" type="url" /></> : <><Field label="URL Instagram (opsional)" name="instagram" type="url" /><Field label="Website (opsional)" name="website" type="url" /></>}
      </div>
      <ImageUploadPreview id={`${type}-image`} label="Poster, logo, atau foto (opsional)" />
      <p className="text-xs text-navy/60">Kontak dan informasi posting akan tersedia bagi publik setelah disetujui pengurus.</p>
      <button type="submit" className="min-h-12 w-full rounded-full bg-navy px-5 py-3 font-semibold text-cream">{busy ? "Mengirim..." : "Kirim untuk Ditinjau"}</button>
    </fieldset>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
  </form>;
}
const inputClass = "mt-2 min-h-11 w-full rounded-xl border border-navy/15 bg-white px-3 py-2 font-normal focus:border-gold";
function Field({ label, name, type = "text", required = false, maxLength = 200 }: { label: string; name: string; type?: string; required?: boolean; maxLength?: number }) {
  return <label className="block text-sm font-semibold">{label}<input name={name} type={type} required={required} maxLength={type === "url" ? 2048 : maxLength} placeholder={type === "url" ? "https://" : undefined} className={inputClass} /></label>;
}
function TextArea({ label, name }: { label: string; name: string }) { return <label className="block text-sm font-semibold">{label}<textarea name={name} required maxLength={10000} rows={4} className={inputClass} /></label>; }
