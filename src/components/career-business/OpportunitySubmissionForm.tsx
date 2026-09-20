"use client";
import { useRef, useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import type { OpportunityType } from "@/types/opportunity";
import { EMPLOYMENT_TYPES, validateSubmission, validateImages } from "@/lib/opportunity-validation";
import ImageUploadPreview from "./ImageUploadPreview";

export default function OpportunitySubmissionForm({ type, onSuccess }: { type: OpportunityType; onSuccess: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState({ message: "", percent: 0 });
  const [uploadingIndexes, setUploadingIndexes] = useState<number[]>([]);
  const inFlight = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setError(""); setBusy(true);
    setProgress({ message: "Menyiapkan upload...", percent: 5 });
    setUploadingIndexes([]);
    const data = new FormData(event.currentTarget);
    let session: { id: string; token: string } | undefined;
    async function send(url: string, body: FormData) {
      const response = await fetch(url, { method: "POST", body });
      const result = await response.json().catch(() => ({ error: "Pengiriman gagal. Periksa ukuran gambar dan koneksi." }));
      if (!response.ok) throw new Error(result.error || "Pengiriman gagal.");
      return result;
    }
    try {
      validateSubmission(data);
      await validateImages(files);
      data.set("imageTypes", JSON.stringify(files.map(file => file.type)));
      const created = await send("/api/opportunities/submissions", data);
      session = { id: created.id, token: created.token };
      let nextIndex = 0;
      let completed = 0;
      async function uploadWorker() {
        while (nextIndex < files.length) {
          const index = nextIndex++;
          setUploadingIndexes(current => [...current, index]);
          setProgress({ message: `Mengupload foto ${index + 1} dari ${files.length}...`, percent: 10 + Math.round((completed / files.length) * 70) });
          const upload = new FormData();
          upload.set("token", session!.token); upload.set("order", String(index)); upload.set("image", files[index]);
          try {
            await send(`/api/opportunities/submissions/${session!.id}/images`, upload);
            completed += 1;
            setProgress({ message: `Mengupload foto ${completed} dari ${files.length}...`, percent: 10 + Math.round((completed / files.length) * 70) });
          } finally {
            setUploadingIndexes(current => current.filter(activeIndex => activeIndex !== index));
          }
        }
      }
      await Promise.all(Array.from({ length: Math.min(2, files.length) }, uploadWorker));
      setProgress({ message: "Menyimpan data...", percent: 88 });
      const finish = new FormData(); finish.set("submissionId", session.id); finish.set("token", session.token);
      setProgress({ message: "Mengirim untuk ditinjau...", percent: 96 });
      await send("/api/opportunities", finish);
      setSubmitted(true);
    } catch (error) {
      let message = error instanceof Error ? error.message : "Koneksi terputus. Silakan coba lagi.";
      if (session) {
        try {
          const cancel = new FormData(); cancel.set("token", session.token);
          const result = await fetch(`/api/opportunities/submissions/${session.id}`, { method: "DELETE", body: cancel });
          if (!result.ok) message += " File sementara tercatat untuk pembersihan ulang.";
        } catch { message += " File sementara tercatat untuk pembersihan ulang."; }
      }
      setError(message);
    }
    finally { setBusy(false); setUploadingIndexes([]); inFlight.current = false; }
  }
  if (submitted) return <div role="status" className="rounded-2xl bg-gold/10 p-6 text-center"><CheckCircle2 size={32} className="mx-auto text-gold-dark" aria-hidden="true" /><h3 className="mt-3 text-xl font-bold">Informasi berhasil dikirim</h3><p className="mt-3 text-sm">Posting menunggu tinjauan pengurus dan akan tampil setelah disetujui.</p><button onClick={onSuccess} className="mt-6 rounded-full bg-navy px-5 py-3 text-cream">Tutup</button></div>;
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
        {type === "job" ? <><Field label="Deadline (opsional)" name="deadline" type="date" /><Field label="Link lamaran (opsional)" name="applicationUrl" type="url" /></> : <><Field label="URL Instagram (opsional)" name="instagram" placeholder="@username atau link Instagram" /><Field label="Website (opsional)" name="website" placeholder="contoh.com atau https://contoh.com" /></>}
      </div>
      <ImageUploadPreview id={`${type}-image`} label="Poster, logo, atau foto (opsional)" onChange={setFiles} uploadingIndexes={uploadingIndexes} />
      <p className="text-xs text-navy/60">Kontak dan informasi posting akan tersedia bagi publik setelah disetujui pengurus.</p>
      {busy ? <div className="rounded-2xl border border-navy/10 bg-navy/[.03] p-4" role="status" aria-live="polite">
        <div className="flex items-center justify-between gap-3 text-sm font-semibold text-navy"><span className="flex min-w-0 items-center gap-2"><LoaderCircle size={17} className="shrink-0 animate-spin text-gold-dark" />{progress.message}</span><span className="shrink-0 text-xs text-navy/60">{progress.percent}%</span></div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-navy/10" role="progressbar" aria-label="Progress pengiriman" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.percent}><div className="h-full rounded-full bg-gold transition-[width] duration-500 ease-out" style={{ width: `${progress.percent}%` }} /></div>
      </div> : null}
      <button type="submit" disabled={busy} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 font-semibold text-cream transition-opacity disabled:cursor-wait disabled:opacity-70">{busy ? <><LoaderCircle size={17} className="animate-spin" />Sedang Mengupload...</> : "Kirim untuk Ditinjau"}</button>
    </fieldset>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
  </form>;
}
const inputClass = "mt-2 min-h-11 w-full rounded-xl border border-navy/15 bg-white px-3 py-2 text-base font-normal focus:border-gold sm:text-sm";
function Field({ label, name, type = "text", required = false, maxLength = 200, placeholder }: { label: string; name: string; type?: string; required?: boolean; maxLength?: number; placeholder?: string }) {
  return <label className="block text-sm font-semibold">{label}<input name={name} type={type} required={required} maxLength={type === "url" ? 2048 : maxLength} placeholder={placeholder ?? (type === "url" ? "https://" : undefined)} className={inputClass} /></label>;
}
function TextArea({ label, name }: { label: string; name: string }) { return <label className="block text-sm font-semibold">{label}<textarea name={name} required maxLength={10000} rows={4} className={inputClass} /></label>; }
