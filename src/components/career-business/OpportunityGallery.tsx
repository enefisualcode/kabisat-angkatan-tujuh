"use client";
import Image from "next/image";
import { useState } from "react";
import type { OpportunityImage } from "@/types/opportunity";

export default function OpportunityGallery({ images, title }: { images: OpportunityImage[]; title: string }) {
  const [selected, setSelected] = useState(0);
  const current = images[selected] || images[0];
  return <section aria-label={`Galeri foto ${title}`}>
    <div className="relative aspect-[4/3] bg-navy/5 sm:aspect-[16/9]">
      <Image unoptimized src={current?.url || "/og-image.png"} alt={current ? `${title} — foto ${selected + 1} dari ${images.length}` : `Ilustrasi ${title}`} fill className="object-contain" />
    </div>
    {images.length > 1 && <div className="flex gap-3 overflow-x-auto p-3 sm:p-4" aria-label="Pilih foto">
      {images.map((image, index) => <button key={image.id} type="button" onClick={() => setSelected(index)} aria-pressed={selected === index} aria-label={`Lihat foto ${index + 1} ${title}`} className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 sm:h-20 sm:w-28 ${selected === index ? "border-gold" : "border-transparent"}`}>
        <Image unoptimized src={image.url} alt={`Thumbnail ${title}, foto ${index + 1}`} fill className="object-cover" />
      </button>)}
    </div>}
  </section>;
}
