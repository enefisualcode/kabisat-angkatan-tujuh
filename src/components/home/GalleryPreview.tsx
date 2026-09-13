import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import { getFeaturedGallery } from "@/data/gallery";

export default function GalleryPreview() {
  const photos = getFeaturedGallery();

  return (
    <section className="py-24 sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <FadeIn>
            <SectionHeading
              eyebrow="Kenangan"
              title="Potongan Perjalanan Kita"
              description="Momen-momen yang menjadi bagian dari cerita KABISAT Angkatan Tujuh."
            />
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link
              href="/dokumentasi"
              className="hidden items-center gap-1.5 text-sm font-semibold text-navy link-underline sm:flex"
            >
              Lihat semua dokumentasi
              <ArrowRight size={15} />
            </Link>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div className="mt-12 columns-2 gap-4 sm:columns-3 sm:gap-5">
            {photos.map((photo) => (
              <Link
                key={photo.id}
                href="/dokumentasi"
                className="group relative mb-4 block overflow-hidden rounded-card break-inside-avoid sm:mb-5"
              >
                <Image
                  src={photo.image}
                  alt={photo.title}
                  width={600}
                  height={750}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/0 to-navy/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="font-heading text-sm font-bold text-cream">
                    {photo.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-cream/75">
                    {photo.location ? (
                      <>
                        <MapPin size={11} />
                        {photo.location} &middot;{" "}
                      </>
                    ) : null}
                    {photo.year}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </FadeIn>

        <div className="mt-10 sm:hidden">
          <Link
            href="/dokumentasi"
            className="flex items-center justify-center gap-1.5 rounded-full border border-navy/15 py-3 text-sm font-semibold text-navy"
          >
            Lihat semua dokumentasi
            <ArrowRight size={15} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
