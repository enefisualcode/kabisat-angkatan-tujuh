"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FadeIn from "@/components/ui/FadeIn";
import ProgramCard from "@/components/program/ProgramCard";
import { cn } from "@/lib/utils";
import type { Program, ProgramStatus } from "@/types";

const FILTERS = [
  { id: "semua", label: "Semua", statuses: null },
  {
    id: "direncanakan",
    label: "Direncanakan",
    statuses: ["idea", "planned"] as ProgramStatus[],
  },
  {
    id: "berjalan",
    label: "Sedang Berjalan",
    statuses: ["preparation", "upcoming"] as ProgramStatus[],
  },
  {
    id: "selesai",
    label: "Selesai",
    statuses: ["completed"] as ProgramStatus[],
  },
] as const;

export default function ProgramListClient({
  programs,
}: {
  programs: Program[];
}) {
  const [active, setActive] = useState<(typeof FILTERS)[number]["id"]>("semua");
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const filtered = useMemo(() => {
    const filter = FILTERS.find((f) => f.id === active);
    if (!filter || !filter.statuses) return programs;
    return programs.filter((p) => filter.statuses!.includes(p.status));
  }, [active, programs]);

  const updateScrollState = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    setCanScrollLeft(carousel.scrollLeft > 1);
    setCanScrollRight(maxScrollLeft - carousel.scrollLeft > 1);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.scrollTo({ left: 0, behavior: "auto" });
    updateScrollState();
    carousel.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateScrollState);
    observer?.observe(carousel);
    return () => {
      carousel.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      observer?.disconnect();
    };
  }, [active, filtered.length, updateScrollState]);

  function scrollByCard(direction: number) {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const firstCard = carousel.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(getComputedStyle(carousel).columnGap || "0") || 0;
    const amount = (firstCard?.getBoundingClientRect().width || carousel.clientWidth) + gap;
    carousel.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActive(filter.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
              active === filter.id
                ? "border-navy bg-navy text-cream"
                : "border-navy/15 text-navy/65 hover:border-navy/30 hover:text-navy"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-navy/50">
          Belum ada program pada kategori ini.
        </p>
      ) : (
        <div className="relative mt-10 md:px-14">
          <button
            type="button"
            disabled={!canScrollLeft}
            onClick={() => scrollByCard(-1)}
            aria-label="Program sebelumnya"
            className="absolute top-1/2 left-0 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-navy/15 bg-white text-navy shadow-md transition-colors hover:border-gold hover:bg-gold/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-0 md:flex"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <div
            ref={carouselRef}
            className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[calc((100vw_-_18rem)_/_2)] pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-8 sm:px-8 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {filtered.map((program, index) => (
              <FadeIn
                key={program.id}
                delay={(index % 3) * 0.08}
                className="shrink-0 snap-center sm:snap-start"
              >
                <ProgramCard program={program} />
              </FadeIn>
            ))}
          </div>
          <button
            type="button"
            disabled={!canScrollRight}
            onClick={() => scrollByCard(1)}
            aria-label="Program berikutnya"
            className="absolute top-1/2 right-0 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-navy/15 bg-white text-navy shadow-md transition-colors hover:border-gold hover:bg-gold/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-0 md:flex"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
