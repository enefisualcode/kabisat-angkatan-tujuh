"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { GalleryItem } from "@/types";

export default function ProgramGallerySlider({
  items,
}: {
  items: GalleryItem[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const activeItem = items[activeIndex];

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) =>
          (index - 1 + items.length) % items.length
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index + 1) % items.length);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, items.length]);

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
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={`Buka ${activeItem.title} dalam layar penuh`}
          className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-gold"
        />

        {items.length > 1 ? (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Foto sebelumnya"
              className="absolute top-1/2 left-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy/75 text-cream shadow-md backdrop-blur-sm transition-colors hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:left-5"
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Foto berikutnya"
              className="absolute top-1/2 right-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy/75 text-cream shadow-md backdrop-blur-sm transition-colors hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:right-5"
            >
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </>
        ) : null}

        <p
          className="pointer-events-none absolute right-3 bottom-3 z-10 rounded-full bg-navy/75 px-3 py-1.5 text-xs font-semibold text-cream backdrop-blur-sm sm:right-5 sm:bottom-5"
          aria-live="polite"
        >
          {activeIndex + 1} / {items.length}
        </p>
      </div>
      <p className="mt-3 text-center text-sm text-navy/60">
        {activeItem.title}
      </p>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-navy/95 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeri ${activeItem.event}`}
          onClick={() => setIsOpen(false)}
        >
          <div className="flex items-center justify-between text-cream">
            <div>
              <p className="font-heading text-lg font-bold">
                {activeItem.event}
              </p>
              <p className="text-sm text-cream/60">
                {activeIndex + 1} / {items.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup galeri"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-cream/10"
            >
              <X size={22} />
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center py-4"
            onClick={(event) => event.stopPropagation()}
          >
            {items.length > 1 ? (
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Foto sebelumnya"
                className="absolute left-0 z-10 flex h-11 w-11 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10 sm:left-4"
              >
                <ChevronLeft size={26} />
              </button>
            ) : null}

            <div className="relative h-full w-full max-w-3xl">
              <Image
                key={`fullscreen-${activeItem.id}`}
                src={activeItem.image}
                alt={activeItem.title}
                fill
                sizes="(min-width: 640px) 768px, 100vw"
                className="object-contain"
              />
            </div>

            {items.length > 1 ? (
              <button
                type="button"
                onClick={showNext}
                aria-label="Foto berikutnya"
                className="absolute right-0 z-10 flex h-11 w-11 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10 sm:right-4"
              >
                <ChevronRight size={26} />
              </button>
            ) : null}
          </div>

          <div className="text-center text-cream/80">
            <p className="font-medium">{activeItem.title}</p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-cream/50">
              {activeItem.location ? (
                <>
                  <MapPin size={12} />
                  {activeItem.location} &middot;{" "}
                </>
              ) : null}
              {activeItem.year}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
