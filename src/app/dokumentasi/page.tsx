import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import Container from "@/components/ui/Container";
import DokumentasiClient from "@/components/gallery/DokumentasiClient";
import { getGalleryByEvent } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Dokumentasi",
  description:
    "Galeri dokumentasi kegiatan KABISAT Angkatan Tujuh dari waktu ke waktu.",
};

export default function DokumentasiPage() {
  const groups = getGalleryByEvent();

  return (
    <>
      <PageHero
        eyebrow="Arsip Kegiatan"
        title="Dokumentasi"
        description="Kumpulan momen dari setiap kegiatan KABISAT Angkatan Tujuh, tersusun berdasarkan acara."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <DokumentasiClient groups={groups} />
        </Container>
      </section>
    </>
  );
}
