import Hero from "@/components/home/Hero";
import ProgramsPreview from "@/components/home/ProgramsPreview";
import CommitteePreview from "@/components/home/CommitteePreview";
import GalleryPreview from "@/components/home/GalleryPreview";
import ClosingCta from "@/components/home/ClosingCta";
import FeedbackSection from "@/components/home/FeedbackSection";

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
