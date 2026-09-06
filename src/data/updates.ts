import type { Update } from "@/types";

// NOTE: update singkat seputar KABISAT — tambahkan entri baru di bagian paling atas.
export const updates: Update[] = [
  {
    id: "u-3",
    date: "2026-09-05",
    title: "Kepengurusan Resmi Terbentuk",
    excerpt:
      "Struktur kepengurusan inti dan divisi KABISAT Angkatan Tujuh resmi terbentuk dan mulai bergerak menyusun program kerja.",
    programSlug: "pembentukan-kepengurusan",
  },
  {
    id: "u-2",
    date: "2026-09-02",
    title: "Persiapan Gathering Dimulai",
    excerpt:
      "Tim acara mulai menyusun konsep Gathering KABISAT yang direncanakan berlangsung pada akhir tahun.",
    programSlug: "gathering-kabisat",
  },
  {
    id: "u-1",
    date: "2026-08-20",
    title: "Wacana Reuni Akbar Mulai Dibahas",
    excerpt:
      "Pengurus mulai membahas kemungkinan Reuni Akbar sebagai penutup rangkaian kegiatan KABISAT tahun ini.",
    programSlug: "reuni-akbar-kabisat-2026",
  },
];

export function getLatestUpdates(count = 3) {
  return [...updates]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}
