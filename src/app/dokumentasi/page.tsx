import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import Container from "@/components/ui/Container";
import DokumentasiClient from "@/components/gallery/DokumentasiClient";
import { getGalleryByEvent } from "@/data/gallery";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Dokumentasi",
  description:
    "Galeri dokumentasi kegiatan KABISAT Angkatan Tujuh dari waktu ke waktu.",
};

export default function DokumentasiPage() {
  const groups = getGalleryByEvent();
  const galleryJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Dokumentasi KABISAT Angkatan Tujuh",
    description: "Dokumentasi kegiatan, reuni, dan kebersamaan alumni KABISAT.",
    url: `${site.url}/dokumentasi`,
    image: groups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "ImageObject",
        name: item.title,
        contentUrl: `${site.url}${item.image}`,
        caption: `${item.event} ${item.year}${item.location ? ` — ${item.location}` : ""}`,
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(galleryJsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
