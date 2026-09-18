import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import type { JobOpportunity } from "@/types/opportunity";

const dateFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" });

export default function JobCard({ job }: { job: JobOpportunity }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-navy/10 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-40 bg-navy/5">
        <Image unoptimized src={job.image} alt={"Poster " + job.title} fill className="object-cover" />
        <span className="absolute top-3 left-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">Lowongan Kerja</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-xl font-bold text-navy">{job.title}</h3>
        <p className="mt-1 font-medium text-navy/75">{job.company}</p>
        <div className="mt-4 space-y-2 text-sm text-navy/65">
          <p className="flex items-center gap-2"><MapPin size={15} />{job.location}</p>
          <p className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-gold" />{job.employmentType}</p>
          <p className="flex items-center gap-2"><CalendarDays size={15} />Diposting {dateFormatter.format(new Date(job.publishedAt))}</p>
          {job.deadline ? <p className="text-xs text-navy/55">Batas pendaftaran: {dateFormatter.format(new Date(job.deadline))}</p> : null}
        </div>
        <p className="mt-4 border-t border-navy/10 pt-4 text-xs text-navy/55">Dibagikan oleh {job.submittedBy}</p>
        <Link href={"/karier-usaha/" + job.slug} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-semibold text-cream transition-colors hover:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">Lihat Detail <ArrowUpRight size={16} /></Link>
      </div>
    </article>
  );
}
