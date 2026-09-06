import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import { site } from "@/data/site";

export default function ClosingCta() {
  return (
    <section className="relative overflow-hidden bg-navy py-28 sm:py-36">
      <Image
        src={site.logos.symbol}
        alt=""
        aria-hidden
        width={800}
        height={800}
        className="pointer-events-none absolute -right-40 -bottom-40 h-[42rem] w-[42rem] object-contain opacity-[0.08]"
      />
      <Container className="relative max-w-2xl text-center">
        <FadeIn>
          <div className="space-y-5">
            {site.closingCta.lines.map((line, index) => (
              <p
                key={index}
                className={
                  index === 0
                    ? "font-heading text-3xl font-bold text-cream sm:text-4xl"
                    : "text-base leading-relaxed text-cream/70 sm:text-lg"
                }
              >
                {line}
              </p>
            ))}
          </div>
          <Link
            href="/program"
            className="mt-10 inline-block rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy transition-transform duration-200 hover:scale-[1.03]"
          >
            Lihat Program KABISAT
          </Link>
        </FadeIn>
      </Container>
    </section>
  );
}
