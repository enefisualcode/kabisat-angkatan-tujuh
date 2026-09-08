import type { Metadata } from "next";
import { BriefcaseBusiness } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Lowongan Kerja",
  description:
    "Informasi peluang kerja dan karier yang dibagikan untuk alumni KABISAT Angkatan Tujuh.",
};

export default function LowonganKerjaPage() {
  return (
    <>
      <PageHero
        eyebrow="Karier Alumni"
        title="Lowongan Kerja"
        description="Temukan dan bagikan peluang kerja untuk saling membantu perkembangan karier alumni KABISAT Angkatan Tujuh."
      />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="rounded-card border border-navy/10 bg-white p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
              <BriefcaseBusiness size={25} />
            </div>
            <h2 className="mt-5 font-heading text-2xl font-bold text-navy">
              Lowongan akan segera hadir
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-navy/65 sm:text-base">
              Bagian ini disiapkan untuk membagikan informasi lowongan kerja
              dari alumni dan jaringan KABISAT.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
