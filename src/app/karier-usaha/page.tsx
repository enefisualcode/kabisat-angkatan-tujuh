import PageHero from "@/components/layout/PageHero";
import CareerBusinessExplorer from "@/components/career-business/CareerBusinessExplorer";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Karier & Usaha Alumni",
  description: "Temukan lowongan kerja dan usaha alumni KABISAT Angkatan Tujuh serta bagikan peluang kepada sesama alumni.",
  path: "/karier-usaha",
});

export default function KarierUsahaPage() {
  return <><PageHero eyebrow="Jejaring Alumni" title="Karier & Usaha" description="Temukan peluang kerja, bagikan kesempatan, dan dukung usaha sesama alumni KABISAT Angkatan Tujuh." /><CareerBusinessExplorer /></>;
}
