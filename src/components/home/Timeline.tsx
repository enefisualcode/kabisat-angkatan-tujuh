import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import StatusBadge from "@/components/ui/StatusBadge";
import FadeIn from "@/components/ui/FadeIn";
import { getAgendaByYear } from "@/lib/agenda";

export default function Timeline() {
  const groups = getAgendaByYear();

  return (
    <section id="agenda" className="scroll-mt-24 bg-navy py-24 sm:py-28">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="Agenda"
            title="Agenda KABISAT"
            description="Rencana dan riwayat perjalanan kegiatan KABISAT Angkatan Tujuh dari waktu ke waktu."
            tone="cream"
          />
        </FadeIn>

        <div className="mt-14 max-w-2xl">
          {groups.map(([year, items]) => (
            <div key={year} className="mb-12 last:mb-0">
              <FadeIn>
                <p className="font-heading mb-6 text-4xl font-extrabold text-gold-soft sm:text-5xl">
                  {year}
                </p>
              </FadeIn>

              <div className="relative border-l border-cream/15 pl-8">
                {items.map((item, index) => (
                  <FadeIn key={item.id} delay={index * 0.06}>
                    <Link
                      href={item.programSlug ? `/program/${item.programSlug}` : "#"}
                      className="group relative block pb-10 last:pb-0"
                    >
                      <span className="absolute top-1.5 -left-[2.28rem] h-3 w-3 rounded-full border-2 border-navy bg-gold ring-4 ring-navy transition-transform duration-300 group-hover:scale-125" />
                      <p className="text-xs font-semibold tracking-[0.15em] text-cream/50 uppercase">
                        {item.month}
                      </p>
                      <p className="font-heading mt-1.5 text-lg font-bold text-cream sm:text-xl">
                        {item.title}
                      </p>
                      <div className="mt-3">
                        <StatusBadge status={item.status} tone="onDark" />
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
