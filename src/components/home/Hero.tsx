import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { site } from "@/data/site";

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-navy sm:min-h-screen">
      <Image
        src={site.heroImage}
        alt="Kebersamaan alumni KABISAT Angkatan Tujuh"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/30" />
      <div className="absolute inset-0 bg-navy/20" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 sm:px-8 sm:pb-28">
        <p className="mb-4 text-xs font-semibold tracking-[0.3em] text-gold-soft uppercase sm:text-sm">
          Alumni Daarul Rahman 3 Angkatan 7
        </p>
        <h1 className="font-heading text-6xl leading-[0.95] font-extrabold text-cream sm:text-8xl lg:text-[9rem]">
          KABISAT
        </h1>
        <p className="font-heading mt-1 text-2xl font-semibold tracking-wide text-cream/90 sm:text-4xl">
          Angkatan Tujuh
        </p>

        <p className="mt-8 max-w-xl text-lg font-medium text-gold-soft sm:text-xl">
          &ldquo;{site.tagline}&rdquo;
        </p>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-cream/70 sm:text-base">
          {site.heroSubtext}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/program"
            className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition-transform duration-200 hover:scale-[1.03]"
          >
            Lihat Program
          </Link>
          <Link
            href="/tentang"
            className="rounded-full border border-cream/30 px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:border-cream/60 hover:bg-cream/10"
          >
            Tentang KABISAT
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-cream/60 sm:flex">
        <span className="text-[10px] tracking-[0.25em] uppercase">
          Gulir
        </span>
        <ChevronDown size={18} className="animate-bounce" />
      </div>
    </section>
  );
}
