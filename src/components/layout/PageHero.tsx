import Image from "next/image";
import Container from "@/components/ui/Container";
import { site } from "@/data/site";

export default function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy pt-44 pb-20 sm:pt-52 sm:pb-24">
      <Image
        src={site.logos.symbol}
        alt=""
        aria-hidden
        width={700}
        height={700}
        className="pointer-events-none absolute -top-24 -right-24 h-[26rem] w-[26rem] object-contain opacity-[0.06] sm:h-[34rem] sm:w-[34rem]"
      />
      <Container className="relative max-w-3xl">
        <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-gold-soft uppercase">
          {eyebrow}
        </p>
        <h1 className="font-heading text-4xl leading-[1.05] font-extrabold text-cream sm:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">
            {description}
          </p>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
