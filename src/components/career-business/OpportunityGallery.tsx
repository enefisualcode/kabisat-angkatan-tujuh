"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { OpportunityImage } from "@/types/opportunity";

export default function OpportunityGallery({ images, title }: { images: OpportunityImage[]; title: string }) {
  const [selected, setSelected] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const current = images[selected] || images[0];
  const hasMultipleImages = images.length > 1;
  const goTo = (index: number) => setSelected((index + images.length) % images.length);
  const previous = () => goTo(selected - 1);
  const next = () => goTo(selected + 1);

  useEffect(() => {
    if (!isViewerOpen) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsViewerOpen(false);
      if (hasMultipleImages && event.key === "ArrowLeft") previous();
      if (hasMultipleImages && event.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); };
  }, [isViewerOpen, selected, hasMultipleImages]);

  const photoAlt = current ? `${title} — foto ${selected + 1} dari ${images.length}` : `Ilustrasi ${title}`;
  return <section aria-label={`Galeri foto ${title}`}>
    <button type="button" onClick={() => setIsViewerOpen(true)} className="group relative block w-full overflow-hidden bg-navy/5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-gold" aria-label={`Buka foto ${selected + 1} dalam layar penuh`}>
      <div className="relative aspect-[5/4] sm:aspect-[16/10]">
        <Image unoptimized src={current?.url || "/og-image.png"} alt={photoAlt} fill sizes="(max-width: 768px) 100vw, 896px" className="object-contain transition-transform duration-300 group-hover:scale-[1.015]" priority />
      </div>
      <span className="absolute right-3 bottom-3 rounded-full bg-navy/75 px-3 py-1.5 text-xs font-semibold text-cream backdrop-blur-sm">Ketuk untuk memperbesar</span>
    </button>
    {hasMultipleImages && <div className="flex gap-3 overflow-x-auto px-4 py-4 sm:px-5" aria-label="Pilih foto">
      {images.map((image, index) => <button key={image.id} type="button" onClick={() => { setSelected(index); setIsViewerOpen(true); }} aria-pressed={selected === index} aria-label={`Lihat foto ${index + 1} ${title}`} className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition sm:w-28 ${selected === index ? "border-gold shadow-sm" : "border-transparent opacity-75 hover:opacity-100"}`}>
        <Image unoptimized src={image.url} alt={`Thumbnail ${title}, foto ${index + 1}`} fill sizes="112px" className="object-cover" />
      </button>)}
    </div>}
    {isViewerOpen && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/95 p-3 sm:p-8" role="dialog" aria-modal="true" aria-label={`Tampilan foto ${title}`} onMouseDown={(event) => { if (event.target === event.currentTarget) setIsViewerOpen(false); }}>
      <button type="button" onClick={() => setIsViewerOpen(false)} className="absolute top-4 right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-cream backdrop-blur hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-gold" aria-label="Tutup galeri"><X size={23} /></button>
      <div className="absolute top-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-cream backdrop-blur">{selected + 1} / {images.length || 1}</div>
      {hasMultipleImages && <button type="button" onClick={previous} className="absolute left-3 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream backdrop-blur hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-gold sm:inline-flex" aria-label="Foto sebelumnya"><ChevronLeft size={28} /></button>}
      <div className="relative h-full w-full max-w-6xl" onTouchStart={(event) => { touchStartX.current = event.changedTouches[0]?.clientX ?? null; }} onTouchEnd={(event) => { const startX = touchStartX.current; const endX = event.changedTouches[0]?.clientX; touchStartX.current = null; if (!hasMultipleImages || startX === null || endX === undefined) return; if (endX - startX > 50) previous(); if (startX - endX > 50) next(); }}>
        <Image unoptimized src={current?.url || "/og-image.png"} alt={photoAlt} fill sizes="100vw" className="object-contain" priority />
      </div>
      {hasMultipleImages && <button type="button" onClick={next} className="absolute right-3 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream backdrop-blur hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-gold sm:inline-flex" aria-label="Foto berikutnya"><ChevronRight size={28} /></button>}
    </div>}
  </section>;
}
