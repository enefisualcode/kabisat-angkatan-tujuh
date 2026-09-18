import PageHero from "@/components/layout/PageHero";
import CareerBusinessExplorer from "@/components/career-business/CareerBusinessExplorer";
import { createPageMetadata } from "@/lib/metadata";
import { getPublishedOpportunities } from "@/lib/opportunities";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Karier & Usaha Alumni",
  description: "Temukan lowongan kerja dan usaha alumni KABISAT Angkatan Tujuh serta bagikan peluang kepada sesama alumni.",
  path: "/karier-usaha",
});

export default async function KarierUsahaPage() {
  const opportunities = await getPublishedOpportunities();
  return <><PageHero eyebrow="Jejaring Alumni" title="Karier & Usaha" description="Temukan peluang kerja, bagikan kesempatan, dan dukung usaha sesama alumni KABISAT Angkatan Tujuh." /><CareerBusinessExplorer opportunities={opportunities} /></>;
}
