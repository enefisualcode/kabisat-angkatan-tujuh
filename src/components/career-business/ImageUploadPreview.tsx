"use client";

import { useEffect, useState } from "react";

export default function ImageUploadPreview({ id, label, onChange }: { id: string; label: string; onChange: (file: File | undefined) => void }) {
  const [previewUrl, setPreviewUrl] = useState<string>();
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  function handleChange(file: File | undefined) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : undefined);
    onChange(file);
  }
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-navy">{label}</label>
      <input id={id} type="file" accept="image/*" onChange={(event) => handleChange(event.target.files?.[0])}
        className="mt-2 block w-full rounded-xl border border-dashed border-navy/20 bg-cream px-3 py-3 text-sm text-navy/70 file:mr-3 file:rounded-full file:border-0 file:bg-navy file:px-3 file:py-2 file:text-xs file:font-semibold file:text-cream" />
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewUrl} alt="Pratinjau gambar yang dipilih" className="mt-3 h-32 w-full rounded-xl object-cover" />
      ) : null}
      <p className="mt-2 text-xs text-navy/55">Preview lokal saja; belum dikirim ke server.</p>
    </div>
  );
}
