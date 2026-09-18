"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import JobSubmissionForm from "./JobSubmissionForm";
import BusinessSubmissionForm from "./BusinessSubmissionForm";

export default function SubmissionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [type, setType] = useState<"job" | "business">();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-navy/60 p-0 sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-cream p-6 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-8" role="dialog" aria-modal="true" aria-labelledby="submission-title">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold tracking-[0.2em] text-gold-dark uppercase">Berbagi informasi</p><h2 id="submission-title" className="mt-2 font-heading text-2xl font-bold text-navy">{type ? type === "job" ? "Kirim Lowongan Kerja" : "Kirim Usaha Alumni" : "Apa yang ingin Anda bagikan?"}</h2></div><button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Tutup dialog" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-navy hover:bg-navy/5 focus-visible:outline-2 focus-visible:outline-gold"><X size={22} /></button></div>
        {!type ? <div className="mt-8 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setType("job")} className="min-h-16 rounded-2xl border border-navy/15 bg-white px-5 text-left font-semibold text-navy transition-colors hover:border-gold focus-visible:outline-2 focus-visible:outline-gold">Lowongan Kerja<span className="mt-1 block text-sm font-normal text-navy/60">Bagikan kesempatan kerja dummy untuk alumni.</span></button><button type="button" onClick={() => setType("business")} className="min-h-16 rounded-2xl border border-navy/15 bg-white px-5 text-left font-semibold text-navy transition-colors hover:border-gold focus-visible:outline-2 focus-visible:outline-gold">Usaha Alumni<span className="mt-1 block text-sm font-normal text-navy/60">Kenalkan usaha dan layanan sesama alumni.</span></button></div> : <div className="mt-6">{type === "job" ? <JobSubmissionForm onSuccess={onClose} /> : <BusinessSubmissionForm onSuccess={onClose} />}<button type="button" onClick={() => setType(undefined)} className="mt-4 w-full text-center text-sm font-semibold text-navy/60 underline decoration-gold underline-offset-4">Kembali memilih jenis informasi</button></div>}
      </div>
    </div>
  );
}
