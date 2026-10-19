import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { site } from "@/data/site";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-cream pt-28 pb-14 sm:pt-32 sm:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-3xl"
      />
      <Container className="relative grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/70 px-3.5 py-2 shadow-sm shadow-navy/5">
            <span className="h-2 w-2 rounded-full bg-gold" />
            <span className="text-[11px] font-bold tracking-[0.18em] text-navy/75 uppercase">
              Keluarga Alumni Angkatan Tujuh
            </span>
          </div>

          <h1 className="font-heading text-[clamp(3.5rem,8vw,6.8rem)] leading-[0.91] font-extrabold tracking-[-0.075em] text-navy">
            Satu angkatan,
            <span className="mt-1 block text-gold-dark">satu ikatan.</span>
            <span className="sr-only"> KABISAT Angkatan Tujuh</span>
          </h1>

          <p className="mt-7 max-w-xl font-heading text-lg leading-relaxed font-semibold text-navy/75 sm:text-xl">
            “{site.tagline}”
          </p>
          <p className="mt-3 max-w-lg text-sm leading-7 text-navy/65 sm:text-base">
            {site.heroSubtext}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/program"
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-cream shadow-lg shadow-navy/15 transition-all hover:-translate-y-0.5 hover:bg-navy-deep"
            >
              Jelajahi program
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/tentang"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-navy/15 px-6 py-3 text-sm font-semibold text-navy transition-colors hover:border-navy/30 hover:bg-white"
            >
              Kenal KABISAT
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-navy/10 pt-6">
            <div>
              <p className="font-heading text-lg font-extrabold text-navy">2018</p>
              <p className="mt-0.5 text-xs text-navy/55">Tahun kelulusan</p>
            </div>
            <span className="h-9 w-px bg-navy/10" aria-hidden="true" />
            <div>
              <p className="font-heading text-lg font-extrabold text-navy">Daarul Rahman 3</p>
              <p className="mt-0.5 text-xs text-navy/55">Tempat kita dipertemukan</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
          <div
            aria-hidden="true"
            className="absolute -right-5 -bottom-5 h-[72%] w-[72%] rounded-[2rem] border border-gold/45 sm:-right-7 sm:-bottom-7"
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-navy shadow-2xl shadow-navy/20 sm:aspect-[1.12] sm:rounded-[2rem]">
            <Image
              src={site.heroImage}
              alt="Kebersamaan alumni KABISAT Angkatan Tujuh"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/5 to-navy/10" />
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-white/25 bg-navy/45 px-3 py-2 text-[10px] font-bold tracking-[0.2em] text-white backdrop-blur-md sm:top-6 sm:left-6 sm:px-4 sm:text-xs">
              ANGKATAN TUJUH <span className="text-gold">✳</span>
            </div>
            <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-4 sm:right-7 sm:bottom-7 sm:left-7">
              <div className="max-w-xs text-white">
                <p className="text-[10px] font-semibold tracking-[0.24em] text-gold-soft uppercase">
                  Terhubung dalam kebaikan
                </p>
                <p className="mt-2 font-heading text-xl leading-tight font-bold sm:text-2xl">
                  Dari pondok, tumbuh jadi keluarga.
                </p>
              </div>
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md sm:flex">
                <ArrowUpRight size={20} />
              </span>
            </div>
          </div>
          <p className="mt-4 text-right text-[10px] font-semibold tracking-[0.22em] text-navy/45 uppercase">
            KABISAT · Daarul Rahman 3
          </p>
        </div>
      </Container>
    </section>
  );
}
