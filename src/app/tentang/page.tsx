import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Tentang KABISAT",
  description:
    "Kisah, filosofi, dan nilai-nilai yang menjadi dasar berdirinya KABISAT Angkatan Tujuh.",
};

const sections = [
  site.about.kami,
  site.about.awalPerjalanan,
  site.about.filosofiNama,
  site.about.filosofiLogo,
];

export default function TentangPage() {
  return (
    <>
      <PageHero
        eyebrow="Tentang"
        title={site.about.heroTitle}
        description="Kisah, filosofi, dan nilai-nilai yang menjadi dasar berdirinya KABISAT Angkatan Tujuh."
      />

      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl">
          <div className="space-y-16">
            {sections.map((section) => (
              <FadeIn key={section.heading}>
                <h2 className="font-heading text-2xl font-bold text-navy sm:text-3xl">
                  {section.heading}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-navy/70 sm:text-lg">
                  {section.body}
                </p>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-navy/10 bg-navy py-20 sm:py-24">
        <Container>
          <FadeIn>
            <p className="mb-3 text-center text-xs font-semibold tracking-[0.2em] text-gold-soft uppercase">
              Nilai KABISAT
            </p>
            <h2 className="font-heading text-center text-3xl font-bold text-cream sm:text-4xl">
              Yang Kami Pegang Teguh
            </h2>
          </FadeIn>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {site.values.map((value, index) => (
              <FadeIn key={value.id} delay={index * 0.1}>
                <div className="h-full rounded-card border border-cream/10 bg-cream/[0.04] p-8 text-center">
                  <p className="font-heading text-xl font-bold tracking-wide text-gold-soft">
                    {value.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-cream/70">
                    {value.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
