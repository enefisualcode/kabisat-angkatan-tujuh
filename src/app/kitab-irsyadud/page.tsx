import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Kitab & Irsyadud",
  description:
    "Unduh kitab pilihan dan Irsyadud Thalabah untuk keluarga alumni KABISAT Angkatan Tujuh.",
  alternates: { canonical: "/kitab-irsyadud" },
};

const books = [
  {
    title: "Intabah Dinuka Fil Khatar",
    arabicTitle: "انتبه دينك فى الخطر",
    description: "Kitab pengingat untuk menjaga agama dan kehidupan.",
    href: "/kitab-dan-irsyadud/kitab-intabah-dinuka-fil-khatar.pdf",
    size: "5,4 MB",
  },
  {
    title: "Irsyadud Thalabah",
    arabicTitle: "إِرْشَادُ الطَّلَبَةِ",
    description: "Bacaan dan panduan untuk para penuntut ilmu.",
    href: "/kitab-dan-irsyadud/irsyadud-thalabah.pdf",
    size: "1,9 MB",
  },
];

export default function KitabIrsyadudPage() {
  return (
    <>
      <PageHero
        eyebrow="Bahan Bacaan"
        title="Kitab & Irsyadud"
        description="Kumpulan kitab pilihan yang dapat dibaca dan diunduh oleh alumni KABISAT Angkatan Tujuh."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {books.map((book) => (
              <article
                key={book.href}
                className="flex h-full flex-col rounded-card border border-navy/10 bg-white p-7 sm:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                  <FileText size={22} />
                </div>
                <p className="mt-6 text-right text-lg text-navy/60" dir="rtl">
                  {book.arabicTitle}
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-navy">
                  {book.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-navy/65 sm:text-base">
                  {book.description}
                </p>
                <div className="mt-7 flex items-center justify-between gap-4 border-t border-navy/10 pt-5">
                  <span className="text-xs text-navy/50">PDF · {book.size}</span>
                  <a
                    href={book.href}
                    download
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-navy transition-transform hover:scale-[1.02]"
                  >
                    Unduh PDF
                    <Download size={15} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
