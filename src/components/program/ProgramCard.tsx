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

  if (!program.coverImage) {
    return (
      <Link
        href={`/program/${program.slug}`}
        className={cn(
          "group flex flex-col gap-3 rounded-card border border-navy/10 bg-white p-5 transition-shadow duration-300 hover:shadow-lg hover:shadow-navy/10",
          className
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy/5">
            {Icon ? (
              <Icon size={20} strokeWidth={1.75} className="text-navy/50" />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-base font-bold text-navy">
              {program.title}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-xs leading-relaxed text-navy/55">
              {program.shortDescription}
            </p>
          </div>
          <StatusBadge status={program.status} className="mt-0.5 shrink-0" />
        </div>

        {program.estimatedDate || program.location ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pl-14 text-xs text-navy/55">
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

        <div className="flex items-center justify-between pl-14">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide uppercase",
              STAGE_STYLES[program.stage]
            )}
          >
            {STAGE_LABELS[program.stage]}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-navy transition-colors group-hover:text-gold-dark">
            Lihat Program
            <ArrowUpRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/program/${program.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-card border border-navy/10 bg-white transition-shadow duration-300 hover:shadow-lg hover:shadow-navy/10",
        className
      )}
    >
      <div className="relative aspect-[8/5] overflow-hidden bg-navy/5">
        <Image
          src={program.coverImage}
          alt={program.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <StatusBadge status={program.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-xl font-bold text-navy">
          {program.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy/65">
          {program.shortDescription}
        </p>

        {program.estimatedDate || program.location ? (
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
            {program.estimatedDate ? (
              <div>
                <p className="text-[11px] font-medium tracking-wide text-navy/45 uppercase">
                  Estimasi Waktu
                </p>
                <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-navy/65">
                  <CalendarDays size={14} />
                  {program.estimatedDate}
                </span>
              </div>
            ) : null}
            {program.location ? (
              <div>
                <p className="text-[11px] font-medium tracking-wide text-navy/45 uppercase">
                  Tempat
                </p>
                <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-navy/65">
                  <MapPin size={14} />
                  {program.location}
                </span>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 flex items-center justify-between text-xs font-medium text-navy/60">
          <span>Tahap</span>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide uppercase",
              STAGE_STYLES[program.stage]
            )}
          >
            {STAGE_LABELS[program.stage]}
          </span>
        </div>

        <span className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors group-hover:text-gold-dark">
          Lihat Program
          <ArrowUpRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
