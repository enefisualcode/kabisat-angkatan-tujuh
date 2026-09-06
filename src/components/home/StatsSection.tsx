import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Counter from "@/components/ui/Counter";
import { site } from "@/data/site";

export default function StatsSection() {
  return (
    <section className="border-y border-navy/10 bg-white/60 py-20 sm:py-24">
      <Container>
        <FadeIn className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-gold-dark uppercase">
            KABISAT Dalam Angka
          </p>
          <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
            Perjalanan yang Terus Bertumbuh
          </h2>
        </FadeIn>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
          {site.stats.map((stat, index) => (
            <FadeIn
              key={stat.id}
              delay={index * 0.08}
              className="text-center"
            >
              <p className="font-heading text-4xl font-extrabold text-navy sm:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium text-navy/60 sm:text-base">
                {stat.label}
              </p>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
