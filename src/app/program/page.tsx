import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import Container from "@/components/ui/Container";
import ProgramListClient from "@/components/program/ProgramListClient";
import { programs } from "@/data/programs";

export const metadata: Metadata = {
  title: "Program & Kegiatan",
  description:
    "Melihat apa yang telah, sedang, dan akan dilakukan KABISAT Angkatan Tujuh.",
};

export default function ProgramPage() {
  return (
    <>
      <PageHero
        eyebrow="Program KABISAT"
        title="Program & Kegiatan"
        description="Melihat apa yang telah, sedang, dan akan dilakukan KABISAT Angkatan Tujuh."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <ProgramListClient programs={programs} />
        </Container>
      </section>
    </>
  );
}
