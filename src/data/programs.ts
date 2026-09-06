import type { Program } from "@/types";

// NOTE: rencana kegiatan KABISAT 2 tahun ke depan — lengkapi tanggal, lokasi, dan detail lain saat sudah pasti.
export const programs: Program[] = [
  {
    id: "prog-1",
    slug: "maulid-nabi-1448-h",
    title: "Maulid Nabi 1448 H",
    shortDescription: "Peringatan Maulid Nabi Muhammad SAW bersama alumni.",
    description:
      "Peringatan Maulid Nabi Muhammad SAW 1448 H sebagai wadah alumni untuk memperkuat kembali nilai-nilai keislaman dan kebersamaan.",
    estimatedDate: "Oktober 2026",
    location: "Depok",
    status: "upcoming",
    stage: "on-going",
    icon: "moon",
    milestones: [],
  },
  {
    id: "prog-2",
    slug: "ngobarji",
    title: "Ngobarji",
    shortDescription: "Ngobrol bareng santai antar alumni KABISAT.",
    description:
      "Ngobarji adalah agenda ngobrol santai antar alumni untuk mempererat silaturahmi sekaligus berbagi kabar dan cerita.",
    status: "planned",
    stage: "coming-soon",
    icon: "message-circle",
    milestones: [],
  },
  {
    id: "prog-3",
    slug: "malam-seribu-lilin",
    title: "Malam Seribu Lilin",
    shortDescription: "Malam refleksi dan doa bersama Gus Ridho.",
    description:
      "Malam Seribu Lilin merupakan agenda refleksi dan doa bersama yang akan dipandu oleh Gus Ridho untuk seluruh alumni KABISAT.",
    status: "planned",
    stage: "coming-soon",
    icon: "flame",
    milestones: [],
  },
  {
    id: "prog-4",
    slug: "kabisat-run",
    title: "Sport KABISAT Run",
    shortDescription: "Agenda lari bersama untuk menjaga kebugaran alumni.",
    description:
      "Sport KABISAT Run adalah agenda olahraga lari bersama yang digagas untuk menjaga kebugaran sekaligus mempererat kebersamaan alumni.",
    status: "planned",
    stage: "coming-soon",
    icon: "footprints",
    milestones: [],
  },
  {
    id: "prog-5",
    slug: "santunan-anak-yatim",
    title: "Santunan Anak Yatim",
    shortDescription: "Kontribusi sosial KABISAT untuk anak yatim.",
    description:
      "Santunan Anak Yatim menjadi agenda rutin KABISAT sebagai wujud kontribusi dan kepedulian sosial alumni terhadap lingkungan sekitar.",
    status: "planned",
    stage: "coming-soon",
    icon: "heart-handshake",
    milestones: [],
  },
  {
    id: "prog-6",
    slug: "gathering-kabisat",
    title: "Gathering KABISAT",
    shortDescription: "Pertemuan santai untuk mempererat silaturahmi alumni.",
    description:
      "Gathering KABISAT adalah agenda kumpul santai yang dirancang sebagai ruang temu alumni lintas angkatan kerja dan kesibukan masing-masing.",
    status: "planned",
    stage: "coming-soon",
    icon: "users",
    milestones: [],
  },
];

export function getProgramBySlug(slug: string) {
  return programs.find((p) => p.slug === slug);
}
