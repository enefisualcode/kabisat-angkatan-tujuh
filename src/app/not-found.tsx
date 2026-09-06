import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { site } from "@/data/site";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-navy">
      <Image
        src={site.logos.symbol}
        alt=""
        aria-hidden
        width={700}
        height={700}
        className="pointer-events-none absolute top-1/2 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
      />
      <Container className="relative max-w-xl text-center">
        <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-gold-soft uppercase">
          404
        </p>
        <h1 className="font-heading text-3xl font-bold text-cream sm:text-4xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-4 text-base leading-relaxed text-cream/70">
          Halaman yang kamu cari mungkin sudah dipindahkan atau belum
          tersedia.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition-transform duration-200 hover:scale-[1.03]"
        >
          Kembali ke Beranda
        </Link>
      </Container>
    </section>
  );
}
