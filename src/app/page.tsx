import Hero from "@/components/home/Hero";
import AboutShort from "@/components/home/AboutShort";
import StatsSection from "@/components/home/StatsSection";
import ProgramsPreview from "@/components/home/ProgramsPreview";
import Timeline from "@/components/home/Timeline";
import UpdatesSection from "@/components/home/UpdatesSection";
import CommitteePreview from "@/components/home/CommitteePreview";
import GalleryPreview from "@/components/home/GalleryPreview";
import ClosingCta from "@/components/home/ClosingCta";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutShort />
      <StatsSection />
      <ProgramsPreview />
      <Timeline />
      <UpdatesSection />
      <CommitteePreview />
      <GalleryPreview />
      <ClosingCta />
    </>
  );
}
