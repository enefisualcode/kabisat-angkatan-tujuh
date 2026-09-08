import type { Metadata } from "next";
import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Lowongan Kerja",
  description:
    "Informasi peluang kerja dan karier yang dibagikan untuk alumni KABISAT Angkatan Tujuh.",
};

export default function LowonganKerjaPage() {
  return (
    <>
      <PageHero
        eyebrow="Karier Alumni"
        title="Lowongan Kerja"
        description="Temukan dan bagikan peluang kerja untuk saling membantu perkembangan karier alumni KABISAT Angkatan Tujuh."
      />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="rounded-card border border-navy/10 bg-white p-8 sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
              <BriefcaseBusiness size={25} />
            </div>
            <h2 className="mt-5 text-center font-heading text-2xl font-bold text-navy">
              Berbagi peluang, membuka jalan
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-navy/65 sm:text-base">
              Halaman ini menjadi ruang berbagi informasi lowongan kerja dari
              alumni dan jaringan KABISAT. Kirimkan informasi yang relevan agar
              dapat membantu alumni lain menemukan kesempatan berikutnya.
            </p>
            <div className="mt-10 grid gap-6 text-left sm:grid-cols-3">
              {["Teknologi & Kreatif", "Bisnis & Profesional", "Pendidikan & Sosial"].map(
                (category) => (
                  <div key={category} className="rounded-xl border border-navy/10 bg-cream/50 p-5">
                    <h3 className="font-heading font-bold text-navy">{category}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy/60">
                      Peluang kerja, proyek, dan kolaborasi dari jaringan alumni.
                    </p>
                  </div>
                )
              )}
            </div>
            <div className="mt-10 border-t border-navy/10 pt-8 text-left">
              <h3 className="font-heading text-lg font-bold text-navy">Cara mengirim informasi lowongan</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-navy/65">
                <li>Tulis posisi, nama perusahaan, lokasi, dan batas pendaftaran.</li>
                <li>Sertakan tautan atau kontak resmi untuk melamar.</li>
                <li>Kirimkan informasi tersebut kepada pengurus KABISAT untuk ditinjau.</li>
              </ol>
              <p className="mt-5 text-sm text-navy/65">
                Belum ada lowongan aktif yang dipublikasikan. Untuk berbagi informasi, hubungi pengurus melalui <Link href="mailto:kabisat0739@gmail.com" className="font-semibold text-navy underline decoration-gold">email resmi KABISAT</Link>.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
