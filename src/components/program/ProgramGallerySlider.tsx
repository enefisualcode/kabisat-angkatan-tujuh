"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { GalleryItem } from "@/types";

export default function ProgramGallerySlider({
  items,
}: {
  items: GalleryItem[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];

  function showPrevious() {
    setActiveIndex((index) => (index - 1 + items.length) % items.length);
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % items.length);
  }

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-navy sm:aspect-[16/10]">
        <Image
          key={activeItem.id}
          src={activeItem.image}
          alt={activeItem.title}
          fill
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-contain"
        />

        {items.length > 1 ? (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Foto sebelumnya"
              className="absolute top-1/2 left-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy/75 text-cream shadow-md backdrop-blur-sm transition-colors hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:left-5"
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Foto berikutnya"
              className="absolute top-1/2 right-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy/75 text-cream shadow-md backdrop-blur-sm transition-colors hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:right-5"
            >
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </>
        ) : null}

        <p
          className="absolute right-3 bottom-3 rounded-full bg-navy/75 px-3 py-1.5 text-xs font-semibold text-cream backdrop-blur-sm sm:right-5 sm:bottom-5"
          aria-live="polite"
        >
          {activeIndex + 1} / {items.length}
        </p>
      </div>
      <p className="mt-3 text-center text-sm text-navy/60">
        {activeItem.title}
      </p>
    </div>
  );
}
