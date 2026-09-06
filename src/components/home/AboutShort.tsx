import Image from "next/image";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import { site } from "@/data/site";

export default function AboutShort() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <Image
        src={site.logos.symbol}
        alt=""
        aria-hidden
        width={640}
        height={640}
        className="pointer-events-none absolute top-1/2 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
      />
      <Container className="relative max-w-3xl text-center">
        <FadeIn>
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-gold-dark uppercase">
            Tentang Singkat
          </p>
          <div className="space-y-6">
            {site.aboutShort.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="font-heading text-2xl leading-snug font-medium text-balance text-navy sm:text-3xl"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
