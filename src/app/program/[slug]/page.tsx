import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  User,
  Users,
  ArrowLeft,
  ImageOff,
} from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import MilestoneChecklist from "@/components/program/MilestoneChecklist";
import { programs, getProgramBySlug } from "@/data/programs";
import { getGalleryForEvent } from "@/data/gallery";

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata(
  props: PageProps<"/program/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const program = getProgramBySlug(slug);
  if (!program) return {};

  return {
    title: program.title,
    description: program.shortDescription,
    openGraph: program.coverImage
      ? { images: [{ url: program.coverImage }] }
      : undefined,
  };
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-gold-dark">{icon}</span>
      <div>
        <p className="text-xs font-medium tracking-wide text-navy/45 uppercase">
          {label}
        </p>
        <p className="mt-0.5 font-medium text-navy">{value}</p>
      </div>
    </div>
  );
}

export default async function ProgramDetailPage(
  props: PageProps<"/program/[slug]">
) {
  const { slug } = await props.params;
  const program = getProgramBySlug(slug);
  if (!program) notFound();

  const isCompleted = program.status === "completed";
  const gallery = getGalleryForEvent(program.title);

  return (
    <>
      <PageHero eyebrow="Program KABISAT" title={program.title}>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-cream/75">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={15} />
            {isCompleted && program.actualDate
              ? program.actualDate
              : program.estimatedDate}
          </span>
          {program.location ? (
            <span className="flex items-center gap-1.5">
              <MapPin size={15} />
              {program.location}
            </span>
          ) : null}
        </div>
        <div className="mt-5">
          <StatusBadge status={program.status} tone="onDark" />
        </div>
        <Link
          href="/program"
          className="mt-10 flex w-fit items-center gap-1.5 text-sm font-medium text-cream/60 transition-colors hover:text-cream"
        >
          <ArrowLeft size={15} />
          Kembali ke semua program
        </Link>
      </PageHero>

      {program.coverImage ? (
        <div className="mx-auto -mt-10 max-w-5xl px-6 sm:-mt-14 sm:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-card-lg shadow-xl shadow-navy/20">
            <Image
              src={program.coverImage}
              alt={program.title}
              fill
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      ) : null}

      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl">
          <FadeIn>
            <h2 className="font-heading text-2xl font-bold text-navy sm:text-3xl">
              Tentang Program
            </h2>
            <p className="mt-4 text-base leading-relaxed text-navy/70 sm:text-lg">
              {program.description}
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-14 rounded-card border border-navy/10 bg-white p-7 sm:p-8">
              <h3 className="font-heading text-lg font-bold text-navy">
                Informasi Program
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <InfoItem
                  icon={<CalendarDays size={17} />}
                  label={isCompleted ? "Dilaksanakan" : "Estimasi Waktu"}
                  value={
                    isCompleted && program.actualDate
                      ? program.actualDate
                      : program.estimatedDate
                  }
                />
                {program.location ? (
                  <InfoItem
                    icon={<MapPin size={17} />}
                    label="Lokasi"
                    value={program.location}
                  />
                ) : null}
                {program.pic ? (
                  <InfoItem
                    icon={<User size={17} />}
                    label="Penanggung Jawab"
                    value={program.pic}
                  />
                ) : null}
                {program.participantCount ? (
                  <InfoItem
                    icon={<Users size={17} />}
                    label={isCompleted ? "Peserta" : "Estimasi Peserta"}
                    value={`${program.participantCount} orang`}
                  />
                ) : null}
              </div>
            </div>
          </FadeIn>

          {typeof program.progress === "number" ? (
            <FadeIn delay={0.16}>
              <div className="mt-10">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-navy">
                    Progress
                  </h3>
                  <span className="text-sm font-semibold text-navy/60">
                    {program.progress}%
                  </span>
                </div>
                <ProgressBar value={program.progress} className="h-2.5" />
              </div>
            </FadeIn>
          ) : null}

          {program.milestones.length > 0 ? (
            <FadeIn delay={0.22}>
              <div className="mt-10">
                <h3 className="font-heading mb-3 text-lg font-bold text-navy">
                  Milestone
                </h3>
                <MilestoneChecklist milestones={program.milestones} />
              </div>
            </FadeIn>
          ) : null}

          <FadeIn delay={0.28}>
            <div className="mt-14">
              <h3 className="font-heading mb-5 text-lg font-bold text-navy">
                Dokumentasi
              </h3>
              {gallery.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {gallery.map((item) => (
                    <div
                      key={item.id}
                      className="relative aspect-square overflow-hidden rounded-card"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 640px) 33vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-navy/15 py-12 text-center text-sm text-navy/45">
                  <ImageOff size={22} />
                  Dokumentasi akan ditambahkan setelah kegiatan berlangsung.
                </div>
              )}
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
