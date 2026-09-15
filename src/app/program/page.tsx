import PageHero from "@/components/layout/PageHero";
import Container from "@/components/ui/Container";
import ProgramListClient from "@/components/program/ProgramListClient";
import { programs } from "@/data/programs";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Program & Kegiatan",
  description:
    "Melihat apa yang telah, sedang, dan akan dilakukan KABISAT Angkatan Tujuh.",
  path: "/program",
});

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
          <h2 className="sr-only">Daftar Program KABISAT</h2>
          <ProgramListClient programs={programs} />
        </Container>
      </section>
    </>
  );
}
