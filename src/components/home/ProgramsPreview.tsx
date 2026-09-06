import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import ProgramCard from "@/components/program/ProgramCard";
import { programs } from "@/data/programs";

export default function ProgramsPreview() {
  const featured = programs.slice(0, 3);

  return (
    <section className="py-24 sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <FadeIn>
            <SectionHeading
              eyebrow="Program & Kegiatan"
              title="Yang Sedang Kami Siapkan"
              description="Ikuti perkembangan program dan kegiatan KABISAT Angkatan Tujuh."
            />
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link
              href="/program"
              className="hidden items-center gap-1.5 text-sm font-semibold text-navy link-underline sm:flex"
            >
              Lihat semua program
              <ArrowRight size={15} />
            </Link>
          </FadeIn>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((program, index) => (
            <FadeIn key={program.id} delay={index * 0.1}>
              <ProgramCard program={program} />
            </FadeIn>
          ))}
        </div>

        <div className="mt-10 sm:hidden">
          <Link
            href="/program"
            className="flex items-center justify-center gap-1.5 rounded-full border border-navy/15 py-3 text-sm font-semibold text-navy"
          >
            Lihat semua program
            <ArrowRight size={15} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
