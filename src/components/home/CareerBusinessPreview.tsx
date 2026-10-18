import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Store } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";

const categories = [
  {
    title: "Usaha Alumni",
    description:
      "Temukan produk dan layanan dari sesama alumni serta dukung usaha mereka.",
    icon: Store,
    href: "/karier-usaha?tab=business",
  },
  {
    title: "Lowongan Kerja",
    description:
      "Lihat dan bagikan kesempatan kerja untuk memperkuat jaringan alumni.",
    icon: BriefcaseBusiness,
    href: "/karier-usaha?tab=job",
  },
];

export default function CareerBusinessPreview() {
  return (
    <section className="bg-navy py-24 sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <FadeIn>
            <SectionHeading
              eyebrow="Jejaring Alumni"
              title="Karier & Usaha"
              description="Ruang untuk saling berbagi peluang, memperluas jaringan, dan mendukung usaha sesama alumni KABISAT."
              tone="cream"
            />
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link
              href="/karier-usaha"
              className="hidden items-center gap-1.5 text-sm font-semibold text-cream link-underline sm:flex"
            >
              Lihat semua peluang
              <ArrowRight size={15} />
            </Link>
          </FadeIn>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <FadeIn key={category.title} delay={0.12 + index * 0.08}>
                <Link
                  href={category.href}
                  className="group flex h-full items-start gap-5 rounded-card border border-cream/15 bg-cream/5 p-6 transition-colors hover:border-gold/60 hover:bg-cream/10 sm:p-8"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-navy">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span className="flex-1">
                    <span className="font-heading text-xl font-bold text-cream sm:text-2xl">
                      {category.title}
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-cream/65 sm:text-base">
                      {category.description}
                    </span>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-soft">
                      Jelajahi
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </span>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <div className="mt-10 sm:hidden">
          <Link
            href="/karier-usaha"
            className="flex items-center justify-center gap-1.5 rounded-full border border-cream/20 py-3 text-sm font-semibold text-cream"
          >
            Lihat semua peluang
            <ArrowRight size={15} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
