"use client";

import { useEffect, useState } from "react";
import { validateImage } from "@/lib/opportunity-validation";

export default function ImageUploadPreview({ id, label }: { id: string; label: string }) {
  const [previewUrl, setPreviewUrl] = useState<string>();
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  function handleChange(file: File | undefined) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : undefined);
  }
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-navy">{label}</label>
      <input id={id} name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => {
        const file = event.target.files?.[0];
        event.target.setCustomValidity("");
        try { if (file) validateImage(file); handleChange(file); }
        catch (error) { handleChange(undefined); event.target.setCustomValidity(error instanceof Error ? error.message : "Gambar tidak valid."); event.target.reportValidity(); }
      }}
        className="mt-2 block w-full rounded-xl border border-dashed border-navy/20 bg-cream px-3 py-3 text-sm text-navy/70 file:mr-3 file:rounded-full file:border-0 file:bg-navy file:px-3 file:py-2 file:text-xs file:font-semibold file:text-cream" />
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewUrl} alt="Pratinjau gambar yang dipilih" className="mt-3 h-32 w-full rounded-xl object-cover" />
      ) : null}
      <p className="mt-2 text-xs text-navy/55">JPEG, PNG, atau WebP, maksimal 3 MB. Gambar diupload saat formulir dikirim.</p>
    </div>
  );
}
