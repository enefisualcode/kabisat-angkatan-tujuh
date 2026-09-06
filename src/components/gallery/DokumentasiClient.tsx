"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ImagesIcon, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/types";

type EventGroup = { event: string; year: number; items: GalleryItem[] };

export default function DokumentasiClient({
  groups,
}: {
  groups: EventGroup[];
}) {
  const [openGroupIndex, setOpenGroupIndex] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const activeGroup =
    openGroupIndex !== null ? groups[openGroupIndex] : undefined;

  useEffect(() => {
    if (openGroupIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenGroupIndex(null);
      if (e.key === "ArrowRight") setPhotoIndex((i) => i + 1);
      if (e.key === "ArrowLeft") setPhotoIndex((i) => i - 1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openGroupIndex]);

  const normalizedIndex = activeGroup
    ? ((photoIndex % activeGroup.items.length) + activeGroup.items.length) %
      activeGroup.items.length
    : 0;
  const activePhoto = activeGroup?.items[normalizedIndex];

  const yearGroups = Array.from(new Set(groups.map((g) => g.year)));

  return (
    <div>
      {yearGroups.map((year) => (
        <div key={year} className="mb-16 last:mb-0">
          <p className="font-heading mb-7 text-3xl font-extrabold text-navy sm:text-4xl">
            {year}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups
              .map((group, index) => ({ group, index }))
              .filter(({ group }) => group.year === year)
              .map(({ group, index }) => (
                <button
                  key={group.event}
                  type="button"
                  onClick={() => {
                    setOpenGroupIndex(index);
                    setPhotoIndex(0);
                  }}
                  className="group relative aspect-[4/3] overflow-hidden rounded-card text-left"
                >
                  <Image
                    src={group.items[0].image}
                    alt={group.event}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-heading text-xl font-bold text-cream">
                      {group.event}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-cream/75">
                      <ImagesIcon size={13} />
                      {group.items.length} Foto
                    </p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}

      {activeGroup && activePhoto ? (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-navy/95 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeri ${activeGroup.event}`}
          onClick={() => setOpenGroupIndex(null)}
        >
          <div className="flex items-center justify-between text-cream">
            <div>
              <p className="font-heading text-lg font-bold">
                {activeGroup.event}
              </p>
              <p className="text-sm text-cream/60">
                {normalizedIndex + 1} / {activeGroup.items.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpenGroupIndex(null)}
              aria-label="Tutup galeri"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-cream/10"
            >
              <X size={22} />
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPhotoIndex((i) => i - 1)}
              aria-label="Foto sebelumnya"
              className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10 sm:left-4"
            >
              <ChevronLeft size={26} />
            </button>

            <div className="relative h-full w-full max-w-3xl">
              <Image
                key={activePhoto.id}
                src={activePhoto.image}
                alt={activePhoto.title}
                fill
                sizes="(min-width: 640px) 768px, 100vw"
                className={cn("object-contain")}
              />
            </div>

            <button
              type="button"
              onClick={() => setPhotoIndex((i) => i + 1)}
              aria-label="Foto berikutnya"
              className="absolute right-0 flex h-11 w-11 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10 sm:right-4"
            >
              <ChevronRight size={26} />
            </button>
          </div>

          <div className="text-center text-cream/80">
            <p className="font-medium">{activePhoto.title}</p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-cream/50">
              {activePhoto.location ? (
                <>
                  <MapPin size={12} />
                  {activePhoto.location} &middot;{" "}
                </>
              ) : null}
              {activePhoto.year}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
