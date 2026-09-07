"use client";

import { useMemo, useState } from "react";
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

  const filtered = useMemo(() => {
    const filter = FILTERS.find((f) => f.id === active);
    if (!filter || !filter.statuses) return programs;
    return programs.filter((p) => filter.statuses!.includes(p.status));
  }, [active, programs]);

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
        <div className="-mx-6 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[calc((100vw_-_18rem)_/_2)] pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
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
      )}
    </div>
  );
}
