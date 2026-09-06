import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import type { Program } from "@/types";

export default function ProgramCard({
  program,
  className,
}: {
  program: Program;
  className?: string;
}) {
  return (
    <Link
      href={`/program/${program.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-card border border-navy/10 bg-white transition-shadow duration-300 hover:shadow-lg hover:shadow-navy/10",
        className
      )}
    >
      <div className="relative aspect-[8/5] overflow-hidden bg-navy/5">
        {program.coverImage ? (
          <Image
            src={program.coverImage}
            alt={program.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
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

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-navy/55">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            {program.estimatedDate}
          </span>
          {program.location ? (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              {program.location}
            </span>
          ) : null}
        </div>

        {typeof program.progress === "number" ? (
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-navy/60">
              <span>Progress</span>
              <span>{program.progress}%</span>
            </div>
            <ProgressBar value={program.progress} />
          </div>
        ) : null}

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
