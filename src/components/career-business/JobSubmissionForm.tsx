"use client";

import { useState } from "react";
import type { EmploymentType } from "@/types/opportunity";
import ImageUploadPreview from "./ImageUploadPreview";

export default function JobSubmissionForm({ onSuccess }: { onSuccess: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <SuccessState onClose={onSuccess} />;
  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Judul posisi" name="title" required /><Field label="Nama perusahaan" name="company" required />
        <Field label="Lokasi" name="location" required />
        <label className="block text-sm font-semibold text-navy">Jenis pekerjaan
          <select name="employmentType" required className="mt-2 min-h-11 w-full rounded-xl border border-navy/15 bg-white px-3 font-normal outline-none focus:border-gold focus:ring-2 focus:ring-gold/25">
            <option value="">Pilih jenis</option>{(["Full Time", "Part Time", "Internship", "Freelance"] as EmploymentType[]).map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <TextArea label="Deskripsi" name="description" required /><TextArea label="Persyaratan" name="requirements" required />
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Deadline" name="deadline" type="date" /><Field label="Link lamaran" name="applicationUrl" type="url" placeholder="https://" /><Field label="Nomor WhatsApp / kontak" name="whatsapp" required /><Field label="Nama pengirim" name="submittedBy" required /></div>
      <ImageUploadPreview id="job-image" label="Upload poster/gambar" onChange={() => undefined} />
      <button type="submit" className="min-h-12 w-full rounded-full bg-navy px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">Siapkan Informasi</button>
    </form>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return <label className="block text-sm font-semibold text-navy">{label}<input name={name} type={type} required={required} placeholder={placeholder} className="mt-2 min-h-11 w-full rounded-xl border border-navy/15 bg-white px-3 font-normal outline-none focus:border-gold focus:ring-2 focus:ring-gold/25" /></label>;
}
function TextArea({ label, name, required }: { label: string; name: string; required?: boolean }) {
  return <label className="block text-sm font-semibold text-navy">{label}<textarea name={name} required={required} rows={4} className="mt-2 w-full rounded-xl border border-navy/15 bg-white px-3 py-3 font-normal outline-none focus:border-gold focus:ring-2 focus:ring-gold/25" /></label>;
}
function SuccessState({ onClose }: { onClose: () => void }) {
  return <div className="rounded-2xl bg-gold/10 p-6 text-center"><h3 className="font-heading text-xl font-bold text-navy">Informasi berhasil disiapkan</h3><p className="mt-3 text-sm leading-relaxed text-navy/70">Pada versi berikutnya posting akan dikirim untuk ditinjau pengurus KABISAT.</p><button type="button" onClick={onClose} className="mt-6 min-h-11 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-cream">Tutup</button></div>;
}
