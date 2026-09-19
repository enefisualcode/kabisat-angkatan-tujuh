"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { MAX_IMAGES, validateImage } from "@/lib/opportunity-validation";

type Selection = { file: File; url: string; id: string };
export default function ImageUploadPreview({ id, label, onChange, uploadingIndexes = [] }: { id: string; label: string; onChange: (files: File[]) => void; uploadingIndexes?: number[] }) {
  const [photos, setPhotos] = useState<Selection[]>([]);
  const [error, setError] = useState("");
  const current = useRef<Selection[]>([]);
  useEffect(() => () => current.current.forEach(photo => URL.revokeObjectURL(photo.url)), []);
  function update(next: Selection[]) { current.current = next; setPhotos(next); onChange(next.map(photo => photo.file)); }
  function move(index: number, offset: number) {
    const next = [...photos];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    update(next);
  }
  return <div>
    <label htmlFor={id} className="text-sm font-semibold text-navy">{label}</label>
    <input id={id} type="file" multiple accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full rounded-xl border border-dashed p-3 text-base sm:text-sm" onChange={event => {
      const incoming = Array.from(event.target.files || []);
      event.target.value = "";
      setError("");
      try {
        if (photos.length + incoming.length > MAX_IMAGES) throw new Error("Maksimal 5 foto per posting.");
        incoming.forEach(validateImage);
        update([...photos, ...incoming.map(file => ({ file, url: URL.createObjectURL(file), id: crypto.randomUUID() }))]);
      } catch (error) { setError(error instanceof Error ? error.message : "Foto tidak valid."); }
    }} />
    <p className="mt-2 text-xs text-navy/65">Maksimal 5 foto JPEG, PNG, atau WebP, masing-masing 3 MB. Foto pertama menjadi cover.</p>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    <ol className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((photo, index) => <li key={photo.id} className="relative rounded-xl border bg-white p-2">
        <div className="relative">
          {/* Blob previews never pass through the image optimizer. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.url} alt={`Pratinjau foto ${index + 1}: ${photo.file.name}`} className="h-28 w-full rounded-lg object-cover" />
          {uploadingIndexes.includes(index) ? <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-navy/45 text-cream" role="status" aria-label={`Mengupload foto ${index + 1}`}><LoaderCircle size={20} className="animate-spin" /></div> : null}
        </div>
        <span aria-label={`Urutan foto ${index + 1}`} className="absolute top-3 left-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-navy shadow-sm">{index + 1}</span>
        <p className="my-2 text-xs font-semibold">{index === 0 ? "Foto 1 · Cover utama" : `Foto ${index + 1}`}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Majukan foto ${index + 1}`} className="rounded border p-2 disabled:opacity-30">←</button>
          <button type="button" disabled={index === photos.length - 1} onClick={() => move(index, 1)} aria-label={`Mundurkan foto ${index + 1}`} className="rounded border p-2 disabled:opacity-30">→</button>
          <button type="button" className="rounded border p-2 text-red-700" aria-label={`Hapus foto ${index + 1}`} onClick={() => { URL.revokeObjectURL(photo.url); update(photos.filter(item => item.id !== photo.id)); }}>Hapus</button>
        </div>
      </li>)}
    </ol>
  </div>;
}
