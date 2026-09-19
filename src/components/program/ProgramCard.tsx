import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
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
        "group flex h-full w-[min(22rem,calc(100vw-3rem))] shrink-0 snap-start flex-col overflow-hidden rounded-card border border-navy/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-navy/10 sm:w-80",
        className
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-navy/5">
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

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-bold tracking-[0.16em] text-gold-dark uppercase">Program KABISAT</p>
        <h3 className="mt-2 font-heading text-2xl font-bold leading-tight text-navy">
          {program.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-navy/65">
          {program.shortDescription}
        </p>

        {program.estimatedDate || program.location ? (
          <div className="mt-5 space-y-2 border-t border-navy/10 pt-4 text-sm text-navy/65">
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

        <div className="mt-6 flex flex-1 items-end">
          <span className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-semibold text-cream transition-colors group-hover:bg-navy-deep">
            Lihat Detail Program <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
