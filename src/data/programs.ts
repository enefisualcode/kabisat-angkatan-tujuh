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
    actualDate: "2026-10-17",
    location: "Padepokan Aswaja, Ciputat",
    status: "completed",
    stage: "done",
    icon: "moon",
    coverImage: "/programs/maulid-cover.jpg",
    milestones: [],
  },
  {
    id: "prog-4",
    slug: "kabisat-run",
    title: "KABISAT Sport",
    shortDescription:
      "Agenda olahraga bersama untuk mempererat kebersamaan alumni.",
    description:
      "KABISAT Sport adalah wadah kegiatan olahraga bersama alumni, mulai dari futsal, lari, hingga olahraga lainnya, untuk mempererat kebersamaan.",
    status: "recurring",
    stage: "on-going",
    icon: "footprints",
    coverImage: "/gallery/kabisat-sport/futsal-zona-futsal.jpg",
    milestones: [],
  },
  {
    id: "prog-2",
    slug: "ngobarji",
    title: "Ngobarji",
    shortDescription: "Ngopi bareng sambil ngaji bersama alumni KABISAT.",
    description:
      "Ngobarji adalah agenda ngopi bareng sambil ngaji bersama alumni KABISAT untuk mempererat silaturahmi dan menambah wawasan keislaman.",
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
