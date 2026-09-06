import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import { getLatestUpdates } from "@/data/updates";
import { formatUpdateDate } from "@/lib/date";

export default function UpdatesSection() {
  const updates = getLatestUpdates(3);

  return (
    <section className="py-24 sm:py-28">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="Kabar Terbaru"
            title="Apa Kabar KABISAT?"
            description="Cerita singkat dan perkembangan seputar kegiatan KABISAT Angkatan Tujuh."
          />
        </FadeIn>

        <div className="mt-12 grid gap-px overflow-hidden rounded-card border border-navy/10 bg-navy/10 sm:grid-cols-3">
          {updates.map((update, index) => (
            <FadeIn key={update.id} delay={index * 0.1} className="h-full">
              <article className="flex h-full flex-col bg-white p-7">
                <time className="text-xs font-semibold tracking-[0.15em] text-gold-dark uppercase">
                  {formatUpdateDate(update.date)}
                </time>
                <h3 className="font-heading mt-3 text-lg font-bold text-navy">
                  {update.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
                  &ldquo;{update.excerpt}&rdquo;
                </p>
                {update.programSlug ? (
                  <Link
                    href={`/program/${update.programSlug}`}
                    className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-navy link-underline"
                  >
                    Baca perkembangan
                    <ArrowRight size={14} />
                  </Link>
                ) : null}
              </article>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
