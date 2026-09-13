import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { cn, STAGE_LABELS, STAGE_STYLES } from "@/lib/utils";
import { PROGRAM_ICONS } from "@/lib/program-icons";
import type { Program } from "@/types";

export default function ProgramCard({
  program,
  className,
}: {
  program: Program;
  className?: string;
}) {
  const Icon = program.icon ? PROGRAM_ICONS[program.icon] : null;

  return (
    <Link
      href={`/program/${program.slug}`}
      className={cn(
        "group flex h-full w-72 shrink-0 snap-start flex-col overflow-hidden rounded-card border border-navy/10 bg-white transition-shadow duration-300 hover:shadow-lg hover:shadow-navy/10 sm:w-80",
        className
      )}
    >
      <div className="relative h-36 overflow-hidden bg-navy/5">
        {program.coverImage ? (
          <Image
            src={program.coverImage}
            alt={program.title}
            fill
            sizes="320px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : Icon ? (
          <div className="flex h-full w-full items-center justify-center">
            <Icon
              size={44}
              strokeWidth={1.5}
              className="text-navy/25 transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ) : null}
        <div className="absolute top-3 left-3">
          <StatusBadge status={program.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-bold text-navy">
          {program.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-navy/65">
          {program.shortDescription}
        </p>

        {program.estimatedDate || program.location ? (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy/55">
            {program.estimatedDate ? (
              <span className="flex items-center gap-1">
                <CalendarDays size={12} />
                {program.estimatedDate}
              </span>
            ) : null}
            {program.location ? (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {program.location}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4 flex flex-1 items-end justify-between">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide uppercase",
              STAGE_STYLES[program.stage]
            )}
          >
            {STAGE_LABELS[program.stage]}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-navy transition-colors group-hover:text-gold-dark">
            Lihat
            <ArrowUpRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
