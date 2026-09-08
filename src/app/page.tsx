import Hero from "@/components/home/Hero";
import ProgramsPreview from "@/components/home/ProgramsPreview";
import CommitteePreview from "@/components/home/CommitteePreview";
import GalleryPreview from "@/components/home/GalleryPreview";
import ClosingCta from "@/components/home/ClosingCta";
import FeedbackSection from "@/components/home/FeedbackSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KABISAT Angkatan Tujuh — Alumni Daarul Rahman 3",
  description:
    "Website resmi KABISAT Angkatan Tujuh, alumni Pondok Pesantren Daarul Rahman 3 tahun 2018. Temukan informasi kepengurusan, program, kegiatan, dan dokumentasi alumni.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <ProgramsPreview />
      <CommitteePreview />
      <GalleryPreview />
      <ClosingCta />
      <FeedbackSection />
    </>
  );
}
